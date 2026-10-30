import { ssrRenderAttrs, ssrRenderStyle } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"FAQ","description":"Frequently asked questions.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"FAQ","sidebarTitle":"FAQ","icon":"circle-help","description":"Frequently asked questions.","prev":false,"next":false},"headers":[],"relativePath":"fr/faq/index.md","filePath":"fr/faq/index.md"}');
const _sfc_main = { name: "fr/faq/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h2 id="frequently-asked-questions" tabindex="-1">Frequently asked questions <a class="header-anchor" href="#frequently-asked-questions" aria-label="Permalink to &quot;Frequently asked questions&quot;">​</a></h2><p>:::md style=&quot;margin-bottom:3rem;&quot; Here are a few frequently asked questions about our services and customer offers.</p><p>For general information, view our subsites or our <a href="/fr/numerimondes/docs">documentation</a>.</p><p>For direct assistance, customers and partners should reach out to their contact person at Numerimondes. :::</p><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "gap": "0.75rem", "margin-top": "1rem" })}"><pre><code>    &lt;NmCard compact=&quot;true&quot; collapsible=&quot;true&quot; collapsed=&quot;true&quot; icon=&quot;$faq[&amp;#x27;icon&amp;#x27;]&quot; color=&quot;$faq[&amp;#x27;color&amp;#x27;]&quot;
        icon-size=&quot;md&quot;
    &gt;
        &lt;template #heading&gt;
                
        &lt;/template&gt;
        
            
    &lt;/NmCard&gt;
</code></pre></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/faq/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
