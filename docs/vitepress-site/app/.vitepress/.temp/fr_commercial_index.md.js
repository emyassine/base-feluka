import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Sovereign technology for builders","description":"Numerimondes — Webkernel, services, Services, Education, Products, Research — Webkernel and more. Casablanca.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Sovereign technology for builders","sidebarTitle":"Home","icon":"home","description":"Numerimondes — Webkernel, services, Services, Education, Products, Research — Webkernel and more. Casablanca.","prev":{"text":"Webkernel","link":"/fr/webkernel/"},"next":false},"headers":[],"relativePath":"fr/commercial/index.md","filePath":"fr/commercial/index.md"}');
const _sfc_main = { name: "fr/commercial/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmContents = resolveComponent("NmContents");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;World-class technology innovation&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Welcome to the&amp;nbsp;
    &lt;a href=&quot;/about&quot;&gt;
        &lt;span class=&quot;nm-headline-accent&quot; x-tooltip=&quot;{ content: &#39;Clic and Learn More about Numerimondes&#39;, placement: &#39;bottom&#39; }&quot; style=&quot;display: inline-flex;&quot;&gt;
            Numerimondes&amp;nbsp;
            
        &lt;/span&gt;
    &lt;/a&gt;
&lt;/h1&gt;
&lt;p style=&quot;color: #888; max-width: 600px; margin: 0 auto; font-size: 15px;&quot;&gt;
    We architect solutions that return technology ownership to business owners—reducing costs, optimizing value creation, and smoothly transitioning away from external dependencies using automation, modular builds, and local &lt;a href=&quot;/services/intelligence&quot;&gt;Intelligence&lt;/a&gt;.
&lt;/p&gt;

&lt;NmTriptych
    style=&quot;margin-top:2rem;&quot;
    left=&quot;https://images.unsplash.com/photo-1774677783913-28d8e6470c34?q=80&amp;w=1632&amp;auto=format&amp;fit=crop&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&quot;
    center=&quot;https://images.unsplash.com/photo-1774677784552-3cbc33328de4?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D&quot;
    right=&quot;https://images.unsplash.com/photo-1591981864044-937149741f56?w=500&amp;auto=format&amp;fit=crop&amp;q=60&amp;ixlib=rb-4.1.0&amp;ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDl8fHxlbnwwfHx8fHw%3D&quot;
    height=&quot;220px&quot;
 /&gt;
</code></pre></div>`);
  _push(ssrRenderComponent(_component_NmContents, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/commercial/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
