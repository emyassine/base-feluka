import { ssrRenderAttrs, ssrRenderStyle } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Software","description":"Download software packages and tools.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Software","sidebarTitle":"Webkernel","icon":"webkernel-logo","description":"Download software packages and tools.","prev":{"text":"Modernization","link":"/fr/solutions/modernization/"},"next":{"text":"Home","link":"/fr/commercial/"}},"headers":[],"relativePath":"fr/webkernel/index.md","filePath":"fr/webkernel/index.md"}');
const _sfc_main = { name: "fr/webkernel/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center", "margin-bottom": "2rem" })}"><pre><code>&lt;img src=&quot;&quot;
    style=&quot;width:5rem !important; height:5rem !important; margin-bottom:2rem; margin-top:2rem;&quot; 
&gt;

&lt;span class=&quot;nm-eyebrow&quot;&gt;Open Source · Packages &amp; Tools&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;WebKernel&amp;nbsp;
    &lt;span class=&quot;nm-headline-accent&quot; style=&quot;display: inline-flex;&quot;&gt;
        Software
    &lt;/span&gt;
&lt;/h1&gt;
&lt;p style=&quot;color: var(--gray-400, #888); max-width: 600px; margin: 0 auto; font-size: 15px; line-height: 1.5;&quot;&gt;
    Browse public repositories and open-source packages from the WebKernelPHP ecosystem.
&lt;/p&gt;
</code></pre></div><h2 style="${ssrRenderStyle({ "font-size": "1.25rem", "font-weight": "700", "margin-top": "1.5rem", "margin-bottom": "0.75rem" })}"> Public Repositories </h2><pre><code>&lt;div class=&quot;repo-grid&quot;&gt;
    
        
            
        
    
&lt;/div&gt;

&lt;p style=&quot;color: #ef4444; margin-top: 1rem;&quot;&gt;Unable to load repositories at this time.&lt;/p&gt;
</code></pre></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/webkernel/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
