// Feluqa View templates combine HTML with typed Rust expressions/directives.
// HTML productions follow the public tree-sitter-html grammar model.
const PREC = { template: 3, component: 2 };

module.exports = grammar({
  name: 'feluqa_view',
  externals: $ => [
    $._rust_block_body,
    $._rust_expression,
    $._rust_raw_expression,
    $._rust_attribute_expression,
    $._rust_condition,
  ],
  extras: $ => [$.html_comment, /[\t\r\n ]+/],
  rules: {
    source_file: $ => repeat($._node),
    _node: $ => choice(
      $.doctype, $.entity, $.text, $.element, $.script_element, $.style_element,
      $.escaped_output, $.raw_output, $.template_comment,
      $.rust_block, $.if_block, $.foreach_block, $.include_directive,
      $.extends_directive, $.section_block, $.yield_directive, $.component,
      $.escaped_at,
    ),
    doctype: $ => seq('<!', alias(/[Dd][Oo][Cc][Tt][Yy][Pp][Ee]/, $.doctype_keyword), /[^>]+/, '>'),
    entity: _ => /&(#([xX][0-9a-fA-F]{1,6}|[0-9]{1,5})|[A-Za-z][A-Za-z0-9]{0,29});?/,
    text: _ => token(prec(-1, /[^<>&@{}\s]([^<>&@{}]*[^<>&@{}\s])?/)),
    html_comment: _ => token(seq('<!--', /([^-]|-[^-]|--[^>])*/, '-->')),
    erroneous_end_tag: $ => seq('</', $.erroneous_end_tag_name, '>'),
    erroneous_end_tag_name: _ => /[A-Za-z][A-Za-z0-9:._-]*/,
    element: $ => choice(
      seq($.start_tag, repeat($._node), $.end_tag),
      $.self_closing_tag,
    ),
    script_element: $ => seq($.script_start_tag, optional($.raw_text), $.end_tag),
    style_element: $ => seq($.style_start_tag, optional($.raw_text), $.end_tag),
    start_tag: $ => seq('<', $.tag_name, repeat($.attribute), '>'),
    script_start_tag: $ => seq('<', alias(/[Ss][Cc][Rr][Ii][Pp][Tt]/, $.tag_name), repeat($.attribute), '>'),
    style_start_tag: $ => seq('<', alias(/[Ss][Tt][Yy][Ll][Ee]/, $.tag_name), repeat($.attribute), '>'),
    self_closing_tag: $ => seq('<', $.tag_name, repeat($.attribute), '/>'),
    end_tag: $ => seq('</', $.tag_name, '>'),
    tag_name: _ => token(/[A-Za-z][A-Za-z0-9:._-]*/),
    attribute: $ => choice(
      seq(':', $.attribute_name, '=', alias(seq('"', alias($._rust_attribute_expression, $.rust_expression), '"'), $.bound_value)),
      seq($.attribute_name, optional(seq('=', choice($.attribute_value, $.quoted_attribute_value)))),
    ),
    attribute_name: _ => token(/[A-Za-z_:][A-Za-z0-9_:.-]*/),
    attribute_value: _ => token(/[^<>"'=\s`]+/),
    quoted_attribute_value: $ => choice(
      seq('"', repeat(choice(alias(/[^"<&@{}]+/, $.attribute_value), $.entity, $.escaped_output, $.raw_output)), '"'),
      seq("'", repeat(choice(alias(/[^'<&@{}]+/, $.attribute_value), $.entity, $.escaped_output, $.raw_output)), "'"),
    ),
    raw_text: _ => token(prec(-1, /[^<]+/)),

    escaped_at: _ => '@@',
    escaped_output: $ => seq('{{', alias($._rust_expression, $.rust_expression), '}}'),
    raw_output: $ => seq('{!!', alias($._rust_raw_expression, $.rust_expression), '!!}'),
    template_comment: _ => seq('{{--', repeat(choice(/[^-]/, seq('-', /[^-]/))), '--}}'),
    rust_block: $ => seq('@rs', optional(alias($._rust_block_body, $.rust_block_body)), '@endrs'),
    if_block: $ => seq(
      '@if', '(', alias($._rust_condition, $.rust_condition), ')', repeat($._node),
      repeat(seq('@elseif', '(', alias($._rust_condition, $.rust_condition), ')', repeat($._node))),
      optional(seq('@else', repeat($._node))), '@endif',
    ),
    foreach_block: $ => seq('@foreach', '(', alias($._rust_condition, $.rust_loop_header), ')', repeat($._node), '@endforeach'),
    include_directive: $ => seq('@include', '(', alias($._rust_condition, $.rust_arguments), ')'),
    extends_directive: $ => seq('@extends', '(', $.string_literal, ')'),
    section_block: $ => seq('@section', '(', $.string_literal, ')', repeat($._node), '@endsection'),
    yield_directive: $ => seq('@yield', '(', $.string_literal, ')'),
    component: $ => seq(
      '<x-', $.component_name, repeat($.attribute),
      choice('/>', seq('>', repeat($._node), '</x-', $.component_name, '>')),
    ),
    component_name: _ => token(prec(PREC.component, /[A-Za-z_][A-Za-z0-9_-]*(?:::[A-Za-z_][A-Za-z0-9_-]*)*/)),
    string_literal: _ => choice(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'), seq("'", repeat(choice(/[^'\\]/, /\\./)), "'")),
  },
});
