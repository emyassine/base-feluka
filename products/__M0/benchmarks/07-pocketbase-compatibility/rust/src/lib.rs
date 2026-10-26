#[derive(Clone, Copy)]
pub struct Record<'a> {
    pub owner_id: &'a str,
    pub status: &'a str,
}

#[derive(Clone, Copy)]
pub struct Request<'a> {
    pub auth_id: Option<&'a str>,
    pub body_owner_id: Option<&'a str>,
    pub superuser: bool,
}

#[derive(Clone, Copy)]
pub enum Rule<'a> {
    Locked,
    Public,
    Filter(&'a str),
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum SqlParameter {
    Text(String),
    Null,
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub struct SqlPredicate {
    /// SQL expression to append after `WHERE`; every dynamic value uses `?`.
    pub expression: String,
    pub parameters: Vec<SqlParameter>,
}

#[derive(Clone, Copy)]
pub enum Action {
    List,
    View,
    Create,
    Update,
    Delete,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
enum Token<'a> {
    Word(&'a str),
    String(&'a str),
    Eq,
    Ne,
    And,
    Or,
    Left,
    Right,
}

pub fn allows(
    rule: Rule<'_>,
    _action: Action,
    request: Request<'_>,
    record: Option<Record<'_>>,
) -> bool {
    if request.superuser {
        return true;
    }
    match rule {
        Rule::Locked => false,
        Rule::Public => true,
        Rule::Filter(source) => {
            let tokens = tokenize(source);
            Parser { tokens, at: 0 }
                .expression(request, record)
                .unwrap_or(false)
        }
    }
}

pub fn status_for(rule: Rule<'_>, action: Action, allowed: bool) -> u16 {
    if allowed {
        return if matches!(action, Action::Delete) {
            204
        } else {
            200
        };
    }
    if matches!(rule, Rule::Locked) {
        return 403;
    }
    match action {
        Action::List => 200,
        Action::Create => 400,
        Action::View | Action::Update | Action::Delete => 404,
    }
}

pub fn list_count(rule: Rule<'_>, request: Request<'_>, records: &[Record<'_>]) -> usize {
    records
        .iter()
        .filter(|record| allows(rule, Action::List, request, Some(**record)))
        .count()
}

fn tokenize(source: &str) -> Vec<Token<'_>> {
    let bytes = source.as_bytes();
    let mut result = Vec::new();
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i].is_ascii_whitespace() {
            i += 1;
            continue;
        }
        match bytes[i] {
            b'(' => {
                result.push(Token::Left);
                i += 1;
            }
            b')' => {
                result.push(Token::Right);
                i += 1;
            }
            b'=' => {
                result.push(Token::Eq);
                i += 1;
            }
            b'!' if bytes.get(i + 1) == Some(&b'=') => {
                result.push(Token::Ne);
                i += 2;
            }
            b'&' if bytes.get(i + 1) == Some(&b'&') => {
                result.push(Token::And);
                i += 2;
            }
            b'|' if bytes.get(i + 1) == Some(&b'|') => {
                result.push(Token::Or);
                i += 2;
            }
            b'\'' | b'"' => {
                let quote = bytes[i];
                let start = i + 1;
                i = start;
                while i < bytes.len() && bytes[i] != quote {
                    i += 1;
                }
                if i == bytes.len() {
                    return Vec::new();
                }
                result.push(Token::String(&source[start..i]));
                i += 1;
            }
            _ => {
                let start = i;
                while i < bytes.len()
                    && !bytes[i].is_ascii_whitespace()
                    && !b"()=!&|'\"".contains(&bytes[i])
                {
                    i += 1;
                }
                if start == i {
                    return Vec::new();
                }
                result.push(Token::Word(&source[start..i]));
            }
        }
    }
    result
}

/// Lower the implemented filter subset into a SQLite-compatible WHERE expression.
///
/// Only the two record columns currently represented by this prototype are accepted.
/// Identifiers are selected from a fixed allowlist and dynamic values are returned as
/// bind parameters; callers must never interpolate `parameters` into SQL text.
pub fn compile_filter_sql(source: &str, request: Request<'_>) -> Option<SqlPredicate> {
    let tokens = tokenize(source);
    if tokens.is_empty() {
        return None;
    }
    let mut parser = SqlParser {
        tokens,
        at: 0,
        parameters: Vec::new(),
    };
    let expression = parser.parse_or(request)?;
    (parser.at == parser.tokens.len()).then_some(SqlPredicate {
        expression,
        parameters: parser.parameters,
    })
}

enum SqlOperand {
    Column(&'static str),
    Parameter(Option<String>),
}

struct SqlParser<'a> {
    tokens: Vec<Token<'a>>,
    at: usize,
    parameters: Vec<SqlParameter>,
}

impl SqlParser<'_> {
    fn parse_or(&mut self, request: Request<'_>) -> Option<String> {
        let mut sql = self.parse_and(request)?;
        while self.take(Token::Or) {
            let right = self.parse_and(request)?;
            sql = format!("({sql} OR {right})");
        }
        Some(sql)
    }

    fn parse_and(&mut self, request: Request<'_>) -> Option<String> {
        let mut sql = self.parse_primary(request)?;
        while self.take(Token::And) {
            let right = self.parse_primary(request)?;
            sql = format!("({sql} AND {right})");
        }
        Some(sql)
    }

    fn parse_primary(&mut self, request: Request<'_>) -> Option<String> {
        if self.take(Token::Left) {
            let inner = self.parse_or(request)?;
            return self.take(Token::Right).then_some(format!("({inner})"));
        }
        let left = self.operand(request)?;
        let operator = match self.next()? {
            // SQLite IS / IS NOT have two-valued NULL semantics, matching Option
            // equality in the evaluator above while preserving bound parameters.
            Token::Eq => "IS",
            Token::Ne => "IS NOT",
            _ => return None,
        };
        let right = self.operand(request)?;
        let left = self.render(left);
        let right = self.render(right);
        Some(format!("{left} {operator} {right}"))
    }

    fn operand(&mut self, request: Request<'_>) -> Option<SqlOperand> {
        match self.next()? {
            Token::String(value) => Some(SqlOperand::Parameter(Some(value.to_owned()))),
            Token::Word(name) => Some(match name {
                "@request.auth.id" => {
                    SqlOperand::Parameter(Some(request.auth_id.unwrap_or("").to_owned()))
                }
                "@request.body.owner_id" => {
                    SqlOperand::Parameter(request.body_owner_id.map(str::to_owned))
                }
                "owner_id" => SqlOperand::Column("owner_id"),
                "status" => SqlOperand::Column("status"),
                _ => return None,
            }),
            _ => None,
        }
    }

    fn render(&mut self, operand: SqlOperand) -> String {
        match operand {
            SqlOperand::Column(name) => format!("\"{name}\""),
            SqlOperand::Parameter(Some(value)) => {
                self.parameters.push(SqlParameter::Text(value));
                "?".to_owned()
            }
            SqlOperand::Parameter(None) => {
                self.parameters.push(SqlParameter::Null);
                "?".to_owned()
            }
        }
    }

    fn take(&mut self, token: Token<'_>) -> bool {
        if self.tokens.get(self.at) == Some(&token) {
            self.at += 1;
            true
        } else {
            false
        }
    }

    fn next(&mut self) -> Option<Token<'_>> {
        let token = *self.tokens.get(self.at)?;
        self.at += 1;
        Some(token)
    }
}

struct Parser<'a> {
    tokens: Vec<Token<'a>>,
    at: usize,
}

impl<'a> Parser<'a> {
    fn expression(mut self, request: Request<'_>, record: Option<Record<'_>>) -> Option<bool> {
        let value = self.parse_or(request, record)?;
        (self.at == self.tokens.len()).then_some(value)
    }

    fn parse_or(&mut self, request: Request<'_>, record: Option<Record<'_>>) -> Option<bool> {
        let mut value = self.parse_and(request, record)?;
        while self.take(Token::Or) {
            value = self.parse_and(request, record)? || value;
        }
        Some(value)
    }

    fn parse_and(&mut self, request: Request<'_>, record: Option<Record<'_>>) -> Option<bool> {
        let mut value = self.parse_primary(request, record)?;
        while self.take(Token::And) {
            value = self.parse_primary(request, record)? && value;
        }
        Some(value)
    }

    fn parse_primary(&mut self, request: Request<'_>, record: Option<Record<'_>>) -> Option<bool> {
        if self.take(Token::Left) {
            let value = self.parse_or(request, record)?;
            return self.take(Token::Right).then_some(value);
        }
        let left = self.value(request, record)?;
        let op = self.next()?;
        let right = self.value(request, record)?;
        match op {
            Token::Eq => Some(left == right),
            Token::Ne => Some(left != right),
            _ => None,
        }
    }

    fn value(
        &mut self,
        request: Request<'_>,
        record: Option<Record<'_>>,
    ) -> Option<Option<String>> {
        match self.next()? {
            Token::String(value) => Some(Some(value.to_owned())),
            Token::Word(name) => Some(match name {
                "@request.auth.id" => Some(request.auth_id.unwrap_or("").to_owned()),
                "@request.body.owner_id" => request.body_owner_id.map(str::to_owned),
                "owner_id" => record.map(|value| value.owner_id.to_owned()),
                "status" => record.map(|value| value.status.to_owned()),
                _ => return None,
            }),
            _ => None,
        }
    }

    fn take(&mut self, token: Token<'_>) -> bool {
        if self.tokens.get(self.at) == Some(&token) {
            self.at += 1;
            true
        } else {
            false
        }
    }

    fn next(&mut self) -> Option<Token<'a>> {
        let token = *self.tokens.get(self.at)?;
        self.at += 1;
        Some(token)
    }
}
