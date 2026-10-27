(template_comment) @comment
(escaped_at) @punctuation.special
(escaped_output "{{" @punctuation.bracket)
(escaped_output "}}" @punctuation.bracket)
(raw_output "{!!" @punctuation.bracket)
(raw_output "!!}" @punctuation.bracket)
(rust_block "@rs" @keyword)
(rust_block "@endrs" @keyword)
(if_block "@if" @keyword.condition)
(if_block "@elseif" @keyword.condition)
(if_block "@else" @keyword.condition)
(if_block "@endif" @keyword.condition)
(foreach_block "@foreach" @keyword.repeat)
(foreach_block "@endforeach" @keyword.repeat)
(include_directive "@include" @keyword)
(extends_directive "@extends" @keyword)
(section_block "@section" @keyword)
(section_block "@endsection" @keyword)
(yield_directive "@yield" @keyword)

(component_name) @type
(tag_name) @tag
(attribute_name) @attribute
(attribute_value) @string
(quoted_attribute_value) @string
(string_literal) @string
(entity) @constant.character.entity
(doctype_keyword) @keyword
(html_comment) @comment
(erroneous_end_tag_name) @tag.error
(bound_value) @embedded
(rust_expression) @embedded
(rust_condition) @embedded
(rust_loop_header) @embedded
(rust_arguments) @embedded
(rust_block_body) @embedded
