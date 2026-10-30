import { ssrRenderAttrs, ssrRenderStyle } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Contact","description":"Get in touch. Want to write to us or have a question or comment? Write in, we would love to hear from you.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Contact","sidebarTitle":"Contact","icon":"envelope","description":"Get in touch. Want to write to us or have a question or comment? Write in, we would love to hear from you.","prev":{"text":"Narrative & Assembly","link":"/fr/services/tender-support/narrative-assembly/"},"next":{"text":"Solutions","link":"/fr/solutions/"}},"headers":[],"relativePath":"fr/contact/index.md","filePath":"fr/contact/index.md"}');
const _sfc_main = { name: "fr/contact/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Contact&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Get in
    &lt;span class=&quot;nm-headline-accent&quot;&gt;
        Touch
    &lt;/span&gt;
&lt;/h1&gt;
</code></pre></div><p>:::md style=&quot;text-align: center; margin-bottom:3rem;&quot; Want to write to us or have a question or comment? Write in, we would love to hear from you. :::</p><div class="nm-contact-wrap" x-data="{ activeTab: &#39;sales&#39; }"><pre><code>&lt;div class=&quot;nm-contact-tabbar&quot;&gt;
    
        
            
                
            
        
    
&lt;/div&gt;


    &lt;div class=&quot;nm-contact-panel&quot; x-show=&quot;activeTab === &#39;&#39;&quot; x-cloak&gt;

        &lt;div class=&quot;nm-contact-person&quot;&gt;
            &lt;div class=&quot;nm-contact-person-name&quot;&gt;&lt;/div&gt;
            &lt;div class=&quot;nm-contact-person-role&quot;&gt;&lt;/div&gt;
        &lt;/div&gt;

        &lt;div class=&quot;nm-contact-grid&quot;&gt;

            &lt;div&gt;
                &lt;div class=&quot;nm-contact-field-label&quot;&gt;E-mail&lt;/div&gt;
                &lt;div class=&quot;nm-contact-field-row&quot;&gt;
                    &lt;span class=&quot;nm-contact-field-value&quot;&gt;&lt;/span&gt;
                    
                        
                    
                &lt;/div&gt;
            &lt;/div&gt;

            &lt;div&gt;
                &lt;div class=&quot;nm-contact-field-label&quot;&gt;Phone (Morocco)&lt;/div&gt;
                &lt;div class=&quot;nm-contact-field-row&quot;&gt;
                    &lt;span class=&quot;nm-contact-field-value&quot;&gt;&lt;/span&gt;
                    
                        
                    
                &lt;/div&gt;
            &lt;/div&gt;

        &lt;/div&gt;

        &lt;div&gt;
            &lt;div class=&quot;nm-contact-office-label&quot;&gt;&lt;/div&gt;
            &lt;div class=&quot;nm-contact-office-address&quot;&gt;{!! $tab[&#39;office_address&#39;] !!}&lt;/div&gt;
        &lt;/div&gt;

        &lt;div&gt;
            
                Get in touch
            
        &lt;/div&gt;

        &lt;div class=&quot;nm-contact-map&quot;&gt;
            &lt;iframe
                src=&quot;&quot;
                loading=&quot;lazy&quot;
                referrerpolicy=&quot;strict-origin-when-cross-origin&quot;
                allowfullscreen&gt;
            &lt;/iframe&gt;
        &lt;/div&gt;

    &lt;/div&gt;
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/contact/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
