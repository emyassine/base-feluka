const PREC = { directive: 3, component: 2, raw: 2 };

module.exports = grammar({
  name: 'feluqa_view',
  externals: $ => [
    $._rust_block_body,
    $._rust_expression,
    $._rust_raw_expression,
    $._rust_attribute_expression,
    $._rust_condition,
  ],
  extras: $ => [/[\t\r\n ]+/],
  rules: {
    source_file: $ => repeat($._node),
    _node: $ => choice(
      $.text, $.escaped_output, $.raw_output, $.template_comment,
      $.rust_block, $.if_block, $.foreach_block, $.include_directive,
      $.extends_directive, $.section_block, $.yield_directive,
      $.component, $.html_tag, $.escaped_at,
    ),
    text: _ => token(prec(-1, /[^<@{}]+/)),
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
    component: $ => choice(
      seq('<x-', $.component_name, repeat($.attribute), '/>'),
      seq('<x-', $.component_name, repeat($.attribute), '>', repeat($._node), '</x-', $.component_name, '>'),
    ),
    component_name: _ => token(prec(PREC.component, /[A-Za-z_][A-Za-z0-9_]*(::[A-Za-z_][A-Za-z0-9_-]*)*/)),
    html_tag: $ => choice(
      seq('<', $.tag_name, repeat($.attribute), '/>'),
      seq('<', $.tag_name, repeat($.attribute), '>'),
      seq('</', $.tag_name, '>'),
    ),
    tag_name: _ => token(/[A-Za-z][A-Za-z0-9:-]*/),
    attribute: $ => choice(
      seq(':', $.attribute_name, '=', alias(seq('"', alias($._rust_attribute_expression, $.rust_expression), '"'), $.bound_value)),
      seq($.attribute_name, '=', $.quoted_value),
      $.attribute_name,
    ),
    attribute_name: _ => token(/[A-Za-z_][A-Za-z0-9_:.-]*/),
    quoted_value: _ => choice(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'), seq("'", repeat(choice(/[^'\\]/, /\\./)), "'")),
    string_literal: _ => choice(seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'), seq("'", repeat(choice(/[^'\\]/, /\\./)), "'")),
  },
});
