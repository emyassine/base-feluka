import { ssrRenderAttrs } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Kardashev Scale","description":"Method of ranking civilizations by energy capture — from planetary to stellar to galactic scales.","frontmatter":{"title":"Kardashev Scale","sidebarTitle":"Kardashev Scale","icon":"globe","description":"Method of ranking civilizations by energy capture — from planetary to stellar to galactic scales.","sidebar":false,"aside":false,"prev":false,"next":false},"headers":[],"relativePath":"concepts/kardashev-scale/index.md","filePath":"concepts/kardashev-scale/index.md"}');
const _sfc_main = { name: "concepts/kardashev-scale/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="kardashev-scale" tabindex="-1">Kardashev Scale <a class="header-anchor" href="#kardashev-scale" aria-label="Permalink to &quot;Kardashev Scale&quot;">​</a></h1><p>A method of measuring a civilization’s level of technological advancement by the <strong>amount of energy</strong> it can harness and put to work — originally proposed by Nikolai Kardashev (1964).</p><table tabindex="0"><thead><tr><th>Type</th><th>Rough idea</th></tr></thead><tbody><tr><td>I</td><td>Planetary energy budget</td></tr><tr><td>II</td><td>Full output of its star</td></tr><tr><td>III</td><td>Energy of its galaxy</td></tr></tbody></table><h2 id="why-it-shows-up-in-our-research" tabindex="-1">Why it shows up in our research <a class="header-anchor" href="#why-it-shows-up-in-our-research" aria-label="Permalink to &quot;Why it shows up in our research&quot;">​</a></h2><p>When we talk about [[technological-acceleration|technological acceleration]] or “pushing technology as far as it can go”, the Kardashev ladder is a reminder: <strong>the outer bound is physical and infrastructural</strong>, not only software fashion.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("concepts/kardashev-scale/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
