import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrRenderClass, ssrRenderStyle, ssrRenderTeleport, ssrIncludeBooleanAttr, ssrLooseContain, renderToString } from "@vue/server-renderer";
import "./vue.runtime.esm-bundler.PWx5r8ot.js";
import { defineComponent, mergeProps, useSSRContext, shallowRef, inject, computed, ref, watch, onUnmounted, reactive, markRaw, readonly, nextTick, h, unref, onMounted, watchEffect, watchPostEffect, onUpdated, resolveComponent, createVNode, resolveDynamicComponent, withCtx, renderSlot, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineAsyncComponent, provide, toHandlers, withKeys, onBeforeUnmount, useSlots, createSSRApp } from "@vue/runtime-dom";
import { usePreferredDark, useDark, useMediaQuery, useWindowSize, onKeyStroke, useWindowScroll, useScrollLock } from "@vueuse/core";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const _sfc_main$1l = /* @__PURE__ */ defineComponent({
  __name: "VPBadge",
  __ssrInlineRender: true,
  props: {
    text: {},
    type: { default: "tip" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${ssrRenderAttrs(mergeProps({
        class: ["VPBadge", __props.type]
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, () => {
        _push(`${ssrInterpolate(__props.text)}`);
      }, _push, _parent);
      _push(`</span>`);
    };
  }
});
const _sfc_setup$1l = _sfc_main$1l.setup;
_sfc_main$1l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue");
  return _sfc_setup$1l ? _sfc_setup$1l(props, ctx) : void 0;
};
function deserializeFunctions(r) {
  return Array.isArray(r) ? r.map(deserializeFunctions) : typeof r == "object" && r !== null ? Object.keys(r).reduce((t, n) => (t[n] = deserializeFunctions(r[n]), t), {}) : typeof r == "string" && r.startsWith("_vp-fn_") ? new Function(`return ${r.slice(7)}`)() : r;
}
const siteData = deserializeFunctions(JSON.parse(`{"lang":"en-US","dir":"ltr","title":"Feluqa","description":"A VitePress site","base":"/","head":[],"router":{"prefetchLinks":true},"appearance":true,"themeConfig":{"nav":[{"text":"Docs","link":"/get-started/","activeMatch":"^/(?!$)(?!(?:internals|agents|learn|articles)(?:/|$))"},{"text":"Architecture","link":"/internals/get-started/","activeMatch":"^/internals(?:/|$)"},{"text":"Agents","link":"/agents/get-started/","activeMatch":"^/agents(?:/|$)"},{"text":"Learn","link":"/learn/get-started/","activeMatch":"^/learn(?:/|$)"},{"text":"Articles","link":"/articles/","activeMatch":"^/articles(?:/|$)"}],"locales":{"fr":{"nav":[{"text":"Docs","link":"/fr/get-started/","activeMatch":"^/fr/(?!$)(?!(?:internals|agents|learn|articles)(?:/|$))"},{"text":"Architecture","link":"/fr/internals/get-started/","activeMatch":"^/fr/internals(?:/|$)"},{"text":"Agents","link":"/fr/agents/get-started/","activeMatch":"^/fr/agents(?:/|$)"},{"text":"Apprendre","link":"/fr/learn/get-started/","activeMatch":"^/fr/learn(?:/|$)"},{"text":"Articles","link":"/fr/articles/","activeMatch":"^/fr/articles(?:/|$)"}],"sidebar":{"/fr/":[{"text":"prologue","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg')\\" aria-hidden=\\"true\\"></span><span>Components</span></span>","link":"/fr/prologue/components"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/fr/prologue/contribution-guide"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>License</span></span>","link":"/fr/prologue/licence"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg')\\" aria-hidden=\\"true\\"></span><span>Releases</span></span>","link":"/fr/prologue/release-notes"}]},{"text":"get started","collapsed":true,"items":[{"text":"introduction","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/fr/get-started/introduction/architecture-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","link":"/fr/get-started/introduction/introduction"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Product &amp; Audience</span></span>","link":"/fr/get-started/introduction/product-and-audience"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg')\\" aria-hidden=\\"true\\"></span><span>Taxonomy</span></span>","link":"/fr/get-started/introduction/taxonomy"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg')\\" aria-hidden=\\"true\\"></span><span>Setup</span></span>","link":"/fr/get-started/installation/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg')\\" aria-hidden=\\"true\\"></span><span>Configuration</span></span>","link":"/fr/get-started/configuration/pages-and-config"},{"text":"directory structure","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>CLI Structure</span></span>","link":"/fr/get-started/directory-structure/cli-structure"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Contexts</span></span>","link":"/fr/get-started/directory-structure/module-submodule-feature-contexts"}]},{"text":"frontend","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg')\\" aria-hidden=\\"true\\"></span><span>Panels</span></span>","link":"/fr/get-started/frontend/panels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg')\\" aria-hidden=\\"true\\"></span><span>Resources</span></span>","link":"/fr/get-started/frontend/resources"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg')\\" aria-hidden=\\"true\\"></span><span>System Panel</span></span>","link":"/fr/get-started/frontend/system-panel"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg')\\" aria-hidden=\\"true\\"></span><span>Starter Kits</span></span>","link":"/fr/get-started/starter-kits/application-profiles-and-starter-kits"}]},{"text":"security","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Authorization</span></span>","link":"/fr/security/authorization-model"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg')\\" aria-hidden=\\"true\\"></span><span>Gates</span></span>","link":"/fr/security/gates"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Privileges</span></span>","link":"/fr/security/privilege-levels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg')\\" aria-hidden=\\"true\\"></span><span>Rust Boundaries</span></span>","link":"/fr/security/rust-security-boundaries"}]},{"text":"storage","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg')\\" aria-hidden=\\"true\\"></span><span>Data Layers</span></span>","link":"/fr/storage/data-layers"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg')\\" aria-hidden=\\"true\\"></span><span>Storage Paths</span></span>","link":"/fr/storage/storage-backends-and-paths"}]},{"text":"deployment","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg')\\" aria-hidden=\\"true\\"></span><span>HTTP &amp; Live</span></span>","link":"/fr/deployment/http-and-live-actions"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg')\\" aria-hidden=\\"true\\"></span><span>Install App</span></span>","link":"/fr/deployment/installing-an-app-with-the-cli"}]}],"/fr/get-started/":[{"text":"prologue","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg')\\" aria-hidden=\\"true\\"></span><span>Components</span></span>","link":"/fr/prologue/components"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/fr/prologue/contribution-guide"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>License</span></span>","link":"/fr/prologue/licence"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg')\\" aria-hidden=\\"true\\"></span><span>Releases</span></span>","link":"/fr/prologue/release-notes"}]},{"text":"get started","collapsed":true,"items":[{"text":"introduction","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/fr/get-started/introduction/architecture-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","link":"/fr/get-started/introduction/introduction"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Product &amp; Audience</span></span>","link":"/fr/get-started/introduction/product-and-audience"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg')\\" aria-hidden=\\"true\\"></span><span>Taxonomy</span></span>","link":"/fr/get-started/introduction/taxonomy"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg')\\" aria-hidden=\\"true\\"></span><span>Setup</span></span>","link":"/fr/get-started/installation/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg')\\" aria-hidden=\\"true\\"></span><span>Configuration</span></span>","link":"/fr/get-started/configuration/pages-and-config"},{"text":"directory structure","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>CLI Structure</span></span>","link":"/fr/get-started/directory-structure/cli-structure"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Contexts</span></span>","link":"/fr/get-started/directory-structure/module-submodule-feature-contexts"}]},{"text":"frontend","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg')\\" aria-hidden=\\"true\\"></span><span>Panels</span></span>","link":"/fr/get-started/frontend/panels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg')\\" aria-hidden=\\"true\\"></span><span>Resources</span></span>","link":"/fr/get-started/frontend/resources"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg')\\" aria-hidden=\\"true\\"></span><span>System Panel</span></span>","link":"/fr/get-started/frontend/system-panel"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg')\\" aria-hidden=\\"true\\"></span><span>Starter Kits</span></span>","link":"/fr/get-started/starter-kits/application-profiles-and-starter-kits"}]},{"text":"security","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Authorization</span></span>","link":"/fr/security/authorization-model"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg')\\" aria-hidden=\\"true\\"></span><span>Gates</span></span>","link":"/fr/security/gates"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Privileges</span></span>","link":"/fr/security/privilege-levels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg')\\" aria-hidden=\\"true\\"></span><span>Rust Boundaries</span></span>","link":"/fr/security/rust-security-boundaries"}]},{"text":"storage","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg')\\" aria-hidden=\\"true\\"></span><span>Data Layers</span></span>","link":"/fr/storage/data-layers"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg')\\" aria-hidden=\\"true\\"></span><span>Storage Paths</span></span>","link":"/fr/storage/storage-backends-and-paths"}]},{"text":"deployment","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg')\\" aria-hidden=\\"true\\"></span><span>HTTP &amp; Live</span></span>","link":"/fr/deployment/http-and-live-actions"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg')\\" aria-hidden=\\"true\\"></span><span>Install App</span></span>","link":"/fr/deployment/installing-an-app-with-the-cli"}]}],"/fr/internals/":[{"text":"get started","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg')\\" aria-hidden=\\"true\\"></span><span>Internals</span></span>","link":"/fr/internals/get-started/overview/internals-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>Workspaces</span></span>","link":"/fr/internals/get-started/workspaces/workspaces-and-packages"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Compile Time</span></span>","link":"/fr/internals/get-started/compile-time/compile-time-guarantees"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/3710fd328756a9333e42110ddbfbf90aa9b64200bbdbc35d3fbac6a8db8b16d7.svg')\\" aria-hidden=\\"true\\"></span><span>Contributor Rules</span></span>","link":"/fr/internals/get-started/contributor-rules/rules-for-developers-and-agents"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1d74d95214a9155a07422ab9529ca816f6d42e9ca8838c12ef2550c78c9b445a.svg')\\" aria-hidden=\\"true\\"></span><span>Async Runtimes</span></span>","link":"/fr/internals/get-started/runtime/asynchronous-runtimes-by-target"}]}],"/fr/agents/":[{"text":"get started","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg')\\" aria-hidden=\\"true\\"></span><span>Agents</span></span>","link":"/fr/agents/get-started/overview/agents-overview"},{"text":"agentic development","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Agent Modules</span></span>","link":"/fr/agents/get-started/agentic-development/agent-ready-extensible-modules"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg')\\" aria-hidden=\\"true\\"></span><span>Agent Project</span></span>","link":"/fr/agents/get-started/agentic-development/complementary-agent-project"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f31e1e7ee2b1b0c366907b94988c185f1e146a46627430dd2bf7db3a63569412.svg')\\" aria-hidden=\\"true\\"></span><span>Writing Docs</span></span>","link":"/fr/agents/get-started/skills/writing-docs"}]}],"/fr/learn/":[{"text":"get started","link":"/fr/learn/get-started/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg')\\" aria-hidden=\\"true\\"></span><span>First App</span></span>","link":"/fr/learn/get-started/first-application/create-your-first-application"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/aff07fc7ed06f1e31c067ca48a35c608741d99c57afceff9d1513d5c1a23ee38.svg')\\" aria-hidden=\\"true\\"></span><span>Hello CLI</span></span>","link":"/fr/learn/get-started/hello-cli/program-0-hello-cli"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1e3afb66a05bfb500bdd6cc4402b88dadd5838340ac989c6c79e51e2638edb6f.svg')\\" aria-hidden=\\"true\\"></span><span>Weather Watcher</span></span>","link":"/fr/learn/get-started/weather-watcher/build-the-weather-watcher"}]}],"/fr/articles/":[]},"outline":{"label":"Sur cette page"},"footer":{"message":"Des questions ? Consultez les <a href=\\"/fr/faq/\\">réponses rapides</a>.","copyright":"Documentation Feluqa - Copyright © <a href=\\"https://numerimondes.com\\">Numerimondes</a>"},"langMenuLabel":"Changer de langue"}},"langMenuLabel":"Change language","socialLinks":[{"icon":"github","link":"https://github.com/emyassine/base-feluka","ariaLabel":"Feluqa on GitHub"},{"icon":{"svg":"<svg role=\\"img\\" viewBox=\\"0 0 24 24\\" xmlns=\\"http://www.w3.org/2000/svg\\"><title>Website</title><circle cx=\\"12\\" cy=\\"12\\" r=\\"9\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"1.8\\"/><path d=\\"M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18\\" fill=\\"none\\" stroke=\\"currentColor\\" stroke-width=\\"1.5\\"/></svg>"},"link":"https://numerimondes.com","ariaLabel":"Numerimondes website"},{"icon":"linkedin","link":"https://www.linkedin.com/in/elmoumenyassine","ariaLabel":"Yassine on LinkedIn"}],"sidebar":{"/":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7f0e52d09075130a12ac51238df176d84c03077f490897d49f335897460c4451.svg')\\" aria-hidden=\\"true\\"></span><span>Prologue</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg')\\" aria-hidden=\\"true\\"></span><span>Releases</span></span>","link":"/prologue/release-notes"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>License</span></span>","link":"/prologue/licence"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/prologue/contribution-guide"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg')\\" aria-hidden=\\"true\\"></span><span>Components</span></span>","link":"/prologue/components"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c5c57ff35b0418d50d009600c7be46abf6e6939f8b000acb14b86b17b4b6753.svg')\\" aria-hidden=\\"true\\"></span><span>Get started</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/18601f346aa15f73cd81da2dc9a94579f7b13dd9826ef1125a35c30ebcd241cf.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","link":"/get-started/introduction/introduction"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Product &amp; Audience</span></span>","link":"/get-started/introduction/product-and-audience"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg')\\" aria-hidden=\\"true\\"></span><span>Taxonomy</span></span>","link":"/get-started/introduction/taxonomy"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/get-started/introduction/architecture-overview"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg')\\" aria-hidden=\\"true\\"></span><span>Setup</span></span>","link":"/get-started/installation/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg')\\" aria-hidden=\\"true\\"></span><span>Configuration</span></span>","link":"/get-started/configuration/pages-and-config"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/445bcc275a0dc3e9e6aef6485530632d8273a322b0910c678f5e64513b5b1a2a.svg')\\" aria-hidden=\\"true\\"></span><span>Directory Structure</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>CLI Structure</span></span>","link":"/get-started/directory-structure/cli-structure"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Contexts</span></span>","link":"/get-started/directory-structure/module-submodule-feature-contexts"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/eddbee2ea95bde55d79fffbc485c45a9b311c01fb718e88fa1d48ee6e2cae8b6.svg')\\" aria-hidden=\\"true\\"></span><span>Frontend</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg')\\" aria-hidden=\\"true\\"></span><span>Panels</span></span>","link":"/get-started/frontend/panels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg')\\" aria-hidden=\\"true\\"></span><span>Resources</span></span>","link":"/get-started/frontend/resources"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg')\\" aria-hidden=\\"true\\"></span><span>System Panel</span></span>","link":"/get-started/frontend/system-panel"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg')\\" aria-hidden=\\"true\\"></span><span>Starter Kits</span></span>","link":"/get-started/starter-kits/application-profiles-and-starter-kits"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/b05cf01913d0b6d5d25ee8c60bd283e707f7541b540dafff32d64b19491066b5.svg')\\" aria-hidden=\\"true\\"></span><span>Security</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Authorization</span></span>","link":"/security/authorization-model"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Privileges</span></span>","link":"/security/privilege-levels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg')\\" aria-hidden=\\"true\\"></span><span>Gates</span></span>","link":"/security/gates"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg')\\" aria-hidden=\\"true\\"></span><span>Rust Boundaries</span></span>","link":"/security/rust-security-boundaries"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f2e5b897d44bf66555eb1a1d4a116ff8d647a64304bcf587735e5a30c8ecae45.svg')\\" aria-hidden=\\"true\\"></span><span>Storage</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg')\\" aria-hidden=\\"true\\"></span><span>Data Layers</span></span>","link":"/storage/data-layers"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg')\\" aria-hidden=\\"true\\"></span><span>Storage Paths</span></span>","link":"/storage/storage-backends-and-paths"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f2cca2cce96c5e1512e60b3bd5c3736bb533fa0cfb3aab89d67f52de180f3579.svg')\\" aria-hidden=\\"true\\"></span><span>Deployment</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg')\\" aria-hidden=\\"true\\"></span><span>Install App</span></span>","link":"/deployment/installing-an-app-with-the-cli"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg')\\" aria-hidden=\\"true\\"></span><span>HTTP &amp; Live</span></span>","link":"/deployment/http-and-live-actions"}]}],"/get-started/":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7f0e52d09075130a12ac51238df176d84c03077f490897d49f335897460c4451.svg')\\" aria-hidden=\\"true\\"></span><span>Prologue</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg')\\" aria-hidden=\\"true\\"></span><span>Releases</span></span>","link":"/prologue/release-notes"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>License</span></span>","link":"/prologue/licence"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/prologue/contribution-guide"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg')\\" aria-hidden=\\"true\\"></span><span>Components</span></span>","link":"/prologue/components"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c5c57ff35b0418d50d009600c7be46abf6e6939f8b000acb14b86b17b4b6753.svg')\\" aria-hidden=\\"true\\"></span><span>Get started</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/18601f346aa15f73cd81da2dc9a94579f7b13dd9826ef1125a35c30ebcd241cf.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","link":"/get-started/introduction/introduction"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Product &amp; Audience</span></span>","link":"/get-started/introduction/product-and-audience"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg')\\" aria-hidden=\\"true\\"></span><span>Taxonomy</span></span>","link":"/get-started/introduction/taxonomy"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/get-started/introduction/architecture-overview"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg')\\" aria-hidden=\\"true\\"></span><span>Setup</span></span>","link":"/get-started/installation/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg')\\" aria-hidden=\\"true\\"></span><span>Configuration</span></span>","link":"/get-started/configuration/pages-and-config"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/445bcc275a0dc3e9e6aef6485530632d8273a322b0910c678f5e64513b5b1a2a.svg')\\" aria-hidden=\\"true\\"></span><span>Directory Structure</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>CLI Structure</span></span>","link":"/get-started/directory-structure/cli-structure"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Contexts</span></span>","link":"/get-started/directory-structure/module-submodule-feature-contexts"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/eddbee2ea95bde55d79fffbc485c45a9b311c01fb718e88fa1d48ee6e2cae8b6.svg')\\" aria-hidden=\\"true\\"></span><span>Frontend</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg')\\" aria-hidden=\\"true\\"></span><span>Panels</span></span>","link":"/get-started/frontend/panels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg')\\" aria-hidden=\\"true\\"></span><span>Resources</span></span>","link":"/get-started/frontend/resources"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg')\\" aria-hidden=\\"true\\"></span><span>System Panel</span></span>","link":"/get-started/frontend/system-panel"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg')\\" aria-hidden=\\"true\\"></span><span>Starter Kits</span></span>","link":"/get-started/starter-kits/application-profiles-and-starter-kits"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/b05cf01913d0b6d5d25ee8c60bd283e707f7541b540dafff32d64b19491066b5.svg')\\" aria-hidden=\\"true\\"></span><span>Security</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Authorization</span></span>","link":"/security/authorization-model"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Privileges</span></span>","link":"/security/privilege-levels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg')\\" aria-hidden=\\"true\\"></span><span>Gates</span></span>","link":"/security/gates"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg')\\" aria-hidden=\\"true\\"></span><span>Rust Boundaries</span></span>","link":"/security/rust-security-boundaries"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f2e5b897d44bf66555eb1a1d4a116ff8d647a64304bcf587735e5a30c8ecae45.svg')\\" aria-hidden=\\"true\\"></span><span>Storage</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg')\\" aria-hidden=\\"true\\"></span><span>Data Layers</span></span>","link":"/storage/data-layers"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg')\\" aria-hidden=\\"true\\"></span><span>Storage Paths</span></span>","link":"/storage/storage-backends-and-paths"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f2cca2cce96c5e1512e60b3bd5c3736bb533fa0cfb3aab89d67f52de180f3579.svg')\\" aria-hidden=\\"true\\"></span><span>Deployment</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg')\\" aria-hidden=\\"true\\"></span><span>Install App</span></span>","link":"/deployment/installing-an-app-with-the-cli"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg')\\" aria-hidden=\\"true\\"></span><span>HTTP &amp; Live</span></span>","link":"/deployment/http-and-live-actions"}]}],"/internals/":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c5c57ff35b0418d50d009600c7be46abf6e6939f8b000acb14b86b17b4b6753.svg')\\" aria-hidden=\\"true\\"></span><span>Get started</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg')\\" aria-hidden=\\"true\\"></span><span>Internals</span></span>","link":"/internals/get-started/overview/internals-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>Workspaces</span></span>","link":"/internals/get-started/workspaces/workspaces-and-packages"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Compile Time</span></span>","link":"/internals/get-started/compile-time/compile-time-guarantees"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/3710fd328756a9333e42110ddbfbf90aa9b64200bbdbc35d3fbac6a8db8b16d7.svg')\\" aria-hidden=\\"true\\"></span><span>Contributor Rules</span></span>","link":"/internals/get-started/contributor-rules/rules-for-developers-and-agents"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1d74d95214a9155a07422ab9529ca816f6d42e9ca8838c12ef2550c78c9b445a.svg')\\" aria-hidden=\\"true\\"></span><span>Async Runtimes</span></span>","link":"/internals/get-started/runtime/asynchronous-runtimes-by-target"}]}],"/agents/":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c5c57ff35b0418d50d009600c7be46abf6e6939f8b000acb14b86b17b4b6753.svg')\\" aria-hidden=\\"true\\"></span><span>Get started</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg')\\" aria-hidden=\\"true\\"></span><span>Agents</span></span>","link":"/agents/get-started/overview/agents-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f0093681555e45bce262f1df04e9f1b0ef6898a332fc71c73f8502939b2879.svg')\\" aria-hidden=\\"true\\"></span><span>Agentic Development</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Agent Modules</span></span>","link":"/agents/get-started/agentic-development/agent-ready-extensible-modules"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg')\\" aria-hidden=\\"true\\"></span><span>Agent Project</span></span>","link":"/agents/get-started/agentic-development/complementary-agent-project"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f31e1e7ee2b1b0c366907b94988c185f1e146a46627430dd2bf7db3a63569412.svg')\\" aria-hidden=\\"true\\"></span><span>Writing Docs</span></span>","link":"/agents/get-started/skills/writing-docs"}]}],"/learn/":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c5c57ff35b0418d50d009600c7be46abf6e6939f8b000acb14b86b17b4b6753.svg')\\" aria-hidden=\\"true\\"></span><span>Get started</span></span>","link":"/learn/get-started/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg')\\" aria-hidden=\\"true\\"></span><span>First App</span></span>","link":"/learn/get-started/first-application/create-your-first-application"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/aff07fc7ed06f1e31c067ca48a35c608741d99c57afceff9d1513d5c1a23ee38.svg')\\" aria-hidden=\\"true\\"></span><span>Hello CLI</span></span>","link":"/learn/get-started/hello-cli/program-0-hello-cli"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1e3afb66a05bfb500bdd6cc4402b88dadd5838340ac989c6c79e51e2638edb6f.svg')\\" aria-hidden=\\"true\\"></span><span>Weather Watcher</span></span>","link":"/learn/get-started/weather-watcher/build-the-weather-watcher"}]}],"/articles/":[]},"search":{"provider":"local","options":{"miniSearch":{"searchOptions":{"fuzzy":0.2,"prefix":true,"boost":{"title":4,"text":2,"titles":1}}},"locales":{"root":{"translations":{"button":{"buttonText":"Search","buttonAriaLabel":"Search documentation"},"modal":{"displayDetails":"Display detailed list","resetButtonTitle":"Reset search","backButtonTitle":"Close search","noResultsText":"No results","footer":{"selectText":"Select","selectKeyAriaLabel":"Enter","navigateText":"Navigate","navigateUpKeyAriaLabel":"Arrow up","navigateDownKeyAriaLabel":"Arrow down","closeText":"Close","closeKeyAriaLabel":"Escape"}}}},"fr":{"translations":{"button":{"buttonText":"Rechercher","buttonAriaLabel":"Rechercher dans la documentation"},"modal":{"displayDetails":"Afficher les détails","resetButtonTitle":"Réinitialiser la recherche","backButtonTitle":"Fermer la recherche","noResultsText":"Aucun résultat","footer":{"selectText":"Sélectionner","selectKeyAriaLabel":"Entrée","navigateText":"Naviguer","navigateUpKeyAriaLabel":"Flèche vers le haut","navigateDownKeyAriaLabel":"Flèche vers le bas","closeText":"Fermer","closeKeyAriaLabel":"Échap"}}}}}}},"outline":{"label":"On this page","level":"deep"},"aside":true,"footer":{"message":"Questions? Read the <a href=\\"/faq/\\">quick answers</a>.","copyright":"Feluqa documentation - Copyright © <a href=\\"https://numerimondes.com\\">Numerimondes</a>"},"logo":{"light":"/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg","dark":"/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg","alt":"Feluqa"},"siteTitle":false},"locales":{"root":{"label":"English","lang":"en"},"fr":{"label":"Français","lang":"fr","link":"/fr/","themeConfig":{"nav":[{"text":"Docs","link":"/fr/get-started/","activeMatch":"^/fr/(?!$)(?!(?:internals|agents|learn|articles)(?:/|$))"},{"text":"Architecture","link":"/fr/internals/get-started/","activeMatch":"^/fr/internals(?:/|$)"},{"text":"Agents","link":"/fr/agents/get-started/","activeMatch":"^/fr/agents(?:/|$)"},{"text":"Apprendre","link":"/fr/learn/get-started/","activeMatch":"^/fr/learn(?:/|$)"},{"text":"Articles","link":"/fr/articles/","activeMatch":"^/fr/articles(?:/|$)"}],"sidebar":{"/fr/":[{"text":"prologue","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg')\\" aria-hidden=\\"true\\"></span><span>Components</span></span>","link":"/fr/prologue/components"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/fr/prologue/contribution-guide"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>License</span></span>","link":"/fr/prologue/licence"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg')\\" aria-hidden=\\"true\\"></span><span>Releases</span></span>","link":"/fr/prologue/release-notes"}]},{"text":"get started","collapsed":true,"items":[{"text":"introduction","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/fr/get-started/introduction/architecture-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","link":"/fr/get-started/introduction/introduction"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Product &amp; Audience</span></span>","link":"/fr/get-started/introduction/product-and-audience"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg')\\" aria-hidden=\\"true\\"></span><span>Taxonomy</span></span>","link":"/fr/get-started/introduction/taxonomy"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg')\\" aria-hidden=\\"true\\"></span><span>Setup</span></span>","link":"/fr/get-started/installation/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg')\\" aria-hidden=\\"true\\"></span><span>Configuration</span></span>","link":"/fr/get-started/configuration/pages-and-config"},{"text":"directory structure","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>CLI Structure</span></span>","link":"/fr/get-started/directory-structure/cli-structure"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Contexts</span></span>","link":"/fr/get-started/directory-structure/module-submodule-feature-contexts"}]},{"text":"frontend","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg')\\" aria-hidden=\\"true\\"></span><span>Panels</span></span>","link":"/fr/get-started/frontend/panels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg')\\" aria-hidden=\\"true\\"></span><span>Resources</span></span>","link":"/fr/get-started/frontend/resources"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg')\\" aria-hidden=\\"true\\"></span><span>System Panel</span></span>","link":"/fr/get-started/frontend/system-panel"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg')\\" aria-hidden=\\"true\\"></span><span>Starter Kits</span></span>","link":"/fr/get-started/starter-kits/application-profiles-and-starter-kits"}]},{"text":"security","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Authorization</span></span>","link":"/fr/security/authorization-model"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg')\\" aria-hidden=\\"true\\"></span><span>Gates</span></span>","link":"/fr/security/gates"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Privileges</span></span>","link":"/fr/security/privilege-levels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg')\\" aria-hidden=\\"true\\"></span><span>Rust Boundaries</span></span>","link":"/fr/security/rust-security-boundaries"}]},{"text":"storage","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg')\\" aria-hidden=\\"true\\"></span><span>Data Layers</span></span>","link":"/fr/storage/data-layers"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg')\\" aria-hidden=\\"true\\"></span><span>Storage Paths</span></span>","link":"/fr/storage/storage-backends-and-paths"}]},{"text":"deployment","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg')\\" aria-hidden=\\"true\\"></span><span>HTTP &amp; Live</span></span>","link":"/fr/deployment/http-and-live-actions"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg')\\" aria-hidden=\\"true\\"></span><span>Install App</span></span>","link":"/fr/deployment/installing-an-app-with-the-cli"}]}],"/fr/get-started/":[{"text":"prologue","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg')\\" aria-hidden=\\"true\\"></span><span>Components</span></span>","link":"/fr/prologue/components"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/fr/prologue/contribution-guide"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>License</span></span>","link":"/fr/prologue/licence"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg')\\" aria-hidden=\\"true\\"></span><span>Releases</span></span>","link":"/fr/prologue/release-notes"}]},{"text":"get started","collapsed":true,"items":[{"text":"introduction","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/fr/get-started/introduction/architecture-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Introduction</span></span>","link":"/fr/get-started/introduction/introduction"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Product &amp; Audience</span></span>","link":"/fr/get-started/introduction/product-and-audience"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg')\\" aria-hidden=\\"true\\"></span><span>Taxonomy</span></span>","link":"/fr/get-started/introduction/taxonomy"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg')\\" aria-hidden=\\"true\\"></span><span>Setup</span></span>","link":"/fr/get-started/installation/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg')\\" aria-hidden=\\"true\\"></span><span>Configuration</span></span>","link":"/fr/get-started/configuration/pages-and-config"},{"text":"directory structure","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>CLI Structure</span></span>","link":"/fr/get-started/directory-structure/cli-structure"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Contexts</span></span>","link":"/fr/get-started/directory-structure/module-submodule-feature-contexts"}]},{"text":"frontend","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg')\\" aria-hidden=\\"true\\"></span><span>Panels</span></span>","link":"/fr/get-started/frontend/panels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg')\\" aria-hidden=\\"true\\"></span><span>Resources</span></span>","link":"/fr/get-started/frontend/resources"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg')\\" aria-hidden=\\"true\\"></span><span>System Panel</span></span>","link":"/fr/get-started/frontend/system-panel"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg')\\" aria-hidden=\\"true\\"></span><span>Starter Kits</span></span>","link":"/fr/get-started/starter-kits/application-profiles-and-starter-kits"}]},{"text":"security","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Authorization</span></span>","link":"/fr/security/authorization-model"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg')\\" aria-hidden=\\"true\\"></span><span>Gates</span></span>","link":"/fr/security/gates"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Privileges</span></span>","link":"/fr/security/privilege-levels"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg')\\" aria-hidden=\\"true\\"></span><span>Rust Boundaries</span></span>","link":"/fr/security/rust-security-boundaries"}]},{"text":"storage","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg')\\" aria-hidden=\\"true\\"></span><span>Data Layers</span></span>","link":"/fr/storage/data-layers"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg')\\" aria-hidden=\\"true\\"></span><span>Storage Paths</span></span>","link":"/fr/storage/storage-backends-and-paths"}]},{"text":"deployment","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg')\\" aria-hidden=\\"true\\"></span><span>HTTP &amp; Live</span></span>","link":"/fr/deployment/http-and-live-actions"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg')\\" aria-hidden=\\"true\\"></span><span>Install App</span></span>","link":"/fr/deployment/installing-an-app-with-the-cli"}]}],"/fr/internals/":[{"text":"get started","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg')\\" aria-hidden=\\"true\\"></span><span>Internals</span></span>","link":"/fr/internals/get-started/overview/internals-overview"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg')\\" aria-hidden=\\"true\\"></span><span>Workspaces</span></span>","link":"/fr/internals/get-started/workspaces/workspaces-and-packages"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg')\\" aria-hidden=\\"true\\"></span><span>Compile Time</span></span>","link":"/fr/internals/get-started/compile-time/compile-time-guarantees"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/3710fd328756a9333e42110ddbfbf90aa9b64200bbdbc35d3fbac6a8db8b16d7.svg')\\" aria-hidden=\\"true\\"></span><span>Contributor Rules</span></span>","link":"/fr/internals/get-started/contributor-rules/rules-for-developers-and-agents"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1d74d95214a9155a07422ab9529ca816f6d42e9ca8838c12ef2550c78c9b445a.svg')\\" aria-hidden=\\"true\\"></span><span>Async Runtimes</span></span>","link":"/fr/internals/get-started/runtime/asynchronous-runtimes-by-target"}]}],"/fr/agents/":[{"text":"get started","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg')\\" aria-hidden=\\"true\\"></span><span>Agents</span></span>","link":"/fr/agents/get-started/overview/agents-overview"},{"text":"agentic development","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg')\\" aria-hidden=\\"true\\"></span><span>Agent Modules</span></span>","link":"/fr/agents/get-started/agentic-development/agent-ready-extensible-modules"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg')\\" aria-hidden=\\"true\\"></span><span>Agent Project</span></span>","link":"/fr/agents/get-started/agentic-development/complementary-agent-project"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f31e1e7ee2b1b0c366907b94988c185f1e146a46627430dd2bf7db3a63569412.svg')\\" aria-hidden=\\"true\\"></span><span>Writing Docs</span></span>","link":"/fr/agents/get-started/skills/writing-docs"}]}],"/fr/learn/":[{"text":"get started","link":"/fr/learn/get-started/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg')\\" aria-hidden=\\"true\\"></span><span>First App</span></span>","link":"/fr/learn/get-started/first-application/create-your-first-application"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/aff07fc7ed06f1e31c067ca48a35c608741d99c57afceff9d1513d5c1a23ee38.svg')\\" aria-hidden=\\"true\\"></span><span>Hello CLI</span></span>","link":"/fr/learn/get-started/hello-cli/program-0-hello-cli"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1e3afb66a05bfb500bdd6cc4402b88dadd5838340ac989c6c79e51e2638edb6f.svg')\\" aria-hidden=\\"true\\"></span><span>Weather Watcher</span></span>","link":"/fr/learn/get-started/weather-watcher/build-the-weather-watcher"}]}],"/fr/articles/":[]},"outline":{"label":"Sur cette page"},"footer":{"message":"Des questions ? Consultez les <a href=\\"/fr/faq/\\">réponses rapides</a>.","copyright":"Documentation Feluqa - Copyright © <a href=\\"https://numerimondes.com\\">Numerimondes</a>"},"langMenuLabel":"Changer de langue"}}},"scrollOffset":134,"cleanUrls":true}`));
const __vite_import_meta_env__ = {};
const EXTERNAL_URL_RE = /^(?:[a-z]+:|\/\/)/i;
const APPEARANCE_KEY = "vitepress-theme-appearance";
const HASH_RE = /#.*$/;
const HASH_OR_QUERY_RE = /[?#].*$/;
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/;
const inBrowser = typeof document !== "undefined";
const notFoundPageData = {
  relativePath: "404.md",
  filePath: "",
  title: "404",
  description: "Not Found",
  headers: [],
  frontmatter: { sidebar: false, layout: "page" },
  lastUpdated: 0,
  isNotFound: true
};
function isActive(currentPath, matchPath, asRegex = false) {
  if (matchPath === void 0) {
    return false;
  }
  currentPath = normalize$3(`/${currentPath}`);
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }
  if (normalize$3(matchPath) !== currentPath) {
    return false;
  }
  const hashMatch = matchPath.match(HASH_RE);
  if (hashMatch) {
    return (inBrowser ? location.hash : "") === hashMatch[0];
  }
  return true;
}
function normalize$3(path) {
  return decodeURI(path).replace(HASH_OR_QUERY_RE, "").replace(INDEX_OR_EXT_RE, "$1");
}
function isExternal(path) {
  return EXTERNAL_URL_RE.test(path);
}
function getLocaleForPath(siteData2, relativePath) {
  return Object.keys((siteData2 == null ? void 0 : siteData2.locales) || {}).find((key) => key !== "root" && !isExternal(key) && isActive(relativePath, `/${key}/`, true)) || "root";
}
function resolveSiteDataByRoute(siteData2, relativePath) {
  var _a, _b, _c, _d, _e, _f, _g;
  const localeIndex = getLocaleForPath(siteData2, relativePath);
  return Object.assign({}, siteData2, {
    localeIndex,
    lang: ((_a = siteData2.locales[localeIndex]) == null ? void 0 : _a.lang) ?? siteData2.lang,
    dir: ((_b = siteData2.locales[localeIndex]) == null ? void 0 : _b.dir) ?? siteData2.dir,
    title: ((_c = siteData2.locales[localeIndex]) == null ? void 0 : _c.title) ?? siteData2.title,
    titleTemplate: ((_d = siteData2.locales[localeIndex]) == null ? void 0 : _d.titleTemplate) ?? siteData2.titleTemplate,
    description: ((_e = siteData2.locales[localeIndex]) == null ? void 0 : _e.description) ?? siteData2.description,
    head: mergeHead(siteData2.head, ((_f = siteData2.locales[localeIndex]) == null ? void 0 : _f.head) ?? []),
    themeConfig: {
      ...siteData2.themeConfig,
      ...(_g = siteData2.locales[localeIndex]) == null ? void 0 : _g.themeConfig
    }
  });
}
function createTitle(siteData2, pageData) {
  const title = pageData.title || siteData2.title;
  const template = pageData.titleTemplate ?? siteData2.titleTemplate;
  if (typeof template === "string" && template.includes(":title")) {
    return template.replace(/:title/g, title);
  }
  const templateString = createTitleTemplate(siteData2.title, template);
  if (title === templateString.slice(3)) {
    return title;
  }
  return `${title}${templateString}`;
}
function createTitleTemplate(siteTitle, template) {
  if (template === false) {
    return "";
  }
  if (template === true || template === void 0) {
    return ` | ${siteTitle}`;
  }
  if (siteTitle === template) {
    return "";
  }
  return ` | ${template}`;
}
function hasTag(head, tag) {
  const [tagType, tagAttrs] = tag;
  if (tagType !== "meta")
    return false;
  const keyAttr = Object.entries(tagAttrs)[0];
  if (keyAttr == null)
    return false;
  return head.some(([type, attrs]) => type === tagType && attrs[keyAttr[0]] === keyAttr[1]);
}
function mergeHead(prev, curr) {
  return [...prev.filter((tagAttrs) => !hasTag(curr, tagAttrs)), ...curr];
}
const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;
function sanitizeFileName(name) {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";
  return driveLetter + name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "_").replace(/(^|\/)_+(?=[^/]*$)/, "$1");
}
const KNOWN_EXTENSIONS = /* @__PURE__ */ new Set();
function treatAsHtml(filename) {
  var _a;
  if (KNOWN_EXTENSIONS.size === 0) {
    const extraExts = typeof process === "object" && ((_a = process.env) == null ? void 0 : _a.VITE_EXTRA_EXTENSIONS) || (__vite_import_meta_env__ == null ? void 0 : __vite_import_meta_env__.VITE_EXTRA_EXTENSIONS) || "";
    ("3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" + (extraExts && typeof extraExts === "string" ? "," + extraExts : "")).split(",").forEach((ext2) => KNOWN_EXTENSIONS.add(ext2));
  }
  const ext = filename.split(".").pop();
  return ext == null || !KNOWN_EXTENSIONS.has(ext.toLowerCase());
}
function escapeRegExp(str) {
  return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}
const dataSymbol = Symbol();
const siteDataRef = shallowRef(siteData);
function initData(route) {
  const site2 = computed(() => resolveSiteDataByRoute(siteDataRef.value, route.data.relativePath));
  const appearance = site2.value.appearance;
  const isDark = appearance === "force-dark" ? ref(true) : appearance === "force-auto" ? usePreferredDark() : appearance ? useDark({
    storageKey: APPEARANCE_KEY,
    initialValue: () => appearance === "dark" ? "dark" : "auto",
    ...typeof appearance === "object" ? appearance : {}
  }) : ref(false);
  const hashRef = ref(inBrowser ? location.hash : "");
  if (inBrowser) {
    window.addEventListener("hashchange", () => {
      hashRef.value = location.hash;
    });
  }
  watch(() => route.data, () => {
    hashRef.value = inBrowser ? location.hash : "";
  });
  return {
    site: site2,
    theme: computed(() => site2.value.themeConfig),
    page: computed(() => route.data),
    frontmatter: computed(() => route.data.frontmatter),
    params: computed(() => route.data.params),
    lang: computed(() => site2.value.lang),
    dir: computed(() => route.data.frontmatter.dir || site2.value.dir),
    localeIndex: computed(() => site2.value.localeIndex || "root"),
    title: computed(() => createTitle(site2.value, route.data)),
    description: computed(() => route.data.description || site2.value.description),
    isDark,
    hash: computed(() => hashRef.value)
  };
}
function useData$1() {
  const data = inject(dataSymbol);
  if (!data) {
    throw new Error("vitepress data not properly injected in app");
  }
  return data;
}
function joinPath(base, path) {
  return `${base}${path}`.replace(/\/+/g, "/");
}
function withBase(path) {
  return EXTERNAL_URL_RE.test(path) || !path.startsWith("/") ? path : joinPath(siteDataRef.value.base, path);
}
function pathToFile(path) {
  let pagePath = path.replace(/\.html$/, "");
  pagePath = decodeURIComponent(pagePath);
  pagePath = pagePath.replace(/\/$/, "/index");
  {
    if (inBrowser) {
      const base = "/";
      pagePath = sanitizeFileName(pagePath.slice(base.length).replace(/\//g, "_") || "index") + ".md";
      let pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      if (!pageHash) {
        pagePath = pagePath.endsWith("_index.md") ? pagePath.slice(0, -9) + ".md" : pagePath.slice(0, -3) + "_index.md";
        pageHash = __VP_HASH_MAP__[pagePath.toLowerCase()];
      }
      if (!pageHash)
        return null;
      pagePath = `${base}${"assets"}/${pagePath}.${pageHash}.js`;
    } else {
      pagePath = `./${sanitizeFileName(pagePath.slice(1).replace(/\//g, "_"))}.md.js`;
    }
  }
  return pagePath;
}
let contentUpdatedCallbacks = [];
function onContentUpdated(fn) {
  contentUpdatedCallbacks.push(fn);
  onUnmounted(() => {
    contentUpdatedCallbacks = contentUpdatedCallbacks.filter((f) => f !== fn);
  });
}
function getScrollOffset() {
  let scrollOffset = siteDataRef.value.scrollOffset;
  let offset = 0;
  let padding = 24;
  if (typeof scrollOffset === "object" && "padding" in scrollOffset) {
    padding = scrollOffset.padding;
    scrollOffset = scrollOffset.selector;
  }
  if (typeof scrollOffset === "number") {
    offset = scrollOffset;
  } else if (typeof scrollOffset === "string") {
    offset = tryOffsetSelector(scrollOffset, padding);
  } else if (Array.isArray(scrollOffset)) {
    for (const selector of scrollOffset) {
      const res = tryOffsetSelector(selector, padding);
      if (res) {
        offset = res;
        break;
      }
    }
  }
  return offset;
}
function tryOffsetSelector(selector, padding) {
  const el = document.querySelector(selector);
  if (!el)
    return 0;
  const bot = el.getBoundingClientRect().bottom;
  if (bot < 0)
    return 0;
  return bot + padding;
}
const RouterSymbol = Symbol();
const fakeHost = "http://a.com";
const getDefaultRoute = () => ({
  path: "/",
  component: null,
  data: notFoundPageData
});
function createRouter(loadPageModule, fallbackComponent) {
  const route = reactive(getDefaultRoute());
  const router = {
    route,
    go
  };
  async function go(href = inBrowser ? location.href : "/") {
    var _a, _b;
    href = normalizeHref(href);
    if (await ((_a = router.onBeforeRouteChange) == null ? void 0 : _a.call(router, href)) === false)
      return;
    if (inBrowser && href !== normalizeHref(location.href)) {
      history.replaceState({ scrollPosition: window.scrollY }, "");
      history.pushState({}, "", href);
    }
    await loadPage(href);
    await ((_b = router.onAfterRouteChange ?? router.onAfterRouteChanged) == null ? void 0 : _b(href));
  }
  let latestPendingPath = null;
  async function loadPage(href, scrollPosition = 0, isRetry = false) {
    var _a, _b;
    if (await ((_a = router.onBeforePageLoad) == null ? void 0 : _a.call(router, href)) === false)
      return;
    const targetLoc = new URL(href, fakeHost);
    const pendingPath = latestPendingPath = targetLoc.pathname;
    try {
      let page = await loadPageModule(pendingPath);
      if (!page) {
        throw new Error(`Page not found: ${pendingPath}`);
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        const { default: comp, __pageData } = page;
        if (!comp) {
          throw new Error(`Invalid route component: ${comp}`);
        }
        await ((_b = router.onAfterPageLoad) == null ? void 0 : _b.call(router, href));
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = markRaw(comp);
        route.data = true ? markRaw(__pageData) : readonly(__pageData);
        if (inBrowser) {
          nextTick(() => {
            let actualPathname = siteDataRef.value.base + __pageData.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
            if (!siteDataRef.value.cleanUrls && !actualPathname.endsWith("/")) {
              actualPathname += ".html";
            }
            if (actualPathname !== targetLoc.pathname) {
              targetLoc.pathname = actualPathname;
              href = actualPathname + targetLoc.search + targetLoc.hash;
              history.replaceState({}, "", href);
            }
            if (targetLoc.hash && !scrollPosition) {
              let target = null;
              try {
                target = document.getElementById(decodeURIComponent(targetLoc.hash).slice(1));
              } catch (e) {
                console.warn(e);
              }
              if (target) {
                scrollTo(target, targetLoc.hash);
                return;
              }
            }
            window.scrollTo(0, scrollPosition);
          });
        }
      }
    } catch (err) {
      if (!/fetch|Page not found/.test(err.message) && !/^\/404(\.html|\/)?$/.test(href)) {
        console.error(err);
      }
      if (!isRetry) {
        try {
          const res = await fetch(siteDataRef.value.base + "hashmap.json");
          window.__VP_HASH_MAP__ = await res.json();
          await loadPage(href, scrollPosition, true);
          return;
        } catch (e) {
        }
      }
      if (latestPendingPath === pendingPath) {
        latestPendingPath = null;
        route.path = inBrowser ? pendingPath : withBase(pendingPath);
        route.component = fallbackComponent ? markRaw(fallbackComponent) : null;
        const relativePath = inBrowser ? pendingPath.replace(/(^|\/)$/, "$1index").replace(/(\.html)?$/, ".md").replace(/^\//, "") : "404.md";
        route.data = { ...notFoundPageData, relativePath };
      }
    }
  }
  if (inBrowser) {
    if (history.state === null) {
      history.replaceState({}, "");
    }
    window.addEventListener("click", (e) => {
      if (e.defaultPrevented || !(e.target instanceof Element) || e.target.closest("button") || // temporary fix for docsearch action buttons
      e.button !== 0 || e.ctrlKey || e.shiftKey || e.altKey || e.metaKey)
        return;
      const link2 = e.target.closest("a");
      if (!link2 || link2.closest(".vp-raw") || link2.hasAttribute("download") || link2.hasAttribute("target"))
        return;
      const linkHref = link2.getAttribute("href") ?? (link2 instanceof SVGAElement ? link2.getAttribute("xlink:href") : null);
      if (linkHref == null)
        return;
      const { href, origin, pathname, hash, search } = new URL(linkHref, link2.baseURI);
      const currentUrl = new URL(location.href);
      if (origin === currentUrl.origin && treatAsHtml(pathname)) {
        e.preventDefault();
        if (pathname === currentUrl.pathname && search === currentUrl.search) {
          if (hash !== currentUrl.hash) {
            history.pushState({}, "", href);
            window.dispatchEvent(new HashChangeEvent("hashchange", {
              oldURL: currentUrl.href,
              newURL: href
            }));
          }
          if (hash) {
            scrollTo(link2, hash, link2.classList.contains("header-anchor"));
          } else {
            window.scrollTo(0, 0);
          }
        } else {
          go(href);
        }
      }
    }, { capture: true });
    window.addEventListener("popstate", async (e) => {
      var _a;
      if (e.state === null)
        return;
      const href = normalizeHref(location.href);
      await loadPage(href, e.state && e.state.scrollPosition || 0);
      await ((_a = router.onAfterRouteChange ?? router.onAfterRouteChanged) == null ? void 0 : _a(href));
    });
    window.addEventListener("hashchange", (e) => {
      e.preventDefault();
    });
  }
  return router;
}
function useRouter() {
  const router = inject(RouterSymbol);
  if (!router) {
    throw new Error("useRouter() is called without provider.");
  }
  return router;
}
function useRoute() {
  return useRouter().route;
}
function scrollTo(el, hash, smooth = false) {
  let target = null;
  try {
    target = el.classList.contains("header-anchor") ? el : document.getElementById(decodeURIComponent(hash).slice(1));
  } catch (e) {
    console.warn(e);
  }
  if (target) {
    let scrollToTarget = function() {
      if (!smooth || Math.abs(targetTop - window.scrollY) > window.innerHeight)
        window.scrollTo(0, targetTop);
      else
        window.scrollTo({ left: 0, top: targetTop, behavior: "smooth" });
    };
    const targetPadding = parseInt(window.getComputedStyle(target).paddingTop, 10);
    const targetTop = window.scrollY + target.getBoundingClientRect().top - getScrollOffset() + targetPadding;
    requestAnimationFrame(scrollToTarget);
  }
}
function normalizeHref(href) {
  const url = new URL(href, fakeHost);
  url.pathname = url.pathname.replace(/(^|\/)index(\.html)?$/, "$1");
  if (siteDataRef.value.cleanUrls)
    url.pathname = url.pathname.replace(/\.html$/, "");
  else if (!url.pathname.endsWith("/") && !url.pathname.endsWith(".html"))
    url.pathname += ".html";
  return url.pathname + url.search + url.hash;
}
const runCbs = () => contentUpdatedCallbacks.forEach((fn) => fn());
const Content = defineComponent({
  name: "VitePressContent",
  props: {
    as: { type: [Object, String], default: "div" }
  },
  setup(props) {
    const route = useRoute();
    const { frontmatter, site: site2 } = useData$1();
    watch(frontmatter, runCbs, { deep: true, flush: "post" });
    return () => h(props.as, site2.value.contentProps ?? { style: { position: "relative" } }, [
      route.component ? h(route.component, {
        onVnodeMounted: runCbs,
        onVnodeUpdated: runCbs,
        onVnodeUnmounted: runCbs
      }) : "404 Page Not Found"
    ]);
  }
});
const _sfc_main$1k = /* @__PURE__ */ defineComponent({
  __name: "VPBackdrop",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPBackdrop" }, _attrs))} data-v-c79a1216></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1k = _sfc_main$1k.setup;
_sfc_main$1k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue");
  return _sfc_setup$1k ? _sfc_setup$1k(props, ctx) : void 0;
};
const VPBackdrop = /* @__PURE__ */ _export_sfc(_sfc_main$1k, [["__scopeId", "data-v-c79a1216"]]);
const useData = useData$1;
function throttleAndDebounce(fn, delay) {
  let timeoutId;
  let called = false;
  return () => {
    if (timeoutId)
      clearTimeout(timeoutId);
    if (!called) {
      fn();
      (called = true) && setTimeout(() => called = false, delay);
    } else
      timeoutId = setTimeout(fn, delay);
  };
}
function ensureStartingSlash(path) {
  return path.startsWith("/") ? path : `/${path}`;
}
function normalizeLink$1(url) {
  const { pathname, search, hash, protocol } = new URL(url, "http://a.com");
  if (isExternal(url) || url.startsWith("#") || !protocol.startsWith("http") || !treatAsHtml(pathname))
    return url;
  const { site: site2 } = useData();
  const normalizedPath = pathname.endsWith("/") || pathname.endsWith(".html") ? url : url.replace(/(?:(^\.+)\/)?.*$/, `$1${pathname.replace(/(\.md)?$/, site2.value.cleanUrls ? "" : ".html")}${search}${hash}`);
  return withBase(normalizedPath);
}
function useLangs({ correspondingLink = false } = {}) {
  const { site: site2, localeIndex, page, theme: theme2, hash } = useData();
  const currentLang = computed(() => {
    var _a, _b;
    return {
      label: (_a = site2.value.locales[localeIndex.value]) == null ? void 0 : _a.label,
      link: ((_b = site2.value.locales[localeIndex.value]) == null ? void 0 : _b.link) || (localeIndex.value === "root" ? "/" : `/${localeIndex.value}/`)
    };
  });
  const localeLinks = computed(() => Object.entries(site2.value.locales).flatMap(([key, value]) => currentLang.value.label === value.label ? [] : {
    text: value.label,
    link: normalizeLink(value.link || (key === "root" ? "/" : `/${key}/`), theme2.value.i18nRouting !== false && correspondingLink, page.value.relativePath.slice(currentLang.value.link.length - 1), !site2.value.cleanUrls) + hash.value
  }));
  return { localeLinks, currentLang };
}
function normalizeLink(link2, addPath, path, addExt) {
  return addPath ? link2.replace(/\/$/, "") + ensureStartingSlash(path.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, addExt ? ".html" : "")) : link2;
}
const _sfc_main$1j = /* @__PURE__ */ defineComponent({
  __name: "NotFound",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const { currentLang } = useLangs();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "NotFound" }, _attrs))} data-v-d6be1790><p class="code" data-v-d6be1790>${ssrInterpolate(((_a = unref(theme2).notFound) == null ? void 0 : _a.code) ?? "404")}</p><h1 class="title" data-v-d6be1790>${ssrInterpolate(((_b = unref(theme2).notFound) == null ? void 0 : _b.title) ?? "PAGE NOT FOUND")}</h1><div class="divider" data-v-d6be1790></div><blockquote class="quote" data-v-d6be1790>${ssrInterpolate(((_c = unref(theme2).notFound) == null ? void 0 : _c.quote) ?? "But if you don't change your direction, and if you keep looking, you may end up where you are heading.")}</blockquote><div class="action" data-v-d6be1790><a class="link"${ssrRenderAttr("href", unref(withBase)(unref(currentLang).link))}${ssrRenderAttr("aria-label", ((_d = unref(theme2).notFound) == null ? void 0 : _d.linkLabel) ?? "go to home")} data-v-d6be1790>${ssrInterpolate(((_e = unref(theme2).notFound) == null ? void 0 : _e.linkText) ?? "Take me home")}</a></div></div>`);
    };
  }
});
const _sfc_setup$1j = _sfc_main$1j.setup;
_sfc_main$1j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/NotFound.vue");
  return _sfc_setup$1j ? _sfc_setup$1j(props, ctx) : void 0;
};
const NotFound = /* @__PURE__ */ _export_sfc(_sfc_main$1j, [["__scopeId", "data-v-d6be1790"]]);
function getSidebar(_sidebar, path) {
  if (Array.isArray(_sidebar))
    return addBase(_sidebar);
  if (_sidebar == null)
    return [];
  path = ensureStartingSlash(path);
  const dir = Object.keys(_sidebar).sort((a, b) => {
    return b.split("/").length - a.split("/").length;
  }).find((dir2) => {
    return path.startsWith(ensureStartingSlash(dir2));
  });
  const sidebar = dir ? _sidebar[dir] : [];
  return Array.isArray(sidebar) ? addBase(sidebar) : addBase(sidebar.items, sidebar.base);
}
function getSidebarGroups(sidebar) {
  const groups = [];
  let lastGroupIndex = 0;
  for (const index in sidebar) {
    const item = sidebar[index];
    if (item.items) {
      lastGroupIndex = groups.push(item);
      continue;
    }
    if (!groups[lastGroupIndex]) {
      groups.push({ items: [] });
    }
    groups[lastGroupIndex].items.push(item);
  }
  return groups;
}
function getFlatSideBarLinks(sidebar) {
  const links = [];
  function recursivelyExtractLinks(items) {
    for (const item of items) {
      if (item.text && item.link) {
        links.push({
          text: item.text,
          link: item.link,
          docFooterText: item.docFooterText
        });
      }
      if (item.items) {
        recursivelyExtractLinks(item.items);
      }
    }
  }
  recursivelyExtractLinks(sidebar);
  return links;
}
function hasActiveLink(path, items) {
  if (Array.isArray(items)) {
    return items.some((item) => hasActiveLink(path, item));
  }
  return isActive(path, items.link) ? true : items.items ? hasActiveLink(path, items.items) : false;
}
function addBase(items, _base) {
  return [...items].map((_item) => {
    const item = { ..._item };
    const base = item.base || _base;
    if (base && item.link)
      item.link = base + item.link;
    if (item.items)
      item.items = addBase(item.items, base);
    return item;
  });
}
function useSidebar() {
  const { frontmatter, page, theme: theme2 } = useData();
  const is960 = useMediaQuery("(min-width: 960px)");
  const isOpen = ref(false);
  const _sidebar = computed(() => {
    const sidebarConfig = theme2.value.sidebar;
    const relativePath = page.value.relativePath;
    return sidebarConfig ? getSidebar(sidebarConfig, relativePath) : [];
  });
  const sidebar = ref(_sidebar.value);
  watch(_sidebar, (next, prev) => {
    if (JSON.stringify(next) !== JSON.stringify(prev))
      sidebar.value = _sidebar.value;
  });
  const hasSidebar = computed(() => {
    return frontmatter.value.sidebar !== false && sidebar.value.length > 0 && frontmatter.value.layout !== "home";
  });
  const leftAside = computed(() => {
    if (hasAside)
      return frontmatter.value.aside == null ? theme2.value.aside === "left" : frontmatter.value.aside === "left";
    return false;
  });
  const hasAside = computed(() => {
    if (frontmatter.value.layout === "home")
      return false;
    if (frontmatter.value.aside != null)
      return !!frontmatter.value.aside;
    return theme2.value.aside !== false;
  });
  const isSidebarEnabled = computed(() => hasSidebar.value && is960.value);
  const sidebarGroups = computed(() => {
    return hasSidebar.value ? getSidebarGroups(sidebar.value) : [];
  });
  function open() {
    isOpen.value = true;
  }
  function close() {
    isOpen.value = false;
  }
  function toggle() {
    isOpen.value ? close() : open();
  }
  return {
    isOpen,
    sidebar,
    sidebarGroups,
    hasSidebar,
    hasAside,
    leftAside,
    isSidebarEnabled,
    open,
    close,
    toggle
  };
}
function useCloseSidebarOnEscape(isOpen, close) {
  let triggerElement;
  watchEffect(() => {
    triggerElement = isOpen.value ? document.activeElement : void 0;
  });
  onMounted(() => {
    window.addEventListener("keyup", onEscape);
  });
  onUnmounted(() => {
    window.removeEventListener("keyup", onEscape);
  });
  function onEscape(e) {
    if (e.key === "Escape" && isOpen.value) {
      close();
      triggerElement == null ? void 0 : triggerElement.focus();
    }
  }
}
function useSidebarControl(item) {
  const { page, hash } = useData();
  const collapsed = ref(false);
  const collapsible = computed(() => {
    return item.value.collapsed != null;
  });
  const isLink = computed(() => {
    return !!item.value.link;
  });
  const isActiveLink = ref(false);
  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(page.value.relativePath, item.value.link);
  };
  watch([page, item, hash], updateIsActiveLink);
  onMounted(updateIsActiveLink);
  const hasActiveLink$1 = computed(() => {
    if (isActiveLink.value) {
      return true;
    }
    return item.value.items ? hasActiveLink(page.value.relativePath, item.value.items) : false;
  });
  const hasChildren = computed(() => {
    return !!(item.value.items && item.value.items.length);
  });
  watchEffect(() => {
    collapsed.value = !!(collapsible.value && item.value.collapsed);
  });
  watchPostEffect(() => {
    (isActiveLink.value || hasActiveLink$1.value) && (collapsed.value = false);
  });
  function toggle() {
    if (collapsible.value) {
      collapsed.value = !collapsed.value;
    }
  }
  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink: hasActiveLink$1,
    hasChildren,
    toggle
  };
}
function useAside() {
  const { hasSidebar } = useSidebar();
  const is960 = useMediaQuery("(min-width: 960px)");
  const is1280 = useMediaQuery("(min-width: 1280px)");
  const isAsideEnabled = computed(() => {
    if (!is1280.value && !is960.value) {
      return false;
    }
    return hasSidebar.value ? is1280.value : is960.value;
  });
  return {
    isAsideEnabled
  };
}
const ignoreRE = /\b(?:VPBadge|header-anchor|footnote-ref|ignore-header)\b/;
const resolvedHeaders = [];
function resolveTitle(theme2) {
  return typeof theme2.outline === "object" && !Array.isArray(theme2.outline) && theme2.outline.label || theme2.outlineTitle || "On this page";
}
function getHeaders(range) {
  const headers = [
    ...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")
  ].filter((el) => el.id && el.hasChildNodes()).map((el) => {
    const level = Number(el.tagName[1]);
    return {
      element: el,
      title: serializeHeader(el),
      link: "#" + el.id,
      level
    };
  });
  return resolveHeaders(headers, range);
}
function serializeHeader(h2) {
  let ret = "";
  for (const node of h2.childNodes) {
    if (node.nodeType === 1) {
      if (ignoreRE.test(node.className))
        continue;
      ret += node.textContent;
    } else if (node.nodeType === 3) {
      ret += node.textContent;
    }
  }
  return ret.trim();
}
function resolveHeaders(headers, range) {
  if (range === false) {
    return [];
  }
  const levelsRange = (typeof range === "object" && !Array.isArray(range) ? range.level : range) || 2;
  const [high, low] = typeof levelsRange === "number" ? [levelsRange, levelsRange] : levelsRange === "deep" ? [2, 6] : levelsRange;
  return buildTree(headers, high, low);
}
function useActiveAnchor(container, marker) {
  const { isAsideEnabled } = useAside();
  const onScroll = throttleAndDebounce(setActiveLink, 100);
  let prevActiveLink = null;
  onMounted(() => {
    requestAnimationFrame(setActiveLink);
    window.addEventListener("scroll", onScroll);
  });
  onUpdated(() => {
    activateLink(location.hash);
  });
  onUnmounted(() => {
    window.removeEventListener("scroll", onScroll);
  });
  function setActiveLink() {
    if (!isAsideEnabled.value) {
      return;
    }
    const scrollY = window.scrollY;
    const innerHeight = window.innerHeight;
    const offsetHeight = document.body.offsetHeight;
    const isBottom = Math.abs(scrollY + innerHeight - offsetHeight) < 1;
    const headers = resolvedHeaders.map(({ element, link: link2 }) => ({
      link: link2,
      top: getAbsoluteTop(element)
    })).filter(({ top }) => !Number.isNaN(top)).sort((a, b) => a.top - b.top);
    if (!headers.length) {
      activateLink(null);
      return;
    }
    if (scrollY < 1) {
      activateLink(null);
      return;
    }
    if (isBottom) {
      activateLink(headers[headers.length - 1].link);
      return;
    }
    let activeLink = null;
    for (const { link: link2, top } of headers) {
      if (top > scrollY + getScrollOffset() + 4) {
        break;
      }
      activeLink = link2;
    }
    activateLink(activeLink);
  }
  function activateLink(hash) {
    if (prevActiveLink) {
      prevActiveLink.classList.remove("active");
    }
    if (hash == null) {
      prevActiveLink = null;
    } else {
      prevActiveLink = container.value.querySelector(`a[href="${decodeURIComponent(hash)}"]`);
    }
    const activeLink = prevActiveLink;
    if (activeLink) {
      activeLink.classList.add("active");
      marker.value.style.top = activeLink.offsetTop + 39 + "px";
      marker.value.style.opacity = "1";
    } else {
      marker.value.style.top = "33px";
      marker.value.style.opacity = "0";
    }
  }
}
function getAbsoluteTop(element) {
  let offsetTop = 0;
  while (element !== document.body) {
    if (element === null) {
      return NaN;
    }
    offsetTop += element.offsetTop;
    element = element.offsetParent;
  }
  return offsetTop;
}
function buildTree(data, min, max) {
  resolvedHeaders.length = 0;
  const result = [];
  const stack = [];
  data.forEach((item) => {
    const node = { ...item, children: [] };
    let parent = stack[stack.length - 1];
    while (parent && parent.level >= node.level) {
      stack.pop();
      parent = stack[stack.length - 1];
    }
    if (node.element.classList.contains("ignore-header") || parent && "shouldIgnore" in parent) {
      stack.push({ level: node.level, shouldIgnore: true });
      return;
    }
    if (node.level > max || node.level < min)
      return;
    resolvedHeaders.push({ element: node.element, link: node.link });
    if (parent)
      parent.children.push(node);
    else
      result.push(node);
    stack.push(node);
  });
  return result;
}
const _sfc_main$1i = /* @__PURE__ */ defineComponent({
  __name: "VPDocOutlineItem",
  __ssrInlineRender: true,
  props: {
    headers: {},
    root: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VPDocOutlineItem = resolveComponent("VPDocOutlineItem", true);
      _push(`<ul${ssrRenderAttrs(mergeProps({
        class: ["VPDocOutlineItem", __props.root ? "root" : "nested"]
      }, _attrs))} data-v-b933a997><!--[-->`);
      ssrRenderList(__props.headers, ({ children, link: link2, title }) => {
        _push(`<li data-v-b933a997><a class="outline-link"${ssrRenderAttr("href", link2)}${ssrRenderAttr("title", title)} data-v-b933a997>${ssrInterpolate(title)}</a>`);
        if (children == null ? void 0 : children.length) {
          _push(ssrRenderComponent(_component_VPDocOutlineItem, { headers: children }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup$1i = _sfc_main$1i.setup;
_sfc_main$1i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue");
  return _sfc_setup$1i ? _sfc_setup$1i(props, ctx) : void 0;
};
const VPDocOutlineItem = /* @__PURE__ */ _export_sfc(_sfc_main$1i, [["__scopeId", "data-v-b933a997"]]);
const _sfc_main$1h = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideOutline",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter, theme: theme2 } = useData();
    const headers = shallowRef([]);
    onContentUpdated(() => {
      headers.value = getHeaders(frontmatter.value.outline ?? theme2.value.outline);
    });
    const container = ref();
    const marker = ref();
    useActiveAnchor(container, marker);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        "aria-labelledby": "doc-outline-aria-label",
        class: ["VPDocAsideOutline", { "has-outline": headers.value.length > 0 }],
        ref_key: "container",
        ref: container
      }, _attrs))} data-v-a5bbad30><div class="content" data-v-a5bbad30><div class="outline-marker" data-v-a5bbad30></div><div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading" data-v-a5bbad30>${ssrInterpolate(unref(resolveTitle)(unref(theme2)))}</div>`);
      _push(ssrRenderComponent(VPDocOutlineItem, {
        headers: headers.value,
        root: true
      }, null, _parent));
      _push(`</div></nav>`);
    };
  }
});
const _sfc_setup$1h = _sfc_main$1h.setup;
_sfc_main$1h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue");
  return _sfc_setup$1h ? _sfc_setup$1h(props, ctx) : void 0;
};
const VPDocAsideOutline = /* @__PURE__ */ _export_sfc(_sfc_main$1h, [["__scopeId", "data-v-a5bbad30"]]);
const _sfc_main$1g = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideCarbonAds",
  __ssrInlineRender: true,
  props: {
    carbonAds: {}
  },
  setup(__props) {
    const VPCarbonAds = () => null;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideCarbonAds" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(VPCarbonAds), { "carbon-ads": __props.carbonAds }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1g = _sfc_main$1g.setup;
_sfc_main$1g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue");
  return _sfc_setup$1g ? _sfc_setup$1g(props, ctx) : void 0;
};
const _sfc_main$1f = /* @__PURE__ */ defineComponent({
  __name: "VPDocAside",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAside" }, _attrs))} data-v-3f215769>`);
      ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(VPDocAsideOutline, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent);
      _push(`<div class="spacer" data-v-3f215769></div>`);
      ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent);
      if (unref(theme2).carbonAds) {
        _push(ssrRenderComponent(_sfc_main$1g, {
          "carbon-ads": unref(theme2).carbonAds
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1f = _sfc_main$1f.setup;
_sfc_main$1f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue");
  return _sfc_setup$1f ? _sfc_setup$1f(props, ctx) : void 0;
};
const VPDocAside = /* @__PURE__ */ _export_sfc(_sfc_main$1f, [["__scopeId", "data-v-3f215769"]]);
function useEditLink() {
  const { theme: theme2, page } = useData();
  return computed(() => {
    const { text = "Edit this page", pattern = "" } = theme2.value.editLink || {};
    let url;
    if (typeof pattern === "function") {
      url = pattern(page.value);
    } else {
      url = pattern.replace(/:path/g, page.value.filePath);
    }
    return { url, text };
  });
}
function usePrevNext() {
  const { page, theme: theme2, frontmatter } = useData();
  return computed(() => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const sidebar = getSidebar(theme2.value.sidebar, page.value.relativePath);
    const links = getFlatSideBarLinks(sidebar);
    const candidates = uniqBy(links, (link2) => link2.link.replace(/[?#].*$/, ""));
    const index = candidates.findIndex((link2) => {
      return isActive(page.value.relativePath, link2.link);
    });
    const hidePrev = ((_a = theme2.value.docFooter) == null ? void 0 : _a.prev) === false && !frontmatter.value.prev || frontmatter.value.prev === false;
    const hideNext = ((_b = theme2.value.docFooter) == null ? void 0 : _b.next) === false && !frontmatter.value.next || frontmatter.value.next === false;
    return {
      prev: hidePrev ? void 0 : {
        text: (typeof frontmatter.value.prev === "string" ? frontmatter.value.prev : typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.text : void 0) ?? ((_c = candidates[index - 1]) == null ? void 0 : _c.docFooterText) ?? ((_d = candidates[index - 1]) == null ? void 0 : _d.text),
        link: (typeof frontmatter.value.prev === "object" ? frontmatter.value.prev.link : void 0) ?? ((_e = candidates[index - 1]) == null ? void 0 : _e.link)
      },
      next: hideNext ? void 0 : {
        text: (typeof frontmatter.value.next === "string" ? frontmatter.value.next : typeof frontmatter.value.next === "object" ? frontmatter.value.next.text : void 0) ?? ((_f = candidates[index + 1]) == null ? void 0 : _f.docFooterText) ?? ((_g = candidates[index + 1]) == null ? void 0 : _g.text),
        link: (typeof frontmatter.value.next === "object" ? frontmatter.value.next.link : void 0) ?? ((_h = candidates[index + 1]) == null ? void 0 : _h.link)
      }
    };
  });
}
function uniqBy(array, keyFn) {
  const seen = /* @__PURE__ */ new Set();
  return array.filter((item) => {
    const k = keyFn(item);
    return seen.has(k) ? false : seen.add(k);
  });
}
const _sfc_main$1e = /* @__PURE__ */ defineComponent({
  __name: "VPLink",
  __ssrInlineRender: true,
  props: {
    tag: {},
    href: {},
    noIcon: { type: Boolean },
    target: {},
    rel: {}
  },
  setup(__props) {
    const props = __props;
    const tag = computed(() => props.tag ?? (props.href ? "a" : "span"));
    const isExternal2 = computed(
      () => props.href && EXTERNAL_URL_RE.test(props.href) || props.target === "_blank"
    );
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(tag.value), mergeProps({
        class: ["VPLink", {
          link: __props.href,
          "vp-external-link-icon": isExternal2.value,
          "no-icon": __props.noIcon
        }],
        href: __props.href ? unref(normalizeLink$1)(__props.href) : void 0,
        target: __props.target ?? (isExternal2.value ? "_blank" : void 0),
        rel: __props.rel ?? (isExternal2.value ? "noreferrer" : void 0)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$1e = _sfc_main$1e.setup;
_sfc_main$1e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPLink.vue");
  return _sfc_setup$1e ? _sfc_setup$1e(props, ctx) : void 0;
};
const _sfc_main$1d = /* @__PURE__ */ defineComponent({
  __name: "VPDocFooterLastUpdated",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, page, lang } = useData();
    const date = computed(
      () => new Date(page.value.lastUpdated)
    );
    const isoDatetime = computed(() => date.value.toISOString());
    const datetime = ref("");
    onMounted(() => {
      watchEffect(() => {
        var _a, _b, _c;
        datetime.value = new Intl.DateTimeFormat(
          ((_b = (_a = theme2.value.lastUpdated) == null ? void 0 : _a.formatOptions) == null ? void 0 : _b.forceLocale) ? lang.value : void 0,
          ((_c = theme2.value.lastUpdated) == null ? void 0 : _c.formatOptions) ?? {
            dateStyle: "short",
            timeStyle: "short"
          }
        ).format(date.value);
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<p${ssrRenderAttrs(mergeProps({ class: "VPLastUpdated" }, _attrs))} data-v-e98dd255>${ssrInterpolate(((_a = unref(theme2).lastUpdated) == null ? void 0 : _a.text) || unref(theme2).lastUpdatedText || "Last updated")}: <time${ssrRenderAttr("datetime", isoDatetime.value)} data-v-e98dd255>${ssrInterpolate(datetime.value)}</time></p>`);
    };
  }
});
const _sfc_setup$1d = _sfc_main$1d.setup;
_sfc_main$1d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue");
  return _sfc_setup$1d ? _sfc_setup$1d(props, ctx) : void 0;
};
const VPDocFooterLastUpdated = /* @__PURE__ */ _export_sfc(_sfc_main$1d, [["__scopeId", "data-v-e98dd255"]]);
const _sfc_main$1c = /* @__PURE__ */ defineComponent({
  __name: "VPDocFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, page, frontmatter } = useData();
    const editLink = useEditLink();
    const control = usePrevNext();
    const hasEditLink = computed(
      () => theme2.value.editLink && frontmatter.value.editLink !== false
    );
    const hasLastUpdated = computed(() => page.value.lastUpdated);
    const showFooter = computed(
      () => hasEditLink.value || hasLastUpdated.value || control.value.prev || control.value.next
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      if (showFooter.value) {
        _push(`<footer${ssrRenderAttrs(mergeProps({ class: "VPDocFooter" }, _attrs))} data-v-e257564d>`);
        ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent);
        if (hasEditLink.value || hasLastUpdated.value) {
          _push(`<div class="edit-info" data-v-e257564d>`);
          if (hasEditLink.value) {
            _push(`<div class="edit-link" data-v-e257564d>`);
            _push(ssrRenderComponent(_sfc_main$1e, {
              class: "edit-link-button",
              href: unref(editLink).url,
              "no-icon": true
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="vpi-square-pen edit-link-icon" data-v-e257564d${_scopeId}></span> ${ssrInterpolate(unref(editLink).text)}`);
                } else {
                  return [
                    createVNode("span", { class: "vpi-square-pen edit-link-icon" }),
                    createTextVNode(" " + toDisplayString(unref(editLink).text), 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          if (hasLastUpdated.value) {
            _push(`<div class="last-updated" data-v-e257564d>`);
            _push(ssrRenderComponent(VPDocFooterLastUpdated, null, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (((_a = unref(control).prev) == null ? void 0 : _a.link) || ((_b = unref(control).next) == null ? void 0 : _b.link)) {
          _push(`<nav class="prev-next" aria-labelledby="doc-footer-aria-label" data-v-e257564d><span class="visually-hidden" id="doc-footer-aria-label" data-v-e257564d>Pager</span><div class="pager" data-v-e257564d>`);
          if ((_c = unref(control).prev) == null ? void 0 : _c.link) {
            _push(ssrRenderComponent(_sfc_main$1e, {
              class: "pager-link prev",
              href: unref(control).prev.link
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<span class="desc" data-v-e257564d${_scopeId}>${(((_a2 = unref(theme2).docFooter) == null ? void 0 : _a2.prev) || "Previous page") ?? ""}</span><span class="title" data-v-e257564d${_scopeId}>${unref(control).prev.text ?? ""}</span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "desc",
                      innerHTML: ((_b2 = unref(theme2).docFooter) == null ? void 0 : _b2.prev) || "Previous page"
                    }, null, 8, ["innerHTML"]),
                    createVNode("span", {
                      class: "title",
                      innerHTML: unref(control).prev.text
                    }, null, 8, ["innerHTML"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="pager" data-v-e257564d>`);
          if ((_d = unref(control).next) == null ? void 0 : _d.link) {
            _push(ssrRenderComponent(_sfc_main$1e, {
              class: "pager-link next",
              href: unref(control).next.link
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<span class="desc" data-v-e257564d${_scopeId}>${(((_a2 = unref(theme2).docFooter) == null ? void 0 : _a2.next) || "Next page") ?? ""}</span><span class="title" data-v-e257564d${_scopeId}>${unref(control).next.text ?? ""}</span>`);
                } else {
                  return [
                    createVNode("span", {
                      class: "desc",
                      innerHTML: ((_b2 = unref(theme2).docFooter) == null ? void 0 : _b2.next) || "Next page"
                    }, null, 8, ["innerHTML"]),
                    createVNode("span", {
                      class: "title",
                      innerHTML: unref(control).next.text
                    }, null, 8, ["innerHTML"])
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</div></nav>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</footer>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1c = _sfc_main$1c.setup;
_sfc_main$1c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue");
  return _sfc_setup$1c ? _sfc_setup$1c(props, ctx) : void 0;
};
const VPDocFooter = /* @__PURE__ */ _export_sfc(_sfc_main$1c, [["__scopeId", "data-v-e257564d"]]);
const _sfc_main$1b = /* @__PURE__ */ defineComponent({
  __name: "VPDoc",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const route = useRoute();
    const { hasSidebar, hasAside, leftAside } = useSidebar();
    const pageName = computed(
      () => route.path.replace(/[./]+/g, "_").replace(/_html$/, "")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Content = resolveComponent("Content");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPDoc", { "has-sidebar": unref(hasSidebar), "has-aside": unref(hasAside) }]
      }, _attrs))} data-v-39a288b8>`);
      ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent);
      _push(`<div class="container" data-v-39a288b8>`);
      if (unref(hasAside)) {
        _push(`<div class="${ssrRenderClass([{ "left-aside": unref(leftAside) }, "aside"])}" data-v-39a288b8><div class="aside-curtain" data-v-39a288b8></div><div class="aside-container" data-v-39a288b8><div class="aside-content" data-v-39a288b8>`);
        _push(ssrRenderComponent(VPDocAside, null, {
          "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)
              ];
            }
          }),
          "aside-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="content" data-v-39a288b8><div class="content-container" data-v-39a288b8>`);
      ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent);
      _push(`<main class="main" data-v-39a288b8>`);
      _push(ssrRenderComponent(_component_Content, {
        class: ["vp-doc", [
          pageName.value,
          unref(theme2).externalLinkIcon && "external-link-icon-enabled"
        ]]
      }, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(VPDocFooter, null, {
        "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push, _parent);
      _push(`</div></div></div>`);
      ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1b = _sfc_main$1b.setup;
_sfc_main$1b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue");
  return _sfc_setup$1b ? _sfc_setup$1b(props, ctx) : void 0;
};
const VPDoc = /* @__PURE__ */ _export_sfc(_sfc_main$1b, [["__scopeId", "data-v-39a288b8"]]);
const _sfc_main$1a = /* @__PURE__ */ defineComponent({
  __name: "VPButton",
  __ssrInlineRender: true,
  props: {
    tag: {},
    size: { default: "medium" },
    theme: { default: "brand" },
    text: {},
    href: {},
    target: {},
    rel: {}
  },
  setup(__props) {
    const props = __props;
    const isExternal2 = computed(
      () => props.href && EXTERNAL_URL_RE.test(props.href)
    );
    const component = computed(() => {
      return props.tag || (props.href ? "a" : "button");
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(component.value), mergeProps({
        class: ["VPButton", [__props.size, __props.theme]],
        href: __props.href ? unref(normalizeLink$1)(__props.href) : void 0,
        target: props.target ?? (isExternal2.value ? "_blank" : void 0),
        rel: props.rel ?? (isExternal2.value ? "noreferrer" : void 0)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.text)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.text), 1)
            ];
          }
        }),
        _: 1
      }), _parent);
    };
  }
});
const _sfc_setup$1a = _sfc_main$1a.setup;
_sfc_main$1a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPButton.vue");
  return _sfc_setup$1a ? _sfc_setup$1a(props, ctx) : void 0;
};
const VPButton = /* @__PURE__ */ _export_sfc(_sfc_main$1a, [["__scopeId", "data-v-fa7799d5"]]);
const _sfc_main$19 = /* @__PURE__ */ defineComponent({
  ...{ inheritAttrs: false },
  __name: "VPImage",
  __ssrInlineRender: true,
  props: {
    image: {},
    alt: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VPImage = resolveComponent("VPImage", true);
      if (__props.image) {
        _push(`<!--[-->`);
        if (typeof __props.image === "string" || "src" in __props.image) {
          _push(`<img${ssrRenderAttrs(mergeProps({ class: "VPImage" }, typeof __props.image === "string" ? _ctx.$attrs : { ...__props.image, ..._ctx.$attrs }, {
            src: unref(withBase)(typeof __props.image === "string" ? __props.image : __props.image.src),
            alt: __props.alt ?? (typeof __props.image === "string" ? "" : __props.image.alt || "")
          }))} data-v-8426fc1a>`);
        } else {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(_component_VPImage, mergeProps({
            class: "dark",
            image: __props.image.dark,
            alt: __props.image.alt
          }, _ctx.$attrs), null, _parent));
          _push(ssrRenderComponent(_component_VPImage, mergeProps({
            class: "light",
            image: __props.image.light,
            alt: __props.image.alt
          }, _ctx.$attrs), null, _parent));
          _push(`<!--]-->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPImage.vue");
  return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
const VPImage = /* @__PURE__ */ _export_sfc(_sfc_main$19, [["__scopeId", "data-v-8426fc1a"]]);
const _sfc_main$18 = /* @__PURE__ */ defineComponent({
  __name: "VPHero",
  __ssrInlineRender: true,
  props: {
    name: {},
    text: {},
    tagline: {},
    image: {},
    actions: {}
  },
  setup(__props) {
    const heroImageSlotExists = inject("hero-image-slot-exists");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPHero", { "has-image": __props.image || unref(heroImageSlotExists) }]
      }, _attrs))} data-v-4f9c455b><div class="container" data-v-4f9c455b><div class="main" data-v-4f9c455b>`);
      ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, () => {
        _push(`<h1 class="heading" data-v-4f9c455b>`);
        if (__props.name) {
          _push(`<span class="name clip" data-v-4f9c455b>${__props.name ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.text) {
          _push(`<span class="text" data-v-4f9c455b>${__props.text ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h1>`);
        if (__props.tagline) {
          _push(`<p class="tagline" data-v-4f9c455b>${__props.tagline ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent);
      if (__props.actions) {
        _push(`<div class="actions" data-v-4f9c455b><!--[-->`);
        ssrRenderList(__props.actions, (action) => {
          _push(`<div class="action" data-v-4f9c455b>`);
          _push(ssrRenderComponent(VPButton, {
            tag: "a",
            size: "medium",
            theme: action.theme,
            text: action.text,
            href: action.link,
            target: action.target,
            rel: action.rel
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push, _parent);
      _push(`</div>`);
      if (__props.image || unref(heroImageSlotExists)) {
        _push(`<div class="image" data-v-4f9c455b><div class="image-container" data-v-4f9c455b><div class="image-bg" data-v-4f9c455b></div>`);
        ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, () => {
          if (__props.image) {
            _push(ssrRenderComponent(VPImage, {
              class: "image-src",
              image: __props.image
            }, null, _parent));
          } else {
            _push(`<!---->`);
          }
        }, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHero.vue");
  return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
const VPHero = /* @__PURE__ */ _export_sfc(_sfc_main$18, [["__scopeId", "data-v-4f9c455b"]]);
const _sfc_main$17 = /* @__PURE__ */ defineComponent({
  __name: "VPHomeHero",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter: fm } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(fm).hero) {
        _push(ssrRenderComponent(VPHero, mergeProps({
          class: "VPHomeHero",
          name: unref(fm).hero.name,
          text: unref(fm).hero.text,
          tagline: unref(fm).hero.tagline,
          image: unref(fm).hero.image,
          actions: unref(fm).hero.actions
        }, _attrs), {
          "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-before")
              ];
            }
          }),
          "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info")
              ];
            }
          }),
          "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-after")
              ];
            }
          }),
          "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-actions-after")
              ];
            }
          }),
          "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-image")
              ];
            }
          }),
          _: 3
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue");
  return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
const _sfc_main$16 = /* @__PURE__ */ defineComponent({
  __name: "VPFeature",
  __ssrInlineRender: true,
  props: {
    icon: {},
    title: {},
    details: {},
    link: {},
    linkText: {},
    rel: {},
    target: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1e, mergeProps({
        class: "VPFeature",
        href: __props.link,
        rel: __props.rel,
        target: __props.target,
        "no-icon": true,
        tag: __props.link ? "a" : "div"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<article class="box" data-v-a3976bdc${_scopeId}>`);
            if (typeof __props.icon === "object" && __props.icon.wrap) {
              _push2(`<div class="icon" data-v-a3976bdc${_scopeId}>`);
              _push2(ssrRenderComponent(VPImage, {
                image: __props.icon,
                alt: __props.icon.alt,
                height: __props.icon.height || 48,
                width: __props.icon.width || 48
              }, null, _parent2, _scopeId));
              _push2(`</div>`);
            } else if (typeof __props.icon === "object") {
              _push2(ssrRenderComponent(VPImage, {
                image: __props.icon,
                alt: __props.icon.alt,
                height: __props.icon.height || 48,
                width: __props.icon.width || 48
              }, null, _parent2, _scopeId));
            } else if (__props.icon) {
              _push2(`<div class="icon" data-v-a3976bdc${_scopeId}>${__props.icon ?? ""}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h2 class="title" data-v-a3976bdc${_scopeId}>${__props.title ?? ""}</h2>`);
            if (__props.details) {
              _push2(`<p class="details" data-v-a3976bdc${_scopeId}>${__props.details ?? ""}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.linkText) {
              _push2(`<div class="link-text" data-v-a3976bdc${_scopeId}><p class="link-text-value" data-v-a3976bdc${_scopeId}>${ssrInterpolate(__props.linkText)} <span class="vpi-arrow-right link-text-icon" data-v-a3976bdc${_scopeId}></span></p></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</article>`);
          } else {
            return [
              createVNode("article", { class: "box" }, [
                typeof __props.icon === "object" && __props.icon.wrap ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "icon"
                }, [
                  createVNode(VPImage, {
                    image: __props.icon,
                    alt: __props.icon.alt,
                    height: __props.icon.height || 48,
                    width: __props.icon.width || 48
                  }, null, 8, ["image", "alt", "height", "width"])
                ])) : typeof __props.icon === "object" ? (openBlock(), createBlock(VPImage, {
                  key: 1,
                  image: __props.icon,
                  alt: __props.icon.alt,
                  height: __props.icon.height || 48,
                  width: __props.icon.width || 48
                }, null, 8, ["image", "alt", "height", "width"])) : __props.icon ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "icon",
                  innerHTML: __props.icon
                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                createVNode("h2", {
                  class: "title",
                  innerHTML: __props.title
                }, null, 8, ["innerHTML"]),
                __props.details ? (openBlock(), createBlock("p", {
                  key: 3,
                  class: "details",
                  innerHTML: __props.details
                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                __props.linkText ? (openBlock(), createBlock("div", {
                  key: 4,
                  class: "link-text"
                }, [
                  createVNode("p", { class: "link-text-value" }, [
                    createTextVNode(toDisplayString(__props.linkText) + " ", 1),
                    createVNode("span", { class: "vpi-arrow-right link-text-icon" })
                  ])
                ])) : createCommentVNode("", true)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue");
  return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
const VPFeature = /* @__PURE__ */ _export_sfc(_sfc_main$16, [["__scopeId", "data-v-a3976bdc"]]);
const _sfc_main$15 = /* @__PURE__ */ defineComponent({
  __name: "VPFeatures",
  __ssrInlineRender: true,
  props: {
    features: {}
  },
  setup(__props) {
    const props = __props;
    const grid = computed(() => {
      const length2 = props.features.length;
      if (!length2) {
        return;
      } else if (length2 === 2) {
        return "grid-2";
      } else if (length2 === 3) {
        return "grid-3";
      } else if (length2 % 3 === 0) {
        return "grid-6";
      } else if (length2 > 3) {
        return "grid-4";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.features) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPFeatures" }, _attrs))} data-v-a6181336><div class="container" data-v-a6181336><div class="items" data-v-a6181336><!--[-->`);
        ssrRenderList(__props.features, (feature) => {
          _push(`<div class="${ssrRenderClass([[grid.value], "item"])}" data-v-a6181336>`);
          _push(ssrRenderComponent(VPFeature, {
            icon: feature.icon,
            title: feature.title,
            details: feature.details,
            link: feature.link,
            "link-text": feature.linkText,
            rel: feature.rel,
            target: feature.target
          }, null, _parent));
          _push(`</div>`);
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue");
  return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
const VPFeatures = /* @__PURE__ */ _export_sfc(_sfc_main$15, [["__scopeId", "data-v-a6181336"]]);
const _sfc_main$14 = /* @__PURE__ */ defineComponent({
  __name: "VPHomeFeatures",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter: fm } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(fm).features) {
        _push(ssrRenderComponent(VPFeatures, mergeProps({
          class: "VPHomeFeatures",
          features: unref(fm).features
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue");
  return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
const _sfc_main$13 = /* @__PURE__ */ defineComponent({
  __name: "VPHomeContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { width: vw } = useWindowSize({
      initialWidth: 0,
      includeScrollbar: false
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "vp-doc container",
        style: unref(vw) ? { "--vp-offset": `calc(50% - ${unref(vw) / 2}px)` } : {}
      }, _attrs))} data-v-8e2d4988>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue");
  return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
const VPHomeContent = /* @__PURE__ */ _export_sfc(_sfc_main$13, [["__scopeId", "data-v-8e2d4988"]]);
const _sfc_main$12 = /* @__PURE__ */ defineComponent({
  __name: "VPHome",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter, theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Content = resolveComponent("Content");
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPHome", {
          "external-link-icon-enabled": unref(theme2).externalLinkIcon
        }]
      }, _attrs))} data-v-8b561e3d>`);
      ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$17, null, {
        "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)
            ];
          }
        }),
        "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)
            ];
          }
        }),
        "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)
            ];
          }
        }),
        "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)
            ];
          }
        }),
        "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$14, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push, _parent);
      if (unref(frontmatter).markdownStyles !== false) {
        _push(ssrRenderComponent(VPHomeContent, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Content, null, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Content)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_Content, null, null, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHome.vue");
  return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
const VPHome = /* @__PURE__ */ _export_sfc(_sfc_main$12, [["__scopeId", "data-v-8b561e3d"]]);
const _sfc_main$11 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  const _component_Content = resolveComponent("Content");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPPage" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_Content, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPPage.vue");
  return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
const VPPage = /* @__PURE__ */ _export_sfc(_sfc_main$11, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$10 = /* @__PURE__ */ defineComponent({
  __name: "VPContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { page, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPContent", {
          "has-sidebar": unref(hasSidebar),
          "is-home": unref(frontmatter).layout === "home"
        }],
        id: "VPContent"
      }, _attrs))} data-v-1428d186>`);
      if (unref(page).isNotFound) {
        ssrRenderSlot(_ctx.$slots, "not-found", {}, () => {
          _push(ssrRenderComponent(NotFound, null, null, _parent));
        }, _push, _parent);
      } else if (unref(frontmatter).layout === "page") {
        _push(ssrRenderComponent(VPPage, null, {
          "page-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-top", {}, void 0, true)
              ];
            }
          }),
          "page-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      } else if (unref(frontmatter).layout === "home") {
        _push(ssrRenderComponent(VPHome, null, {
          "home-hero-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)
              ];
            }
          }),
          "home-hero-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)
              ];
            }
          }),
          "home-features-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)
              ];
            }
          }),
          "home-features-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      } else if (unref(frontmatter).layout && unref(frontmatter).layout !== "doc") {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(frontmatter).layout), null, null), _parent);
      } else {
        _push(ssrRenderComponent(VPDoc, null, {
          "doc-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)
              ];
            }
          }),
          "doc-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)
              ];
            }
          }),
          "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)
              ];
            }
          }),
          "doc-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)
              ];
            }
          }),
          "doc-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)
              ];
            }
          }),
          "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)
              ];
            }
          }),
          "aside-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPContent.vue");
  return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
const VPContent = /* @__PURE__ */ _export_sfc(_sfc_main$10, [["__scopeId", "data-v-1428d186"]]);
const _sfc_main$$ = /* @__PURE__ */ defineComponent({
  __name: "VPFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).footer && unref(frontmatter).footer !== false) {
        _push(`<footer${ssrRenderAttrs(mergeProps({
          class: ["VPFooter", { "has-sidebar": unref(hasSidebar) }]
        }, _attrs))} data-v-e315a0ad><div class="container" data-v-e315a0ad>`);
        if (unref(theme2).footer.message) {
          _push(`<p class="message" data-v-e315a0ad>${unref(theme2).footer.message ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(theme2).footer.copyright) {
          _push(`<p class="copyright" data-v-e315a0ad>${unref(theme2).footer.copyright ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></footer>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$$ = _sfc_main$$.setup;
_sfc_main$$.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue");
  return _sfc_setup$$ ? _sfc_setup$$(props, ctx) : void 0;
};
const VPFooter = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["__scopeId", "data-v-e315a0ad"]]);
function useLocalNav() {
  const { theme: theme2, frontmatter } = useData();
  const headers = shallowRef([]);
  const hasLocalNav = computed(() => {
    return headers.value.length > 0;
  });
  onContentUpdated(() => {
    headers.value = getHeaders(frontmatter.value.outline ?? theme2.value.outline);
  });
  return {
    headers,
    hasLocalNav
  };
}
const _sfc_main$_ = /* @__PURE__ */ defineComponent({
  __name: "VPLocalNavOutlineDropdown",
  __ssrInlineRender: true,
  props: {
    headers: {},
    navHeight: {}
  },
  setup(__props) {
    const { theme: theme2 } = useData();
    const open = ref(false);
    const vh = ref(0);
    const main = ref();
    ref();
    function closeOnClickOutside(e) {
      var _a;
      if (!((_a = main.value) == null ? void 0 : _a.contains(e.target))) {
        open.value = false;
      }
    }
    watch(open, (value) => {
      if (value) {
        document.addEventListener("click", closeOnClickOutside);
        return;
      }
      document.removeEventListener("click", closeOnClickOutside);
    });
    onKeyStroke("Escape", () => {
      open.value = false;
    });
    onContentUpdated(() => {
      open.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "VPLocalNavOutlineDropdown",
        style: { "--vp-vh": vh.value + "px" },
        ref_key: "main",
        ref: main
      }, _attrs))} data-v-8a42e2b4>`);
      if (__props.headers.length > 0) {
        _push(`<button class="${ssrRenderClass({ open: open.value })}" data-v-8a42e2b4><span class="menu-text" data-v-8a42e2b4>${ssrInterpolate(unref(resolveTitle)(unref(theme2)))}</span><span class="vpi-chevron-right icon" data-v-8a42e2b4></span></button>`);
      } else {
        _push(`<button data-v-8a42e2b4>${ssrInterpolate(unref(theme2).returnToTopLabel || "Return to top")}</button>`);
      }
      if (open.value) {
        _push(`<div class="items" data-v-8a42e2b4><div class="header" data-v-8a42e2b4><a class="top-link" href="#" data-v-8a42e2b4>${ssrInterpolate(unref(theme2).returnToTopLabel || "Return to top")}</a></div><div class="outline" data-v-8a42e2b4>`);
        _push(ssrRenderComponent(VPDocOutlineItem, { headers: __props.headers }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$_ = _sfc_main$_.setup;
_sfc_main$_.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue");
  return _sfc_setup$_ ? _sfc_setup$_(props, ctx) : void 0;
};
const VPLocalNavOutlineDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["__scopeId", "data-v-8a42e2b4"]]);
const _sfc_main$Z = /* @__PURE__ */ defineComponent({
  __name: "VPLocalNav",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  emits: ["open-menu"],
  setup(__props) {
    const { theme: theme2, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    const { headers } = useLocalNav();
    const { y } = useWindowScroll();
    const navHeight = ref(0);
    onMounted(() => {
      navHeight.value = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--vp-nav-height"
        )
      );
    });
    onContentUpdated(() => {
      headers.value = getHeaders(frontmatter.value.outline ?? theme2.value.outline);
    });
    const empty = computed(() => {
      return headers.value.length === 0;
    });
    const emptyAndNoSidebar = computed(() => {
      return empty.value && !hasSidebar.value;
    });
    const classes = computed(() => {
      return {
        VPLocalNav: true,
        "has-sidebar": hasSidebar.value,
        empty: empty.value,
        fixed: emptyAndNoSidebar.value
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(frontmatter).layout !== "home" && (!emptyAndNoSidebar.value || unref(y) >= navHeight.value)) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: classes.value }, _attrs))} data-v-a6f0e41e><div class="container" data-v-a6f0e41e>`);
        if (unref(hasSidebar)) {
          _push(`<button class="menu"${ssrRenderAttr("aria-expanded", __props.open)} aria-controls="VPSidebarNav" data-v-a6f0e41e><span class="vpi-align-left menu-icon" data-v-a6f0e41e></span><span class="menu-text" data-v-a6f0e41e>${ssrInterpolate(unref(theme2).sidebarMenuLabel || "Menu")}</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(VPLocalNavOutlineDropdown, {
          headers: unref(headers),
          navHeight: navHeight.value
        }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$Z = _sfc_main$Z.setup;
_sfc_main$Z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue");
  return _sfc_setup$Z ? _sfc_setup$Z(props, ctx) : void 0;
};
const VPLocalNav = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["__scopeId", "data-v-a6f0e41e"]]);
function useNav() {
  const isScreenOpen = ref(false);
  function openScreen() {
    isScreenOpen.value = true;
    window.addEventListener("resize", closeScreenOnTabletWindow);
  }
  function closeScreen() {
    isScreenOpen.value = false;
    window.removeEventListener("resize", closeScreenOnTabletWindow);
  }
  function toggleScreen() {
    isScreenOpen.value ? closeScreen() : openScreen();
  }
  function closeScreenOnTabletWindow() {
    window.outerWidth >= 768 && closeScreen();
  }
  const route = useRoute();
  watch(() => route.path, closeScreen);
  return {
    isScreenOpen,
    openScreen,
    closeScreen,
    toggleScreen
  };
}
const _sfc_main$Y = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<button${ssrRenderAttrs(mergeProps({
    class: "VPSwitch",
    type: "button",
    role: "switch"
  }, _attrs))} data-v-1d5665e3><span class="check" data-v-1d5665e3>`);
  if (_ctx.$slots.default) {
    _push(`<span class="icon" data-v-1d5665e3>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</span></button>`);
}
const _sfc_setup$Y = _sfc_main$Y.setup;
_sfc_main$Y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue");
  return _sfc_setup$Y ? _sfc_setup$Y(props, ctx) : void 0;
};
const VPSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$Y, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-1d5665e3"]]);
const _sfc_main$X = /* @__PURE__ */ defineComponent({
  __name: "VPSwitchAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { isDark, theme: theme2 } = useData();
    const toggleAppearance = inject("toggle-appearance", () => {
      isDark.value = !isDark.value;
    });
    const switchTitle = ref("");
    watchPostEffect(() => {
      switchTitle.value = isDark.value ? theme2.value.lightModeSwitchTitle || "Switch to light theme" : theme2.value.darkModeSwitchTitle || "Switch to dark theme";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VPSwitch, mergeProps({
        title: switchTitle.value,
        class: "VPSwitchAppearance",
        "aria-checked": unref(isDark),
        onClick: unref(toggleAppearance)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="vpi-sun sun" data-v-5337faa4${_scopeId}></span><span class="vpi-moon moon" data-v-5337faa4${_scopeId}></span>`);
          } else {
            return [
              createVNode("span", { class: "vpi-sun sun" }),
              createVNode("span", { class: "vpi-moon moon" })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const VPSwitchAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["__scopeId", "data-v-5337faa4"]]);
const _sfc_main$W = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { site: site2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarAppearance" }, _attrs))} data-v-6c893767>`);
        _push(ssrRenderComponent(VPSwitchAppearance, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const VPNavBarAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["__scopeId", "data-v-6c893767"]]);
const focusedElement = ref();
let active = false;
let listeners = 0;
function useFlyout(options) {
  const focus = ref(false);
  if (inBrowser) {
    !active && activateFocusTracking();
    listeners++;
    const unwatch = watch(focusedElement, (el) => {
      var _a, _b, _c;
      if (el === options.el.value || ((_a = options.el.value) == null ? void 0 : _a.contains(el))) {
        focus.value = true;
        (_b = options.onFocus) == null ? void 0 : _b.call(options);
      } else {
        focus.value = false;
        (_c = options.onBlur) == null ? void 0 : _c.call(options);
      }
    });
    onUnmounted(() => {
      unwatch();
      listeners--;
      if (!listeners) {
        deactivateFocusTracking();
      }
    });
  }
  return readonly(focus);
}
function activateFocusTracking() {
  document.addEventListener("focusin", handleFocusIn);
  active = true;
  focusedElement.value = document.activeElement;
}
function deactivateFocusTracking() {
  document.removeEventListener("focusin", handleFocusIn);
}
function handleFocusIn() {
  focusedElement.value = document.activeElement;
}
const _sfc_main$V = /* @__PURE__ */ defineComponent({
  __name: "VPMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const { page } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenuLink" }, _attrs))} data-v-35975db6>`);
      _push(ssrRenderComponent(_sfc_main$1e, {
        class: {
          active: unref(isActive)(
            unref(page).relativePath,
            __props.item.activeMatch || __props.item.link,
            !!__props.item.activeMatch
          )
        },
        href: __props.item.link,
        target: __props.item.target,
        rel: __props.item.rel,
        "no-icon": __props.item.noIcon
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-35975db6${_scopeId}>${__props.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: __props.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const VPMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$V, [["__scopeId", "data-v-35975db6"]]);
const _sfc_main$U = /* @__PURE__ */ defineComponent({
  __name: "VPMenuGroup",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenuGroup" }, _attrs))} data-v-69e747b5>`);
      if (__props.text) {
        _push(`<p class="title" data-v-69e747b5>${ssrInterpolate(__props.text)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<!--[-->`);
        if ("link" in item) {
          _push(ssrRenderComponent(VPMenuLink, { item }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const VPMenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["__scopeId", "data-v-69e747b5"]]);
const _sfc_main$T = /* @__PURE__ */ defineComponent({
  __name: "VPMenu",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenu" }, _attrs))} data-v-b98bc113>`);
      if (__props.items) {
        _push(`<div class="items" data-v-b98bc113><!--[-->`);
        ssrRenderList(__props.items, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props), null), _parent);
          } else {
            _push(ssrRenderComponent(VPMenuGroup, {
              text: item.text,
              items: item.items
            }, null, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const VPMenu = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["__scopeId", "data-v-b98bc113"]]);
const _sfc_main$S = /* @__PURE__ */ defineComponent({
  __name: "VPFlyout",
  __ssrInlineRender: true,
  props: {
    icon: {},
    button: {},
    label: {},
    items: {}
  },
  setup(__props) {
    const open = ref(false);
    const el = ref();
    useFlyout({ el, onBlur });
    function onBlur() {
      open.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "VPFlyout",
        ref_key: "el",
        ref: el
      }, _attrs))} data-v-cf11d7a2><button type="button" class="button" aria-haspopup="true"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-label", __props.label)} data-v-cf11d7a2>`);
      if (__props.button || __props.icon) {
        _push(`<span class="text" data-v-cf11d7a2>`);
        if (__props.icon) {
          _push(`<span class="${ssrRenderClass([__props.icon, "option-icon"])}" data-v-cf11d7a2></span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.button) {
          _push(`<span data-v-cf11d7a2>${__props.button ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="vpi-chevron-down text-icon" data-v-cf11d7a2></span></span>`);
      } else {
        _push(`<span class="vpi-more-horizontal icon" data-v-cf11d7a2></span>`);
      }
      _push(`</button><div class="menu" data-v-cf11d7a2>`);
      _push(ssrRenderComponent(VPMenu, { items: __props.items }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const VPFlyout = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["__scopeId", "data-v-cf11d7a2"]]);
const _sfc_main$R = /* @__PURE__ */ defineComponent({
  __name: "VPSocialLink",
  __ssrInlineRender: true,
  props: {
    icon: {},
    link: {},
    ariaLabel: {}
  },
  setup(__props) {
    var _a;
    const props = __props;
    const el = ref();
    onMounted(async () => {
      var _a2;
      await nextTick();
      const span = (_a2 = el.value) == null ? void 0 : _a2.children[0];
      if (span instanceof HTMLElement && span.className.startsWith("vpi-social-") && (getComputedStyle(span).maskImage || getComputedStyle(span).webkitMaskImage) === "none") {
        span.style.setProperty(
          "--icon",
          `url('https://api.iconify.design/simple-icons/${props.icon}.svg')`
        );
      }
    });
    const svg = computed(() => {
      if (typeof props.icon === "object") return props.icon.svg;
      return `<span class="vpi-social-${props.icon}"></span>`;
    });
    {
      typeof props.icon === "string" && ((_a = useSSRContext()) == null ? void 0 : _a.vpSocialIcons.add(props.icon));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        ref_key: "el",
        ref: el,
        class: "VPSocialLink no-icon",
        href: __props.link,
        "aria-label": __props.ariaLabel ?? (typeof __props.icon === "string" ? __props.icon : ""),
        target: "_blank",
        rel: "noopener"
      }, _attrs))} data-v-bd121fe5>${svg.value ?? ""}</a>`);
    };
  }
});
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const VPSocialLink = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["__scopeId", "data-v-bd121fe5"]]);
const _sfc_main$Q = /* @__PURE__ */ defineComponent({
  __name: "VPSocialLinks",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPSocialLinks" }, _attrs))} data-v-7bc22406><!--[-->`);
      ssrRenderList(__props.links, ({ link: link2, icon, ariaLabel }) => {
        _push(ssrRenderComponent(VPSocialLink, {
          key: link2,
          icon,
          link: link2,
          ariaLabel
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const VPSocialLinks = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["__scopeId", "data-v-7bc22406"]]);
const _sfc_main$P = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarExtra",
  __ssrInlineRender: true,
  setup(__props) {
    const { site: site2, theme: theme2 } = useData();
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    const hasExtraContent = computed(
      () => localeLinks.value.length && currentLang.value.label || site2.value.appearance || theme2.value.socialLinks
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (hasExtraContent.value) {
        _push(ssrRenderComponent(VPFlyout, mergeProps({
          class: "VPNavBarExtra",
          label: "extra navigation"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(localeLinks).length && unref(currentLang).label) {
                _push2(`<div class="group translations" data-v-bb2aa2f0${_scopeId}><p class="trans-title" data-v-bb2aa2f0${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><!--[-->`);
                ssrRenderList(unref(localeLinks), (locale) => {
                  _push2(ssrRenderComponent(VPMenuLink, { item: locale }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto") {
                _push2(`<div class="group" data-v-bb2aa2f0${_scopeId}><div class="item appearance" data-v-bb2aa2f0${_scopeId}><p class="label" data-v-bb2aa2f0${_scopeId}>${ssrInterpolate(unref(theme2).darkModeSwitchLabel || "Appearance")}</p><div class="appearance-action" data-v-bb2aa2f0${_scopeId}>`);
                _push2(ssrRenderComponent(VPSwitchAppearance, null, null, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(theme2).socialLinks) {
                _push2(`<div class="group" data-v-bb2aa2f0${_scopeId}><div class="item social-links" data-v-bb2aa2f0${_scopeId}>`);
                _push2(ssrRenderComponent(VPSocialLinks, {
                  class: "social-links-list",
                  links: unref(theme2).socialLinks
                }, null, _parent2, _scopeId));
                _push2(`</div></div>`);
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                unref(localeLinks).length && unref(currentLang).label ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "group translations"
                }, [
                  createVNode("p", { class: "trans-title" }, toDisplayString(unref(currentLang).label), 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(localeLinks), (locale) => {
                    return openBlock(), createBlock(VPMenuLink, {
                      key: locale.link,
                      item: locale
                    }, null, 8, ["item"]);
                  }), 128))
                ])) : createCommentVNode("", true),
                unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto" ? (openBlock(), createBlock("div", {
                  key: 1,
                  class: "group"
                }, [
                  createVNode("div", { class: "item appearance" }, [
                    createVNode("p", { class: "label" }, toDisplayString(unref(theme2).darkModeSwitchLabel || "Appearance"), 1),
                    createVNode("div", { class: "appearance-action" }, [
                      createVNode(VPSwitchAppearance)
                    ])
                  ])
                ])) : createCommentVNode("", true),
                unref(theme2).socialLinks ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "group"
                }, [
                  createVNode("div", { class: "item social-links" }, [
                    createVNode(VPSocialLinks, {
                      class: "social-links-list",
                      links: unref(theme2).socialLinks
                    }, null, 8, ["links"])
                  ])
                ])) : createCommentVNode("", true)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const VPNavBarExtra = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["__scopeId", "data-v-bb2aa2f0"]]);
const _sfc_main$O = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarHamburger",
  __ssrInlineRender: true,
  props: {
    active: { type: Boolean }
  },
  emits: ["click"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: ["VPNavBarHamburger", { active: __props.active }],
        "aria-label": "mobile navigation",
        "aria-expanded": __props.active,
        "aria-controls": "VPNavScreen"
      }, _attrs))} data-v-e5dd9c1c><span class="container" data-v-e5dd9c1c><span class="top" data-v-e5dd9c1c></span><span class="middle" data-v-e5dd9c1c></span><span class="bottom" data-v-e5dd9c1c></span></span></button>`);
    };
  }
});
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const VPNavBarHamburger = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["__scopeId", "data-v-e5dd9c1c"]]);
const _sfc_main$N = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const { page } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1e, mergeProps({
        class: {
          VPNavBarMenuLink: true,
          active: unref(isActive)(
            unref(page).relativePath,
            __props.item.activeMatch || __props.item.link,
            !!__props.item.activeMatch
          )
        },
        href: __props.item.link,
        target: __props.item.target,
        rel: __props.item.rel,
        "no-icon": __props.item.noIcon,
        tabindex: "0"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-e56f3d57${_scopeId}>${__props.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: __props.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenuLink.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const VPNavBarMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["__scopeId", "data-v-e56f3d57"]]);
const _sfc_main$M = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenuGroup",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const props = __props;
    const { page } = useData();
    const isChildActive = (navItem) => {
      if ("component" in navItem) return false;
      if ("link" in navItem) {
        return isActive(
          page.value.relativePath,
          navItem.link,
          !!props.item.activeMatch
        );
      }
      return navItem.items.some(isChildActive);
    };
    const childrenActive = computed(() => isChildActive(props.item));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VPFlyout, mergeProps({
        class: {
          VPNavBarMenuGroup: true,
          active: unref(isActive)(unref(page).relativePath, __props.item.activeMatch, !!__props.item.activeMatch) || childrenActive.value
        },
        button: __props.item.text,
        items: __props.item.items
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenuGroup.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).nav) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-labelledby": "main-nav-aria-label",
          class: "VPNavBarMenu"
        }, _attrs))} data-v-dc692963><span id="main-nav-aria-label" class="visually-hidden" data-v-dc692963> Main Navigation </span><!--[-->`);
        ssrRenderList(unref(theme2).nav, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPNavBarMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props), null), _parent);
          } else {
            _push(ssrRenderComponent(_sfc_main$M, { item }, null, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenu.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const VPNavBarMenu = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["__scopeId", "data-v-dc692963"]]);
function createSearchTranslate(defaultTranslations) {
  const { localeIndex, theme: theme2 } = useData();
  function translate2(key) {
    var _a, _b, _c;
    const keyPath = key.split(".");
    const themeObject = (_a = theme2.value.search) == null ? void 0 : _a.options;
    const isObject = themeObject && typeof themeObject === "object";
    const locales = isObject && ((_c = (_b = themeObject.locales) == null ? void 0 : _b[localeIndex.value]) == null ? void 0 : _c.translations) || null;
    const translations = isObject && themeObject.translations || null;
    let localeResult = locales;
    let translationResult = translations;
    let defaultResult = defaultTranslations;
    const lastKey = keyPath.pop();
    for (const k of keyPath) {
      let fallbackResult = null;
      const foundInFallback = defaultResult == null ? void 0 : defaultResult[k];
      if (foundInFallback) {
        fallbackResult = defaultResult = foundInFallback;
      }
      const foundInTranslation = translationResult == null ? void 0 : translationResult[k];
      if (foundInTranslation) {
        fallbackResult = translationResult = foundInTranslation;
      }
      const foundInLocale = localeResult == null ? void 0 : localeResult[k];
      if (foundInLocale) {
        fallbackResult = localeResult = foundInLocale;
      }
      if (!foundInFallback) {
        defaultResult = fallbackResult;
      }
      if (!foundInTranslation) {
        translationResult = fallbackResult;
      }
      if (!foundInLocale) {
        localeResult = fallbackResult;
      }
    }
    return (localeResult == null ? void 0 : localeResult[lastKey]) ?? (translationResult == null ? void 0 : translationResult[lastKey]) ?? (defaultResult == null ? void 0 : defaultResult[lastKey]) ?? "";
  }
  return translate2;
}
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSearchButton",
  __ssrInlineRender: true,
  setup(__props) {
    const defaultTranslations = {
      button: {
        buttonText: "Search",
        buttonAriaLabel: "Search"
      }
    };
    const translate2 = createSearchTranslate(defaultTranslations);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: "DocSearch DocSearch-Button",
        "aria-label": unref(translate2)("button.buttonAriaLabel")
      }, _attrs))}><span class="DocSearch-Button-Container"><span class="vp-icon DocSearch-Search-Icon"></span><span class="DocSearch-Button-Placeholder">${ssrInterpolate(unref(translate2)("button.buttonText"))}</span></span><span class="DocSearch-Button-Keys"><kbd class="DocSearch-Button-Key"></kbd><kbd class="DocSearch-Button-Key">K</kbd></span></button>`);
    };
  }
});
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSearch",
  __ssrInlineRender: true,
  setup(__props) {
    const VPLocalSearchBox = defineAsyncComponent(() => import("./VPLocalSearchBox.2tJKWArw.js"));
    const VPAlgoliaSearchBox = () => null;
    const { theme: theme2 } = useData();
    const loaded = ref(false);
    const actuallyLoaded = ref(false);
    onMounted(() => {
      {
        return;
      }
    });
    function load() {
      if (!loaded.value) {
        loaded.value = true;
        setTimeout(poll, 16);
      }
    }
    function poll() {
      const e = new Event("keydown");
      e.key = "k";
      e.metaKey = true;
      window.dispatchEvent(e);
      setTimeout(() => {
        if (!document.querySelector(".DocSearch-Modal")) {
          poll();
        }
      }, 16);
    }
    function isEditingContent(event) {
      const element = event.target;
      const tagName = element.tagName;
      return element.isContentEditable || tagName === "INPUT" || tagName === "SELECT" || tagName === "TEXTAREA";
    }
    const showSearch = ref(false);
    {
      onKeyStroke("k", (event) => {
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          showSearch.value = true;
        }
      });
      onKeyStroke("/", (event) => {
        if (!isEditingContent(event)) {
          event.preventDefault();
          showSearch.value = true;
        }
      });
    }
    const provider = "local";
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarSearch" }, _attrs))}>`);
      if (unref(provider) === "local") {
        _push(`<!--[-->`);
        if (showSearch.value) {
          _push(ssrRenderComponent(unref(VPLocalSearchBox), {
            onClose: ($event) => showSearch.value = false
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div id="local-search">`);
        _push(ssrRenderComponent(_sfc_main$K, {
          onClick: ($event) => showSearch.value = true
        }, null, _parent));
        _push(`</div><!--]-->`);
      } else if (unref(provider) === "algolia") {
        _push(`<!--[-->`);
        if (loaded.value) {
          _push(ssrRenderComponent(unref(VPAlgoliaSearchBox), {
            algolia: ((_a = unref(theme2).search) == null ? void 0 : _a.options) ?? unref(theme2).algolia,
            onVnodeBeforeMount: ($event) => actuallyLoaded.value = true
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (!actuallyLoaded.value) {
          _push(`<div id="docsearch">`);
          _push(ssrRenderComponent(_sfc_main$K, { onClick: load }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSocialLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).socialLinks) {
        _push(ssrRenderComponent(VPSocialLinks, mergeProps({
          class: "VPNavBarSocialLinks",
          links: unref(theme2).socialLinks
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const VPNavBarSocialLinks = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["__scopeId", "data-v-0394ad82"]]);
const _sfc_main$H = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarTitle",
  __ssrInlineRender: true,
  setup(__props) {
    const { site: site2, theme: theme2 } = useData();
    const { hasSidebar } = useSidebar();
    const { currentLang } = useLangs();
    const link2 = computed(
      () => {
        var _a;
        return typeof theme2.value.logoLink === "string" ? theme2.value.logoLink : (_a = theme2.value.logoLink) == null ? void 0 : _a.link;
      }
    );
    const rel = computed(
      () => {
        var _a;
        return typeof theme2.value.logoLink === "string" ? void 0 : (_a = theme2.value.logoLink) == null ? void 0 : _a.rel;
      }
    );
    const target = computed(
      () => {
        var _a;
        return typeof theme2.value.logoLink === "string" ? void 0 : (_a = theme2.value.logoLink) == null ? void 0 : _a.target;
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPNavBarTitle", { "has-sidebar": unref(hasSidebar) }]
      }, _attrs))} data-v-1168a8e4><a class="title"${ssrRenderAttr("href", link2.value ?? unref(normalizeLink$1)(unref(currentLang).link))}${ssrRenderAttr("rel", rel.value)}${ssrRenderAttr("target", target.value)} data-v-1168a8e4>`);
      ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push, _parent);
      if (unref(theme2).logo) {
        _push(ssrRenderComponent(VPImage, {
          class: "logo",
          image: unref(theme2).logo
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(theme2).siteTitle) {
        _push(`<span data-v-1168a8e4>${unref(theme2).siteTitle ?? ""}</span>`);
      } else if (unref(theme2).siteTitle === void 0) {
        _push(`<span data-v-1168a8e4>${ssrInterpolate(unref(site2).title)}</span>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent);
      _push(`</a></div>`);
    };
  }
});
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const VPNavBarTitle = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["__scopeId", "data-v-1168a8e4"]]);
const _sfc_main$G = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarTranslations",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(localeLinks).length && unref(currentLang).label) {
        _push(ssrRenderComponent(VPFlyout, mergeProps({
          class: "VPNavBarTranslations",
          icon: "vpi-languages",
          label: unref(theme2).langMenuLabel || "Change language"
        }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="items" data-v-88af2de4${_scopeId}><p class="title" data-v-88af2de4${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><!--[-->`);
              ssrRenderList(unref(localeLinks), (locale) => {
                _push2(ssrRenderComponent(VPMenuLink, { item: locale }, null, _parent2, _scopeId));
              });
              _push2(`<!--]--></div>`);
            } else {
              return [
                createVNode("div", { class: "items" }, [
                  createVNode("p", { class: "title" }, toDisplayString(unref(currentLang).label), 1),
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(localeLinks), (locale) => {
                    return openBlock(), createBlock(VPMenuLink, {
                      key: locale.link,
                      item: locale
                    }, null, 8, ["item"]);
                  }), 128))
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTranslations.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const VPNavBarTranslations = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["__scopeId", "data-v-88af2de4"]]);
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "VPNavBar",
  __ssrInlineRender: true,
  props: {
    isScreenOpen: { type: Boolean }
  },
  emits: ["toggle-screen"],
  setup(__props) {
    const props = __props;
    const { y } = useWindowScroll();
    const { hasSidebar } = useSidebar();
    const { frontmatter } = useData();
    const classes = ref({});
    watchPostEffect(() => {
      classes.value = {
        "has-sidebar": hasSidebar.value,
        "home": frontmatter.value.layout === "home",
        "top": y.value === 0,
        "screen-open": props.isScreenOpen
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPNavBar", classes.value]
      }, _attrs))} data-v-6aa21345><div class="wrapper" data-v-6aa21345><div class="container" data-v-6aa21345><div class="title" data-v-6aa21345>`);
      _push(ssrRenderComponent(VPNavBarTitle, null, {
        "nav-bar-title-before": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)
            ];
          }
        }),
        "nav-bar-title-after": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</div><div class="content" data-v-6aa21345><div class="content-body" data-v-6aa21345>`);
      ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$J, { class: "search" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarMenu, { class: "menu" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarTranslations, { class: "translations" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarAppearance, { class: "appearance" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarSocialLinks, { class: "social-links" }, null, _parent));
      _push(ssrRenderComponent(VPNavBarExtra, { class: "extra" }, null, _parent));
      ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push, _parent);
      _push(ssrRenderComponent(VPNavBarHamburger, {
        class: "hamburger",
        active: __props.isScreenOpen,
        onClick: ($event) => _ctx.$emit("toggle-screen")
      }, null, _parent));
      _push(`</div></div></div></div><div class="divider" data-v-6aa21345><div class="divider-line" data-v-6aa21345></div></div></div>`);
    };
  }
});
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const VPNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["__scopeId", "data-v-6aa21345"]]);
const _sfc_main$E = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { site: site2, theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavScreenAppearance" }, _attrs))} data-v-b44890b2><p class="text" data-v-b44890b2>${ssrInterpolate(unref(theme2).darkModeSwitchLabel || "Appearance")}</p>`);
        _push(ssrRenderComponent(VPSwitchAppearance, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenAppearance.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const VPNavScreenAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["__scopeId", "data-v-b44890b2"]]);
const _sfc_main$D = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const closeScreen = inject("close-screen");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1e, mergeProps({
        class: "VPNavScreenMenuLink",
        href: __props.item.link,
        target: __props.item.target,
        rel: __props.item.rel,
        "no-icon": __props.item.noIcon,
        onClick: unref(closeScreen)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-df37e6dd${_scopeId}>${__props.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: __props.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuLink.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const VPNavScreenMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-df37e6dd"]]);
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroupLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const closeScreen = inject("close-screen");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1e, mergeProps({
        class: "VPNavScreenMenuGroupLink",
        href: __props.item.link,
        target: __props.item.target,
        rel: __props.item.rel,
        "no-icon": __props.item.noIcon,
        onClick: unref(closeScreen)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-3e9c20e4${_scopeId}>${__props.item.text ?? ""}</span>`);
          } else {
            return [
              createVNode("span", {
                innerHTML: __props.item.text
              }, null, 8, ["innerHTML"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$C = _sfc_main$C.setup;
_sfc_main$C.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroupLink.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const VPNavScreenMenuGroupLink = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["__scopeId", "data-v-3e9c20e4"]]);
const _sfc_main$B = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroupSection",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavScreenMenuGroupSection" }, _attrs))} data-v-8133b170>`);
      if (__props.text) {
        _push(`<p class="title" data-v-8133b170>${ssrInterpolate(__props.text)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(ssrRenderComponent(VPNavScreenMenuGroupLink, {
          key: item.text,
          item
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroupSection.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const VPNavScreenMenuGroupSection = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["__scopeId", "data-v-8133b170"]]);
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroup",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    const props = __props;
    const isOpen = ref(false);
    const groupId = computed(
      () => `NavScreenGroup-${props.text.replace(" ", "-").toLowerCase()}`
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPNavScreenMenuGroup", { open: isOpen.value }]
      }, _attrs))} data-v-b9ab8c58><button class="button"${ssrRenderAttr("aria-controls", groupId.value)}${ssrRenderAttr("aria-expanded", isOpen.value)} data-v-b9ab8c58><span class="button-text" data-v-b9ab8c58>${__props.text ?? ""}</span><span class="vpi-plus button-icon" data-v-b9ab8c58></span></button><div${ssrRenderAttr("id", groupId.value)} class="items" data-v-b9ab8c58><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<!--[-->`);
        if ("link" in item) {
          _push(`<div class="item" data-v-b9ab8c58>`);
          _push(ssrRenderComponent(VPNavScreenMenuGroupLink, { item }, null, _parent));
          _push(`</div>`);
        } else if ("component" in item) {
          _push(`<div class="item" data-v-b9ab8c58>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": "" }), null), _parent);
          _push(`</div>`);
        } else {
          _push(`<div class="group" data-v-b9ab8c58>`);
          _push(ssrRenderComponent(VPNavScreenMenuGroupSection, {
            text: item.text,
            items: item.items
          }, null, _parent));
          _push(`</div>`);
        }
        _push(`<!--]-->`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroup.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const VPNavScreenMenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["__scopeId", "data-v-b9ab8c58"]]);
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).nav) {
        _push(`<nav${ssrRenderAttrs(mergeProps({ class: "VPNavScreenMenu" }, _attrs))}><!--[-->`);
        ssrRenderList(unref(theme2).nav, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPNavScreenMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": "" }), null), _parent);
          } else {
            _push(ssrRenderComponent(VPNavScreenMenuGroup, {
              text: item.text || "",
              items: item.items
            }, null, _parent));
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenu.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenSocialLinks",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).socialLinks) {
        _push(ssrRenderComponent(VPSocialLinks, mergeProps({
          class: "VPNavScreenSocialLinks",
          links: unref(theme2).socialLinks
        }, _attrs), null, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenSocialLinks.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenTranslations",
  __ssrInlineRender: true,
  setup(__props) {
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(localeLinks).length && unref(currentLang).label) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["VPNavScreenTranslations", { open: isOpen.value }]
        }, _attrs))} data-v-858fe1a4><button class="title" data-v-858fe1a4><span class="vpi-languages icon lang" data-v-858fe1a4></span> ${ssrInterpolate(unref(currentLang).label)} <span class="vpi-chevron-down icon chevron" data-v-858fe1a4></span></button><ul class="list" data-v-858fe1a4><!--[-->`);
        ssrRenderList(unref(localeLinks), (locale) => {
          _push(`<li class="item" data-v-858fe1a4>`);
          _push(ssrRenderComponent(_sfc_main$1e, {
            class: "link",
            href: locale.link
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(locale.text)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(locale.text), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenTranslations.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const VPNavScreenTranslations = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-858fe1a4"]]);
const _sfc_main$w = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreen",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  setup(__props) {
    const screen = ref(null);
    useScrollLock(inBrowser ? document.body : null);
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.open) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "VPNavScreen",
          ref_key: "screen",
          ref: screen,
          id: "VPNavScreen"
        }, _attrs))} data-v-f2779853><div class="container" data-v-f2779853>`);
        ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent);
        _push(ssrRenderComponent(_sfc_main$z, { class: "menu" }, null, _parent));
        _push(ssrRenderComponent(VPNavScreenTranslations, { class: "translations" }, null, _parent));
        _push(ssrRenderComponent(VPNavScreenAppearance, { class: "appearance" }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$y, { class: "social-links" }, null, _parent));
        ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const VPNavScreen = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-f2779853"]]);
const _sfc_main$v = /* @__PURE__ */ defineComponent({
  __name: "VPNav",
  __ssrInlineRender: true,
  setup(__props) {
    const { isScreenOpen, closeScreen, toggleScreen } = useNav();
    const { frontmatter } = useData();
    const hasNavbar = computed(() => {
      return frontmatter.value.navbar !== false;
    });
    provide("close-screen", closeScreen);
    watchEffect(() => {
      if (inBrowser) {
        document.documentElement.classList.toggle("hide-nav", !hasNavbar.value);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (hasNavbar.value) {
        _push(`<header${ssrRenderAttrs(mergeProps({ class: "VPNav" }, _attrs))} data-v-ae24b3ad>`);
        _push(ssrRenderComponent(VPNavBar, {
          "is-screen-open": unref(isScreenOpen),
          onToggleScreen: unref(toggleScreen)
        }, {
          "nav-bar-title-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-title-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPNavScreen, { open: unref(isScreenOpen) }, {
          "nav-screen-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-screen-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPNav.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const VPNav = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-ae24b3ad"]]);
const _sfc_main$u = /* @__PURE__ */ defineComponent({
  __name: "VPSidebarItem",
  __ssrInlineRender: true,
  props: {
    item: {},
    depth: {}
  },
  setup(__props) {
    const props = __props;
    const {
      collapsed,
      collapsible,
      isLink,
      isActiveLink,
      hasActiveLink: hasActiveLink2,
      hasChildren,
      toggle
    } = useSidebarControl(computed(() => props.item));
    const sectionTag = computed(() => hasChildren.value ? "section" : `div`);
    const linkTag = computed(() => isLink.value ? "a" : "div");
    const textTag = computed(() => {
      return !hasChildren.value ? "p" : props.depth + 2 === 7 ? "p" : `h${props.depth + 2}`;
    });
    const itemRole = computed(() => isLink.value ? void 0 : "button");
    const classes = computed(() => [
      [`level-${props.depth}`],
      { collapsible: collapsible.value },
      { collapsed: collapsed.value },
      { "is-link": isLink.value },
      { "is-active": isActiveLink.value },
      { "has-active": hasActiveLink2.value }
    ]);
    function onItemInteraction(e) {
      if ("key" in e && e.key !== "Enter") {
        return;
      }
      !props.item.link && toggle();
    }
    function onCaretClick() {
      props.item.link && toggle();
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VPSidebarItem = resolveComponent("VPSidebarItem", true);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(sectionTag.value), mergeProps({
        class: ["VPSidebarItem", classes.value]
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (__props.item.text) {
              _push2(`<div class="item"${ssrRenderAttr("role", itemRole.value)}${ssrRenderAttr("tabindex", __props.item.items && 0)} data-v-b3fd67f8${_scopeId}><div class="indicator" data-v-b3fd67f8${_scopeId}></div>`);
              if (__props.item.link) {
                _push2(ssrRenderComponent(_sfc_main$1e, {
                  tag: linkTag.value,
                  class: "link",
                  href: __props.item.link,
                  rel: __props.item.rel,
                  target: __props.item.target
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      ssrRenderVNode(_push3, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent3, _scopeId2);
                    } else {
                      return [
                        (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
                          class: "text",
                          innerHTML: __props.item.text
                        }, null, 8, ["innerHTML"]))
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(textTag.value), { class: "text" }, null), _parent2, _scopeId);
              }
              if (__props.item.collapsed != null && __props.item.items && __props.item.items.length) {
                _push2(`<div class="caret" role="button" aria-label="toggle section" tabindex="0" data-v-b3fd67f8${_scopeId}><span class="vpi-chevron-right caret-icon" data-v-b3fd67f8${_scopeId}></span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.item.items && __props.item.items.length) {
              _push2(`<div class="items" data-v-b3fd67f8${_scopeId}>`);
              if (__props.depth < 5) {
                _push2(`<!--[-->`);
                ssrRenderList(__props.item.items, (i) => {
                  _push2(ssrRenderComponent(_component_VPSidebarItem, {
                    key: i.text,
                    item: i,
                    depth: __props.depth + 1
                  }, null, _parent2, _scopeId));
                });
                _push2(`<!--]-->`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              __props.item.text ? (openBlock(), createBlock("div", mergeProps({
                key: 0,
                class: "item",
                role: itemRole.value
              }, toHandlers(
                __props.item.items ? { click: onItemInteraction, keydown: onItemInteraction } : {},
                true
              ), {
                tabindex: __props.item.items && 0
              }), [
                createVNode("div", { class: "indicator" }),
                __props.item.link ? (openBlock(), createBlock(_sfc_main$1e, {
                  key: 0,
                  tag: linkTag.value,
                  class: "link",
                  href: __props.item.link,
                  rel: __props.item.rel,
                  target: __props.item.target
                }, {
                  default: withCtx(() => [
                    (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
                      class: "text",
                      innerHTML: __props.item.text
                    }, null, 8, ["innerHTML"]))
                  ]),
                  _: 1
                }, 8, ["tag", "href", "rel", "target"])) : (openBlock(), createBlock(resolveDynamicComponent(textTag.value), {
                  key: 1,
                  class: "text",
                  innerHTML: __props.item.text
                }, null, 8, ["innerHTML"])),
                __props.item.collapsed != null && __props.item.items && __props.item.items.length ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "caret",
                  role: "button",
                  "aria-label": "toggle section",
                  onClick: onCaretClick,
                  onKeydown: withKeys(onCaretClick, ["enter"]),
                  tabindex: "0"
                }, [
                  createVNode("span", { class: "vpi-chevron-right caret-icon" })
                ], 32)) : createCommentVNode("", true)
              ], 16, ["role", "tabindex"])) : createCommentVNode("", true),
              __props.item.items && __props.item.items.length ? (openBlock(), createBlock("div", {
                key: 1,
                class: "items"
              }, [
                __props.depth < 5 ? (openBlock(true), createBlock(Fragment, { key: 0 }, renderList(__props.item.items, (i) => {
                  return openBlock(), createBlock(_component_VPSidebarItem, {
                    key: i.text,
                    item: i,
                    depth: __props.depth + 1
                  }, null, 8, ["item", "depth"]);
                }), 128)) : createCommentVNode("", true)
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }), _parent);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const VPSidebarItem = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-b3fd67f8"]]);
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "VPSidebarGroup",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    const disableTransition = ref(true);
    let timer = null;
    onMounted(() => {
      timer = setTimeout(() => {
        timer = null;
        disableTransition.value = false;
      }, 300);
    });
    onBeforeUnmount(() => {
      if (timer != null) {
        clearTimeout(timer);
        timer = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<div class="${ssrRenderClass([{ "no-transition": disableTransition.value }, "group"])}" data-v-c40bc020>`);
        _push(ssrRenderComponent(VPSidebarItem, {
          item,
          depth: 0
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const VPSidebarGroup = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-c40bc020"]]);
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "VPSidebar",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean }
  },
  setup(__props) {
    const { sidebarGroups, hasSidebar } = useSidebar();
    const props = __props;
    const navEl = ref(null);
    const isLocked = useScrollLock(inBrowser ? document.body : null);
    watch(
      [props, navEl],
      () => {
        var _a;
        if (props.open) {
          isLocked.value = true;
          (_a = navEl.value) == null ? void 0 : _a.focus();
        } else isLocked.value = false;
      },
      { immediate: true, flush: "post" }
    );
    const key = ref(0);
    watch(
      sidebarGroups,
      () => {
        key.value += 1;
      },
      { deep: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(hasSidebar)) {
        _push(`<aside${ssrRenderAttrs(mergeProps({
          class: ["VPSidebar", { open: __props.open }],
          ref_key: "navEl",
          ref: navEl
        }, _attrs))} data-v-319d5ca6><div class="curtain" data-v-319d5ca6></div><nav class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1" data-v-319d5ca6><span class="visually-hidden" id="sidebar-aria-label" data-v-319d5ca6> Sidebar Navigation </span>`);
        ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push, _parent);
        _push(ssrRenderComponent(VPSidebarGroup, {
          items: unref(sidebarGroups),
          key: key.value
        }, null, _parent));
        ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push, _parent);
        _push(`</nav></aside>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const VPSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-319d5ca6"]]);
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "VPSkipLink",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const route = useRoute();
    const backToTop = ref();
    watch(() => route.path, () => backToTop.value.focus());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><span tabindex="-1" data-v-0b0ada53></span><a href="#VPContent" class="VPSkipLink visually-hidden" data-v-0b0ada53>${ssrInterpolate(unref(theme2).skipToContentLabel || "Skip to content")}</a><!--]-->`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const VPSkipLink = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-0b0ada53"]]);
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "Layout",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      isOpen: isSidebarOpen,
      open: openSidebar,
      close: closeSidebar
    } = useSidebar();
    const route = useRoute();
    watch(() => route.path, closeSidebar);
    useCloseSidebarOnEscape(isSidebarOpen, closeSidebar);
    const { frontmatter } = useData();
    const slots = useSlots();
    const heroImageSlotExists = computed(() => !!slots["home-hero-image"]);
    provide("hero-image-slot-exists", heroImageSlotExists);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Content = resolveComponent("Content");
      if (unref(frontmatter).layout !== false) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["Layout", unref(frontmatter).pageClass]
        }, _attrs))} data-v-5d98c3a5>`);
        ssrRenderSlot(_ctx.$slots, "layout-top", {}, null, _push, _parent);
        _push(ssrRenderComponent(VPSkipLink, null, null, _parent));
        _push(ssrRenderComponent(VPBackdrop, {
          class: "backdrop",
          show: unref(isSidebarOpen),
          onClick: unref(closeSidebar)
        }, null, _parent));
        _push(ssrRenderComponent(VPNav, null, {
          "nav-bar-title-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-title-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-title-after", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-bar-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-bar-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-bar-content-after", {}, void 0, true)
              ];
            }
          }),
          "nav-screen-content-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-before", {}, void 0, true)
              ];
            }
          }),
          "nav-screen-content-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "nav-screen-content-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPLocalNav, {
          open: unref(isSidebarOpen),
          onOpenMenu: unref(openSidebar)
        }, null, _parent));
        _push(ssrRenderComponent(VPSidebar, { open: unref(isSidebarOpen) }, {
          "sidebar-nav-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "sidebar-nav-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "sidebar-nav-before", {}, void 0, true)
              ];
            }
          }),
          "sidebar-nav-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "sidebar-nav-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "sidebar-nav-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPContent, null, {
          "page-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-top", {}, void 0, true)
              ];
            }
          }),
          "page-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "page-bottom", {}, void 0, true)
              ];
            }
          }),
          "not-found": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "not-found", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "not-found", {}, void 0, true)
              ];
            }
          }),
          "home-hero-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-before", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info", {}, void 0, true)
              ];
            }
          }),
          "home-hero-info-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-info-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-actions-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-actions-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-actions-after", {}, void 0, true)
              ];
            }
          }),
          "home-hero-image": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-image", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-image", {}, void 0, true)
              ];
            }
          }),
          "home-hero-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-hero-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-hero-after", {}, void 0, true)
              ];
            }
          }),
          "home-features-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-before", {}, void 0, true)
              ];
            }
          }),
          "home-features-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "home-features-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "home-features-after", {}, void 0, true)
              ];
            }
          }),
          "doc-footer-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-footer-before", {}, void 0, true)
              ];
            }
          }),
          "doc-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-before", {}, void 0, true)
              ];
            }
          }),
          "doc-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-after", {}, void 0, true)
              ];
            }
          }),
          "doc-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-top", {}, void 0, true)
              ];
            }
          }),
          "doc-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "doc-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "doc-bottom", {}, void 0, true)
              ];
            }
          }),
          "aside-top": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-top", {}, void 0, true)
              ];
            }
          }),
          "aside-bottom": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-bottom", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-bottom", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-before", {}, void 0, true)
              ];
            }
          }),
          "aside-outline-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-outline-after", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-before": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-before", {}, void 0, true)
              ];
            }
          }),
          "aside-ads-after": withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              ssrRenderSlot(_ctx.$slots, "aside-ads-after", {}, null, _push2, _parent2, _scopeId);
            } else {
              return [
                renderSlot(_ctx.$slots, "aside-ads-after", {}, void 0, true)
              ];
            }
          }),
          _: 3
        }, _parent));
        _push(ssrRenderComponent(VPFooter, null, null, _parent));
        ssrRenderSlot(_ctx.$slots, "layout-bottom", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(ssrRenderComponent(_component_Content, _attrs, null, _parent));
      }
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/Layout.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const Layout = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-5d98c3a5"]]);
const GridSettings = {
  xmini: [[0, 2]],
  mini: [],
  small: [
    [920, 6],
    [768, 5],
    [640, 4],
    [480, 3],
    [0, 2]
  ],
  medium: [
    [960, 5],
    [832, 4],
    [640, 3],
    [480, 2]
  ],
  big: [
    [832, 3],
    [640, 2]
  ]
};
function useSponsorsGrid({ el, size = "medium" }) {
  const onResize = throttleAndDebounce(manage, 100);
  onMounted(() => {
    manage();
    window.addEventListener("resize", onResize);
  });
  onUnmounted(() => {
    window.removeEventListener("resize", onResize);
  });
  function manage() {
    adjustSlots(el.value, size);
  }
}
function adjustSlots(el, size) {
  const tsize = el.children.length;
  const asize = el.querySelectorAll(".vp-sponsor-grid-item:not(.empty)").length;
  const grid = setGrid(el, size, asize);
  manageSlots(el, grid, tsize, asize);
}
function setGrid(el, size, items) {
  const settings = GridSettings[size];
  const screen = window.innerWidth;
  let grid = 1;
  settings.some(([breakpoint, value]) => {
    if (screen >= breakpoint) {
      grid = items < value ? items : value;
      return true;
    }
  });
  setGridData(el, grid);
  return grid;
}
function setGridData(el, value) {
  el.dataset.vpGrid = String(value);
}
function manageSlots(el, grid, tsize, asize) {
  const diff = tsize - asize;
  const rem = asize % grid;
  const drem = rem === 0 ? rem : grid - rem;
  neutralizeSlots(el, drem - diff);
}
function neutralizeSlots(el, count) {
  if (count === 0) {
    return;
  }
  count > 0 ? addSlots(el, count) : removeSlots(el, count * -1);
}
function addSlots(el, count) {
  for (let i = 0; i < count; i++) {
    const slot = document.createElement("div");
    slot.classList.add("vp-sponsor-grid-item", "empty");
    el.append(slot);
  }
}
function removeSlots(el, count) {
  for (let i = 0; i < count; i++) {
    el.removeChild(el.lastElementChild);
  }
}
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "VPSponsorsGrid",
  __ssrInlineRender: true,
  props: {
    size: { default: "medium" },
    data: {}
  },
  setup(__props) {
    const props = __props;
    const el = ref(null);
    useSponsorsGrid({ el, size: props.size });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPSponsorsGrid vp-sponsor-grid", [__props.size]],
        ref_key: "el",
        ref: el
      }, _attrs))}><!--[-->`);
      ssrRenderList(__props.data, (sponsor) => {
        _push(`<div class="vp-sponsor-grid-item"><a class="vp-sponsor-grid-link"${ssrRenderAttr("href", sponsor.url)} target="_blank" rel="sponsored noopener"><article class="vp-sponsor-grid-box"><h4 class="visually-hidden">${ssrInterpolate(sponsor.name)}</h4><img class="vp-sponsor-grid-image"${ssrRenderAttr("src", sponsor.img)}${ssrRenderAttr("alt", sponsor.name)}></article></a></div>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "VPSponsors",
  __ssrInlineRender: true,
  props: {
    mode: { default: "normal" },
    tier: {},
    size: {},
    data: {}
  },
  setup(__props) {
    const props = __props;
    const sponsors = computed(() => {
      const isSponsors = props.data.some((s) => {
        return "items" in s;
      });
      if (isSponsors) {
        return props.data;
      }
      return [
        { tier: props.tier, size: props.size, items: props.data }
      ];
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPSponsors vp-sponsor", [__props.mode]]
      }, _attrs))}><!--[-->`);
      ssrRenderList(sponsors.value, (sponsor, index) => {
        _push(`<section class="vp-sponsor-section">`);
        if (sponsor.tier) {
          _push(`<h3 class="vp-sponsor-tier">${ssrInterpolate(sponsor.tier)}</h3>`);
        } else {
          _push(`<!---->`);
        }
        _push(ssrRenderComponent(_sfc_main$p, {
          size: sponsor.size,
          data: sponsor.items
        }, null, _parent));
        _push(`</section>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "VPDocAsideSponsors",
  __ssrInlineRender: true,
  props: {
    tier: {},
    size: {},
    data: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAsideSponsors" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$o, {
        mode: "aside",
        tier: __props.tier,
        size: __props.size,
        data: __props.data
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "VPHomeSponsors",
  __ssrInlineRender: true,
  props: {
    message: {},
    actionText: { default: "Become a sponsor" },
    actionLink: {},
    data: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "VPHomeSponsors" }, _attrs))} data-v-3d121b4a><div class="container" data-v-3d121b4a><div class="header" data-v-3d121b4a><div class="love" data-v-3d121b4a><span class="vpi-heart icon" data-v-3d121b4a></span></div>`);
      if (__props.message) {
        _push(`<h2 class="message" data-v-3d121b4a>${ssrInterpolate(__props.message)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sponsors" data-v-3d121b4a>`);
      _push(ssrRenderComponent(_sfc_main$o, { data: __props.data }, null, _parent));
      _push(`</div>`);
      if (__props.actionLink) {
        _push(`<div class="action" data-v-3d121b4a>`);
        _push(ssrRenderComponent(VPButton, {
          theme: "sponsor",
          text: __props.actionText,
          href: __props.actionLink
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "VPTeamMembersItem",
  __ssrInlineRender: true,
  props: {
    size: { default: "medium" },
    member: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({
        class: ["VPTeamMembersItem", [__props.size]]
      }, _attrs))} data-v-f3fa364a><div class="profile" data-v-f3fa364a><figure class="avatar" data-v-f3fa364a><img class="avatar-img"${ssrRenderAttr("src", __props.member.avatar)}${ssrRenderAttr("alt", __props.member.name)} data-v-f3fa364a></figure><div class="data" data-v-f3fa364a><h1 class="name" data-v-f3fa364a>${ssrInterpolate(__props.member.name)}</h1>`);
      if (__props.member.title || __props.member.org) {
        _push(`<p class="affiliation" data-v-f3fa364a>`);
        if (__props.member.title) {
          _push(`<span class="title" data-v-f3fa364a>${ssrInterpolate(__props.member.title)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.member.title && __props.member.org) {
          _push(`<span class="at" data-v-f3fa364a> @ </span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.member.org) {
          _push(ssrRenderComponent(_sfc_main$1e, {
            class: ["org", { link: __props.member.orgLink }],
            href: __props.member.orgLink,
            "no-icon": ""
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(__props.member.org)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(__props.member.org), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.member.desc) {
        _push(`<p class="desc" data-v-f3fa364a>${__props.member.desc ?? ""}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.member.links) {
        _push(`<div class="links" data-v-f3fa364a>`);
        _push(ssrRenderComponent(VPSocialLinks, {
          links: __props.member.links
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (__props.member.sponsor) {
        _push(`<div class="sp" data-v-f3fa364a>`);
        _push(ssrRenderComponent(_sfc_main$1e, {
          class: "sp-link",
          href: __props.member.sponsor,
          "no-icon": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="vpi-heart sp-icon" data-v-f3fa364a${_scopeId}></span> ${ssrInterpolate(__props.member.actionText || "Sponsor")}`);
            } else {
              return [
                createVNode("span", { class: "vpi-heart sp-icon" }),
                createTextVNode(" " + toDisplayString(__props.member.actionText || "Sponsor"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</article>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const VPTeamMembersItem = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-f3fa364a"]]);
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "VPTeamMembers",
  __ssrInlineRender: true,
  props: {
    size: { default: "medium" },
    members: {}
  },
  setup(__props) {
    const props = __props;
    const classes = computed(() => [props.size, `count-${props.members.length}`]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["VPTeamMembers", classes.value]
      }, _attrs))} data-v-6cb0dbc4><div class="container" data-v-6cb0dbc4><!--[-->`);
      ssrRenderList(__props.members, (member) => {
        _push(`<div class="item" data-v-6cb0dbc4>`);
        _push(ssrRenderComponent(VPTeamMembersItem, {
          size: __props.size,
          member
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div></div>`);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const _sfc_main$j = {};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = {};
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = {};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", _sfc_main$1l);
  }
};
const root = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const internals = {
  primary: "oklch(68% .28 300)",
  secondary: "oklch(76% .24 275)",
  sidebarIcon: "#8b9099",
  inlineCode: "#d2a8ff",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(68% .28 300), oklch(76% .24 250))",
  inlineCodeBackgroundDarkMode: "#261b38",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const agents = {
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const learn = {
  primary: "oklch(68% .19 153)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(78% .16 150)",
  secondary: "oklch(75% .17 170)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(68% .19 153), oklch(77% .17 180))",
  inlineCodeBackgroundDarkMode: "#182b26",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const Projects = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const art = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const articles = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const conventions = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const deployment = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const feluqa = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const prologue = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const security = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const storage = {
  primary: "oklch(57.7% .245 27.325)",
  secondary: "oklch(66% .21 28)",
  sidebarIcon: "#8b9099",
  inlineCode: "oklch(57.7% .245 27.325)",
  heroNameColor: "transparent",
  heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
  inlineCodeBackgroundDarkMode: "#252a37",
  logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
  logoAlt: "Feluqa",
  logoHeight: "3rem",
  favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
};
const guideColors = {
  root,
  internals,
  agents,
  learn,
  Projects,
  art,
  articles,
  conventions,
  deployment,
  feluqa,
  "get-started": {
    primary: "oklch(57.7% .245 27.325)",
    secondary: "oklch(66% .21 28)",
    sidebarIcon: "#8b9099",
    inlineCode: "oklch(57.7% .245 27.325)",
    heroNameColor: "transparent",
    heroNameBackground: "linear-gradient(120deg, oklch(57.7% .245 27.325), oklch(72% .19 38))",
    inlineCodeBackgroundDarkMode: "#252a37",
    logoLight: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
    logoDark: "/__docs-assets/90b5f3e359aca9b66701c4d349fd1a9f00b99bf179c579b3d1da9534b7ab739f.svg",
    logoAlt: "Feluqa",
    logoHeight: "3rem",
    favicon: "/__docs-assets/84eb15058039efcb2168b968c8fe0db5d792aaad5c3ec65e97e792a55a0595b5.png"
  },
  prologue,
  security,
  storage
};
const site = {
  body: {
    family: "Manrope",
    src: "/__docs-assets/8c2def024c1bf31aacf3624ae3c4d701269b4ec3dc765c04830839f0d36b2d9e.woff2",
    format: "woff2",
    weight: "200 800",
    style: "normal",
    fallback: "ui-sans-serif, system-ui, sans-serif"
  },
  heading: {
    family: "DM Sans",
    src: "/__docs-assets/dd1563c3bb43e0a5163db0d0dfe3ef4b9cd698ed4166d23ba3031e6eff00e9f5.ttf",
    format: "truetype",
    weight: "100 1000",
    style: "normal",
    fallback: "ui-sans-serif, system-ui, sans-serif"
  }
};
const guides = {
  "feluqa.rs": {},
  root: {},
  internals: {},
  "x-agents": {},
  agents: {},
  learn: {},
  Projects: {},
  art: {},
  articles: {},
  conventions: {},
  deployment: {},
  feluqa: {},
  "get-started": {},
  prologue: {},
  security: {},
  storage: {}
};
const generatedFonts = {
  site,
  guides
};
const languages = [
  "en",
  "fr"
];
const defaultLanguage = "en";
const themeSlots = {
  site: {
    "sidebar-nav-before": "BranchedSidebar",
    "nav-bar-content-after": "CollectionArticleSubnav"
  },
  guides: {}
};
const documentationNotices = {
  en: {
    exploringTitle: "Under exploration",
    exploring: "This page describes an idea or proposal that is still under active discussion and subject to change.",
    validatedTitle: "Validated",
    validated: "The information on this page has been verified and reflects the current baseline.",
    fallbackTitle: "Language availability"
  },
  fr: {
    exploringTitle: "En cours d'exploration",
    exploring: "Cette page présente une idée ou une proposition encore à l'étude, susceptible de faire l'objet de modifications.",
    validatedTitle: "Validé",
    validated: "Les informations contenues sur cette page sont vérifiées et conformes à la version actuelle.",
    fallbackTitle: "Disponibilité linguistique"
  }
};
const siteContent = {
  languages,
  defaultLanguage,
  themeSlots,
  documentationNotices
};
const sidebarPageIcons = {
  "/prologue/release-notes": "__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg",
  "/prologue/licence": "__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg",
  "/prologue/contribution-guide": "__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg",
  "/prologue/components": "__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg",
  "/get-started/introduction/introduction": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/get-started/introduction/product-and-audience": "__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg",
  "/get-started/introduction/taxonomy": "__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg",
  "/get-started/introduction/architecture-overview": "__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg",
  "/get-started/installation/": "__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg",
  "/get-started/configuration/pages-and-config": "__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg",
  "/get-started/directory-structure/cli-structure": "__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg",
  "/get-started/directory-structure/module-submodule-feature-contexts": "__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg",
  "/get-started/frontend/panels": "__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg",
  "/get-started/frontend/resources": "__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg",
  "/get-started/frontend/system-panel": "__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg",
  "/get-started/starter-kits/application-profiles-and-starter-kits": "__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg",
  "/security/authorization-model": "__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg",
  "/security/privilege-levels": "__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg",
  "/security/gates": "__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg",
  "/security/rust-security-boundaries": "__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg",
  "/storage/data-layers": "__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg",
  "/storage/storage-backends-and-paths": "__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg",
  "/deployment/installing-an-app-with-the-cli": "__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg",
  "/deployment/http-and-live-actions": "__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg",
  "/feluqa/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/": "__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg",
  "/internals/get-started/overview/internals-overview": "__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg",
  "/internals/get-started/workspaces/workspaces-and-packages": "__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg",
  "/internals/get-started/compile-time/compile-time-guarantees": "__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg",
  "/internals/get-started/contributor-rules/rules-for-developers-and-agents": "__docs-assets/3710fd328756a9333e42110ddbfbf90aa9b64200bbdbc35d3fbac6a8db8b16d7.svg",
  "/internals/get-started/runtime/asynchronous-runtimes-by-target": "__docs-assets/1d74d95214a9155a07422ab9529ca816f6d42e9ca8838c12ef2550c78c9b445a.svg",
  "/learn/get-started/first-application/create-your-first-application": "__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg",
  "/learn/get-started/hello-cli/program-0-hello-cli": "__docs-assets/aff07fc7ed06f1e31c067ca48a35c608741d99c57afceff9d1513d5c1a23ee38.svg",
  "/learn/get-started/weather-watcher/build-the-weather-watcher": "__docs-assets/1e3afb66a05bfb500bdd6cc4402b88dadd5838340ac989c6c79e51e2638edb6f.svg",
  "/learn/get-started/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/agents/get-started/overview/agents-overview": "__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg",
  "/agents/get-started/agentic-development/agent-ready-extensible-modules": "__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg",
  "/agents/get-started/agentic-development/complementary-agent-project": "__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg",
  "/agents/get-started/skills/writing-docs": "__docs-assets/f31e1e7ee2b1b0c366907b94988c185f1e146a46627430dd2bf7db3a63569412.svg",
  "/articles/starting-a-feluqa-app": "__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg",
  "/fr/prologue/release-notes": "__docs-assets/785ccf84d22c54a92645adc6525aaa2c4f52942b6b5fceb20e064b9f50505fed.svg",
  "/fr/prologue/licence": "__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg",
  "/fr/prologue/contribution-guide": "__docs-assets/0ee5bff0e69c4d745a81836ec1ed46bf51678f63350dcf47e352fcbef64fd775.svg",
  "/fr/prologue/components": "__docs-assets/00c97c82d0c4e375c0dae7fba01ead3aed92a2cd4ba22a80f330296a8f3ab4a7.svg",
  "/fr/get-started/introduction/introduction": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/get-started/introduction/product-and-audience": "__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg",
  "/fr/get-started/introduction/taxonomy": "__docs-assets/7ce9876493fce5e696bcd3bbdf3e19d1dd1a11b8b69262b281da2cef8dc613d0.svg",
  "/fr/get-started/introduction/architecture-overview": "__docs-assets/03efea7f2f87b1f37964433b9a014e4ab3c20720939a851dafd0c191d80db757.svg",
  "/fr/get-started/installation/": "__docs-assets/670956464dc04750c4cc63f2279b566a3bb98dba67beadcd6be00a0e3e5bb4c7.svg",
  "/fr/get-started/configuration/pages-and-config": "__docs-assets/13bb32d8e45c17230a176365ef3f120c51ad518be8eb68ab62dc4fae49d6786c.svg",
  "/fr/get-started/directory-structure/cli-structure": "__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg",
  "/fr/get-started/directory-structure/module-submodule-feature-contexts": "__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg",
  "/fr/get-started/frontend/panels": "__docs-assets/444d75024c6664ace7b1411020df364959283ab16ab871ef898a1e19f80f767d.svg",
  "/fr/get-started/frontend/resources": "__docs-assets/c53514dd868f258648daad10403d4f4e4d9c14db25b7e1063939025702493066.svg",
  "/fr/get-started/frontend/system-panel": "__docs-assets/6cc5bcb03186cbec6f67a455e8fb16d86d876851ce2c93aca64230e6ad72d70f.svg",
  "/fr/get-started/starter-kits/application-profiles-and-starter-kits": "__docs-assets/159cf26f9519bc6c6aac4f29bf68ba1b548d5c97effe3732d0f60f0549094d1e.svg",
  "/fr/security/authorization-model": "__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg",
  "/fr/security/privilege-levels": "__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg",
  "/fr/security/gates": "__docs-assets/5e4e65509ccf6271f4e03ed72bc4afa7801960d72e5c8e387878aa3dd54d8f6d.svg",
  "/fr/security/rust-security-boundaries": "__docs-assets/ea9dec17616adda14a96c76ed5602df971eeb116cd03591b46dee5260c3b5a25.svg",
  "/fr/storage/data-layers": "__docs-assets/94752cc33ccfbb232e7214c728eb0d4564f388bdebed187aa0a75eed88bb8415.svg",
  "/fr/storage/storage-backends-and-paths": "__docs-assets/d0590ad6b67fef9232e179c9db97295396a87269d2548103aa60d119bccca844.svg",
  "/fr/deployment/installing-an-app-with-the-cli": "__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg",
  "/fr/deployment/http-and-live-actions": "__docs-assets/2bb78f7767849ff68debfc1a9904a057fd17d197c319af27b22ad5798247120a.svg",
  "/fr/feluqa/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/": "__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg",
  "/fr/internals/get-started/overview/internals-overview": "__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg",
  "/fr/internals/get-started/workspaces/workspaces-and-packages": "__docs-assets/7d823c8bf8e29e0b1e986b89b4dac008f5732423b35cbce7b538e067d7c7df7c.svg",
  "/fr/internals/get-started/compile-time/compile-time-guarantees": "__docs-assets/95cde393502805ffc6da87c9720cd27b978d230da128a0a60dbf4bcce4e96d14.svg",
  "/fr/internals/get-started/contributor-rules/rules-for-developers-and-agents": "__docs-assets/3710fd328756a9333e42110ddbfbf90aa9b64200bbdbc35d3fbac6a8db8b16d7.svg",
  "/fr/internals/get-started/runtime/asynchronous-runtimes-by-target": "__docs-assets/1d74d95214a9155a07422ab9529ca816f6d42e9ca8838c12ef2550c78c9b445a.svg",
  "/fr/learn/get-started/first-application/create-your-first-application": "__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg",
  "/fr/learn/get-started/hello-cli/program-0-hello-cli": "__docs-assets/aff07fc7ed06f1e31c067ca48a35c608741d99c57afceff9d1513d5c1a23ee38.svg",
  "/fr/learn/get-started/weather-watcher/build-the-weather-watcher": "__docs-assets/1e3afb66a05bfb500bdd6cc4402b88dadd5838340ac989c6c79e51e2638edb6f.svg",
  "/fr/learn/get-started/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/fr/agents/get-started/overview/agents-overview": "__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg",
  "/fr/agents/get-started/agentic-development/agent-ready-extensible-modules": "__docs-assets/74f8556eb292d95e9e2feeb97e5b6ceb49e885c4ba4d72a090b4b8935f868816.svg",
  "/fr/agents/get-started/agentic-development/complementary-agent-project": "__docs-assets/7cc8caa2677e3289bcaa353785d1bd363eaf3b63dbeb3a466a8ac1ade8c7a403.svg",
  "/fr/agents/get-started/skills/writing-docs": "__docs-assets/f31e1e7ee2b1b0c366907b94988c185f1e146a46627430dd2bf7db3a63569412.svg",
  "/fr/articles/starting-a-feluqa-app": "__docs-assets/ed5dd501754bb83ba334ed8d007f76bbb0de1d6ad988b1a390c912a3dc23c37e.svg",
  "/faq/": "__docs-assets/bfade24700bb2d82d0cd4e72d9bf0b0f409f76fea8747216e221a826d1ba1b09.svg",
  "/faq": "__docs-assets/bfade24700bb2d82d0cd4e72d9bf0b0f409f76fea8747216e221a826d1ba1b09.svg",
  "/fr/faq/": "__docs-assets/bfade24700bb2d82d0cd4e72d9bf0b0f409f76fea8747216e221a826d1ba1b09.svg",
  "/fr/faq": "__docs-assets/bfade24700bb2d82d0cd4e72d9bf0b0f409f76fea8747216e221a826d1ba1b09.svg"
};
const generatedCollections = [
  {
    id: "articles",
    path: "../collections/articles",
    sourcePath: "../collections/articles",
    layout: "article",
    indexLayout: "spotlight",
    titles: {
      en: "Articles",
      fr: "Articles"
    },
    descriptions: {
      en: "Short articles about building with Feluqa.",
      fr: "Articles courts sur la création avec Feluqa."
    },
    links: {
      en: "/articles/",
      fr: "/fr/articles/"
    },
    categories: {
      en: [
        {
          id: "building",
          label: "Building apps"
        }
      ],
      fr: [
        {
          id: "building",
          label: "Créer des applications"
        }
      ]
    },
    articles: {
      en: [
        {
          title: "Starting an app",
          description: "A concise starting point for shaping a Feluqa application around a real workflow and a chosen runtime.",
          date: "2026-10-30",
          category: "building",
          wordCount: 159,
          readingTime: 1,
          url: "/articles/starting-a-feluqa-app"
        }
      ],
      fr: [
        {
          title: "Starting an app",
          description: "A concise starting point for shaping a Feluqa application around a real workflow and a chosen runtime.",
          date: "2026-10-30",
          category: "building",
          wordCount: 159,
          readingTime: 1,
          url: "/fr/articles/starting-a-feluqa-app"
        }
      ]
    }
  }
];
const strings = {
  en: {
    exploringTitle: "Under exploration",
    exploring: "This page presents ideas or proposals that are still under discussion and subject to change.",
    validatedTitle: "Validated",
    validated: "The information on this page has been verified and reflects the current state of the project.",
    fallbackTitle: "Language availability",
    lastModified: "Last updated"
  },
  fr: {
    exploringTitle: "En cours d'exploration",
    exploring: "Cette page présente des idées ou des propositions encore à l'étude et susceptibles d'évoluer.",
    validatedTitle: "Validé",
    validated: "Les informations contenues sur cette page ont été vérifiées et reflètent l’état actuel du projet.",
    fallbackTitle: "Disponibilité des langues",
    lastModified: "Dernière mise à jour"
  }
};
function languageFor(value) {
  return String(value ?? "en").toLowerCase().startsWith("fr") ? "fr" : "en";
}
const DocumentationNotice = defineComponent({
  name: "DocumentationNotice",
  props: { notices: { type: Object, default: () => ({}) } },
  setup(props) {
    const { frontmatter, lang } = useData$1();
    return () => {
      const metadata = frontmatter.value;
      const language = languageFor(metadata.requestedLanguage ?? lang.value);
      const messages = strings[language];
      const configured = props.notices[language] ?? {};
      const fallbackNotice = typeof metadata.languageFallbackNotice === "string" ? metadata.languageFallbackNotice : "";
      const status = String(metadata.status ?? "").toLowerCase();
      const statusMessage = status === "exploring" ? configured.exploring ?? messages.exploring : ["validated", "verified", "complete", "completed"].includes(status) ? configured.validated ?? messages.validated : "";
      if (!fallbackNotice && !statusMessage) return null;
      const statusTitle = status === "exploring" ? language === "fr" ? "Spécification / Proposition" : "Proposal / Draft" : language === "fr" ? "Spécifié / Validé" : "Validated";
      return h("div", { class: "FeluqaDocumentationNotices", "aria-live": "polite" }, [
        fallbackNotice ? h("div", { class: "FeluqaDocumentationNotices__fallback", role: "note" }, [
          h("span", { class: "FeluqaDocumentationNotices__icon", "aria-hidden": "true" }, "i"),
          h("div", [h("strong", configured.fallbackTitle ?? messages.fallbackTitle), h("p", fallbackNotice)])
        ]) : null,
        statusMessage ? h("div", {
          class: ["FeluqaDocumentationNotices__status", status === "exploring" ? "is-exploring" : "is-validated"],
          role: status === "exploring" ? "status" : "note"
        }, [
          h("span", { class: "FeluqaDocumentationNotices__icon", "aria-hidden": "true" }, status === "exploring" ? "!" : "✓"),
          h("div", [h("strong", statusTitle), h("p", statusMessage)])
        ]) : null
      ]);
    };
  }
});
const DocumentationLastModified = defineComponent({
  name: "DocumentationLastModified",
  setup() {
    const { frontmatter, lang } = useData$1();
    return () => {
      const value = frontmatter.value.lastmod ?? frontmatter.value.lastModified;
      if (!value) return null;
      const date = new Date(String(value));
      if (Number.isNaN(date.getTime())) return null;
      const locale = languageFor(lang.value) === "fr" ? "fr-FR" : "en-US";
      const label = languageFor(lang.value) === "fr" ? strings.fr.lastModified : strings.en.lastModified;
      return h("p", { class: "FeluqaLastModified" }, [
        h("span", { class: "FeluqaLastModified__icon", "aria-hidden": "true" }),
        `${label} : `,
        h("time", { datetime: date.toISOString() }, new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date))
      ]);
    };
  }
});
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "FeluqaButton",
  __ssrInlineRender: true,
  props: {
    tag: { default: "button" },
    href: {},
    type: { default: "button" },
    size: { default: "md" },
    color: { default: "primary" },
    outlined: { type: Boolean },
    iconPosition: { default: "before" },
    tooltip: {},
    badge: {},
    badgeColor: { default: "primary" },
    radius: {},
    tint: { default: "#ffffff" },
    tintOpacity: { default: 0 },
    blur: { default: 0 },
    textColor: {},
    lineColor: { default: "#ffffff" },
    baseColor: {},
    intensity: { default: 1 },
    shineSize: { default: 10 },
    shineFade: { default: 40 },
    thickness: { default: 1 },
    speed: { default: 0.35 },
    followMouse: { type: Boolean, default: false },
    proximity: { default: 250 },
    autoAnimate: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const shineAngle = ref(0);
    const shineOpacity = ref(0);
    const isHovered = ref(false);
    let animationFrame = 0;
    let previousFrame = 0;
    const style = computed(() => ({
      ...props.radius === void 0 ? {} : { "--button-radius": `${Math.max(0, props.radius)}px` },
      "--button-tint": props.tint,
      "--button-tint-opacity": `${Math.min(1, Math.max(0, props.tintOpacity)) * 100}%`,
      "--button-blur": `${Math.max(0, props.blur)}px`,
      ...props.textColor ? { "--button-text": props.textColor } : {},
      "--button-line": props.lineColor,
      ...props.baseColor ? { "--button-base": props.baseColor } : {},
      "--button-intensity": String(Math.max(0, props.intensity)),
      "--button-shine-size": `${Math.min(180, Math.max(0, props.shineSize))}deg`,
      "--button-shine-fade": `${Math.min(180, Math.max(0, props.shineFade))}deg`,
      "--button-thickness": `${Math.max(0.5, props.thickness)}px`,
      "--button-shine-angle": `${shineAngle.value}deg`,
      "--button-shine-opacity": String(shineOpacity.value)
    }));
    function followPointer(event) {
      if (!props.followMouse || props.disabled || event.pointerType === "touch") return;
      const button = event.currentTarget;
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      const distance2 = Math.hypot(x, y);
      shineAngle.value = Math.atan2(y, x) * (180 / Math.PI) + 90;
      shineOpacity.value = Math.max(0, Math.min(1, 1 - distance2 / Math.max(1, props.proximity)));
    }
    function startHoverAnimation() {
      isHovered.value = true;
      if (!props.autoAnimate || props.disabled || animationFrame || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      previousFrame = 0;
      const animate = (time) => {
        if (!isHovered.value) return;
        if (previousFrame) shineAngle.value = (shineAngle.value + (time - previousFrame) * props.speed * 0.36) % 360;
        previousFrame = time;
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    function leavePointer() {
      isHovered.value = false;
      shineOpacity.value = 0;
      previousFrame = 0;
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      shineAngle.value = 0;
    }
    function preventDisabledLink(event) {
      if (!props.disabled || props.tag !== "a") return;
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    onUnmounted(() => cancelAnimationFrame(animationFrame));
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.tag), mergeProps({
        href: __props.tag === "a" && !__props.disabled ? __props.href : void 0,
        type: __props.tag === "button" ? __props.type : void 0,
        disabled: __props.tag === "button" ? __props.disabled : void 0,
        "aria-disabled": __props.disabled ? "true" : void 0,
        tabindex: __props.tag === "a" && __props.disabled ? -1 : void 0,
        title: __props.tooltip,
        style: style.value,
        class: [
          "feluqa-button",
          `size-${__props.size}`,
          `color-${__props.color}`,
          { outlined: __props.outlined, "is-disabled": __props.disabled, "is-hovered": isHovered.value, "is-auto-animated": __props.autoAnimate, "has-text-color": Boolean(__props.textColor) }
        ],
        onPointerenter: startHoverAnimation,
        onPointermove: followPointer,
        onPointerleave: leavePointer,
        onClick: preventDisabledLink
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (_ctx.$slots.icon && __props.iconPosition === "before") {
              _push2(`<span class="button-icon" data-v-4df8a63a${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<span class="button-content" data-v-4df8a63a${_scopeId}>`);
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(`Get Started`);
            }, _push2, _parent2, _scopeId);
            _push2(`</span>`);
            if (_ctx.$slots.icon && __props.iconPosition === "after") {
              _push2(`<span class="button-icon" data-v-4df8a63a${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
            if (_ctx.$slots.badge || __props.badge !== void 0) {
              _push2(`<span class="${ssrRenderClass(["button-badge", `badge-${__props.badgeColor}`])}" data-v-4df8a63a${_scopeId}>`);
              ssrRenderSlot(_ctx.$slots, "badge", {}, () => {
                _push2(`${ssrInterpolate(__props.badge)}`);
              }, _push2, _parent2, _scopeId);
              _push2(`</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              _ctx.$slots.icon && __props.iconPosition === "before" ? (openBlock(), createBlock("span", {
                key: 0,
                class: "button-icon"
              }, [
                renderSlot(_ctx.$slots, "icon", {}, void 0, true)
              ])) : createCommentVNode("", true),
              createVNode("span", { class: "button-content" }, [
                renderSlot(_ctx.$slots, "default", {}, () => [
                  createTextVNode("Get Started")
                ], true)
              ]),
              _ctx.$slots.icon && __props.iconPosition === "after" ? (openBlock(), createBlock("span", {
                key: 1,
                class: "button-icon"
              }, [
                renderSlot(_ctx.$slots, "icon", {}, void 0, true)
              ])) : createCommentVNode("", true),
              _ctx.$slots.badge || __props.badge !== void 0 ? (openBlock(), createBlock("span", {
                key: 2,
                class: ["button-badge", `badge-${__props.badgeColor}`]
              }, [
                renderSlot(_ctx.$slots, "badge", {}, () => [
                  createTextVNode(toDisplayString(__props.badge), 1)
                ], true)
              ], 2)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 3
      }), _parent);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/FeluqaButton.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const ProjectComponent2 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-4df8a63a"]]);
const allCollections = generatedCollections;
function useCollection(id) {
  return allCollections.find((collection) => collection.id === id);
}
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "CollectionArticleSubnav",
  __ssrInlineRender: true,
  setup(__props) {
    const { frontmatter, lang, page } = useData$1();
    const collection = computed(() => useCollection(String(frontmatter.value.collection || "")));
    const isArticle = computed(() => {
      var _a;
      return ((_a = collection.value) == null ? void 0 : _a.layout) === "article";
    });
    const locale = computed(() => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split("-")[0]);
    const label = computed(() => {
      var _a, _b;
      return ((_a = collection.value) == null ? void 0 : _a.titles[locale.value]) ?? ((_b = collection.value) == null ? void 0 : _b.titles.en) ?? "Back";
    });
    const href = computed(() => {
      var _a, _b;
      return ((_a = collection.value) == null ? void 0 : _a.links[locale.value]) ?? ((_b = collection.value) == null ? void 0 : _b.links.en) ?? "/";
    });
    const headings = computed(() => (page.value.headers ?? []).filter((heading) => heading.level === 2));
    const readingLabel = computed(() => locale.value === "fr" ? "min de lecture" : "min read");
    const wordLabel = computed(() => locale.value === "fr" ? "mots" : "words");
    return (_ctx, _push, _parent, _attrs) => {
      if (isArticle.value) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          class: "collection-article-subnav",
          "aria-label": locale.value === "fr" ? "Navigation de l’article" : "Article navigation"
        }, _attrs))}><div class="collection-article-subnav__inner">`);
        _push(ssrRenderComponent(ProjectComponent2, {
          tag: "a",
          href: href.value,
          color: "gray",
          outlined: "",
          size: "sm"
        }, {
          icon: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"${_scopeId}><path d="m15 18-6-6 6-6"${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "m15 18-6-6 6-6" })
                ]))
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ${ssrInterpolate(label.value)}`);
            } else {
              return [
                createTextVNode(" " + toDisplayString(label.value), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="collection-article-subnav__sections"${ssrRenderAttr("aria-label", locale.value === "fr" ? "Sur cet article" : "On this article")}><!--[-->`);
        ssrRenderList(headings.value, (heading) => {
          _push(`<a${ssrRenderAttr("href", `#${heading.slug}`)}>${ssrInterpolate(heading.title)}</a>`);
        });
        _push(`<!--]--></div><div class="collection-article-subnav__meta">`);
        if (unref(frontmatter).wordCount) {
          _push(`<span>${ssrInterpolate(unref(frontmatter).wordCount)} ${ssrInterpolate(wordLabel.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(frontmatter).readingTime) {
          _push(`<span>${ssrInterpolate(unref(frontmatter).readingTime)} ${ssrInterpolate(readingLabel.value)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="collection-article-actions">`);
        ssrRenderSlot(_ctx.$slots, "actions", {}, null, _push, _parent);
        _push(`</div></div></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/CollectionArticleSubnav.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "SpotlightCard",
  __ssrInlineRender: true,
  props: {
    className: { default: "" },
    spotlightColor: { default: "color-mix(in srgb, var(--feluqa-brand, var(--vp-c-brand-1)) 12%, transparent)" }
  },
  setup(__props) {
    const card = ref(null);
    const position = ref({ x: 0, y: 0 });
    const opacity = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "card",
        ref: card,
        class: ["spotlight-card", __props.className]
      }, _attrs))}><div class="spotlight-card__glow" aria-hidden="true" style="${ssrRenderStyle({
        opacity: opacity.value,
        background: `radial-gradient(circle at ${position.value.x}px ${position.value.y}px, ${__props.spotlightColor}, transparent 78%)`
      })}"></div><div class="spotlight-card__content">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/SpotlightCard.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "CollectionSpotlightCards",
  __ssrInlineRender: true,
  props: {
    collectionId: {}
  },
  setup(__props) {
    const props = __props;
    const { lang, frontmatter } = useData$1();
    const collection = computed(() => useCollection(props.collectionId));
    const locale = computed(() => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split("-")[0]);
    const search = ref("");
    const category = ref("");
    const sort = ref("newest");
    const labels = computed(() => locale.value === "fr" ? { search: "Rechercher des articles", category: "Toutes les catégories", sort: "Trier par", newest: "Plus récents", title: "Titre", noResults: "Aucun article ne correspond." } : { search: "Search articles", category: "All categories", sort: "Sort by", newest: "Newest", title: "Title", noResults: "No matching articles." });
    const categories = computed(() => {
      var _a, _b;
      return ((_a = collection.value) == null ? void 0 : _a.categories[locale.value]) ?? ((_b = collection.value) == null ? void 0 : _b.categories.en) ?? [];
    });
    const categoryLabel = computed(() => {
      var _a;
      return ((_a = categories.value.find((item) => item.id === category.value)) == null ? void 0 : _a.label) ?? labels.value.category;
    });
    const sortLabel = computed(() => sort.value === "title" ? labels.value.title : labels.value.newest);
    const items = computed(() => {
      var _a, _b;
      const source = ((_a = collection.value) == null ? void 0 : _a.articles[locale.value]) ?? ((_b = collection.value) == null ? void 0 : _b.articles.en) ?? [];
      const needle = search.value.trim().toLocaleLowerCase(locale.value);
      const filtered = source.filter((item) => {
        const matchesSearch = !needle || `${item.title} ${item.description}`.toLocaleLowerCase(locale.value).includes(needle);
        return matchesSearch && (!category.value || item.category === category.value);
      });
      return filtered.sort((a, b) => sort.value === "title" ? a.title.localeCompare(b.title, locale.value) : b.date.localeCompare(a.date));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="collection-spotlight-filters" role="search" data-v-1db2acd5><input${ssrRenderAttr("value", search.value)} type="search"${ssrRenderAttr("placeholder", labels.value.search)}${ssrRenderAttr("aria-label", labels.value.search)} data-v-1db2acd5>`);
      _push(ssrRenderComponent(VPFlyout, {
        class: "collection-filter-flyout",
        button: categoryLabel.value,
        label: labels.value.category
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="collection-filter-options" data-v-1db2acd5${_scopeId}><button class="collection-filter-option" type="button" role="menuitemradio"${ssrRenderAttr("aria-checked", String(!category.value))} data-v-1db2acd5${_scopeId}>${ssrInterpolate(labels.value.category)}</button><!--[-->`);
            ssrRenderList(categories.value, (item) => {
              _push2(`<button class="collection-filter-option" type="button" role="menuitemradio"${ssrRenderAttr("aria-checked", String(category.value === item.id))} data-v-1db2acd5${_scopeId}>${ssrInterpolate(item.label)}</button>`);
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "collection-filter-options" }, [
                createVNode("button", {
                  class: "collection-filter-option",
                  type: "button",
                  role: "menuitemradio",
                  "aria-checked": String(!category.value),
                  onClick: ($event) => category.value = ""
                }, toDisplayString(labels.value.category), 9, ["aria-checked", "onClick"]),
                (openBlock(true), createBlock(Fragment, null, renderList(categories.value, (item) => {
                  return openBlock(), createBlock("button", {
                    key: item.id,
                    class: "collection-filter-option",
                    type: "button",
                    role: "menuitemradio",
                    "aria-checked": String(category.value === item.id),
                    onClick: ($event) => category.value = item.id
                  }, toDisplayString(item.label), 9, ["aria-checked", "onClick"]);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(VPFlyout, {
        class: "collection-filter-flyout",
        button: sortLabel.value,
        label: labels.value.sort
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="collection-filter-options" data-v-1db2acd5${_scopeId}><button class="collection-filter-option" type="button" role="menuitemradio"${ssrRenderAttr("aria-checked", String(sort.value === "newest"))} data-v-1db2acd5${_scopeId}>${ssrInterpolate(labels.value.newest)}</button><button class="collection-filter-option" type="button" role="menuitemradio"${ssrRenderAttr("aria-checked", String(sort.value === "title"))} data-v-1db2acd5${_scopeId}>${ssrInterpolate(labels.value.title)}</button></div>`);
          } else {
            return [
              createVNode("div", { class: "collection-filter-options" }, [
                createVNode("button", {
                  class: "collection-filter-option",
                  type: "button",
                  role: "menuitemradio",
                  "aria-checked": String(sort.value === "newest"),
                  onClick: ($event) => sort.value = "newest"
                }, toDisplayString(labels.value.newest), 9, ["aria-checked", "onClick"]),
                createVNode("button", {
                  class: "collection-filter-option",
                  type: "button",
                  role: "menuitemradio",
                  "aria-checked": String(sort.value === "title"),
                  onClick: ($event) => sort.value = "title"
                }, toDisplayString(labels.value.title), 9, ["aria-checked", "onClick"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="collection-spotlight-grid" data-v-1db2acd5><!--[-->`);
      ssrRenderList(items.value, (item) => {
        _push(ssrRenderComponent(_sfc_main$e, {
          key: item.url,
          "class-name": "collection-spotlight-card"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<article class="collection-spotlight-card__body" data-v-1db2acd5${_scopeId}><div class="collection-spotlight-card__meta" data-v-1db2acd5${_scopeId}>`);
              if (item.date) {
                _push2(`<time data-v-1db2acd5${_scopeId}>${ssrInterpolate(item.date)}</time>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span data-v-1db2acd5${_scopeId}>${ssrInterpolate(item.wordCount)} ${ssrInterpolate(unref(lang).toLowerCase().startsWith("fr") ? "mots" : "words")}</span><span data-v-1db2acd5${_scopeId}>${ssrInterpolate(item.readingTime)} ${ssrInterpolate(unref(lang).toLowerCase().startsWith("fr") ? "min de lecture" : "min read")}</span></div><h2 data-v-1db2acd5${_scopeId}><a${ssrRenderAttr("href", item.url)} data-v-1db2acd5${_scopeId}>${ssrInterpolate(item.title)}</a></h2>`);
              if (item.description) {
                _push2(`<p data-v-1db2acd5${_scopeId}>${ssrInterpolate(item.description)}</p>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(ssrRenderComponent(ProjectComponent2, {
                tag: "a",
                href: item.url,
                color: "gray",
                outlined: "",
                size: "sm"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(lang).toLowerCase().startsWith("fr") ? "Lire l’article" : "Read article")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(lang).toLowerCase().startsWith("fr") ? "Lire l’article" : "Read article"), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(`</article>`);
            } else {
              return [
                createVNode("article", { class: "collection-spotlight-card__body" }, [
                  createVNode("div", { class: "collection-spotlight-card__meta" }, [
                    item.date ? (openBlock(), createBlock("time", { key: 0 }, toDisplayString(item.date), 1)) : createCommentVNode("", true),
                    createVNode("span", null, toDisplayString(item.wordCount) + " " + toDisplayString(unref(lang).toLowerCase().startsWith("fr") ? "mots" : "words"), 1),
                    createVNode("span", null, toDisplayString(item.readingTime) + " " + toDisplayString(unref(lang).toLowerCase().startsWith("fr") ? "min de lecture" : "min read"), 1)
                  ]),
                  createVNode("h2", null, [
                    createVNode("a", {
                      href: item.url
                    }, toDisplayString(item.title), 9, ["href"])
                  ]),
                  item.description ? (openBlock(), createBlock("p", { key: 0 }, toDisplayString(item.description), 1)) : createCommentVNode("", true),
                  createVNode(ProjectComponent2, {
                    tag: "a",
                    href: item.url,
                    color: "gray",
                    outlined: "",
                    size: "sm"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(lang).toLowerCase().startsWith("fr") ? "Lire l’article" : "Read article"), 1)
                    ]),
                    _: 1
                  }, 8, ["href"])
                ])
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div>`);
      if (!items.value.length) {
        _push(`<p class="collection-spotlight-empty" data-v-1db2acd5>${ssrInterpolate(labels.value.noResults)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/CollectionSpotlightCards.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const ProjectComponent1 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-1db2acd5"]]);
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function copy$4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}
function set$4(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}
function add$1(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}
function subtract$1(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}
function multiply$3(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}
function scale$2(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x * x + y * y + z * z);
}
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x * x + y * y + z * z;
}
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x * x + y * y + z * z;
}
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}
function inverse(out, a) {
  out[0] = 1 / a[0];
  out[1] = 1 / a[1];
  out[2] = 1 / a[2];
  return out;
}
function normalize$2(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x * x + y * y + z * z;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
}
function dot$2(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];
  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}
function smoothLerp(out, a, b, decay, dt) {
  const exp = Math.exp(-decay * dt);
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = b[0] + (ax - b[0]) * exp;
  out[1] = b[1] + (ay - b[1]) * exp;
  out[2] = b[2] + (az - b[2]) * exp;
  return out;
}
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}
function scaleRotateMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1;
  out[0] = (m[0] * x + m[4] * y + m[8] * z) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z) / w;
  return out;
}
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];
  let uvx = qy * z - qz * y;
  let uvy = qz * x - qx * z;
  let uvz = qx * y - qy * x;
  let uuvx = qy * uvz - qz * uvy;
  let uuvy = qz * uvx - qx * uvz;
  let uuvz = qx * uvy - qy * uvx;
  let w2 = qw * 2;
  uvx *= w2;
  uvy *= w2;
  uvz *= w2;
  uuvx *= 2;
  uuvy *= 2;
  uuvz *= 2;
  out[0] = x + uvx + uuvx;
  out[1] = y + uvy + uuvy;
  out[2] = z + uvz + uuvz;
  return out;
}
const angle = /* @__PURE__ */ function() {
  const tempA = [0, 0, 0];
  const tempB = [0, 0, 0];
  return function(a, b) {
    copy$4(tempA, a);
    copy$4(tempB, b);
    normalize$2(tempA, tempA);
    normalize$2(tempB, tempB);
    let cosine = dot$2(tempA, tempB);
    if (cosine > 1) {
      return 0;
    } else if (cosine < -1) {
      return Math.PI;
    } else {
      return Math.acos(cosine);
    }
  };
}();
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}
class Vec3 extends Array {
  constructor(x = 0, y = x, z = x) {
    super(x, y, z);
    return this;
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  set x(v) {
    this[0] = v;
  }
  set y(v) {
    this[1] = v;
  }
  set z(v) {
    this[2] = v;
  }
  set(x, y = x, z = x) {
    if (x.length) return this.copy(x);
    set$4(this, x, y, z);
    return this;
  }
  copy(v) {
    copy$4(this, v);
    return this;
  }
  add(va, vb) {
    if (vb) add$1(this, va, vb);
    else add$1(this, this, va);
    return this;
  }
  sub(va, vb) {
    if (vb) subtract$1(this, va, vb);
    else subtract$1(this, this, va);
    return this;
  }
  multiply(v) {
    if (v.length) multiply$3(this, this, v);
    else scale$2(this, this, v);
    return this;
  }
  divide(v) {
    if (v.length) divide(this, this, v);
    else scale$2(this, this, 1 / v);
    return this;
  }
  inverse(v = this) {
    inverse(this, v);
    return this;
  }
  // Can't use 'length' as Array.prototype uses it
  len() {
    return length(this);
  }
  distance(v) {
    if (v) return distance(this, v);
    else return length(this);
  }
  squaredLen() {
    return squaredLength(this);
  }
  squaredDistance(v) {
    if (v) return squaredDistance(this, v);
    else return squaredLength(this);
  }
  negate(v = this) {
    negate(this, v);
    return this;
  }
  cross(va, vb) {
    if (vb) cross(this, va, vb);
    else cross(this, this, va);
    return this;
  }
  scale(v) {
    scale$2(this, this, v);
    return this;
  }
  normalize() {
    normalize$2(this, this);
    return this;
  }
  dot(v) {
    return dot$2(this, v);
  }
  equals(v) {
    return exactEquals(this, v);
  }
  applyMatrix3(mat3) {
    transformMat3(this, this, mat3);
    return this;
  }
  applyMatrix4(mat4) {
    transformMat4(this, this, mat4);
    return this;
  }
  scaleRotateMatrix4(mat4) {
    scaleRotateMat4(this, this, mat4);
    return this;
  }
  applyQuaternion(q) {
    transformQuat(this, this, q);
    return this;
  }
  angle(v) {
    return angle(this, v);
  }
  lerp(v, t) {
    lerp(this, this, v, t);
    return this;
  }
  smoothLerp(v, decay, dt) {
    smoothLerp(this, this, v, decay, dt);
    return this;
  }
  clone() {
    return new Vec3(this[0], this[1], this[2]);
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }
  transformDirection(mat4) {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    this[0] = mat4[0] * x + mat4[4] * y + mat4[8] * z;
    this[1] = mat4[1] * x + mat4[5] * y + mat4[9] * z;
    this[2] = mat4[2] * x + mat4[6] * y + mat4[10] * z;
    return this.normalize();
  }
}
const tempVec3$1 = /* @__PURE__ */ new Vec3();
let ID$4 = 1;
let ATTR_ID = 1;
let isBoundsWarned = false;
class Geometry {
  constructor(gl, attributes = {}) {
    if (!gl.canvas) console.error("gl not passed as first argument to Geometry");
    this.gl = gl;
    this.attributes = attributes;
    this.id = ID$4++;
    this.VAOs = {};
    this.drawRange = { start: 0, count: 0 };
    this.instancedCount = 0;
    this.gl.renderer.bindVertexArray(null);
    this.gl.renderer.currentGeometry = null;
    this.glState = this.gl.renderer.state;
    for (let key in attributes) {
      this.addAttribute(key, attributes[key]);
    }
  }
  addAttribute(key, attr) {
    this.attributes[key] = attr;
    attr.id = ATTR_ID++;
    attr.size = attr.size || 1;
    attr.type = attr.type || (attr.data.constructor === Float32Array ? this.gl.FLOAT : attr.data.constructor === Uint16Array ? this.gl.UNSIGNED_SHORT : this.gl.UNSIGNED_INT);
    attr.target = key === "index" ? this.gl.ELEMENT_ARRAY_BUFFER : this.gl.ARRAY_BUFFER;
    attr.normalized = attr.normalized || false;
    attr.stride = attr.stride || 0;
    attr.offset = attr.offset || 0;
    attr.count = attr.count || (attr.stride ? attr.data.byteLength / attr.stride : attr.data.length / attr.size);
    attr.divisor = attr.instanced || 0;
    attr.needsUpdate = false;
    attr.usage = attr.usage || this.gl.STATIC_DRAW;
    if (!attr.buffer) {
      this.updateAttribute(attr);
    }
    if (attr.divisor) {
      this.isInstanced = true;
      if (this.instancedCount && this.instancedCount !== attr.count * attr.divisor) {
        console.warn("geometry has multiple instanced buffers of different length");
        return this.instancedCount = Math.min(this.instancedCount, attr.count * attr.divisor);
      }
      this.instancedCount = attr.count * attr.divisor;
    } else if (key === "index") {
      this.drawRange.count = attr.count;
    } else if (!this.attributes.index) {
      this.drawRange.count = Math.max(this.drawRange.count, attr.count);
    }
  }
  updateAttribute(attr) {
    const isNewBuffer = !attr.buffer;
    if (isNewBuffer) attr.buffer = this.gl.createBuffer();
    if (this.glState.boundBuffer !== attr.buffer) {
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.buffer;
    }
    if (isNewBuffer) {
      this.gl.bufferData(attr.target, attr.data, attr.usage);
    } else {
      this.gl.bufferSubData(attr.target, 0, attr.data);
    }
    attr.needsUpdate = false;
  }
  setIndex(value) {
    this.addAttribute("index", value);
  }
  setDrawRange(start, count) {
    this.drawRange.start = start;
    this.drawRange.count = count;
  }
  setInstancedCount(value) {
    this.instancedCount = value;
  }
  createVAO(program) {
    this.VAOs[program.attributeOrder] = this.gl.renderer.createVertexArray();
    this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
    this.bindAttributes(program);
  }
  bindAttributes(program) {
    program.attributeLocations.forEach((location2, { name, type }) => {
      if (!this.attributes[name]) {
        console.warn(`active attribute ${name} not being supplied`);
        return;
      }
      const attr = this.attributes[name];
      this.gl.bindBuffer(attr.target, attr.buffer);
      this.glState.boundBuffer = attr.buffer;
      let numLoc = 1;
      if (type === 35674) numLoc = 2;
      if (type === 35675) numLoc = 3;
      if (type === 35676) numLoc = 4;
      const size = attr.size / numLoc;
      const stride = numLoc === 1 ? 0 : numLoc * numLoc * 4;
      const offset = numLoc === 1 ? 0 : numLoc * 4;
      for (let i = 0; i < numLoc; i++) {
        this.gl.vertexAttribPointer(location2 + i, size, attr.type, attr.normalized, attr.stride + stride, attr.offset + i * offset);
        this.gl.enableVertexAttribArray(location2 + i);
        this.gl.renderer.vertexAttribDivisor(location2 + i, attr.divisor);
      }
    });
    if (this.attributes.index) this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.attributes.index.buffer);
  }
  draw({ program, mode = this.gl.TRIANGLES }) {
    var _a;
    if (this.gl.renderer.currentGeometry !== `${this.id}_${program.attributeOrder}`) {
      if (!this.VAOs[program.attributeOrder]) this.createVAO(program);
      this.gl.renderer.bindVertexArray(this.VAOs[program.attributeOrder]);
      this.gl.renderer.currentGeometry = `${this.id}_${program.attributeOrder}`;
    }
    program.attributeLocations.forEach((location2, { name }) => {
      const attr = this.attributes[name];
      if (attr.needsUpdate) this.updateAttribute(attr);
    });
    let indexBytesPerElement = 2;
    if (((_a = this.attributes.index) == null ? void 0 : _a.type) === this.gl.UNSIGNED_INT) indexBytesPerElement = 4;
    if (this.isInstanced) {
      if (this.attributes.index) {
        this.gl.renderer.drawElementsInstanced(
          mode,
          this.drawRange.count,
          this.attributes.index.type,
          this.attributes.index.offset + this.drawRange.start * indexBytesPerElement,
          this.instancedCount
        );
      } else {
        this.gl.renderer.drawArraysInstanced(mode, this.drawRange.start, this.drawRange.count, this.instancedCount);
      }
    } else {
      if (this.attributes.index) {
        this.gl.drawElements(
          mode,
          this.drawRange.count,
          this.attributes.index.type,
          this.attributes.index.offset + this.drawRange.start * indexBytesPerElement
        );
      } else {
        this.gl.drawArrays(mode, this.drawRange.start, this.drawRange.count);
      }
    }
  }
  getPosition() {
    const attr = this.attributes.position;
    if (attr.data) return attr;
    if (isBoundsWarned) return;
    console.warn("No position buffer data found to compute bounds");
    return isBoundsWarned = true;
  }
  computeBoundingBox(attr) {
    if (!attr) attr = this.getPosition();
    const array = attr.data;
    const stride = attr.size;
    if (!this.bounds) {
      this.bounds = {
        min: new Vec3(),
        max: new Vec3(),
        center: new Vec3(),
        scale: new Vec3(),
        radius: Infinity
      };
    }
    const min = this.bounds.min;
    const max = this.bounds.max;
    const center = this.bounds.center;
    const scale2 = this.bounds.scale;
    min.set(Infinity);
    max.set(-Infinity);
    for (let i = 0, l = array.length; i < l; i += stride) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      min.x = Math.min(x, min.x);
      min.y = Math.min(y, min.y);
      min.z = Math.min(z, min.z);
      max.x = Math.max(x, max.x);
      max.y = Math.max(y, max.y);
      max.z = Math.max(z, max.z);
    }
    scale2.sub(max, min);
    center.add(min, max).divide(2);
  }
  computeBoundingSphere(attr) {
    if (!attr) attr = this.getPosition();
    const array = attr.data;
    const stride = attr.size;
    if (!this.bounds) this.computeBoundingBox(attr);
    let maxRadiusSq = 0;
    for (let i = 0, l = array.length; i < l; i += stride) {
      tempVec3$1.fromArray(array, i);
      maxRadiusSq = Math.max(maxRadiusSq, this.bounds.center.squaredDistance(tempVec3$1));
    }
    this.bounds.radius = Math.sqrt(maxRadiusSq);
  }
  remove() {
    for (let key in this.VAOs) {
      this.gl.renderer.deleteVertexArray(this.VAOs[key]);
      delete this.VAOs[key];
    }
    for (let key in this.attributes) {
      this.gl.deleteBuffer(this.attributes[key].buffer);
      delete this.attributes[key];
    }
  }
}
let ID$3 = 1;
const arrayCacheF32 = {};
class Program {
  constructor(gl, {
    vertex,
    fragment,
    uniforms = {},
    transparent = false,
    cullFace = gl.BACK,
    frontFace = gl.CCW,
    depthTest = true,
    depthWrite = true,
    depthFunc = gl.LEQUAL
  } = {}) {
    if (!gl.canvas) console.error("gl not passed as first argument to Program");
    this.gl = gl;
    this.uniforms = uniforms;
    this.id = ID$3++;
    if (!vertex) console.warn("vertex shader not supplied");
    if (!fragment) console.warn("fragment shader not supplied");
    this.transparent = transparent;
    this.cullFace = cullFace;
    this.frontFace = frontFace;
    this.depthTest = depthTest;
    this.depthWrite = depthWrite;
    this.depthFunc = depthFunc;
    this.blendFunc = {};
    this.blendEquation = {};
    this.stencilFunc = {};
    this.stencilOp = {};
    if (this.transparent && !this.blendFunc.src) {
      if (this.gl.renderer.premultipliedAlpha) this.setBlendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
      else this.setBlendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    }
    this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
    this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    this.program = gl.createProgram();
    gl.attachShader(this.program, this.vertexShader);
    gl.attachShader(this.program, this.fragmentShader);
    this.setShaders({ vertex, fragment });
  }
  setShaders({ vertex, fragment }) {
    if (vertex) {
      this.gl.shaderSource(this.vertexShader, vertex);
      this.gl.compileShader(this.vertexShader);
      if (this.gl.getShaderInfoLog(this.vertexShader) !== "") {
        console.warn(`${this.gl.getShaderInfoLog(this.vertexShader)}
Vertex Shader
${addLineNumbers(vertex)}`);
      }
    }
    if (fragment) {
      this.gl.shaderSource(this.fragmentShader, fragment);
      this.gl.compileShader(this.fragmentShader);
      if (this.gl.getShaderInfoLog(this.fragmentShader) !== "") {
        console.warn(`${this.gl.getShaderInfoLog(this.fragmentShader)}
Fragment Shader
${addLineNumbers(fragment)}`);
      }
    }
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      return console.warn(this.gl.getProgramInfoLog(this.program));
    }
    this.uniformLocations = /* @__PURE__ */ new Map();
    let numUniforms = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_UNIFORMS);
    for (let uIndex = 0; uIndex < numUniforms; uIndex++) {
      let uniform = this.gl.getActiveUniform(this.program, uIndex);
      this.uniformLocations.set(uniform, this.gl.getUniformLocation(this.program, uniform.name));
      const split = uniform.name.match(/(\w+)/g);
      uniform.uniformName = split[0];
      uniform.nameComponents = split.slice(1);
    }
    this.attributeLocations = /* @__PURE__ */ new Map();
    const locations = [];
    const numAttribs = this.gl.getProgramParameter(this.program, this.gl.ACTIVE_ATTRIBUTES);
    for (let aIndex = 0; aIndex < numAttribs; aIndex++) {
      const attribute = this.gl.getActiveAttrib(this.program, aIndex);
      const location2 = this.gl.getAttribLocation(this.program, attribute.name);
      if (location2 === -1) continue;
      locations[location2] = attribute.name;
      this.attributeLocations.set(attribute, location2);
    }
    this.attributeOrder = locations.join("");
  }
  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    this.blendFunc.src = src;
    this.blendFunc.dst = dst;
    this.blendFunc.srcAlpha = srcAlpha;
    this.blendFunc.dstAlpha = dstAlpha;
    if (src) this.transparent = true;
  }
  setBlendEquation(modeRGB, modeAlpha) {
    this.blendEquation.modeRGB = modeRGB;
    this.blendEquation.modeAlpha = modeAlpha;
  }
  setStencilFunc(func, ref2, mask) {
    this.stencilRef = ref2;
    this.stencilFunc.func = func;
    this.stencilFunc.ref = ref2;
    this.stencilFunc.mask = mask;
  }
  setStencilOp(stencilFail, depthFail, depthPass) {
    this.stencilOp.stencilFail = stencilFail;
    this.stencilOp.depthFail = depthFail;
    this.stencilOp.depthPass = depthPass;
  }
  applyState() {
    if (this.depthTest) this.gl.renderer.enable(this.gl.DEPTH_TEST);
    else this.gl.renderer.disable(this.gl.DEPTH_TEST);
    if (this.cullFace) this.gl.renderer.enable(this.gl.CULL_FACE);
    else this.gl.renderer.disable(this.gl.CULL_FACE);
    if (this.blendFunc.src) this.gl.renderer.enable(this.gl.BLEND);
    else this.gl.renderer.disable(this.gl.BLEND);
    if (this.cullFace) this.gl.renderer.setCullFace(this.cullFace);
    this.gl.renderer.setFrontFace(this.frontFace);
    this.gl.renderer.setDepthMask(this.depthWrite);
    this.gl.renderer.setDepthFunc(this.depthFunc);
    if (this.blendFunc.src) this.gl.renderer.setBlendFunc(this.blendFunc.src, this.blendFunc.dst, this.blendFunc.srcAlpha, this.blendFunc.dstAlpha);
    this.gl.renderer.setBlendEquation(this.blendEquation.modeRGB, this.blendEquation.modeAlpha);
    if (this.stencilFunc.func || this.stencilOp.stencilFail) this.gl.renderer.enable(this.gl.STENCIL_TEST);
    else this.gl.renderer.disable(this.gl.STENCIL_TEST);
    this.gl.renderer.setStencilFunc(this.stencilFunc.func, this.stencilFunc.ref, this.stencilFunc.mask);
    this.gl.renderer.setStencilOp(this.stencilOp.stencilFail, this.stencilOp.depthFail, this.stencilOp.depthPass);
  }
  use({ flipFaces = false } = {}) {
    let textureUnit = -1;
    const programActive = this.gl.renderer.state.currentProgram === this.id;
    if (!programActive) {
      this.gl.useProgram(this.program);
      this.gl.renderer.state.currentProgram = this.id;
    }
    this.uniformLocations.forEach((location2, activeUniform) => {
      let uniform = this.uniforms[activeUniform.uniformName];
      for (const component of activeUniform.nameComponents) {
        if (!uniform) break;
        if (component in uniform) {
          uniform = uniform[component];
        } else if (Array.isArray(uniform.value)) {
          break;
        } else {
          uniform = void 0;
          break;
        }
      }
      if (!uniform) {
        return warn(`Active uniform ${activeUniform.name} has not been supplied`);
      }
      if (uniform && uniform.value === void 0) {
        return warn(`${activeUniform.name} uniform is missing a value parameter`);
      }
      if (uniform.value.texture) {
        textureUnit = textureUnit + 1;
        uniform.value.update(textureUnit);
        return setUniform(this.gl, activeUniform.type, location2, textureUnit);
      }
      if (uniform.value.length && uniform.value[0].texture) {
        const textureUnits = [];
        uniform.value.forEach((value) => {
          textureUnit = textureUnit + 1;
          value.update(textureUnit);
          textureUnits.push(textureUnit);
        });
        return setUniform(this.gl, activeUniform.type, location2, textureUnits);
      }
      setUniform(this.gl, activeUniform.type, location2, uniform.value);
    });
    this.applyState();
    if (flipFaces) this.gl.renderer.setFrontFace(this.frontFace === this.gl.CCW ? this.gl.CW : this.gl.CCW);
  }
  remove() {
    this.gl.deleteProgram(this.program);
  }
}
function setUniform(gl, type, location2, value) {
  value = value.length ? flatten(value) : value;
  const setValue = gl.renderer.state.uniformLocations.get(location2);
  if (value.length) {
    if (setValue === void 0 || setValue.length !== value.length) {
      gl.renderer.state.uniformLocations.set(location2, value.slice(0));
    } else {
      if (arraysEqual(setValue, value)) return;
      setValue.set ? setValue.set(value) : setArray(setValue, value);
      gl.renderer.state.uniformLocations.set(location2, setValue);
    }
  } else {
    if (setValue === value) return;
    gl.renderer.state.uniformLocations.set(location2, value);
  }
  switch (type) {
    case 5126:
      return value.length ? gl.uniform1fv(location2, value) : gl.uniform1f(location2, value);
    case 35664:
      return gl.uniform2fv(location2, value);
    case 35665:
      return gl.uniform3fv(location2, value);
    case 35666:
      return gl.uniform4fv(location2, value);
    case 35670:
    case 5124:
    case 35678:
    case 36306:
    case 35680:
    case 36289:
      return value.length ? gl.uniform1iv(location2, value) : gl.uniform1i(location2, value);
    case 35671:
    case 35667:
      return gl.uniform2iv(location2, value);
    case 35672:
    case 35668:
      return gl.uniform3iv(location2, value);
    case 35673:
    case 35669:
      return gl.uniform4iv(location2, value);
    case 35674:
      return gl.uniformMatrix2fv(location2, false, value);
    case 35675:
      return gl.uniformMatrix3fv(location2, false, value);
    case 35676:
      return gl.uniformMatrix4fv(location2, false, value);
  }
}
function addLineNumbers(string) {
  let lines = string.split("\n");
  for (let i = 0; i < lines.length; i++) {
    lines[i] = i + 1 + ": " + lines[i];
  }
  return lines.join("\n");
}
function flatten(a) {
  const arrayLen = a.length;
  const valueLen = a[0].length;
  if (valueLen === void 0) return a;
  const length2 = arrayLen * valueLen;
  let value = arrayCacheF32[length2];
  if (!value) arrayCacheF32[length2] = value = new Float32Array(length2);
  for (let i = 0; i < arrayLen; i++) value.set(a[i], i * valueLen);
  return value;
}
function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
function setArray(a, b) {
  for (let i = 0, l = a.length; i < l; i++) {
    a[i] = b[i];
  }
}
let warnCount = 0;
function warn(message) {
  if (warnCount > 100) return;
  console.warn(message);
  warnCount++;
  if (warnCount > 100) console.warn("More than 100 program warnings - stopping logs.");
}
const tempVec3 = /* @__PURE__ */ new Vec3();
let ID$2 = 1;
class Renderer {
  constructor({
    canvas = document.createElement("canvas"),
    width = 300,
    height = 150,
    dpr = 1,
    alpha = false,
    depth = true,
    stencil = false,
    antialias = false,
    premultipliedAlpha = false,
    preserveDrawingBuffer = false,
    powerPreference = "default",
    autoClear = true,
    webgl = 2
  } = {}) {
    const attributes = { alpha, depth, stencil, antialias, premultipliedAlpha, preserveDrawingBuffer, powerPreference };
    this.dpr = dpr;
    this.alpha = alpha;
    this.color = true;
    this.depth = depth;
    this.stencil = stencil;
    this.premultipliedAlpha = premultipliedAlpha;
    this.autoClear = autoClear;
    this.id = ID$2++;
    if (webgl === 2) this.gl = canvas.getContext("webgl2", attributes);
    this.isWebgl2 = !!this.gl;
    if (!this.gl) this.gl = canvas.getContext("webgl", attributes);
    if (!this.gl) console.error("unable to create webgl context");
    this.gl.renderer = this;
    this.setSize(width, height);
    this.state = {};
    this.state.blendFunc = { src: this.gl.ONE, dst: this.gl.ZERO };
    this.state.blendEquation = { modeRGB: this.gl.FUNC_ADD };
    this.state.cullFace = false;
    this.state.frontFace = this.gl.CCW;
    this.state.depthMask = true;
    this.state.depthFunc = this.gl.LEQUAL;
    this.state.premultiplyAlpha = false;
    this.state.flipY = false;
    this.state.unpackAlignment = 4;
    this.state.framebuffer = null;
    this.state.viewport = { x: 0, y: 0, width: null, height: null };
    this.state.textureUnits = [];
    this.state.activeTextureUnit = 0;
    this.state.boundBuffer = null;
    this.state.uniformLocations = /* @__PURE__ */ new Map();
    this.state.currentProgram = null;
    this.extensions = {};
    if (this.isWebgl2) {
      this.getExtension("EXT_color_buffer_float");
      this.getExtension("OES_texture_float_linear");
    } else {
      this.getExtension("OES_texture_float");
      this.getExtension("OES_texture_float_linear");
      this.getExtension("OES_texture_half_float");
      this.getExtension("OES_texture_half_float_linear");
      this.getExtension("OES_element_index_uint");
      this.getExtension("OES_standard_derivatives");
      this.getExtension("EXT_sRGB");
      this.getExtension("WEBGL_depth_texture");
      this.getExtension("WEBGL_draw_buffers");
    }
    this.getExtension("WEBGL_compressed_texture_astc");
    this.getExtension("EXT_texture_compression_bptc");
    this.getExtension("WEBGL_compressed_texture_s3tc");
    this.getExtension("WEBGL_compressed_texture_etc1");
    this.getExtension("WEBGL_compressed_texture_pvrtc");
    this.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");
    this.vertexAttribDivisor = this.getExtension("ANGLE_instanced_arrays", "vertexAttribDivisor", "vertexAttribDivisorANGLE");
    this.drawArraysInstanced = this.getExtension("ANGLE_instanced_arrays", "drawArraysInstanced", "drawArraysInstancedANGLE");
    this.drawElementsInstanced = this.getExtension("ANGLE_instanced_arrays", "drawElementsInstanced", "drawElementsInstancedANGLE");
    this.createVertexArray = this.getExtension("OES_vertex_array_object", "createVertexArray", "createVertexArrayOES");
    this.bindVertexArray = this.getExtension("OES_vertex_array_object", "bindVertexArray", "bindVertexArrayOES");
    this.deleteVertexArray = this.getExtension("OES_vertex_array_object", "deleteVertexArray", "deleteVertexArrayOES");
    this.drawBuffers = this.getExtension("WEBGL_draw_buffers", "drawBuffers", "drawBuffersWEBGL");
    this.parameters = {};
    this.parameters.maxTextureUnits = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
    this.parameters.maxAnisotropy = this.getExtension("EXT_texture_filter_anisotropic") ? this.gl.getParameter(this.getExtension("EXT_texture_filter_anisotropic").MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
  }
  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.gl.canvas.width = width * this.dpr;
    this.gl.canvas.height = height * this.dpr;
    if (!this.gl.canvas.style) return;
    Object.assign(this.gl.canvas.style, {
      width: width + "px",
      height: height + "px"
    });
  }
  setViewport(width, height, x = 0, y = 0) {
    if (this.state.viewport.width === width && this.state.viewport.height === height) return;
    this.state.viewport.width = width;
    this.state.viewport.height = height;
    this.state.viewport.x = x;
    this.state.viewport.y = y;
    this.gl.viewport(x, y, width, height);
  }
  setScissor(width, height, x = 0, y = 0) {
    this.gl.scissor(x, y, width, height);
  }
  enable(id) {
    if (this.state[id] === true) return;
    this.gl.enable(id);
    this.state[id] = true;
  }
  disable(id) {
    if (this.state[id] === false) return;
    this.gl.disable(id);
    this.state[id] = false;
  }
  setBlendFunc(src, dst, srcAlpha, dstAlpha) {
    if (this.state.blendFunc.src === src && this.state.blendFunc.dst === dst && this.state.blendFunc.srcAlpha === srcAlpha && this.state.blendFunc.dstAlpha === dstAlpha)
      return;
    this.state.blendFunc.src = src;
    this.state.blendFunc.dst = dst;
    this.state.blendFunc.srcAlpha = srcAlpha;
    this.state.blendFunc.dstAlpha = dstAlpha;
    if (srcAlpha !== void 0) this.gl.blendFuncSeparate(src, dst, srcAlpha, dstAlpha);
    else this.gl.blendFunc(src, dst);
  }
  setBlendEquation(modeRGB, modeAlpha) {
    modeRGB = modeRGB || this.gl.FUNC_ADD;
    if (this.state.blendEquation.modeRGB === modeRGB && this.state.blendEquation.modeAlpha === modeAlpha) return;
    this.state.blendEquation.modeRGB = modeRGB;
    this.state.blendEquation.modeAlpha = modeAlpha;
    if (modeAlpha !== void 0) this.gl.blendEquationSeparate(modeRGB, modeAlpha);
    else this.gl.blendEquation(modeRGB);
  }
  setCullFace(value) {
    if (this.state.cullFace === value) return;
    this.state.cullFace = value;
    this.gl.cullFace(value);
  }
  setFrontFace(value) {
    if (this.state.frontFace === value) return;
    this.state.frontFace = value;
    this.gl.frontFace(value);
  }
  setDepthMask(value) {
    if (this.state.depthMask === value) return;
    this.state.depthMask = value;
    this.gl.depthMask(value);
  }
  setDepthFunc(value) {
    if (this.state.depthFunc === value) return;
    this.state.depthFunc = value;
    this.gl.depthFunc(value);
  }
  setStencilMask(value) {
    if (this.state.stencilMask === value) return;
    this.state.stencilMask = value;
    this.gl.stencilMask(value);
  }
  setStencilFunc(func, ref2, mask) {
    if (this.state.stencilFunc === func && this.state.stencilRef === ref2 && this.state.stencilFuncMask === mask) return;
    this.state.stencilFunc = func || this.gl.ALWAYS;
    this.state.stencilRef = ref2 || 0;
    this.state.stencilFuncMask = mask || 0;
    this.gl.stencilFunc(func || this.gl.ALWAYS, ref2 || 0, mask || 0);
  }
  setStencilOp(stencilFail, depthFail, depthPass) {
    if (this.state.stencilFail === stencilFail && this.state.stencilDepthFail === depthFail && this.state.stencilDepthPass === depthPass) return;
    this.state.stencilFail = stencilFail;
    this.state.stencilDepthFail = depthFail;
    this.state.stencilDepthPass = depthPass;
    this.gl.stencilOp(stencilFail, depthFail, depthPass);
  }
  activeTexture(value) {
    if (this.state.activeTextureUnit === value) return;
    this.state.activeTextureUnit = value;
    this.gl.activeTexture(this.gl.TEXTURE0 + value);
  }
  bindFramebuffer({ target = this.gl.FRAMEBUFFER, buffer = null } = {}) {
    if (this.state.framebuffer === buffer) return;
    this.state.framebuffer = buffer;
    this.gl.bindFramebuffer(target, buffer);
  }
  getExtension(extension, webgl2Func, extFunc) {
    if (webgl2Func && this.gl[webgl2Func]) return this.gl[webgl2Func].bind(this.gl);
    if (!this.extensions[extension]) {
      this.extensions[extension] = this.gl.getExtension(extension);
    }
    if (!webgl2Func) return this.extensions[extension];
    if (!this.extensions[extension]) return null;
    return this.extensions[extension][extFunc].bind(this.extensions[extension]);
  }
  sortOpaque(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else if (a.zDepth !== b.zDepth) {
      return a.zDepth - b.zDepth;
    } else {
      return b.id - a.id;
    }
  }
  sortTransparent(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    }
    if (a.zDepth !== b.zDepth) {
      return b.zDepth - a.zDepth;
    } else {
      return b.id - a.id;
    }
  }
  sortUI(a, b) {
    if (a.renderOrder !== b.renderOrder) {
      return a.renderOrder - b.renderOrder;
    } else if (a.program.id !== b.program.id) {
      return a.program.id - b.program.id;
    } else {
      return b.id - a.id;
    }
  }
  getRenderList({ scene, camera, frustumCull, sort }) {
    let renderList2 = [];
    if (camera && frustumCull) camera.updateFrustum();
    scene.traverse((node) => {
      if (!node.visible) return true;
      if (!node.draw) return;
      if (frustumCull && node.frustumCulled && camera) {
        if (!camera.frustumIntersectsMesh(node)) return;
      }
      renderList2.push(node);
    });
    if (sort) {
      const opaque = [];
      const transparent = [];
      const ui = [];
      renderList2.forEach((node) => {
        if (!node.program.transparent) {
          opaque.push(node);
        } else if (node.program.depthTest) {
          transparent.push(node);
        } else {
          ui.push(node);
        }
        node.zDepth = 0;
        if (node.renderOrder !== 0 || !node.program.depthTest || !camera) return;
        node.worldMatrix.getTranslation(tempVec3);
        tempVec3.applyMatrix4(camera.projectionViewMatrix);
        node.zDepth = tempVec3.z;
      });
      opaque.sort(this.sortOpaque);
      transparent.sort(this.sortTransparent);
      ui.sort(this.sortUI);
      renderList2 = opaque.concat(transparent, ui);
    }
    return renderList2;
  }
  render({ scene, camera, target = null, update = true, sort = true, frustumCull = true, clear }) {
    if (target === null) {
      this.bindFramebuffer();
      this.setViewport(this.width * this.dpr, this.height * this.dpr);
    } else {
      this.bindFramebuffer(target);
      this.setViewport(target.width, target.height);
    }
    if (clear || this.autoClear && clear !== false) {
      if (this.depth && (!target || target.depth)) {
        this.enable(this.gl.DEPTH_TEST);
        this.setDepthMask(true);
      }
      if (this.stencil || (!target || target.stencil)) {
        this.enable(this.gl.STENCIL_TEST);
        this.setStencilMask(255);
      }
      this.gl.clear(
        (this.color ? this.gl.COLOR_BUFFER_BIT : 0) | (this.depth ? this.gl.DEPTH_BUFFER_BIT : 0) | (this.stencil ? this.gl.STENCIL_BUFFER_BIT : 0)
      );
    }
    if (update) scene.updateMatrixWorld();
    if (camera) camera.updateMatrixWorld();
    const renderList2 = this.getRenderList({ scene, camera, frustumCull, sort });
    renderList2.forEach((node) => {
      node.draw({ camera });
    });
  }
}
function copy$3(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}
function set$3(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}
function normalize$1(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x * x + y * y + z * z + w * w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
  }
  out[0] = x * len;
  out[1] = y * len;
  out[2] = z * len;
  out[3] = w * len;
  return out;
}
function dot$1(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}
function identity$2(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}
function multiply$2(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}
function rotateX(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}
function rotateY(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}
function rotateZ(out, a, rad) {
  rad *= 0.5;
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);
  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}
function slerp(out, a, b, t) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];
  let omega, cosom, sinom, scale0, scale1;
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  if (cosom < 0) {
    cosom = -cosom;
    bx = -bx;
    by = -by;
    bz = -bz;
    bw = -bw;
  }
  if (1 - cosom > 1e-6) {
    omega = Math.acos(cosom);
    sinom = Math.sin(omega);
    scale0 = Math.sin((1 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    scale0 = 1 - t;
    scale1 = t;
  }
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;
  return out;
}
function invert$2(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot2 = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
  let invDot = dot2 ? 1 / dot2 : 0;
  out[0] = -a0 * invDot;
  out[1] = -a1 * invDot;
  out[2] = -a2 * invDot;
  out[3] = a3 * invDot;
  return out;
}
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}
function fromMat3(out, m) {
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;
  if (fTrace > 0) {
    fRoot = Math.sqrt(fTrace + 1);
    out[3] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[0] = (m[5] - m[7]) * fRoot;
    out[1] = (m[6] - m[2]) * fRoot;
    out[2] = (m[1] - m[3]) * fRoot;
  } else {
    let i = 0;
    if (m[4] > m[0]) i = 1;
    if (m[8] > m[i * 3 + i]) i = 2;
    let j = (i + 1) % 3;
    let k = (i + 2) % 3;
    fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
    out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
    out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
  }
  return out;
}
function fromEuler(out, euler, order = "YXZ") {
  let sx = Math.sin(euler[0] * 0.5);
  let cx = Math.cos(euler[0] * 0.5);
  let sy = Math.sin(euler[1] * 0.5);
  let cy = Math.cos(euler[1] * 0.5);
  let sz = Math.sin(euler[2] * 0.5);
  let cz = Math.cos(euler[2] * 0.5);
  if (order === "XYZ") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "YXZ") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === "ZXY") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "ZYX") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  } else if (order === "YZX") {
    out[0] = sx * cy * cz + cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz - sx * sy * sz;
  } else if (order === "XZY") {
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz - sx * cy * sz;
    out[2] = cx * cy * sz + sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
  }
  return out;
}
const copy$2 = copy$3;
const set$2 = set$3;
const dot = dot$1;
const normalize = normalize$1;
class Quat extends Array {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    super(x, y, z, w);
    this.onChange = () => {
    };
    this._target = this;
    const triggerProps = ["0", "1", "2", "3"];
    return new Proxy(this, {
      set(target, property) {
        const success = Reflect.set(...arguments);
        if (success && triggerProps.includes(property)) target.onChange();
        return success;
      }
    });
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  get w() {
    return this[3];
  }
  set x(v) {
    this._target[0] = v;
    this.onChange();
  }
  set y(v) {
    this._target[1] = v;
    this.onChange();
  }
  set z(v) {
    this._target[2] = v;
    this.onChange();
  }
  set w(v) {
    this._target[3] = v;
    this.onChange();
  }
  identity() {
    identity$2(this._target);
    this.onChange();
    return this;
  }
  set(x, y, z, w) {
    if (x.length) return this.copy(x);
    set$2(this._target, x, y, z, w);
    this.onChange();
    return this;
  }
  rotateX(a) {
    rotateX(this._target, this._target, a);
    this.onChange();
    return this;
  }
  rotateY(a) {
    rotateY(this._target, this._target, a);
    this.onChange();
    return this;
  }
  rotateZ(a) {
    rotateZ(this._target, this._target, a);
    this.onChange();
    return this;
  }
  inverse(q = this._target) {
    invert$2(this._target, q);
    this.onChange();
    return this;
  }
  conjugate(q = this._target) {
    conjugate(this._target, q);
    this.onChange();
    return this;
  }
  copy(q) {
    copy$2(this._target, q);
    this.onChange();
    return this;
  }
  normalize(q = this._target) {
    normalize(this._target, q);
    this.onChange();
    return this;
  }
  multiply(qA, qB) {
    if (qB) {
      multiply$2(this._target, qA, qB);
    } else {
      multiply$2(this._target, this._target, qA);
    }
    this.onChange();
    return this;
  }
  dot(v) {
    return dot(this._target, v);
  }
  fromMatrix3(matrix3) {
    fromMat3(this._target, matrix3);
    this.onChange();
    return this;
  }
  fromEuler(euler, isInternal) {
    fromEuler(this._target, euler, euler.order);
    if (!isInternal) this.onChange();
    return this;
  }
  fromAxisAngle(axis, a) {
    setAxisAngle(this._target, axis, a);
    this.onChange();
    return this;
  }
  slerp(q, t) {
    slerp(this._target, this._target, q, t);
    this.onChange();
    return this;
  }
  fromArray(a, o = 0) {
    this._target[0] = a[o];
    this._target[1] = a[o + 1];
    this._target[2] = a[o + 2];
    this._target[3] = a[o + 3];
    this.onChange();
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    return a;
  }
}
const EPSILON = 1e-6;
function copy$1(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function set$1(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}
function identity$1(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function invert$1(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}
function multiply$1(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[4];
  b1 = b[5];
  b2 = b[6];
  b3 = b[7];
  out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[8];
  b1 = b[9];
  b2 = b[10];
  b3 = b[11];
  out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  b0 = b[12];
  b1 = b[13];
  b2 = b[14];
  b3 = b[15];
  out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
  out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
  out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
  out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
  return out;
}
function translate$1(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0];
    a01 = a[1];
    a02 = a[2];
    a03 = a[3];
    a10 = a[4];
    a11 = a[5];
    a12 = a[6];
    a13 = a[7];
    a20 = a[8];
    a21 = a[9];
    a22 = a[10];
    a23 = a[11];
    out[0] = a00;
    out[1] = a01;
    out[2] = a02;
    out[3] = a03;
    out[4] = a10;
    out[5] = a11;
    out[6] = a12;
    out[7] = a13;
    out[8] = a20;
    out[9] = a21;
    out[10] = a22;
    out[11] = a23;
    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }
  return out;
}
function scale$1(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}
function rotate$1(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.hypot(x, y, z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;
  if (Math.abs(len) < EPSILON) {
    return null;
  }
  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;
  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;
  a00 = a[0];
  a01 = a[1];
  a02 = a[2];
  a03 = a[3];
  a10 = a[4];
  a11 = a[5];
  a12 = a[6];
  a13 = a[7];
  a20 = a[8];
  a21 = a[9];
  a22 = a[10];
  a23 = a[11];
  b00 = x * x * t + c;
  b01 = y * x * t + z * s;
  b02 = z * x * t - y * s;
  b10 = x * y * t - z * s;
  b11 = y * y * t + c;
  b12 = z * y * t + x * s;
  b20 = x * z * t + y * s;
  b21 = y * z * t - x * s;
  b22 = z * z * t + c;
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;
  if (a !== out) {
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];
  return out;
}
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  out[0] = Math.hypot(m11, m12, m13);
  out[1] = Math.hypot(m21, m22, m23);
  out[2] = Math.hypot(m31, m32, m33);
  return out;
}
function getMaxScaleOnAxis(mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];
  const x = m11 * m11 + m12 * m12 + m13 * m13;
  const y = m21 * m21 + m22 * m22 + m23 * m23;
  const z = m31 * m31 + m32 * m32 + m33 * m33;
  return Math.sqrt(Math.max(x, y, z));
}
const getRotation = /* @__PURE__ */ function() {
  const temp = [1, 1, 1];
  return function(out, mat) {
    let scaling = temp;
    getScaling(scaling, mat);
    let is1 = 1 / scaling[0];
    let is2 = 1 / scaling[1];
    let is3 = 1 / scaling[2];
    let sm11 = mat[0] * is1;
    let sm12 = mat[1] * is2;
    let sm13 = mat[2] * is3;
    let sm21 = mat[4] * is1;
    let sm22 = mat[5] * is2;
    let sm23 = mat[6] * is3;
    let sm31 = mat[8] * is1;
    let sm32 = mat[9] * is2;
    let sm33 = mat[10] * is3;
    let trace = sm11 + sm22 + sm33;
    let S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  };
}();
function decompose(srcMat, dstRotation, dstTranslation, dstScale) {
  let sx = length([srcMat[0], srcMat[1], srcMat[2]]);
  const sy = length([srcMat[4], srcMat[5], srcMat[6]]);
  const sz = length([srcMat[8], srcMat[9], srcMat[10]]);
  const det = determinant(srcMat);
  if (det < 0) sx = -sx;
  dstTranslation[0] = srcMat[12];
  dstTranslation[1] = srcMat[13];
  dstTranslation[2] = srcMat[14];
  const _m1 = srcMat.slice();
  const invSX = 1 / sx;
  const invSY = 1 / sy;
  const invSZ = 1 / sz;
  _m1[0] *= invSX;
  _m1[1] *= invSX;
  _m1[2] *= invSX;
  _m1[4] *= invSY;
  _m1[5] *= invSY;
  _m1[6] *= invSY;
  _m1[8] *= invSZ;
  _m1[9] *= invSZ;
  _m1[10] *= invSZ;
  getRotation(dstRotation, _m1);
  dstScale[0] = sx;
  dstScale[1] = sy;
  dstScale[2] = sz;
}
function compose(dstMat, srcRotation, srcTranslation, srcScale) {
  const te = dstMat;
  const x = srcRotation[0], y = srcRotation[1], z = srcRotation[2], w = srcRotation[3];
  const x2 = x + x, y2 = y + y, z2 = z + z;
  const xx = x * x2, xy = x * y2, xz = x * z2;
  const yy = y * y2, yz = y * z2, zz = z * z2;
  const wx = w * x2, wy = w * y2, wz = w * z2;
  const sx = srcScale[0], sy = srcScale[1], sz = srcScale[2];
  te[0] = (1 - (yy + zz)) * sx;
  te[1] = (xy + wz) * sx;
  te[2] = (xz - wy) * sx;
  te[3] = 0;
  te[4] = (xy - wz) * sy;
  te[5] = (1 - (xx + zz)) * sy;
  te[6] = (yz + wx) * sy;
  te[7] = 0;
  te[8] = (xz + wy) * sz;
  te[9] = (yz - wx) * sz;
  te[10] = (1 - (xx + yy)) * sz;
  te[11] = 0;
  te[12] = srcTranslation[0];
  te[13] = srcTranslation[1];
  te[14] = srcTranslation[2];
  te[15] = 1;
  return te;
}
function fromQuat$1(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;
  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;
  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}
function perspective(out, fovy, aspect, near, far) {
  let f = 1 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = 2 * far * near * nf;
  out[15] = 0;
  return out;
}
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}
function targetTo(out, eye, target, up) {
  let eyex = eye[0], eyey = eye[1], eyez = eye[2], upx = up[0], upy = up[1], upz = up[2];
  let z0 = eyex - target[0], z1 = eyey - target[1], z2 = eyez - target[2];
  let len = z0 * z0 + z1 * z1 + z2 * z2;
  if (len === 0) {
    z2 = 1;
  } else {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }
  let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len = x0 * x0 + x1 * x1 + x2 * x2;
  if (len === 0) {
    if (upz) {
      upx += 1e-6;
    } else if (upy) {
      upz += 1e-6;
    } else {
      upy += 1e-6;
    }
    x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
  }
  len = 1 / Math.sqrt(len);
  x0 *= len;
  x1 *= len;
  x2 *= len;
  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
}
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}
class Mat4 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m03 = 0, m10 = 0, m11 = 1, m12 = 0, m13 = 0, m20 = 0, m21 = 0, m22 = 1, m23 = 0, m30 = 0, m31 = 0, m32 = 0, m33 = 1) {
    super(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }
  get x() {
    return this[12];
  }
  get y() {
    return this[13];
  }
  get z() {
    return this[14];
  }
  get w() {
    return this[15];
  }
  set x(v) {
    this[12] = v;
  }
  set y(v) {
    this[13] = v;
  }
  set z(v) {
    this[14] = v;
  }
  set w(v) {
    this[15] = v;
  }
  set(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
    if (m00.length) return this.copy(m00);
    set$1(this, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33);
    return this;
  }
  translate(v, m = this) {
    translate$1(this, m, v);
    return this;
  }
  rotate(v, axis, m = this) {
    rotate$1(this, m, v, axis);
    return this;
  }
  scale(v, m = this) {
    scale$1(this, m, typeof v === "number" ? [v, v, v] : v);
    return this;
  }
  add(ma, mb) {
    if (mb) add(this, ma, mb);
    else add(this, this, ma);
    return this;
  }
  sub(ma, mb) {
    if (mb) subtract(this, ma, mb);
    else subtract(this, this, ma);
    return this;
  }
  multiply(ma, mb) {
    if (!ma.length) {
      multiplyScalar(this, this, ma);
    } else if (mb) {
      multiply$1(this, ma, mb);
    } else {
      multiply$1(this, this, ma);
    }
    return this;
  }
  identity() {
    identity$1(this);
    return this;
  }
  copy(m) {
    copy$1(this, m);
    return this;
  }
  fromPerspective({ fov, aspect, near, far } = {}) {
    perspective(this, fov, aspect, near, far);
    return this;
  }
  fromOrthogonal({ left, right, bottom, top, near, far }) {
    ortho(this, left, right, bottom, top, near, far);
    return this;
  }
  fromQuaternion(q) {
    fromQuat$1(this, q);
    return this;
  }
  setPosition(v) {
    this.x = v[0];
    this.y = v[1];
    this.z = v[2];
    return this;
  }
  inverse(m = this) {
    invert$1(this, m);
    return this;
  }
  compose(q, pos, scale2) {
    compose(this, q, pos, scale2);
    return this;
  }
  decompose(q, pos, scale2) {
    decompose(this, q, pos, scale2);
    return this;
  }
  getRotation(q) {
    getRotation(q, this);
    return this;
  }
  getTranslation(pos) {
    getTranslation(pos, this);
    return this;
  }
  getScaling(scale2) {
    getScaling(scale2, this);
    return this;
  }
  getMaxScaleOnAxis() {
    return getMaxScaleOnAxis(this);
  }
  lookAt(eye, target, up) {
    targetTo(this, eye, target, up);
    return this;
  }
  determinant() {
    return determinant(this);
  }
  fromArray(a, o = 0) {
    this[0] = a[o];
    this[1] = a[o + 1];
    this[2] = a[o + 2];
    this[3] = a[o + 3];
    this[4] = a[o + 4];
    this[5] = a[o + 5];
    this[6] = a[o + 6];
    this[7] = a[o + 7];
    this[8] = a[o + 8];
    this[9] = a[o + 9];
    this[10] = a[o + 10];
    this[11] = a[o + 11];
    this[12] = a[o + 12];
    this[13] = a[o + 13];
    this[14] = a[o + 14];
    this[15] = a[o + 15];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    a[o + 3] = this[3];
    a[o + 4] = this[4];
    a[o + 5] = this[5];
    a[o + 6] = this[6];
    a[o + 7] = this[7];
    a[o + 8] = this[8];
    a[o + 9] = this[9];
    a[o + 10] = this[10];
    a[o + 11] = this[11];
    a[o + 12] = this[12];
    a[o + 13] = this[13];
    a[o + 14] = this[14];
    a[o + 15] = this[15];
    return a;
  }
}
function fromRotationMatrix(out, m, order = "YXZ") {
  if (order === "XYZ") {
    out[1] = Math.asin(Math.min(Math.max(m[8], -1), 1));
    if (Math.abs(m[8]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[10]);
      out[2] = Math.atan2(-m[4], m[0]);
    } else {
      out[0] = Math.atan2(m[6], m[5]);
      out[2] = 0;
    }
  } else if (order === "YXZ") {
    out[0] = Math.asin(-Math.min(Math.max(m[9], -1), 1));
    if (Math.abs(m[9]) < 0.99999) {
      out[1] = Math.atan2(m[8], m[10]);
      out[2] = Math.atan2(m[1], m[5]);
    } else {
      out[1] = Math.atan2(-m[2], m[0]);
      out[2] = 0;
    }
  } else if (order === "ZXY") {
    out[0] = Math.asin(Math.min(Math.max(m[6], -1), 1));
    if (Math.abs(m[6]) < 0.99999) {
      out[1] = Math.atan2(-m[2], m[10]);
      out[2] = Math.atan2(-m[4], m[5]);
    } else {
      out[1] = 0;
      out[2] = Math.atan2(m[1], m[0]);
    }
  } else if (order === "ZYX") {
    out[1] = Math.asin(-Math.min(Math.max(m[2], -1), 1));
    if (Math.abs(m[2]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[10]);
      out[2] = Math.atan2(m[1], m[0]);
    } else {
      out[0] = 0;
      out[2] = Math.atan2(-m[4], m[5]);
    }
  } else if (order === "YZX") {
    out[2] = Math.asin(Math.min(Math.max(m[1], -1), 1));
    if (Math.abs(m[1]) < 0.99999) {
      out[0] = Math.atan2(-m[9], m[5]);
      out[1] = Math.atan2(-m[2], m[0]);
    } else {
      out[0] = 0;
      out[1] = Math.atan2(m[8], m[10]);
    }
  } else if (order === "XZY") {
    out[2] = Math.asin(-Math.min(Math.max(m[4], -1), 1));
    if (Math.abs(m[4]) < 0.99999) {
      out[0] = Math.atan2(m[6], m[5]);
      out[1] = Math.atan2(m[8], m[0]);
    } else {
      out[0] = Math.atan2(-m[9], m[10]);
      out[1] = 0;
    }
  }
  return out;
}
const tmpMat4 = /* @__PURE__ */ new Mat4();
class Euler extends Array {
  constructor(x = 0, y = x, z = x, order = "YXZ") {
    super(x, y, z);
    this.order = order;
    this.onChange = () => {
    };
    this._target = this;
    const triggerProps = ["0", "1", "2"];
    return new Proxy(this, {
      set(target, property) {
        const success = Reflect.set(...arguments);
        if (success && triggerProps.includes(property)) target.onChange();
        return success;
      }
    });
  }
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
  }
  get z() {
    return this[2];
  }
  set x(v) {
    this._target[0] = v;
    this.onChange();
  }
  set y(v) {
    this._target[1] = v;
    this.onChange();
  }
  set z(v) {
    this._target[2] = v;
    this.onChange();
  }
  set(x, y = x, z = x) {
    if (x.length) return this.copy(x);
    this._target[0] = x;
    this._target[1] = y;
    this._target[2] = z;
    this.onChange();
    return this;
  }
  copy(v) {
    this._target[0] = v[0];
    this._target[1] = v[1];
    this._target[2] = v[2];
    this.onChange();
    return this;
  }
  reorder(order) {
    this._target.order = order;
    this.onChange();
    return this;
  }
  fromRotationMatrix(m, order = this.order) {
    fromRotationMatrix(this._target, m, order);
    this.onChange();
    return this;
  }
  fromQuaternion(q, order = this.order, isInternal) {
    tmpMat4.fromQuaternion(q);
    this._target.fromRotationMatrix(tmpMat4, order);
    if (!isInternal) this.onChange();
    return this;
  }
  fromArray(a, o = 0) {
    this._target[0] = a[o];
    this._target[1] = a[o + 1];
    this._target[2] = a[o + 2];
    return this;
  }
  toArray(a = [], o = 0) {
    a[o] = this[0];
    a[o + 1] = this[1];
    a[o + 2] = this[2];
    return a;
  }
}
class Transform {
  constructor() {
    this.parent = null;
    this.children = [];
    this.visible = true;
    this.matrix = new Mat4();
    this.worldMatrix = new Mat4();
    this.matrixAutoUpdate = true;
    this.worldMatrixNeedsUpdate = false;
    this.position = new Vec3();
    this.quaternion = new Quat();
    this.scale = new Vec3(1);
    this.rotation = new Euler();
    this.up = new Vec3(0, 1, 0);
    this.rotation._target.onChange = () => this.quaternion.fromEuler(this.rotation, true);
    this.quaternion._target.onChange = () => this.rotation.fromQuaternion(this.quaternion, void 0, true);
  }
  setParent(parent, notifyParent = true) {
    if (this.parent && parent !== this.parent) this.parent.removeChild(this, false);
    this.parent = parent;
    if (notifyParent && parent) parent.addChild(this, false);
  }
  addChild(child, notifyChild = true) {
    if (!~this.children.indexOf(child)) this.children.push(child);
    if (notifyChild) child.setParent(this, false);
  }
  removeChild(child, notifyChild = true) {
    if (!!~this.children.indexOf(child)) this.children.splice(this.children.indexOf(child), 1);
    if (notifyChild) child.setParent(null, false);
  }
  updateMatrixWorld(force) {
    if (this.matrixAutoUpdate) this.updateMatrix();
    if (this.worldMatrixNeedsUpdate || force) {
      if (this.parent === null) this.worldMatrix.copy(this.matrix);
      else this.worldMatrix.multiply(this.parent.worldMatrix, this.matrix);
      this.worldMatrixNeedsUpdate = false;
      force = true;
    }
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].updateMatrixWorld(force);
    }
  }
  updateMatrix() {
    this.matrix.compose(this.quaternion, this.position, this.scale);
    this.worldMatrixNeedsUpdate = true;
  }
  traverse(callback) {
    if (callback(this)) return;
    for (let i = 0, l = this.children.length; i < l; i++) {
      this.children[i].traverse(callback);
    }
  }
  decompose() {
    this.matrix.decompose(this.quaternion._target, this.position, this.scale);
    this.rotation.fromQuaternion(this.quaternion);
  }
  lookAt(target, invert2 = false) {
    if (invert2) this.matrix.lookAt(this.position, target, this.up);
    else this.matrix.lookAt(target, this.position, this.up);
    this.matrix.getRotation(this.quaternion._target);
    this.rotation.fromQuaternion(this.quaternion);
  }
}
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;
  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;
  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;
  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;
  return out;
}
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];
  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;
  let det = a00 * b01 + a01 * b11 + a02 * b21;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];
  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];
  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;
  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;
  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}
function translate(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], x = v[0], y = v[1];
  out[0] = a00;
  out[1] = a01;
  out[2] = a02;
  out[3] = a10;
  out[4] = a11;
  out[5] = a12;
  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}
function rotate(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a10 = a[3], a11 = a[4], a12 = a[5], a20 = a[6], a21 = a[7], a22 = a[8], s = Math.sin(rad), c = Math.cos(rad);
  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;
  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;
  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
}
function scale(out, a, v) {
  let x = v[0], y = v[1];
  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];
  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) {
    return null;
  }
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  return out;
}
class Mat3 extends Array {
  constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
    super(m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }
  set(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
    if (m00.length) return this.copy(m00);
    set(this, m00, m01, m02, m10, m11, m12, m20, m21, m22);
    return this;
  }
  translate(v, m = this) {
    translate(this, m, v);
    return this;
  }
  rotate(v, m = this) {
    rotate(this, m, v);
    return this;
  }
  scale(v, m = this) {
    scale(this, m, v);
    return this;
  }
  multiply(ma, mb) {
    if (mb) {
      multiply(this, ma, mb);
    } else {
      multiply(this, this, ma);
    }
    return this;
  }
  identity() {
    identity(this);
    return this;
  }
  copy(m) {
    copy(this, m);
    return this;
  }
  fromMatrix4(m) {
    fromMat4(this, m);
    return this;
  }
  fromQuaternion(q) {
    fromQuat(this, q);
    return this;
  }
  fromBasis(vec3a, vec3b, vec3c) {
    this.set(vec3a[0], vec3a[1], vec3a[2], vec3b[0], vec3b[1], vec3b[2], vec3c[0], vec3c[1], vec3c[2]);
    return this;
  }
  inverse(m = this) {
    invert(this, m);
    return this;
  }
  getNormalMatrix(m) {
    normalFromMat4(this, m);
    return this;
  }
}
let ID$1 = 0;
class Mesh extends Transform {
  constructor(gl, { geometry, program, mode = gl.TRIANGLES, frustumCulled = true, renderOrder = 0 } = {}) {
    super();
    if (!gl.canvas) console.error("gl not passed as first argument to Mesh");
    this.gl = gl;
    this.id = ID$1++;
    this.geometry = geometry;
    this.program = program;
    this.mode = mode;
    this.frustumCulled = frustumCulled;
    this.renderOrder = renderOrder;
    this.modelViewMatrix = new Mat4();
    this.normalMatrix = new Mat3();
    this.beforeRenderCallbacks = [];
    this.afterRenderCallbacks = [];
  }
  onBeforeRender(f) {
    this.beforeRenderCallbacks.push(f);
    return this;
  }
  onAfterRender(f) {
    this.afterRenderCallbacks.push(f);
    return this;
  }
  draw({ camera } = {}) {
    if (camera) {
      if (!this.program.uniforms.modelMatrix) {
        Object.assign(this.program.uniforms, {
          modelMatrix: { value: null },
          viewMatrix: { value: null },
          modelViewMatrix: { value: null },
          normalMatrix: { value: null },
          projectionMatrix: { value: null },
          cameraPosition: { value: null }
        });
      }
      this.program.uniforms.projectionMatrix.value = camera.projectionMatrix;
      this.program.uniforms.cameraPosition.value = camera.worldPosition;
      this.program.uniforms.viewMatrix.value = camera.viewMatrix;
      this.modelViewMatrix.multiply(camera.viewMatrix, this.worldMatrix);
      this.normalMatrix.getNormalMatrix(this.modelViewMatrix);
      this.program.uniforms.modelMatrix.value = this.worldMatrix;
      this.program.uniforms.modelViewMatrix.value = this.modelViewMatrix;
      this.program.uniforms.normalMatrix.value = this.normalMatrix;
    }
    this.beforeRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
    let flipFaces = this.program.cullFace && this.worldMatrix.determinant() < 0;
    this.program.use({ flipFaces });
    this.geometry.draw({ mode: this.mode, program: this.program });
    this.afterRenderCallbacks.forEach((f) => f && f({ mesh: this, camera }));
  }
}
const emptyPixel = new Uint8Array(4);
function isPowerOf2(value) {
  return (value & value - 1) === 0;
}
let ID = 1;
class Texture {
  constructor(gl, {
    image,
    target = gl.TEXTURE_2D,
    type = gl.UNSIGNED_BYTE,
    format = gl.RGBA,
    internalFormat = format,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    wrapR = gl.CLAMP_TO_EDGE,
    generateMipmaps = target === (gl.TEXTURE_2D || gl.TEXTURE_CUBE_MAP),
    minFilter = generateMipmaps ? gl.NEAREST_MIPMAP_LINEAR : gl.LINEAR,
    magFilter = gl.LINEAR,
    premultiplyAlpha = false,
    unpackAlignment = 4,
    flipY = target == (gl.TEXTURE_2D || gl.TEXTURE_3D) ? true : false,
    anisotropy = 0,
    level = 0,
    width,
    // used for RenderTargets or Data Textures
    height = width,
    length: length2 = 1
  } = {}) {
    this.gl = gl;
    this.id = ID++;
    this.image = image;
    this.target = target;
    this.type = type;
    this.format = format;
    this.internalFormat = internalFormat;
    this.minFilter = minFilter;
    this.magFilter = magFilter;
    this.wrapS = wrapS;
    this.wrapT = wrapT;
    this.wrapR = wrapR;
    this.generateMipmaps = generateMipmaps;
    this.premultiplyAlpha = premultiplyAlpha;
    this.unpackAlignment = unpackAlignment;
    this.flipY = flipY;
    this.anisotropy = Math.min(anisotropy, this.gl.renderer.parameters.maxAnisotropy);
    this.level = level;
    this.width = width;
    this.height = height;
    this.length = length2;
    this.texture = this.gl.createTexture();
    this.store = {
      image: null
    };
    this.glState = this.gl.renderer.state;
    this.state = {};
    this.state.minFilter = this.gl.NEAREST_MIPMAP_LINEAR;
    this.state.magFilter = this.gl.LINEAR;
    this.state.wrapS = this.gl.REPEAT;
    this.state.wrapT = this.gl.REPEAT;
    this.state.anisotropy = 0;
  }
  bind() {
    if (this.glState.textureUnits[this.glState.activeTextureUnit] === this.id) return;
    this.gl.bindTexture(this.target, this.texture);
    this.glState.textureUnits[this.glState.activeTextureUnit] = this.id;
  }
  update(textureUnit = 0) {
    const needsUpdate = !(this.image === this.store.image && !this.needsUpdate);
    if (needsUpdate || this.glState.textureUnits[textureUnit] !== this.id) {
      this.gl.renderer.activeTexture(textureUnit);
      this.bind();
    }
    if (!needsUpdate) return;
    this.needsUpdate = false;
    if (this.flipY !== this.glState.flipY) {
      this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, this.flipY);
      this.glState.flipY = this.flipY;
    }
    if (this.premultiplyAlpha !== this.glState.premultiplyAlpha) {
      this.gl.pixelStorei(this.gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, this.premultiplyAlpha);
      this.glState.premultiplyAlpha = this.premultiplyAlpha;
    }
    if (this.unpackAlignment !== this.glState.unpackAlignment) {
      this.gl.pixelStorei(this.gl.UNPACK_ALIGNMENT, this.unpackAlignment);
      this.glState.unpackAlignment = this.unpackAlignment;
    }
    if (this.minFilter !== this.state.minFilter) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MIN_FILTER, this.minFilter);
      this.state.minFilter = this.minFilter;
    }
    if (this.magFilter !== this.state.magFilter) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_MAG_FILTER, this.magFilter);
      this.state.magFilter = this.magFilter;
    }
    if (this.wrapS !== this.state.wrapS) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_S, this.wrapS);
      this.state.wrapS = this.wrapS;
    }
    if (this.wrapT !== this.state.wrapT) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_T, this.wrapT);
      this.state.wrapT = this.wrapT;
    }
    if (this.wrapR !== this.state.wrapR) {
      this.gl.texParameteri(this.target, this.gl.TEXTURE_WRAP_R, this.wrapR);
      this.state.wrapR = this.wrapR;
    }
    if (this.anisotropy && this.anisotropy !== this.state.anisotropy) {
      this.gl.texParameterf(this.target, this.gl.renderer.getExtension("EXT_texture_filter_anisotropic").TEXTURE_MAX_ANISOTROPY_EXT, this.anisotropy);
      this.state.anisotropy = this.anisotropy;
    }
    if (this.image) {
      if (this.image.width) {
        this.width = this.image.width;
        this.height = this.image.height;
      }
      if (this.target === this.gl.TEXTURE_CUBE_MAP) {
        for (let i = 0; i < 6; i++) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, this.level, this.internalFormat, this.format, this.type, this.image[i]);
        }
      } else if (ArrayBuffer.isView(this.image)) {
        if (this.target === this.gl.TEXTURE_2D) {
          this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, this.image);
        } else if (this.target === this.gl.TEXTURE_2D_ARRAY || this.target === this.gl.TEXTURE_3D) {
          this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, this.image);
        }
      } else if (this.image.isCompressedTexture) {
        for (let level = 0; level < this.image.length; level++) {
          this.gl.compressedTexImage2D(this.target, level, this.internalFormat, this.image[level].width, this.image[level].height, 0, this.image[level].data);
        }
      } else {
        if (this.target === this.gl.TEXTURE_2D) {
          this.gl.texImage2D(this.target, this.level, this.internalFormat, this.format, this.type, this.image);
        } else {
          this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, this.image);
        }
      }
      if (this.generateMipmaps) {
        if (!this.gl.renderer.isWebgl2 && (!isPowerOf2(this.image.width) || !isPowerOf2(this.image.height))) {
          this.generateMipmaps = false;
          this.wrapS = this.wrapT = this.gl.CLAMP_TO_EDGE;
          this.minFilter = this.gl.LINEAR;
        } else {
          this.gl.generateMipmap(this.target);
        }
      }
      this.onUpdate && this.onUpdate();
    } else {
      if (this.target === this.gl.TEXTURE_CUBE_MAP) {
        for (let i = 0; i < 6; i++) {
          this.gl.texImage2D(this.gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
        }
      } else if (this.width) {
        if (this.target === this.gl.TEXTURE_2D) {
          this.gl.texImage2D(this.target, this.level, this.internalFormat, this.width, this.height, 0, this.format, this.type, null);
        } else {
          this.gl.texImage3D(this.target, this.level, this.internalFormat, this.width, this.height, this.length, 0, this.format, this.type, null);
        }
      } else {
        this.gl.texImage2D(this.target, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, emptyPixel);
      }
    }
    this.store.image = this.image;
  }
}
class RenderTarget {
  constructor(gl, {
    width = gl.canvas.width,
    height = gl.canvas.height,
    target = gl.FRAMEBUFFER,
    color = 1,
    // number of color attachments
    depth = true,
    stencil = false,
    depthTexture = false,
    wrapS = gl.CLAMP_TO_EDGE,
    wrapT = gl.CLAMP_TO_EDGE,
    wrapR = gl.CLAMP_TO_EDGE,
    minFilter = gl.LINEAR,
    magFilter = minFilter,
    type = gl.UNSIGNED_BYTE,
    format = gl.RGBA,
    internalFormat = format,
    unpackAlignment,
    premultiplyAlpha
  } = {}) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.stencil = stencil;
    this.buffer = this.gl.createFramebuffer();
    this.target = target;
    this.gl.renderer.bindFramebuffer(this);
    this.textures = [];
    const drawBuffers = [];
    for (let i = 0; i < color; i++) {
      this.textures.push(
        new Texture(gl, {
          width,
          height,
          wrapS,
          wrapT,
          wrapR,
          minFilter,
          magFilter,
          type,
          format,
          internalFormat,
          unpackAlignment,
          premultiplyAlpha,
          flipY: false,
          generateMipmaps: false
        })
      );
      this.textures[i].update();
      this.gl.framebufferTexture2D(
        this.target,
        this.gl.COLOR_ATTACHMENT0 + i,
        this.gl.TEXTURE_2D,
        this.textures[i].texture,
        0
        /* level */
      );
      drawBuffers.push(this.gl.COLOR_ATTACHMENT0 + i);
    }
    if (drawBuffers.length > 1) this.gl.renderer.drawBuffers(drawBuffers);
    this.texture = this.textures[0];
    if (depthTexture && (this.gl.renderer.isWebgl2 || this.gl.renderer.getExtension("WEBGL_depth_texture"))) {
      this.depthTexture = new Texture(gl, {
        width,
        height,
        minFilter: this.gl.NEAREST,
        magFilter: this.gl.NEAREST,
        format: this.stencil ? this.gl.DEPTH_STENCIL : this.gl.DEPTH_COMPONENT,
        internalFormat: gl.renderer.isWebgl2 ? this.stencil ? this.gl.DEPTH24_STENCIL8 : this.gl.DEPTH_COMPONENT16 : this.gl.DEPTH_COMPONENT,
        type: this.stencil ? this.gl.UNSIGNED_INT_24_8 : this.gl.UNSIGNED_INT
      });
      this.depthTexture.update();
      this.gl.framebufferTexture2D(
        this.target,
        this.stencil ? this.gl.DEPTH_STENCIL_ATTACHMENT : this.gl.DEPTH_ATTACHMENT,
        this.gl.TEXTURE_2D,
        this.depthTexture.texture,
        0
        /* level */
      );
    } else {
      if (depth && !stencil) {
        this.depthBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_ATTACHMENT, this.gl.RENDERBUFFER, this.depthBuffer);
      }
      if (stencil && !depth) {
        this.stencilBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.stencilBuffer);
      }
      if (depth && stencil) {
        this.depthStencilBuffer = this.gl.createRenderbuffer();
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
        this.gl.framebufferRenderbuffer(this.target, this.gl.DEPTH_STENCIL_ATTACHMENT, this.gl.RENDERBUFFER, this.depthStencilBuffer);
      }
    }
    this.gl.renderer.bindFramebuffer({ target: this.target });
  }
  setSize(width, height) {
    if (this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;
    this.gl.renderer.bindFramebuffer(this);
    for (let i = 0; i < this.textures.length; i++) {
      this.textures[i].width = width;
      this.textures[i].height = height;
      this.textures[i].needsUpdate = true;
      this.textures[i].update();
      this.gl.framebufferTexture2D(
        this.target,
        this.gl.COLOR_ATTACHMENT0 + i,
        this.gl.TEXTURE_2D,
        this.textures[i].texture,
        0
        /* level */
      );
    }
    if (this.depthTexture) {
      this.depthTexture.width = width;
      this.depthTexture.height = height;
      this.depthTexture.needsUpdate = true;
      this.depthTexture.update();
      this.gl.framebufferTexture2D(
        this.target,
        this.gl.DEPTH_ATTACHMENT,
        this.gl.TEXTURE_2D,
        this.depthTexture.texture,
        0
        /* level */
      );
    } else {
      if (this.depthBuffer) {
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_COMPONENT16, width, height);
      }
      if (this.stencilBuffer) {
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.stencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.STENCIL_INDEX8, width, height);
      }
      if (this.depthStencilBuffer) {
        this.gl.bindRenderbuffer(this.gl.RENDERBUFFER, this.depthStencilBuffer);
        this.gl.renderbufferStorage(this.gl.RENDERBUFFER, this.gl.DEPTH_STENCIL, width, height);
      }
    }
    this.gl.renderer.bindFramebuffer({ target: this.target });
  }
}
class Plane extends Geometry {
  constructor(gl, { width = 1, height = 1, widthSegments = 1, heightSegments = 1, attributes = {} } = {}) {
    const wSegs = widthSegments;
    const hSegs = heightSegments;
    const num = (wSegs + 1) * (hSegs + 1);
    const numIndices = wSegs * hSegs * 6;
    const position = new Float32Array(num * 3);
    const normal = new Float32Array(num * 3);
    const uv = new Float32Array(num * 2);
    const index = numIndices > 65536 ? new Uint32Array(numIndices) : new Uint16Array(numIndices);
    Plane.buildPlane(position, normal, uv, index, width, height, 0, wSegs, hSegs);
    Object.assign(attributes, {
      position: { size: 3, data: position },
      normal: { size: 3, data: normal },
      uv: { size: 2, data: uv },
      index: { data: index }
    });
    super(gl, attributes);
  }
  static buildPlane(position, normal, uv, index, width, height, depth, wSegs, hSegs, u = 0, v = 1, w = 2, uDir = 1, vDir = -1, i = 0, ii = 0) {
    const io = i;
    const segW = width / wSegs;
    const segH = height / hSegs;
    for (let iy = 0; iy <= hSegs; iy++) {
      let y = iy * segH - height / 2;
      for (let ix = 0; ix <= wSegs; ix++, i++) {
        let x = ix * segW - width / 2;
        position[i * 3 + u] = x * uDir;
        position[i * 3 + v] = y * vDir;
        position[i * 3 + w] = depth / 2;
        normal[i * 3 + u] = 0;
        normal[i * 3 + v] = 0;
        normal[i * 3 + w] = depth >= 0 ? 1 : -1;
        uv[i * 2] = ix / wSegs;
        uv[i * 2 + 1] = 1 - iy / hSegs;
        if (iy === hSegs || ix === wSegs) continue;
        let a = io + ix + iy * (wSegs + 1);
        let b = io + ix + (iy + 1) * (wSegs + 1);
        let c = io + ix + (iy + 1) * (wSegs + 1) + 1;
        let d = io + ix + iy * (wSegs + 1) + 1;
        index[ii * 6] = a;
        index[ii * 6 + 1] = b;
        index[ii * 6 + 2] = d;
        index[ii * 6 + 3] = b;
        index[ii * 6 + 4] = c;
        index[ii * 6 + 5] = d;
        ii++;
      }
    }
  }
}
class Triangle extends Geometry {
  constructor(gl, { attributes = {} } = {}) {
    Object.assign(attributes, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) }
    });
    super(gl, attributes);
  }
}
const TAPS = 12;
const PIXEL_BUDGET = 45e5;
const cardVertex = `#version 300 es
in vec3 position;
in vec2 uv;
uniform vec4 uRect;
uniform vec2 uResolution;
out vec2 vUv;
out vec2 vLocal;
void main() {
  vUv = uv;
  vLocal = vec2(position.x, -position.y) * uRect.zw;
  vec2 px = uRect.xy + vLocal;
  gl_Position = vec4(px.x / uResolution.x * 2.0 - 1.0, 1.0 - px.y / uResolution.y * 2.0, 0.0, 1.0);
}
`;
const cardFragment = `#version 300 es
precision highp float;
uniform sampler2D tMap;
uniform vec2 uSize;
uniform vec2 uImage;
uniform float uRadius;
uniform float uAlpha;
uniform float uReady;
uniform float uShift;
uniform float uDpr;
uniform vec3 uPlaceholder;
in vec2 vUv;
in vec2 vLocal;
out vec4 fragColor;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float sd = roundedBox(vLocal, uSize * 0.5, min(uRadius, min(uSize.x, uSize.y) * 0.5));
  float mask = clamp(0.5 - sd * uDpr, 0.0, 1.0);
  vec2 local = vLocal / uSize + 0.5;
  float cardAspect = uSize.x / uSize.y;
  float imageAspect = uImage.x / max(uImage.y, 1.0);
  vec2 scale = imageAspect > cardAspect ? vec2(cardAspect / imageAspect, 1.0) : vec2(1.0, imageAspect / cardAspect);
  scale /= 1.08;
  vec2 uv = vec2(local.x, 1.0 - local.y);
  uv = (uv - 0.5) * scale + 0.5;
  uv.x += uShift * (1.0 - scale.x) * 0.5;
  vec3 image = texture(tMap, uv).rgb;
  vec3 color = mix(uPlaceholder, image, uReady);
  float alpha = mask * uAlpha;
  fragColor = vec4(color * alpha, alpha);
}
`;
const lensVertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "FlexCarousel",
  __ssrInlineRender: true,
  props: {
    items: { default: void 0 },
    title: { default: "" },
    description: { default: "" },
    actionLabel: { default: "" },
    actionHref: { default: "" },
    preset: { default: "liquid" },
    intro: { default: "rise" },
    cardHeight: { default: 0.5 },
    gap: { default: 12 },
    radius: { default: 0 },
    fit: { default: "natural" },
    lensWidth: { default: void 0 },
    lensHeight: { default: void 0 },
    tilt: { default: void 0 },
    roundness: { default: void 0 },
    bend: { default: void 0 },
    reach: { default: void 0 },
    curl: { default: void 0 },
    dispersion: { default: void 0 },
    liquid: { default: void 0 },
    followCursor: { type: Boolean, default: void 0 },
    squeeze: { default: 0.2 },
    focusOnClick: { type: Boolean, default: true },
    autoplay: { type: Boolean, default: false },
    interval: { default: 4 },
    captions: { type: Boolean, default: true },
    captureWheel: { type: Boolean, default: true },
    className: { default: "" },
    clickAction: { default: "navigate" },
    showCardButton: { type: Boolean, default: false },
    cardButtonLabel: { default: "" }
  },
  emits: ["change", "select"],
  setup(__props, { emit: __emit }) {
    const photo = (id) => `https://images.unsplash.com/${id}?w=1200&q=80&auto=format&fit=max`;
    const DEFAULT_ITEMS = [
      {
        src: photo("photo-1737071371043-761e02b1ef95"),
        alt: "An iridescent chrome sculpture of a head",
        title: "Iridescence"
      },
      {
        src: photo("photo-1693645325828-62cd35c8da8f"),
        alt: "A person in dark clothes standing in front of a white backdrop",
        title: "White Room"
      },
      { src: photo("photo-1739056238917-d89cd05c48d5"), alt: "A twisted chrome form on black", title: "Liquid Metal" },
      { src: photo("photo-1747191092806-c7da11881986"), alt: "A clay bust shown in profile", title: "Clay Study" },
      { src: photo("photo-1605034313761-73ea4a0cfbf3"), alt: "Black and white low top sneakers", title: "Low Tops" },
      { src: photo("photo-1495462911434-be47104d70fa"), alt: "A woman in a wide black hat", title: "Brim" },
      {
        src: photo("photo-1786835568925-20cd20007ed0"),
        alt: "Three swirling shapes in white, gold and silver on grey",
        title: "Three Forms"
      },
      { src: photo("photo-1770249196550-ff6c641165cb"), alt: "A chrome humanoid sculpture", title: "Automaton" },
      {
        src: photo("photo-1787181875088-087d612262a7"),
        alt: "A black textured sculpture with an opening at its center",
        title: "Obsidian"
      },
      {
        src: photo("photo-1770062422885-2dfcbe8fb65b"),
        alt: "A woman in a white shirt crouching on a dark set",
        title: "Poise"
      },
      { src: photo("photo-1726910133626-9b573eca70ff"), alt: "Black curved shapes stacked like a fan", title: "Fins" },
      { src: photo("photo-1604854574958-59047362c165"), alt: "A white plaster bust on a black table", title: "Plaster" }
    ];
    const BEND_PRESETS = {
      liquid: {
        lensWidth: 0.74,
        lensHeight: 1.18,
        tilt: 62,
        roundness: 1,
        bend: 0.34,
        reach: 0.38,
        curl: "twist",
        dispersion: 0.45,
        liquid: 0,
        followCursor: false
      },
      ribbon: {
        lensWidth: 0.8,
        lensHeight: 0.8,
        tilt: 0,
        roundness: 1,
        bend: 0.34,
        reach: 0.34,
        curl: "twist",
        dispersion: 0.4,
        liquid: 0,
        followCursor: false
      },
      vortex: {
        lensWidth: 0.7,
        lensHeight: 0.95,
        tilt: 30,
        roundness: 1,
        bend: 0.46,
        reach: 0.3,
        curl: "twist",
        dispersion: 0.5,
        liquid: 0,
        followCursor: false
      },
      arch: {
        lensWidth: 0.8,
        lensHeight: 0.8,
        tilt: 0,
        roundness: 1,
        bend: 0.3,
        reach: 0.36,
        curl: "rise",
        dispersion: 0.4,
        liquid: 0,
        followCursor: false
      }
    };
    const FIT_ASPECT = { portrait: 0.75, square: 1, landscape: 4 / 3 };
    const INTRO_DURATION = { rise: 2.1, bloom: 1.6, spin: 2.2, deal: 1.5, fade: 0.35 };
    const wrap = (value, size) => ((value + size / 2) % size + size) % size - size / 2;
    const clamp01 = (value) => Math.min(Math.max(value, 0), 1);
    const easeOut = (value) => 1 - Math.pow(1 - clamp01(value), 3);
    const easeOutQuint = (value) => 1 - Math.pow(1 - clamp01(value), 5);
    const easeInOut = (value) => {
      const t = clamp01(value);
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };
    const lensFragment = `#version 300 es
precision highp float;
uniform sampler2D tScene;
uniform vec2 uResolution;
uniform float uDpr;
uniform vec2 uCenter;
uniform vec2 uHalf;
uniform float uAngle;
uniform float uExponent;
uniform float uInner;
uniform float uOuter;
uniform float uFlow;
uniform float uCurl;
uniform float uDispersion;
uniform float uStrength;
uniform float uSceneAlpha;
out vec4 fragColor;

void main() {
  vec2 frag = gl_FragCoord.xy / uDpr;
  vec2 uv = frag / uResolution;
  vec2 rel = frag - vec2(uCenter.x, uResolution.y - uCenter.y);
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  vec2 local = vec2(ca * rel.x + sa * rel.y, -sa * rel.x + ca * rel.y);
  vec2 k = max(abs(local) / uHalf, vec2(1e-5));
  float nd = pow(pow(k.x, uExponent) + pow(k.y, uExponent), 1.0 / uExponent);
  vec2 grad = pow(k, vec2(uExponent - 1.0)) * sign(local) / uHalf * pow(nd, 1.0 - uExponent);
  float glen = max(length(grad), 1e-6);
  float edge = (nd - 1.0) / glen;
  vec2 outward = grad / glen;
  vec2 normal = vec2(ca * outward.x - sa * outward.y, sa * outward.x + ca * outward.y);
  vec2 along = vec2(-normal.y, normal.x);

  float t = clamp((edge + uInner) / (uInner + uOuter), 0.0, 1.0);
  float ramp = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  float slope = 16.0 * t * t * (1.0 - t) * (1.0 - t);
  float reachX = rel.x / (uResolution.x * 0.5);
  float side = smoothstep(0.02, 0.3, abs(reachX)) * (uCurl == 0.0 ? sign(reachX) : uCurl);
  float lift = ramp * side * uFlow * uStrength;
  vec2 swirl = along * along.y * side * slope * uFlow * uStrength * 0.35;
  vec2 drift = vec2(0.0, -lift) - swirl;
  vec2 shifted = uv + drift / uResolution;

  vec2 texels = uResolution * uDpr;
  vec2 gx = dFdx(shifted);
  vec2 gy = dFdy(shifted);
  gx *= min(1.0, 3.0 / max(length(gx * texels), 1e-4));
  gy *= min(1.0, 3.0 / max(length(gy * texels), 1e-4));

  vec4 color = textureGrad(tScene, shifted, gx, gy);
  vec2 spread = vec2(0.0, side * slope * uFlow * uStrength) / uResolution * uDispersion;
  float spreadPx = length(spread * texels);
  if (color.a > 0.002 && spreadPx > 0.25) {
    vec3 base = color.rgb / color.a;
    vec3 sumColor = vec3(0.0);
    vec3 sumWeight = vec3(0.0);
    for (int i = 0; i < ${TAPS}; i++) {
      float s = (float(i) + 0.5) / float(${TAPS});
      vec4 c = textureGrad(tScene, shifted + spread * (s - 0.5), gx, gy);
      vec3 w = max(1.0 - abs(vec3(s) - vec3(0.15, 0.5, 0.85)) * 2.6, 0.0) * c.a;
      sumColor += c.rgb * (w / max(c.a, 0.002));
      sumWeight += w;
    }
    vec3 split = mix(base, sumColor / max(sumWeight, vec3(1e-4)), clamp(sumWeight * 2.0, 0.0, 1.0));
    color.rgb = mix(color.rgb, clamp(split, 0.0, 1.0) * color.a, smoothstep(0.25, 1.5, spreadPx));
  }

  fragColor = color * uSceneAlpha;
}
`;
    const Digits = defineComponent({
      props: { value: { type: Number, required: true } },
      setup(p) {
        return () => h(
          "span",
          { class: "inline-flex" },
          String(p.value).padStart(2, "0").split("").map(
            (digit, index) => h("span", { key: index, class: "inline-block h-[1em] overflow-hidden" }, [
              h(
                "span",
                {
                  class: "flex flex-col transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                  style: { transform: `translateY(${-Number(digit) * 10}%)` }
                },
                "0123456789".split("").map((n) => h("span", { key: n, class: "h-[1em]" }, n))
              )
            ])
          )
        );
      }
    });
    const props = __props;
    const emit = __emit;
    const containerRef = ref(null);
    const active2 = ref(0);
    const revealed = ref(false);
    const focusOpen = ref(false);
    const modalOpen = ref(false);
    const modalIndex = ref(0);
    const list = computed(() => props.items && props.items.length ? props.items : DEFAULT_ITEMS);
    const itemsKey = computed(() => list.value.map((item) => item.src).join("|"));
    let settings = null;
    let engine = null;
    const pick = (key) => {
      const value = props[key];
      const base = BEND_PRESETS[props.preset] || BEND_PRESETS.liquid;
      return value === void 0 || value === null ? base[key] : value;
    };
    watch(
      () => ({ ...props }),
      () => {
        settings = {
          intro: props.intro,
          cardHeight: props.cardHeight,
          gap: props.gap,
          radius: props.radius,
          fit: props.fit,
          lensWidth: pick("lensWidth"),
          lensHeight: pick("lensHeight"),
          tilt: pick("tilt"),
          roundness: pick("roundness"),
          bend: pick("bend"),
          reach: pick("reach"),
          curl: pick("curl"),
          dispersion: pick("dispersion"),
          liquid: pick("liquid"),
          followCursor: pick("followCursor"),
          squeeze: props.squeeze,
          focusOnClick: props.focusOnClick && !props.showCardButton,
          autoplay: props.autoplay,
          interval: props.interval,
          captureWheel: props.captureWheel
        };
        engine == null ? void 0 : engine.resize();
        engine == null ? void 0 : engine.wake();
      },
      { immediate: true }
    );
    watch(itemsKey, () => engine == null ? void 0 : engine.setItems(list.value));
    let disposeScene;
    const mountScene = () => {
      var _a, _b;
      const container = containerRef.value;
      if (!container) return;
      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, 2),
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false
      });
      const gl = renderer.gl;
      if (!renderer.isWebgl2) {
        (_a = gl.getExtension("WEBGL_lose_context")) == null ? void 0 : _a.loseContext();
        return;
      }
      gl.clearColor(0, 0, 0, 0);
      const canvas = gl.canvas;
      canvas.style.display = "block";
      canvas.style.position = "absolute";
      canvas.style.insetInline = "0";
      canvas.style.top = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.setAttribute("aria-hidden", "true");
      container.prepend(canvas);
      const cardProgram = new Program(gl, {
        vertex: cardVertex,
        fragment: cardFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        uniforms: {
          tMap: { value: new Texture(gl) },
          uRect: { value: [0, 0, 1, 1] },
          uResolution: { value: [1, 1] },
          uSize: { value: [1, 1] },
          uImage: { value: [1, 1] },
          uRadius: { value: 16 },
          uAlpha: { value: 1 },
          uReady: { value: 0 },
          uShift: { value: 0 },
          uDpr: { value: 1 },
          uPlaceholder: { value: [0.5, 0.5, 0.5] }
        }
      });
      cardProgram.setBlendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const cardMesh = new Mesh(gl, { geometry: new Plane(gl), program: cardProgram });
      const target = new RenderTarget(gl, {
        width: 2,
        height: 2,
        depth: false,
        minFilter: gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR
      });
      const hitPixel = new Uint8Array(4);
      const isRenderedCardPixel = (x, y) => {
        const px = Math.floor(x * renderer.dpr);
        const py = target.height - 1 - Math.floor(y * renderer.dpr);
        if (px < 0 || py < 0 || px >= target.width || py >= target.height) return false;
        renderer.bindFramebuffer(target);
        gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, hitPixel);
        renderer.bindFramebuffer();
        return hitPixel[3] > 0;
      };
      const lensUniforms = {
        tScene: { value: target.texture },
        uResolution: { value: [1, 1] },
        uDpr: { value: 1 },
        uCenter: { value: [0, 0] },
        uHalf: { value: [1, 1] },
        uAngle: { value: 0 },
        uExponent: { value: 2 },
        uInner: { value: 60 },
        uOuter: { value: 80 },
        uFlow: { value: 0 },
        uCurl: { value: 0 },
        uDispersion: { value: 0 },
        uStrength: { value: 0 },
        uSceneAlpha: { value: 0 }
      };
      const lensMesh = new Mesh(gl, {
        geometry: new Triangle(gl),
        program: new Program(gl, {
          vertex: lensVertex,
          fragment: lensFragment,
          uniforms: lensUniforms,
          depthTest: false,
          depthWrite: false
        })
      });
      const reducedMotion = ((_b = window.matchMedia) == null ? void 0 : _b.call(window, "(prefers-reduced-motion: reduce)").matches) ?? false;
      const anisotropy = renderer.getExtension("EXT_texture_filter_anisotropic") ? 8 : 0;
      let slots = [];
      let width = 1;
      let height = 1;
      let pos = 0;
      let vel = 0;
      let goal = 0;
      let mode = "spring";
      let wheelAt = 0;
      let raf = 0;
      let last = performance.now();
      let visible = true;
      let alive = true;
      let dirty = true;
      let activeIndex = -1;
      let interactedAt = -Infinity;
      let autoplayAt = performance.now();
      let hasFocus = false;
      let deform = 0;
      let deformVel = 0;
      let layout = null;
      let resnap = false;
      let hover = "";
      let lift = 1;
      let energy = 0;
      let lastPos = 0;
      const lens = { x: 0, y: 0, vx: 0, vy: 0, ready: false };
      const pointer = {
        x: 0,
        y: 0,
        over: false,
        down: false,
        id: -1,
        startX: 0,
        startY: 0,
        startPos: 0,
        dragging: false,
        touch: false,
        samples: []
      };
      const introState = { kind: "none", t: 0, running: false, done: false, readyAt: 0 };
      const focus = { index: -1, pending: -1, t: 0, v: 0, target: 0 };
      let instances = [];
      const start = () => {
        if (raf || !visible || !alive) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };
      const loadSlot = (item, index) => {
        const texture = new Texture(gl, {
          generateMipmaps: true,
          minFilter: gl.LINEAR_MIPMAP_LINEAR,
          magFilter: gl.LINEAR,
          anisotropy
        });
        const slot = {
          item,
          index,
          texture,
          aspect: 0.8,
          loaded: false,
          failed: false,
          ready: 0,
          color: [0.5, 0.5, 0.5],
          image: [1, 1],
          dispose: () => {
          }
        };
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.decoding = "async";
        image.onload = () => {
          if (!alive || !slots.includes(slot)) return;
          texture.image = image;
          texture.update();
          slot.image = [image.naturalWidth || 1, image.naturalHeight || 1];
          slot.aspect = slot.image[0] / slot.image[1];
          try {
            const probe = document.createElement("canvas");
            probe.width = 8;
            probe.height = 8;
            const ctx = probe.getContext("2d", { willReadFrequently: true });
            if (ctx) {
              ctx.drawImage(image, 0, 0, 8, 8);
              const data = ctx.getImageData(0, 0, 8, 8).data;
              const avg = [0, 0, 0];
              for (let i = 0; i < data.length; i += 4) {
                avg[0] += data[i];
                avg[1] += data[i + 1];
                avg[2] += data[i + 2];
              }
              slot.color = avg.map((v) => v / 64 / 255);
            }
          } catch {
            slot.color = [0.5, 0.5, 0.5];
          }
          slot.loaded = true;
          dirty = true;
          start();
        };
        image.onerror = () => {
          if (!alive) return;
          slot.failed = true;
          dirty = true;
          start();
        };
        image.src = item.src;
        slot.dispose = () => {
          image.onload = null;
          image.onerror = null;
          gl.deleteTexture(texture.texture);
        };
        return slot;
      };
      const setItems = (next) => {
        slots.forEach((slot) => slot.dispose());
        slots = next.map(loadSlot);
        activeIndex = -1;
        layout = null;
        resnap = true;
        focus.target = 0;
        focus.t = 0;
        focus.v = 0;
        focus.pending = -1;
        focusOpen.value = false;
        introState.readyAt = performance.now();
        dirty = true;
        start();
      };
      const metrics = (s) => {
        const cardH = Math.max(24, s.cardHeight * height);
        const fixed = FIT_ASPECT[s.fit];
        const widths = slots.map((slot) => (fixed || slot.aspect) * cardH);
        const centers = [];
        let cursor = 0;
        for (let i = 0; i < widths.length; i++) {
          centers.push(cursor + widths[i] / 2);
          cursor += widths[i] + s.gap;
        }
        return { cardH, widths, centers, gap: s.gap, loop: Math.max(cursor, 1) };
      };
      const nearest = (m, at) => {
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < m.centers.length; i++) {
          const dist = Math.abs(wrap(m.centers[i] - at, m.loop));
          if (dist < bestDist) {
            bestDist = dist;
            best = i;
          }
        }
        return best;
      };
      const snapPoint = (m, at) => {
        const i = nearest(m, at);
        return at + wrap(m.centers[i] - at, m.loop);
      };
      const remap = (from, to, at) => {
        const i = nearest(from, at);
        const offset = wrap(at - from.centers[i], from.loop);
        const cycles = Math.round((at - offset - from.centers[i]) / from.loop);
        return cycles * to.loop + to.centers[i] + offset * (to.widths[i] / from.widths[i]);
      };
      const step = (m, delta) => {
        let at = snapPoint(m, goal);
        let index = nearest(m, at);
        const n = m.centers.length;
        for (let k = 0; k < Math.abs(delta); k++) {
          const next = (index + (delta > 0 ? 1 : n - 1)) % n;
          const distance2 = delta > 0 ? m.widths[index] / 2 + m.gap + m.widths[next] / 2 : -(m.widths[next] / 2 + m.gap + m.widths[index] / 2);
          at += distance2;
          index = next;
        }
        goal = at;
        mode = "spring";
        dirty = true;
        start();
      };
      const goTo = (m, index) => {
        const i = (index % m.centers.length + m.centers.length) % m.centers.length;
        goal = goal + wrap(m.centers[i] - goal, m.loop);
        mode = "spring";
        dirty = true;
        start();
      };
      const openFocus = (index) => {
        focus.index = index;
        focus.pending = -1;
        focus.target = 1;
        focusOpen.value = true;
        dirty = true;
        start();
      };
      const closeFocus = () => {
        focus.pending = -1;
        if (focus.target === 0) return false;
        focus.target = 0;
        focusOpen.value = false;
        dirty = true;
        start();
        return true;
      };
      const skipIntro = () => {
        if (introState.running) introState.t = 1;
      };
      const introEffects = () => {
        const t = introState.running ? introState.t : introState.done ? 1 : 0;
        const e = { sceneAlpha: 1, strength: 1, card: null };
        if (!introState.done && !introState.running) {
          e.sceneAlpha = 0;
          e.strength = 0;
          return e;
        }
        if (t >= 1) return e;
        const kind = introState.kind;
        if (kind === "rise") {
          e.strength = easeInOut((t - 0.3) / 0.65);
          e.card = (rel) => {
            const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.34;
            const local = clamp01((t - delay) / 0.6);
            return {
              alpha: clamp01(local * 4),
              x: 0,
              y: (1 - easeOutQuint(local)) * height * 0.62,
              scale: 0.5 + 0.5 * easeInOut((local - 0.18) / 0.82)
            };
          };
        } else if (kind === "bloom") {
          e.strength = easeInOut((t - 0.2) / 0.8);
          e.card = (rel) => {
            const delay = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.25;
            const local = easeOut((t - delay) / 0.55);
            return { alpha: local, x: 0, y: 0, scale: 0.92 + 0.08 * local };
          };
        } else if (kind === "spin") {
          e.sceneAlpha = easeOut(t / 0.25);
          e.strength = easeOut((t - 0.55) / 0.45);
        } else if (kind === "deal") {
          e.strength = easeOut((t - 0.45) / 0.5);
          e.card = (rel) => {
            const spread = Math.min(Math.abs(rel) / (width * 0.6), 1) * 0.3;
            const local = easeOut((t - 0.12 - spread) / 0.5);
            return { alpha: easeOut((t - spread) / 0.12), x: -rel * (1 - local), y: 0, scale: 1 };
          };
        } else {
          e.sceneAlpha = easeOut(t);
          e.strength = easeOut(t);
        }
        return e;
      };
      const beginIntro = (s, m) => {
        const kind = reducedMotion && s.intro !== "none" ? "fade" : s.intro;
        introState.kind = INTRO_DURATION[kind] ? kind : "none";
        introState.running = introState.kind !== "none";
        introState.done = !introState.running;
        introState.t = 0;
        if (introState.done) revealed.value = true;
        if (introState.kind === "spin") {
          const distance2 = m.loop * 1.6 + width;
          pos = goal + distance2;
          vel = -distance2 * 3;
          mode = "spring";
        }
      };
      const resize = () => {
        width = Math.max(1, container.clientWidth);
        height = Math.max(1, container.clientHeight);
        const cardFraction = Math.min(Math.max((settings == null ? void 0 : settings.cardHeight) ?? props.cardHeight, 0.05), 1);
        const canvasOffset = Math.max(0, height * (1 - cardFraction) / 2 - 24);
        canvas.style.top = `${-canvasOffset}px`;
        container.style.setProperty("--flex-canvas-offset", `${canvasOffset}px`);
        renderer.dpr = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(PIXEL_BUDGET / (width * height)));
        renderer.setSize(width, height);
        target.setSize(Math.max(2, Math.round(width * renderer.dpr)), Math.max(2, Math.round(height * renderer.dpr)));
        lensUniforms.tScene.value = target.texture;
        dirty = true;
        start();
      };
      const frame = (now) => {
        raf = 0;
        if (!alive) return;
        const s = settings;
        const dt = Math.min(0.05, Math.max(1e-3, (now - last) / 1e3));
        last = now;
        if (!s || !slots.length) {
          if (visible) raf = requestAnimationFrame(frame);
          return;
        }
        const m = metrics(s);
        const n = slots.length;
        let animating = false;
        if (resnap) {
          goal = snapPoint(m, goal);
          pos = goal;
          vel = 0;
          resnap = false;
        } else if (layout && layout.loop !== m.loop) {
          pos = remap(layout, m, pos);
          goal = remap(layout, m, goal);
          pointer.startPos = pos + (pointer.x - pointer.startX);
          animating = true;
        }
        layout = m;
        if (!introState.running && !introState.done) {
          const allSettled = slots.every((slot) => slot.loaded || slot.failed);
          if (allSettled || now - introState.readyAt > 3500) {
            goal = snapPoint(m, goal);
            pos = goal;
            beginIntro(s, m);
          }
        }
        if (introState.running) {
          introState.t = Math.min(1, introState.t + dt / (INTRO_DURATION[introState.kind] || 1));
          if (introState.t >= 1) {
            introState.running = false;
            introState.done = true;
            revealed.value = true;
          }
          animating = true;
        }
        if (mode === "wheel" && now - wheelAt > 150) {
          goal = snapPoint(m, goal);
          mode = "spring";
        }
        if (!pointer.dragging) {
          const spinning = introState.running && introState.kind === "spin";
          const stiffness = spinning ? 9 : mode === "wheel" ? 80 : 55;
          const damping = 2 * Math.sqrt(stiffness);
          const steps = Math.ceil(dt / (1 / 240));
          const hstep = dt / steps;
          for (let i = 0; i < steps; i++) {
            const acc = stiffness * (goal - pos) - damping * vel;
            vel += acc * hstep;
            pos += vel * hstep;
          }
          if (Math.abs(goal - pos) < 0.05 && Math.abs(vel) < 0.5) {
            pos = goal;
            vel = 0;
          } else {
            animating = true;
          }
        } else {
          animating = true;
        }
        if (Math.abs(pos) > m.loop * 8) {
          const shift = Math.round(pos / m.loop) * m.loop;
          pos -= shift;
          goal -= shift;
          pointer.startPos -= shift;
        }
        const current2 = nearest(m, pos);
        if (current2 !== activeIndex) {
          activeIndex = current2;
          active2.value = current2;
          emit("change", current2, list.value[current2]);
        }
        if (focus.pending >= 0 && mode === "spring" && Math.abs(goal - pos) < 1.5 && Math.abs(vel) < 30) {
          if (current2 === focus.pending) openFocus(current2);
          else focus.pending = -1;
        }
        if (s.autoplay && !reducedMotion && introState.done && focus.target === 0 && focus.t < 0.01 && !pointer.over && !pointer.down && !hasFocus && mode === "spring" && Math.abs(goal - pos) < 1 && now - interactedAt > 3e3 && now - autoplayAt > s.interval * 1e3) {
          autoplayAt = now;
          step(m, 1);
        }
        if (s.autoplay && !reducedMotion) animating = true;
        const travel = Math.abs(pos - lastPos) / dt;
        lastPos = pos;
        const energyTarget = reducedMotion ? 0 : Math.min(travel / 2600, 1);
        energy += (energyTarget - energy) * (1 - Math.exp(-dt / (energyTarget > energy ? 0.07 : 0.35)));
        if (energy > 1e-3) animating = true;
        const liquidAmount = reducedMotion ? 0 : s.liquid;
        const push = Math.max(-1, Math.min(1, vel / 2200));
        const deformStiffness = 120;
        const deformDamping = 2 * Math.sqrt(deformStiffness) * 0.32;
        deformVel += (deformStiffness * (push - deform) - deformDamping * deformVel) * dt;
        deform += deformVel * dt;
        if (Math.abs(deform) > 5e-4 || Math.abs(deformVel) > 5e-3) animating = true;
        const focusStiffness = 64;
        focus.v += (focusStiffness * (focus.target - focus.t) - 2 * Math.sqrt(focusStiffness) * focus.v) * dt;
        focus.t += focus.v * dt;
        if (Math.abs(focus.target - focus.t) < 5e-4 && Math.abs(focus.v) < 1e-3) {
          focus.t = focus.target;
          focus.v = 0;
        } else {
          animating = true;
        }
        const focusAmount = clamp01(focus.t);
        const focusEase = easeInOut(focusAmount);
        const focusW = focus.index >= 0 && focus.index < n ? m.widths[focus.index] : m.cardH;
        const focusScale = Math.max(1, Math.min(1.3, height * 0.84 / m.cardH, width * 0.92 / focusW));
        const nextLift = 1 + (focusScale - 1) * focusEase;
        if (Math.abs(nextLift - lift) > 5e-4) {
          lift = nextLift;
          container.style.setProperty("--flex-carousel-lift", lift.toFixed(4));
        }
        const effects = introEffects();
        const homeX = width / 2;
        const homeY = height / 2;
        const follow = s.followCursor && pointer.over && !pointer.dragging && !pointer.touch && focus.target === 0;
        const aimX = follow ? pointer.x : homeX;
        const aimY = follow ? pointer.y : homeY;
        if (!lens.ready) {
          lens.x = homeX;
          lens.y = homeY;
          lens.ready = true;
        }
        const lensK = 110;
        const lensC = 2 * Math.sqrt(lensK) * 0.8;
        lens.vx += (lensK * (aimX - lens.x) - lensC * lens.vx) * dt;
        lens.vy += (lensK * (aimY - lens.y) - lensC * lens.vy) * dt;
        lens.x += lens.vx * dt;
        lens.y += lens.vy * dt;
        if (Math.abs(aimX - lens.x) + Math.abs(aimY - lens.y) > 0.2 || Math.abs(lens.vx) + Math.abs(lens.vy) > 0.5)
          animating = true;
        const cardH = m.cardH;
        let halfW = s.lensWidth * width / 2;
        let halfH = s.lensHeight * width / 2;
        const squash = Math.abs(deform) * liquidAmount;
        halfW *= 1 + squash * 0.16;
        halfH *= 1 - squash * 0.08;
        const lensX = lens.x - deform * 14 * liquidAmount;
        for (let i = 0; i < n; i++) {
          const slot = slots[i];
          if (slot.loaded && slot.ready < 1) {
            slot.ready = Math.min(1, slot.ready + dt / 0.45);
            animating = true;
          }
        }
        const waiting = !introState.done;
        if (dirty || animating || pointer.dragging) {
          dirty = false;
          instances = [];
          const dpr = renderer.dpr;
          cardProgram.uniforms.uResolution.value = [width, height];
          cardProgram.uniforms.uDpr.value = dpr;
          cardProgram.uniforms.uRadius.value = s.radius;
          const shrink = 1 - clamp01(s.squeeze) * energy;
          const draws = [];
          for (let i = 0; i < n; i++) {
            const w = m.widths[i];
            const baseRel = wrap(m.centers[i] - pos, m.loop);
            for (let k = -3; k <= 3; k++) {
              const rel = baseRel + k * m.loop;
              if (Math.abs(rel) - w / 2 > width + 40) continue;
              const fx = effects.card ? effects.card(rel) : null;
              let x = homeX + rel + (fx ? fx.x : 0);
              let scale2 = shrink * (fx ? fx.scale : 1);
              let alpha = fx ? fx.alpha : 1;
              if (focusAmount > 0) {
                if (i === focus.index && Math.abs(rel) < w) {
                  scale2 *= 1 + (focusScale - 1) * focusEase;
                } else {
                  const order = Math.min(Math.abs(rel) / width, 1) * 0.25;
                  const part = easeInOut(focusAmount * 1.25 - order);
                  x += Math.sign(rel) * part * width * 0.7;
                  alpha *= 1 - part;
                }
              }
              const cw = w * scale2;
              if (alpha <= 1e-3 || x + cw / 2 < -40 || x - cw / 2 > width + 40) continue;
              draws.push({ i, rel, x, y: homeY + (fx ? fx.y : 0), cw, ch: cardH * scale2, alpha });
            }
          }
          draws.sort((a, b) => Math.abs(b.rel) - Math.abs(a.rel));
          let first = true;
          for (const draw of draws) {
            const slot = slots[draw.i];
            cardProgram.uniforms.tMap.value = slot.texture;
            cardProgram.uniforms.uRect.value = [draw.x, draw.y, draw.cw + 2, draw.ch + 2];
            cardProgram.uniforms.uSize.value = [draw.cw, draw.ch];
            cardProgram.uniforms.uImage.value = slot.image;
            cardProgram.uniforms.uAlpha.value = draw.alpha;
            cardProgram.uniforms.uReady.value = slot.ready;
            cardProgram.uniforms.uShift.value = reducedMotion ? 0 : Math.max(-1, Math.min(1, draw.rel / (width * 0.75)));
            cardProgram.uniforms.uPlaceholder.value = slot.color;
            renderer.render({ scene: cardMesh, target, clear: first });
            first = false;
            instances.push({
              index: draw.i,
              x0: draw.x - draw.cw / 2,
              x1: draw.x + draw.cw / 2,
              y0: draw.y - draw.ch / 2,
              y1: draw.y + draw.ch / 2
            });
          }
          if (first) {
            renderer.bindFramebuffer(target);
            gl.viewport(0, 0, target.width, target.height);
            gl.clear(gl.COLOR_BUFFER_BIT);
          }
          renderer.bindFramebuffer();
          target.texture.bind();
          gl.generateMipmap(gl.TEXTURE_2D);
          lensUniforms.uResolution.value = [width, height];
          lensUniforms.uDpr.value = dpr;
          lensUniforms.uCenter.value = [lensX, lens.y];
          lensUniforms.uHalf.value = [Math.max(halfW, 1), Math.max(halfH, 1)];
          lensUniforms.uAngle.value = s.tilt * Math.PI / 180;
          lensUniforms.uExponent.value = 2 + Math.pow(1 - clamp01(s.roundness), 1.5) * 10;
          const spanW = Math.max(halfW, 1);
          const spanH = Math.max(halfH, 1);
          const inner = Math.max(4, s.reach * (spanW + spanH) * 0.5);
          lensUniforms.uInner.value = inner;
          lensUniforms.uOuter.value = inner * 1.6;
          lensUniforms.uFlow.value = s.bend * (spanW + spanH) * 0.45;
          lensUniforms.uCurl.value = s.curl === "rise" ? 1 : s.curl === "fall" ? -1 : 0;
          lensUniforms.uDispersion.value = s.dispersion * 0.12 * (1 + Math.abs(deform) * liquidAmount * 1.2);
          lensUniforms.uStrength.value = effects.strength * (1 - focusEase);
          lensUniforms.uSceneAlpha.value = effects.sceneAlpha;
          renderer.render({ scene: lensMesh });
        }
        let nextHover = "";
        if (pointer.over && !pointer.dragging && introState.done && s.focusOnClick) {
          const hit = instances.find(
            (inst) => pointer.x >= inst.x0 && pointer.x <= inst.x1 && pointer.y >= inst.y0 && pointer.y <= inst.y1
          );
          if (focus.target > 0) nextHover = "close";
          else if (hit) nextHover = "open";
        }
        if (nextHover !== hover) {
          hover = nextHover;
          if (hover) container.setAttribute("data-hover", hover);
          else container.removeAttribute("data-hover");
        }
        if (visible && (animating || waiting || dirty || pointer.down)) raf = requestAnimationFrame(frame);
      };
      const localPoint = (e) => {
        const rect = canvas.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
      };
      const onPointerDown = (e) => {
        if (e.button !== void 0 && e.button > 0) return;
        const target2 = e.target;
        if (target2 !== container && target2 !== canvas) return;
        skipIntro();
        const [x, y] = localPoint(e);
        pointer.down = true;
        pointer.id = e.pointerId;
        pointer.touch = e.pointerType === "touch";
        pointer.startX = x;
        pointer.startY = y;
        pointer.x = x;
        pointer.y = y;
        pointer.startPos = pos;
        pointer.dragging = false;
        pointer.samples = [{ x, t: performance.now() }];
        interactedAt = performance.now();
        if (Math.abs(vel) > 40) {
          goal = pos;
          vel = 0;
        }
        dirty = true;
        start();
      };
      const onPointerMove = (e) => {
        const [x, y] = localPoint(e);
        pointer.x = x;
        pointer.y = y;
        pointer.over = true;
        if (pointer.down && e.pointerId === pointer.id) {
          const dx = x - pointer.startX;
          const dy = y - pointer.startY;
          const slop = pointer.touch ? 10 : 5;
          if (!pointer.dragging) {
            if (pointer.touch && Math.abs(dy) > slop && Math.abs(dy) > Math.abs(dx)) {
              pointer.down = false;
              return;
            }
            if (Math.abs(dx) > slop) {
              pointer.dragging = true;
              pointer.startX = x;
              pointer.startPos = pos;
              closeFocus();
              try {
                container.setPointerCapture(e.pointerId);
              } catch {
                pointer.dragging = true;
              }
              container.setAttribute("data-dragging", "");
            }
          }
          if (pointer.dragging) {
            pos = pointer.startPos - (x - pointer.startX);
            goal = pos;
            vel = 0;
            const now = performance.now();
            pointer.samples.push({ x, t: now });
            while (pointer.samples.length > 2 && now - pointer.samples[0].t > 100) pointer.samples.shift();
          }
        }
        dirty = true;
        start();
      };
      const onPointerUp = (e) => {
        if (!pointer.down || e.pointerId !== pointer.id) return;
        const target2 = e.target;
        if (target2 !== container && target2 !== canvas) return;
        pointer.down = false;
        container.removeAttribute("data-dragging");
        const s = settings;
        if (!s) return;
        const m = metrics(s);
        interactedAt = performance.now();
        if (pointer.dragging) {
          pointer.dragging = false;
          const now = performance.now();
          const first = pointer.samples[0];
          const lastSample = pointer.samples[pointer.samples.length - 1];
          let velocity = 0;
          if (first && lastSample && lastSample.t > first.t && now - lastSample.t < 70) {
            velocity = -((lastSample.x - first.x) / (lastSample.t - first.t)) * 1e3;
          }
          vel = velocity;
          const landing = snapPoint(m, pos + velocity * 0.32);
          goal = landing;
          if (Math.abs(velocity) > 400 && Math.abs(landing - pos) < 1) step(m, velocity > 0 ? 1 : -1);
          mode = "spring";
          start();
          return;
        }
        const [x, y] = localPoint(e);
        const hit = instances.find((inst) => x >= inst.x0 && x <= inst.x1 && y >= inst.y0 && y <= inst.y1);
        const selectedItem = hit ? list.value[hit.index] : void 0;
        if (selectedItem) {
          emit("select", hit.index, selectedItem);
          if (props.clickAction === "modal") {
            openModal(hit.index);
            return;
          }
          if (selectedItem.href) {
            window.location.assign(selectedItem.href);
            return;
          }
        }
        if (closeFocus() || !hit) return;
        if (hit.index === activeIndex && Math.abs(goal - pos) < 2) {
          emit("select", hit.index, list.value[hit.index]);
          if (s.focusOnClick) openFocus(hit.index);
        } else {
          const rel = (hit.x0 + hit.x1) / 2 - width / 2;
          goal = snapPoint(m, pos + rel);
          mode = "spring";
          if (s.focusOnClick) focus.pending = hit.index;
          start();
        }
      };
      const onPointerLeave = () => {
        pointer.over = false;
        dirty = true;
        start();
      };
      const onPointerCancel = () => {
        pointer.down = false;
        pointer.dragging = false;
        container.removeAttribute("data-dragging");
        if (!settings) return;
        goal = snapPoint(metrics(settings), pos);
        mode = "spring";
        start();
      };
      const onWheel = (e) => {
        const s = settings;
        if (!s || e.ctrlKey || !s.captureWheel) return;
        const [pointerX, pointerY] = localPoint(e);
        if (!isRenderedCardPixel(pointerX, pointerY)) return;
        let dx = e.deltaX;
        let dy = e.deltaY;
        if (e.shiftKey && Math.abs(dx) < Math.abs(dy)) {
          dx = dy;
          dy = 0;
        }
        const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? height : 1;
        const horizontal = Math.abs(dx) > Math.abs(dy);
        e.preventDefault();
        skipIntro();
        interactedAt = performance.now();
        if (closeFocus()) return;
        const delta = Math.max(-120, Math.min(120, (horizontal ? dx : dy) * unit));
        goal += delta * 1.25;
        mode = "wheel";
        wheelAt = performance.now();
        start();
      };
      const onKeyDown = (e) => {
        const s = settings;
        if (!s) return;
        const m = metrics(s);
        if (e.key === "ArrowRight") {
          e.preventDefault();
          skipIntro();
          closeFocus();
          interactedAt = performance.now();
          step(m, 1);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          skipIntro();
          closeFocus();
          interactedAt = performance.now();
          step(m, -1);
        } else if (e.key === "Home") {
          e.preventDefault();
          closeFocus();
          goTo(m, 0);
        } else if (e.key === "End") {
          e.preventDefault();
          closeFocus();
          goTo(m, slots.length - 1);
        } else if (e.key === "Escape") {
          if (closeFocus()) e.preventDefault();
        } else if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (activeIndex < 0) return;
          const selectedItem = list.value[activeIndex];
          emit("select", activeIndex, selectedItem);
          if (selectedItem) {
            if (props.clickAction === "modal") {
              openModal(activeIndex);
              return;
            }
            if (selectedItem.href) {
              window.location.assign(selectedItem.href);
              return;
            }
          }
          if (closeFocus()) return;
          if (s.focusOnClick) openFocus(activeIndex);
        }
      };
      const onFocus = () => {
        hasFocus = true;
      };
      const onBlur = () => {
        hasFocus = false;
      };
      const onVisibility = () => {
        if (!document.hidden) start();
      };
      container.addEventListener("pointerdown", onPointerDown);
      container.addEventListener("pointermove", onPointerMove);
      container.addEventListener("pointerup", onPointerUp);
      container.addEventListener("pointerleave", onPointerLeave);
      container.addEventListener("pointercancel", onPointerCancel);
      container.addEventListener("wheel", onWheel, { passive: false });
      container.addEventListener("keydown", onKeyDown);
      container.addEventListener("focus", onFocus);
      container.addEventListener("blur", onBlur);
      document.addEventListener("visibilitychange", onVisibility);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      const intersectionObserver = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        start();
      });
      intersectionObserver.observe(container);
      engine = {
        wake: () => {
          dirty = true;
          start();
        },
        resize,
        setItems
      };
      resize();
      setItems(list.value);
      disposeScene = () => {
        var _a2;
        alive = false;
        visible = false;
        engine = null;
        cancelAnimationFrame(raf);
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        container.removeEventListener("pointerdown", onPointerDown);
        container.removeEventListener("pointermove", onPointerMove);
        container.removeEventListener("pointerup", onPointerUp);
        container.removeEventListener("pointerleave", onPointerLeave);
        container.removeEventListener("pointercancel", onPointerCancel);
        container.removeEventListener("wheel", onWheel);
        container.removeEventListener("keydown", onKeyDown);
        container.removeEventListener("focus", onFocus);
        container.removeEventListener("blur", onBlur);
        document.removeEventListener("visibilitychange", onVisibility);
        slots.forEach((slot) => slot.dispose());
        slots = [];
        (_a2 = gl.getExtension("WEBGL_lose_context")) == null ? void 0 : _a2.loseContext();
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      };
    };
    onMounted(mountScene);
    onBeforeUnmount(() => disposeScene == null ? void 0 : disposeScene());
    const current = computed(() => list.value[active2.value] || list.value[0]);
    const label = computed(
      () => current.value ? current.value.title || current.value.alt || `Image ${active2.value + 1}` : ""
    );
    const half = computed(() => `${Math.min(Math.max(props.cardHeight, 0.05), 1) * 50}%`);
    const modalItem = computed(() => list.value[modalIndex.value] || list.value[0]);
    const openModal = (index = active2.value) => {
      modalIndex.value = (index % list.value.length + list.value.length) % list.value.length;
      modalOpen.value = true;
    };
    const closeModal = () => {
      modalOpen.value = false;
    };
    const prevModalItem = () => {
      modalIndex.value = (modalIndex.value - 1 + list.value.length) % list.value.length;
    };
    const nextModalItem = () => {
      modalIndex.value = (modalIndex.value + 1) % list.value.length;
    };
    let docKeyListener = null;
    watch(modalOpen, (open) => {
      if (open) {
        docKeyListener = (e) => {
          if (e.key === "Escape") closeModal();
          else if (e.key === "ArrowLeft") prevModalItem();
          else if (e.key === "ArrowRight") nextModalItem();
        };
        document.addEventListener("keydown", docKeyListener);
      } else if (docKeyListener) {
        document.removeEventListener("keydown", docKeyListener);
        docKeyListener = null;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "w-full py-28 lg:py-32" }, _attrs))}><div class="container"><div class="space-y-4">`);
      if (__props.title) {
        _push(`<h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.description) {
        _push(`<p class="text-muted-foreground max-w-md leading-snug">${ssrInterpolate(__props.description)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.actionLabel && __props.actionHref) {
        _push(`<a${ssrRenderAttr("href", __props.actionHref)} class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-md !text-foreground !no-underline">${ssrInterpolate(__props.actionLabel)} <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"></path></svg></a>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="relative mt-8 w-full max-w-full overflow-x-clip overflow-y-visible md:mt-12 lg:mt-20"><div class="${ssrRenderClass([__props.className, "relative min-h-[550px] w-full max-w-full overflow-x-clip overflow-y-visible outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(128,128,140,0.55)] overscroll-auto touch-pan-y cursor-grab data-[dragging]:cursor-grabbing data-[hover=close]:cursor-zoom-out data-[hover=open]:cursor-zoom-in select-none [-webkit-tap-highlight-color:transparent] sm:min-h-[650px]"])}" style="${ssrRenderStyle({ "--flex-carousel-half": half.value })}" role="region" aria-roledescription="carousel"${ssrRenderAttr("aria-label", __props.title || "Image carousel")} tabindex="0">`);
      if (__props.captions && current.value && revealed.value) {
        _push(`<div class="absolute inset-x-0 flex flex-col top-[calc(50%_+_var(--flex-carousel-half)_*_var(--flex-carousel-lift,1)_+_22px_-_var(--flex-canvas-offset))] items-center gap-1.5 px-4 text-center animate-[flex-carousel-reveal_900ms_ease_both] motion-reduce:animate-none pointer-events-none" aria-hidden="true"><span class="flex flex-col items-center max-w-full font-medium text-[15px] leading-[1.35] animate-[flex-carousel-title_520ms_cubic-bezier(0.22,1,0.36,1)] motion-reduce:animate-none">${ssrInterpolate(current.value.title || current.value.alt)} `);
        if (current.value.subtitle) {
          _push(`<span class="opacity-60 font-normal">${ssrInterpolate(current.value.subtitle)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span><span class="inline-flex items-center gap-[3px] opacity-50 data-[hidden]:opacity-0 tabular-nums text-[12px] leading-none transition-opacity duration-[400ms]"${ssrRenderAttr("data-hidden", focusOpen.value ? "" : void 0)}>`);
        _push(ssrRenderComponent(unref(Digits), {
          value: active2.value + 1
        }, null, _parent));
        _push(`<span class="opacity-60">/</span><span>${ssrInterpolate(String(list.value.length).padStart(2, "0"))}</span></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="sr-only" aria-live="polite" aria-atomic="true">${ssrInterpolate(`${label.value}, ${active2.value + 1} of ${list.value.length}`)}</div>`);
      if (__props.showCardButton && ((_a = current.value) == null ? void 0 : _a.href)) {
        _push(`<div class="pointer-events-none absolute inset-0 z-10" style="${ssrRenderStyle({ "--flex-card-half": `${Math.min(Math.max(__props.cardHeight, 0.05), 1) * 50}%` })}">`);
        _push(ssrRenderComponent(ProjectComponent2, {
          tag: "a",
          color: "dark",
          size: "lg",
          class: "pointer-events-auto absolute left-1/2 top-[calc(50%_+_var(--flex-card-half)_-_4.5rem_-_var(--flex-canvas-offset))] -translate-x-1/2 backdrop-blur-md",
          href: current.value.href,
          "icon-position": "after"
        }, {
          icon: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"${_scopeId}><path d="M7 17 17 7M7 7h10v10"${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "size-4",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  "stroke-width": "2",
                  "aria-hidden": "true"
                }, [
                  createVNode("path", { d: "M7 17 17 7M7 7h10v10" })
                ]))
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(current.value.actionLabel || __props.cardButtonLabel || "Discover")} `);
            } else {
              return [
                createTextVNode(toDisplayString(current.value.actionLabel || __props.cardButtonLabel || "Discover") + " ", 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (modalOpen.value && modalItem.value) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" aria-modal="true" role="dialog" aria-label="Image gallery"><div class="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true"></div><div class="relative z-10 flex w-full max-w-3xl items-center gap-4">`);
          if (list.value.length > 1) {
            _push2(`<button class="z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-xl hover:bg-black transition-colors" aria-label="Previous image">‹</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="flex-1 flex flex-col items-center gap-4 px-2 text-center"><button class="absolute right-0 top-0 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/25 bg-black/75 text-white shadow-xl hover:bg-black transition-colors" aria-label="Close gallery">×</button><img${ssrRenderAttr("src", modalItem.value.src)}${ssrRenderAttr("alt", modalItem.value.alt || "")} class="w-full max-w-md max-h-[70vh] rounded-2xl border border-white/10 bg-white/5 shadow-2xl object-contain animate-[flex-carousel-modal-fade_500ms_ease_both]"><h3 class="text-xl font-bold text-white">${ssrInterpolate(modalItem.value.title)}</h3>`);
          if (modalItem.value.subtitle) {
            _push2(`<p class="text-slate-300 text-sm leading-relaxed max-w-md">${ssrInterpolate(modalItem.value.subtitle)}</p>`);
          } else {
            _push2(`<!---->`);
          }
          if (modalItem.value.href) {
            _push2(ssrRenderComponent(ProjectComponent2, {
              tag: "a",
              color: "dark",
              href: modalItem.value.href,
              class: "mt-3",
              "icon-position": "after"
            }, {
              icon: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"${_scopeId}><path d="M7 17 17 7M7 7h10v10"${_scopeId}></path></svg>`);
                } else {
                  return [
                    (openBlock(), createBlock("svg", {
                      class: "size-4",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      "stroke-width": "2",
                      "aria-hidden": "true"
                    }, [
                      createVNode("path", { d: "M7 17 17 7M7 7h10v10" })
                    ]))
                  ];
                }
              }),
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(modalItem.value.actionLabel || __props.cardButtonLabel || "Discover")} `);
                } else {
                  return [
                    createTextVNode(toDisplayString(modalItem.value.actionLabel || __props.cardButtonLabel || "Discover") + " ", 1)
                  ];
                }
              }),
              _: 1
            }, _parent));
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div>`);
          if (list.value.length > 1) {
            _push2(`<button class="z-20 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-black/70 text-white shadow-xl hover:bg-black transition-colors" aria-label="Next image">›</button>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`</section>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/FlexCarousel.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const footerImage = "/assets/feluqa-footer-white-transteinted.DeFKKwcJ.png";
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "MainlineCta",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    actionLabel: {},
    actionHref: {},
    navigation: {},
    legalLabel: {},
    legalHref: {},
    logoAlt: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "flex flex-col items-center gap-14 pt-28 lg:pt-32" }, _attrs))}><div class="container space-y-3 text-center"><h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h2><p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">${ssrInterpolate(__props.description)}</p><div><a${ssrRenderAttr("href", __props.actionHref)} class="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium !text-primary-foreground !no-underline">${ssrInterpolate(__props.actionLabel)}</a></div></div><nav class="container flex flex-col items-center gap-4"><ul class="flex list-none flex-wrap items-center justify-center gap-6 p-0"><!--[-->`);
      ssrRenderList(__props.navigation, (item) => {
        _push(`<li><a${ssrRenderAttr("href", item.href)}${ssrRenderAttr("target", item.external ? "_blank" : void 0)}${ssrRenderAttr("rel", item.external ? "noreferrer" : void 0)} class="flex items-center gap-0.5 font-medium !text-foreground !no-underline transition-opacity hover:opacity-75">${ssrInterpolate(item.name)} `);
        if (item.external) {
          _push(`<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</a></li>`);
      });
      _push(`<!--]--></ul><ul class="flex list-none items-center justify-center p-0"><li><a${ssrRenderAttr("href", __props.legalHref)} class="text-muted-foreground text-sm !no-underline transition-opacity hover:opacity-75">${ssrInterpolate(__props.legalLabel)}</a></li></ul></nav><div class="text-primary mt-10 w-full md:mt-14 lg:mt-20"><img${ssrRenderAttr("src", unref(footerImage))}${ssrRenderAttr("alt", __props.logoAlt)} class="w-full"></div></footer>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineCta.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "MainlineFaq",
  __ssrInlineRender: true,
  props: {
    title: {},
    lead: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-28 lg:py-32" }, _attrs))}><div class="container max-w-5xl"><div class="mx-auto grid gap-16 lg:grid-cols-2"><div class="space-y-4"><h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h2><p class="text-muted-foreground max-w-md leading-snug lg:mx-auto">${ssrInterpolate(__props.lead)}</p></div><div class="grid gap-6 text-start"><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<details class="group w-full border-b border-border"><summary class="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium marker:hidden">${ssrInterpolate(item.question)} <span class="text-muted-foreground transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p class="text-muted-foreground pb-4 leading-relaxed">${ssrInterpolate(item.answer)}</p></details>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineFaq.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const triageImage = "/assets/triage-card.DDsMKxsO.svg";
const cycleImage = "/assets/cycle-card.B-nTDUfR.svg";
const overviewImage = "/assets/overview-card.DVJOEHXY.svg";
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "MainlineGuideBlocks",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    description: {},
    items: {}
  },
  setup(__props) {
    const props = __props;
    const images = {
      "triage-card": triageImage,
      "cycle-card": cycleImage,
      "overview-card": overviewImage
    };
    const items = computed(() => props.items.map((item) => ({ ...item, src: images[item.image] })));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "feature-modern-teams",
        class: "pb-28 lg:pb-32"
      }, _attrs))}><div class="container"><div class="relative flex items-center justify-center"><div class="text-muted-foreground relative h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]" aria-hidden="true"></div>`);
      if (__props.eyebrow) {
        _push(`<span class="bg-muted text-muted-foreground absolute px-3 font-mono text-sm font-medium tracking-wide max-md:hidden">${ssrInterpolate(__props.eyebrow)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="mx-auto mt-10 grid max-w-4xl items-center gap-3 md:gap-0 lg:mt-24 lg:grid-cols-2"><h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h2><p class="text-muted-foreground leading-snug">${ssrInterpolate(__props.description)}</p></div><div class="bg-card text-card-foreground mt-8 overflow-hidden rounded-3xl border shadow-sm md:mt-12 lg:mt-20"><div class="flex max-md:flex-col"><!--[-->`);
      ssrRenderList(items.value, (item, index) => {
        _push(`<article class="flex flex-1 max-md:flex-col"><div class="flex-1 p-4 pe-0! md:p-6"><div class="relative aspect-[1.28/1] overflow-hidden"><img${ssrRenderAttr("src", item.src)}${ssrRenderAttr("alt", `${item.title} interface`)} class="absolute inset-0 size-full object-cover object-left-top ps-4 pt-2"><div class="from-background absolute inset-0 z-10 bg-gradient-to-t via-transparent to-transparent"></div></div><div class="flex flex-col gap-3 pe-4 pt-4 md:pe-6 md:pt-6"><div><h3 class="font-display !text-2xl !leading-tight !font-bold !tracking-tight">${ssrInterpolate(item.title)}</h3><p class="text-muted-foreground mt-2 text-sm leading-relaxed">${ssrInterpolate(item.description)}</p></div><div class="flex flex-wrap gap-x-4 gap-y-2"><!--[-->`);
        ssrRenderList(item.links, (link2) => {
          _push(`<a${ssrRenderAttr("href", link2.href)} class="inline-flex items-center gap-1 text-sm font-medium !text-foreground !no-underline hover:text-primary">${ssrInterpolate(link2.label)} <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"></path></svg></a>`);
        });
        _push(`<!--]--></div></div></div>`);
        if (index < items.value.length - 1) {
          _push(`<div class="relative hidden md:block"><div class="absolute inset-y-0 left-0 w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (index < items.value.length - 1) {
          _push(`<div class="relative block md:hidden"><div class="h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineGuideBlocks.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const heroImage = "/assets/hero.B1LXw1YC.webp";
const vertexShader = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;
const fragmentShader = `precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform float iSpeed;
uniform vec3 iRayColor1;
uniform vec3 iRayColor2;
uniform float iIntensity;
uniform float iSpread;
uniform float iFlipX;
uniform float iFlipY;
uniform float iTilt;
uniform float iSaturation;
uniform float iBlend;
uniform float iFalloff;
uniform float iOpacity;

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  float cosAngle = dot(normalize(sourceToCoord), rayRefDirection);
  return clamp(
    (0.45 + 0.15 * sin(cosAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-cosAngle * seedB + iTime * speed)),
    0.0, 1.0) *
    clamp((iResolution.x - length(sourceToCoord)) / iResolution.x, 0.5, 1.0);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  if (iFlipX > 0.5) fragCoord.x = iResolution.x - fragCoord.x;
  if (iFlipY > 0.5) fragCoord.y = iResolution.y - fragCoord.y;

  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 rayPos = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);

  float tiltRad = iTilt * 3.14159265 / 180.0;
  float cs = cos(tiltRad);
  float sn = sin(tiltRad);
  vec2 rel = coord - rayPos;
  vec2 tiltedCoord = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + rayPos;

  float halfSpread = iSpread * 0.275;
  vec2 rayRefDir1 = normalize(vec2(cos(0.785398 + halfSpread), sin(0.785398 + halfSpread)));
  vec2 rayRefDir2 = normalize(vec2(cos(0.785398 - halfSpread), sin(0.785398 - halfSpread)));

  vec4 rays1 = vec4(iRayColor1, 1.0) * rayStrength(rayPos, rayRefDir1, tiltedCoord, 36.2214, 21.11349, iSpeed);
  vec4 rays2 = vec4(iRayColor2, 1.0) * rayStrength(rayPos, rayRefDir2, tiltedCoord, 22.3991, 18.0234, iSpeed * 0.2);
  vec4 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;

  float distanceToLight = length(fragCoord.xy - vec2(rayPos.x, iResolution.y - rayPos.y)) / iResolution.y;
  float brightness = iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  color.rgb *= brightness;

  float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
  color.rgb = mix(vec3(gray), color.rgb, iSaturation);
  color.a = max(color.r, max(color.g, color.b)) * iOpacity;
  gl_FragColor = color;
}`;
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "SideRays",
  __ssrInlineRender: true,
  props: {
    speed: { default: 2.5 },
    rayColor1: { default: "var(--vp-c-brand-1)" },
    rayColor2: { default: "var(--vp-c-brand-2)" },
    intensity: { default: 2 },
    spread: { default: 2 },
    origin: { default: "top-right" },
    tilt: { default: 0 },
    saturation: { default: 1.5 },
    blend: { default: 0.75 },
    falloff: { default: 1.6 },
    opacity: { default: 0.48 },
    className: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const containerRef = ref(null);
    const uniformsRef = shallowRef(null);
    const rendererRef = shallowRef(null);
    const meshRef = shallowRef(null);
    const animationFrame = ref(null);
    const isVisible = ref(false);
    const rayColor1 = ref([1, 1, 1]);
    const rayColor2 = ref([1, 1, 1]);
    let intersectionObserver;
    let themeObserver;
    let motionPreference;
    let resizeObserver;
    let motionPreferenceChange;
    let isUnmounted = false;
    function resolveCssColor(color) {
      if (typeof document === "undefined") return [1, 1, 1];
      const probe = document.createElement("span");
      probe.style.color = color;
      probe.setAttribute("aria-hidden", "true");
      probe.style.position = "fixed";
      probe.style.visibility = "hidden";
      document.body.append(probe);
      const resolvedColor = getComputedStyle(probe).color;
      probe.remove();
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return [1, 1, 1];
      context.fillStyle = "#ffffff";
      context.fillStyle = resolvedColor;
      context.fillRect(0, 0, 1, 1);
      const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
      return [red / 255, green / 255, blue / 255];
    }
    function updateThemeColors() {
      rayColor1.value = resolveCssColor(props.rayColor1);
      rayColor2.value = resolveCssColor(props.rayColor2);
      if (uniformsRef.value) {
        uniformsRef.value.iRayColor1.value = rayColor1.value;
        uniformsRef.value.iRayColor2.value = rayColor2.value;
      }
    }
    function originFlip(origin) {
      switch (origin) {
        case "top-left":
          return [1, 0];
        case "bottom-right":
          return [0, 1];
        case "bottom-left":
          return [1, 1];
        default:
          return [0, 0];
      }
    }
    function updateSize() {
      const renderer = rendererRef.value;
      const container = containerRef.value;
      const uniforms = uniformsRef.value;
      if (!renderer || !container || !uniforms) return;
      renderer.dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.iResolution.value = [container.clientWidth * renderer.dpr, container.clientHeight * renderer.dpr];
    }
    function renderFrame(time) {
      const renderer = rendererRef.value;
      const mesh = meshRef.value;
      const uniforms = uniformsRef.value;
      if (!renderer || !mesh || !uniforms || !isVisible.value || isUnmounted) return;
      uniforms.iTime.value = time * 1e-3;
      renderer.render({ scene: mesh });
      if (!(motionPreference == null ? void 0 : motionPreference.matches)) animationFrame.value = requestAnimationFrame(renderFrame);
    }
    function stopAnimation() {
      if (animationFrame.value !== null) cancelAnimationFrame(animationFrame.value);
      animationFrame.value = null;
    }
    function initializeWebGL() {
      var _a, _b;
      const container = containerRef.value;
      if (!container || rendererRef.value || isUnmounted) return;
      try {
        const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true });
        rendererRef.value = renderer;
        const canvas = renderer.gl.canvas;
        canvas.style.position = "absolute";
        canvas.style.inset = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        container.replaceChildren(canvas);
        const [flipX, flipY] = originFlip(props.origin);
        const uniforms = {
          iTime: { value: 0 },
          iResolution: { value: [1, 1] },
          iSpeed: { value: props.speed },
          iRayColor1: { value: rayColor1.value },
          iRayColor2: { value: rayColor2.value },
          iIntensity: { value: props.intensity },
          iSpread: { value: props.spread },
          iFlipX: { value: flipX },
          iFlipY: { value: flipY },
          iTilt: { value: props.tilt },
          iSaturation: { value: props.saturation },
          iBlend: { value: props.blend },
          iFalloff: { value: props.falloff },
          iOpacity: { value: props.opacity }
        };
        uniformsRef.value = uniforms;
        const mesh = new Mesh(renderer.gl, {
          geometry: new Triangle(renderer.gl),
          program: new Program(renderer.gl, { vertex: vertexShader, fragment: fragmentShader, uniforms })
        });
        meshRef.value = mesh;
        updateSize();
        resizeObserver = new ResizeObserver(updateSize);
        resizeObserver.observe(container);
        renderFrame(0);
      } catch (error) {
        console.error("Failed to initialize the SideRays effect:", error);
        (_b = (_a = rendererRef.value) == null ? void 0 : _a.gl.getExtension("WEBGL_lose_context")) == null ? void 0 : _b.loseContext();
        rendererRef.value = null;
        container.replaceChildren();
      }
    }
    watch(isVisible, (visible) => {
      if (!visible) {
        stopAnimation();
        return;
      }
      if (!rendererRef.value) initializeWebGL();
      else if (!(motionPreference == null ? void 0 : motionPreference.matches)) renderFrame(performance.now());
    });
    watch(() => [props.speed, props.intensity, props.spread, props.origin, props.tilt, props.saturation, props.blend, props.falloff, props.opacity], () => {
      const uniforms = uniformsRef.value;
      if (!uniforms) return;
      uniforms.iSpeed.value = props.speed;
      uniforms.iIntensity.value = props.intensity;
      uniforms.iSpread.value = props.spread;
      [uniforms.iFlipX.value, uniforms.iFlipY.value] = originFlip(props.origin);
      uniforms.iTilt.value = props.tilt;
      uniforms.iSaturation.value = props.saturation;
      uniforms.iBlend.value = props.blend;
      uniforms.iFalloff.value = props.falloff;
      uniforms.iOpacity.value = props.opacity;
    });
    watch(() => [props.rayColor1, props.rayColor2], updateThemeColors);
    onMounted(() => {
      updateThemeColors();
      motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
      motionPreferenceChange = () => {
        stopAnimation();
        if (isVisible.value && !(motionPreference == null ? void 0 : motionPreference.matches)) renderFrame(performance.now());
      };
      motionPreference.addEventListener("change", motionPreferenceChange);
      themeObserver = new MutationObserver(updateThemeColors);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
      intersectionObserver = new IntersectionObserver(([entry]) => {
        isVisible.value = entry.isIntersecting;
      }, { threshold: 0.1, rootMargin: "50px" });
      if (containerRef.value) intersectionObserver.observe(containerRef.value);
    });
    onBeforeUnmount(() => {
      var _a, _b;
      isUnmounted = true;
      stopAnimation();
      intersectionObserver == null ? void 0 : intersectionObserver.disconnect();
      themeObserver == null ? void 0 : themeObserver.disconnect();
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      if (motionPreferenceChange) motionPreference == null ? void 0 : motionPreference.removeEventListener("change", motionPreferenceChange);
      (_b = (_a = rendererRef.value) == null ? void 0 : _a.gl.getExtension("WEBGL_lose_context")) == null ? void 0 : _b.loseContext();
      rendererRef.value = null;
      uniformsRef.value = null;
      meshRef.value = null;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "containerRef",
        ref: containerRef,
        class: ["relative h-full w-full overflow-hidden pointer-events-none", __props.className],
        "aria-hidden": "true"
      }, _attrs))}></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/SideRays.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "MainlineHero",
  __ssrInlineRender: true,
  props: {
    title: {},
    lead: {},
    primaryLabel: {},
    primaryHref: {},
    secondaryLabel: {},
    secondaryHref: {},
    heroAlt: {},
    points: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative isolate py-28 lg:py-32 lg:pt-44" }, _attrs))}><div class="docs-home__rays pointer-events-none absolute inset-x-0 top-0 z-0 h-[440px] overflow-hidden md:h-[500px] lg:h-[600px]" aria-hidden="true">`);
      _push(ssrRenderComponent(_sfc_main$8, {
        speed: 2.5,
        "ray-color1": "var(--vp-c-brand-1)",
        "ray-color2": "var(--vp-c-brand-2)",
        intensity: 2,
        spread: 2,
        origin: "top-right",
        tilt: 0,
        saturation: 1.5,
        blend: 0.75,
        falloff: 1.6,
        opacity: 0.48
      }, null, _parent));
      _push(`</div><div class="container relative z-10 flex flex-col justify-between gap-8 md:gap-14 lg:flex-row lg:gap-20"><div class="box-border min-w-0 flex-1"><h1 class="docs-home__hero-title text-foreground max-w-160 text-balance !text-3xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h1><p class="docs-home__hero-lead text-muted-foreground mt-5 text-xl md:text-3xl">${ssrInterpolate(__props.lead)}</p><div class="mt-8 flex flex-wrap items-center gap-4 lg:flex-nowrap">`);
      _push(ssrRenderComponent(ProjectComponent2, {
        tag: "a",
        href: __props.primaryHref,
        color: "primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.primaryLabel)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.primaryLabel), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(ProjectComponent2, {
        tag: "a",
        href: __props.secondaryHref,
        color: "gray",
        outlined: "",
        "icon-position": "after"
      }, {
        icon: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg class="size-4 shrink-0" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"${_scopeId}><path d="M5 12h14m-6-6 6 6-6 6"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                class: "size-4 shrink-0",
                "aria-hidden": "true",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round"
              }, [
                createVNode("path", { d: "M5 12h14m-6-6 6 6-6 6" })
              ]))
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.secondaryLabel)} `);
          } else {
            return [
              createTextVNode(toDisplayString(__props.secondaryLabel) + " ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="relative box-border flex min-w-0 flex-1 flex-col justify-center pt-10 lg:pt-0"><div class="absolute top-0 left-0 hidden h-full w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground lg:block" aria-hidden="true"></div><div class="absolute top-0 left-0 block h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)] text-muted-foreground lg:hidden" aria-hidden="true"></div><div class="space-y-5 lg:pl-10"><!--[-->`);
      ssrRenderList(__props.points, (point) => {
        _push(`<div class="flex gap-3 lg:gap-5"><svg class="text-foreground mt-1 size-4 shrink-0 lg:size-5" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg><div><h2 class="text-foreground !text-base !font-semibold !leading-6">${ssrInterpolate(point.title)}</h2><p class="text-muted-foreground max-w-xs text-sm leading-relaxed">${ssrInterpolate(point.description)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div><div class="relative z-10 mt-12 max-lg:ml-6 max-lg:h-[550px] max-lg:overflow-hidden md:mt-20 lg:container lg:mt-24"><div class="relative h-[793px] w-full overflow-hidden rounded-2xl shadow-lg max-lg:rounded-tr-none"><img${ssrRenderAttr("src", unref(heroImage))}${ssrRenderAttr("alt", __props.heroAlt)} class="h-full w-full object-cover object-left-top"></div></div></section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineHero.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "docs-home" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineHomeLayout.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const ProjectComponent8 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender]]);
const arc = "/assets/arc.rSzwGWti.svg";
const descript = "data:image/svg+xml,%3csvg%20width='112'%20height='27'%20viewBox='0%200%20112%2027'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_68_63)'%3e%3cpath%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M47.969%2012.838C48.287%2011.347%2049.314%2010.588%2050.665%2010.588C52.003%2010.588%2052.982%2011.381%2053.295%2012.838H47.969ZM50.738%208.006C47.3%208.006%2045.161%2010.66%2045.161%2013.907C45.161%2017.27%2047.446%2019.764%2050.843%2019.764C53.185%2019.764%2054.606%2018.717%2055.485%2017.399L53.3%2016.05C52.75%2016.776%2051.87%2017.16%2050.928%2017.16C49.385%2017.16%2048.352%2016.462%2048%2015.066H53.772L53.77%2015.072L55.874%2015.084C55.954%2014.716%2056.001%2014.337%2056.001%2013.908C56.001%2011.08%2054.198%208.007%2050.739%208.007L50.738%208.006ZM37.484%2017.111C35.585%2017.111%2034.444%2015.75%2034.444%2014.071C34.444%2012.391%2035.607%2011.03%2037.484%2011.03C39.36%2011.03%2040.524%2012.391%2040.524%2014.07C40.524%2015.75%2039.382%2017.111%2037.484%2017.111ZM40.524%209.925C39.71%208.965%2038.555%208.377%2037.122%208.377C33.917%208.377%2031.612%2010.927%2031.612%2014.071C31.612%2017.215%2033.896%2019.764%2037.122%2019.764C38.555%2019.764%2039.71%2019.176%2040.523%2018.216V19.484H43.355V4.388H40.523L40.524%209.925ZM64.478%2013.65C65.269%2014.19%2065.771%2015.003%2065.771%2016.074C65.771%2018.24%2064.281%2019.742%2061.493%2019.742C58.87%2019.742%2057.463%2018.426%2056.903%2017.097L59.311%2015.721C59.311%2015.721%2059.635%2017.157%2061.45%2017.157C62.573%2017.157%2062.919%2016.671%2062.919%2016.242C62.919%2016.042%2062.854%2015.677%2062.055%2015.367C60.449%2014.746%2057.345%2014.467%2057.345%2011.633C57.345%209.313%2059.202%208.076%2061.493%208.076C63.635%208.076%2065.011%209.381%2065.533%2010.396L63.178%2011.744C63.178%2011.744%2062.725%2010.617%2061.515%2010.617C60.305%2010.617%2060.197%2011.302%2060.197%2011.501C60.197%2012.081%2060.801%2012.319%2062.098%2012.694C62.866%2012.916%2063.655%2013.118%2064.48%2013.647L64.478%2013.65ZM112%2011.124H109.558V15.72C109.558%2017.156%20110.984%2016.847%20112%2016.847V19.432C112%2019.432%20111.465%2019.52%20110.531%2019.52C108.457%2019.52%20106.771%2018.901%20106.771%2015.72V11.124H104.891V8.384H106.771V5.291H109.558V8.384H112V11.124ZM72.7%2016.957C73.857%2016.957%2074.746%2016.393%2075.196%2015.467L77.612%2016.884C76.665%2018.582%2074.901%2019.763%2072.7%2019.763C69.362%2019.763%2067.029%2017.152%2067.029%2013.93C67.029%2010.709%2069.384%208.097%2072.7%208.097C74.869%208.097%2076.626%209.259%2077.583%2010.934L75.172%2012.384C74.714%2011.47%2073.832%2010.904%2072.7%2010.904C71.014%2010.904%2069.816%2012.258%2069.816%2013.93C69.816%2015.602%2071.003%2016.957%2072.7%2016.957ZM98.21%2017.447C96.38%2017.447%2095.279%2016.05%2095.279%2014.326C95.279%2012.602%2096.401%2011.206%2098.21%2011.206C100.019%2011.206%20101.141%2012.602%20101.141%2014.326C101.141%2016.05%20100.041%2017.447%2098.21%2017.447ZM98.559%208.482C101.649%208.482%20103.871%2011.099%20103.871%2014.326C103.871%2017.553%20101.67%2020.169%2098.559%2020.169C97.177%2020.169%2096.064%2019.566%2095.279%2018.581V24.286H92.549V8.792H95.279V10.071C96.064%209.086%2097.177%208.482%2098.559%208.482ZM87.301%2019.882V8.815H90.031V19.882H87.301ZM82.214%2010.705C82.741%209.364%2083.814%208.597%2085.43%208.593V11.781C83.535%2011.593%2082.166%2012.579%2082.216%2014.907L82.214%2014.902V19.882H79.484V8.815H82.214V10.705ZM87.301%207.338V4.388H90.121V7.338H87.301ZM0%2024.567C0%2026.043%200.942001%2027%202.394%2027H9.388C13.56%2027%2016.974%2025.565%2019.294%2023.053H0V24.567ZM9.388%200H2.394C0.942001%200%200%200.957001%200%202.433V3.947H19.294C16.974%201.435%2013.56%200%209.388%200ZM15.492%2017.347C15.492%2018.541%2016.257%2019.316%2017.437%2019.316H21.627C22.103%2018.117%2022.422%2016.8%2022.57%2015.379H17.437C16.257%2015.379%2015.492%2016.153%2015.492%2017.347ZM9.682%209.663C9.682%2010.857%2010.448%2011.631%2011.628%2011.631H22.57C22.4375%2010.2818%2022.1205%208.9571%2021.628%207.694H11.628C10.448%207.694%209.682%208.469%209.682%209.663ZM11.626%2017.347C11.626%2016.153%2010.861%2015.379%209.681%2015.379H0V19.316H9.681C10.861%2019.316%2011.626%2018.541%2011.626%2017.347ZM5.817%209.663C5.817%208.469%205.052%207.694%203.872%207.694H0V11.631H3.872C5.052%2011.631%205.817%2010.857%205.817%209.663Z'%20fill='black'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_68_63'%3e%3crect%20width='112'%20height='27'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const mercury = "/assets/mercury.BXBh3IbR.svg";
const monzo = "data:image/svg+xml,%3csvg%20width='104'%20height='19'%20viewBox='0%200%20104%2019'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_68_75)'%3e%3cpath%20d='M0%2018.52V0.479978H4.645V2.89798C5.10303%202.03361%205.79327%201.31428%206.638%200.820977C7.47083%200.335411%208.42591%200.100028%209.389%200.142978C10.3788%200.112533%2011.3566%200.366947%2012.206%200.875978C13.0674%201.39375%2013.7679%202.14093%2014.229%203.03398C16.049%201.04998%2017.445%200.143977%2019.623%200.143977C23.553%200.143977%2025.763%202.42598%2025.763%206.62798V18.52H20.759V8.74498C20.759%206.22498%2020.24%205.08198%2018.323%205.08198C16.374%205.08198%2015.334%206.32498%2015.334%208.74498V18.52H10.3V8.74498C10.3%206.22498%209.78%205.08198%207.863%205.08198C5.914%205.08198%204.874%206.32498%204.874%208.74498V18.52H0ZM31.688%202.82998C32.9487%201.50496%2034.5785%200.589366%2036.366%200.201978C38.142%20-0.178284%2039.9918%20-0.00733334%2041.668%200.691978C43.364%201.40339%2044.8102%202.60285%2045.823%204.13798C46.8539%205.6967%2047.4161%207.51838%2047.443%209.38698C47.4771%2010.6423%2047.2612%2011.8918%2046.808%2013.063C46.3595%2014.2241%2045.6805%2015.2824%2044.812%2016.174C43.9583%2017.0822%2042.926%2017.804%2041.78%2018.294C40.6442%2018.7787%2039.4188%2019.0183%2038.184%2018.997C36.9467%2019.0314%2035.7172%2018.7909%2034.584%2018.293C33.4394%2017.7893%2032.4179%2017.0431%2031.59%2016.106C29.922%2014.325%2029%2011.934%2029.023%209.45298C29.0178%208.22325%2029.2508%207.00416%2029.709%205.86298C30.1628%204.73165%2030.8353%203.70097%2031.688%202.82998ZM38.218%2013.953C39.077%2013.991%2039.928%2013.761%2040.66%2013.294C41.3983%2012.8204%2041.979%2012.1377%2042.328%2011.333C42.5933%2010.7241%2042.7233%2010.0649%2042.709%209.40086C42.6946%208.73684%2042.5363%208.08385%2042.245%207.48698C41.9571%206.89687%2041.5414%206.3783%2041.028%205.96898C40.5221%205.565%2039.9302%205.28242%2039.298%205.14298C38.4561%204.95792%2037.5776%205.03791%2036.783%205.37198C35.9793%205.71146%2035.2963%206.28501%2034.823%207.01798C34.3418%207.76269%2034.0878%208.63135%2034.092%209.51798C34.082%2010.09%2034.18%2010.658%2034.382%2011.19C34.582%2011.722%2034.884%2012.208%2035.267%2012.62C35.65%2013.032%2036.107%2013.362%2036.614%2013.59C37.1182%2013.8184%2037.6646%2013.9419%2038.218%2013.953ZM50.706%2018.52V0.479978H55.578L55.514%202.89898C56.0148%202.01342%2056.751%201.28381%2057.641%200.790978C58.5186%200.306119%2059.5163%200.081669%2060.517%200.143977C64.123%200.143977%2066.461%202.49498%2066.461%206.62798V18.52H61.329V8.74498C61.329%206.22498%2060.809%205.08198%2058.827%205.08198C56.813%205.08198%2055.741%206.32498%2055.741%208.74498V18.52H50.706ZM88.242%202.82798C89.5026%201.50195%2091.1329%200.585618%2092.921%200.197978C94.6976%20-0.182702%2096.5482%20-0.0117453%2098.225%200.687978C99.9211%201.39913%20101.367%202.59865%20102.38%204.13398C103.41%205.69314%20103.972%207.51528%20103.997%209.38398C104.03%2010.6392%20103.815%2011.8887%20103.362%2013.06C102.913%2014.221%20102.234%2015.2793%20101.366%2016.171C100.512%2017.0792%2099.4793%2017.8009%2098.333%2018.291C97.1974%2018.7753%2095.9724%2019.0148%2094.738%2018.994C93.5004%2019.0284%2092.2705%2018.788%2091.137%2018.29C89.9927%2017.786%2088.9712%2017.0398%2088.143%2016.103C86.475%2014.322%2085.553%2011.932%2085.576%209.45098C85.5709%208.22126%2085.8039%207.00219%2086.262%205.86098C86.7153%204.72966%2087.3875%203.69896%2088.24%202.82798H88.242ZM94.772%2013.951C95.6348%2013.9875%2096.4879%2013.757%2097.215%2013.291C97.9533%2012.8173%2098.5339%2012.1347%2098.883%2011.33C99.2366%2010.515%2099.3467%209.61514%2099.2%208.73898C99.0561%207.86732%2098.6593%207.05713%2098.059%206.40898C97.4696%205.77104%2096.6997%205.32801%2095.852%205.13898C95.01%204.95384%2094.1314%205.03419%2093.337%205.36898C92.5335%205.7089%2091.8509%206.28279%2091.378%207.01598C90.8971%207.76083%2090.6432%208.6294%2090.647%209.51598C90.637%2010.088%2090.735%2010.656%2090.937%2011.188C91.138%2011.72%2091.439%2012.206%2091.822%2012.618C92.205%2013.03%2092.663%2013.359%2093.169%2013.588C93.6732%2013.8163%2094.2186%2013.9398%2094.772%2013.951ZM70.202%2018.521V14.757L77.382%205.14398H70.202V0.477979H83.164V4.74598L76.829%2013.852H83.294V18.519H70.203L70.202%2018.521Z'%20fill='black'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_68_75'%3e%3crect%20width='104'%20height='19'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const perplexity = "/assets/perplexity.cq0rRDvr.svg";
const ramp = "data:image/svg+xml,%3csvg%20width='105'%20height='28'%20viewBox='0%200%20105%2028'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_68_67)'%3e%3cpath%20d='M7.249%209.464C4.75%209.464%203.524%2011.671%203.524%2014.618V22.003H0V6.419H3.462V10.462H3.522C4.262%207.976%205.735%205.967%208.007%205.967C9.606%205.967%2010.28%206.527%2010.28%206.527L8.69%209.737C8.69%209.737%208.183%209.464%207.249%209.464ZM49.845%2011.604V22H46.413V12.87C46.413%2010.248%2045.593%208.86%2043.497%208.86C41.327%208.86%2040.277%2010.616%2040.277%2013.984V22H36.875V12.869C36.875%2010.349%2036.065%208.859%2033.99%208.859C31.622%208.859%2030.71%2010.939%2030.71%2013.983V22H27.248V6.419H30.71V9.948H30.741C31.281%207.505%2032.752%205.998%2035.236%205.998C37.699%205.998%2039.304%207.325%2039.913%209.677C40.493%207.413%2042.036%205.997%2044.408%205.997C47.718%205.997%2049.846%208.077%2049.846%2011.603L49.845%2011.604ZM17.205%205.967C14.02%205.967%2011.935%207.467%2010.985%2010.173L13.917%2011.242C14.452%209.609%2015.567%208.679%2017.267%208.679C19.181%208.679%2020.305%209.524%2020.305%2010.819C20.305%2012.145%2019.41%2012.422%2017.389%2012.749C15.141%2013.112%209.794%2013.231%209.794%2017.752C9.794%2020.4%2012.004%2022.393%2015.323%2022.393C17.818%2022.393%2019.517%2021.371%2020.303%2019.469H20.334V22H23.767V12.416C23.765%208.223%2021.66%205.967%2017.205%205.967ZM20.395%2014.667C20.395%2017.934%2018.781%2020.033%2016.203%2020.033C14.38%2020.033%2013.287%2019.007%2013.287%2017.529C13.287%2016.143%2014.411%2015.18%2016.567%2014.784C18.773%2014.378%2019.884%2013.876%2020.394%2012.674V14.666L20.395%2014.667ZM62.056%205.997C59.43%205.997%2057.696%207.444%2056.953%209.617V6.419H53.307V28H56.922V18.804H56.952C57.757%2021.158%2059.432%2022.453%2062.056%2022.453C66.216%2022.453%2069.194%2019.017%2069.194%2014.163C69.192%209.343%2066.216%205.997%2062.056%205.997ZM61.159%2019.56C58.277%2019.56%2056.679%2017.465%2056.679%2014.21C56.679%2010.955%2058.467%208.86%2061.159%208.86C63.849%208.86%2065.639%2011.057%2065.639%2014.21C65.639%2017.365%2063.851%2019.56%2061.159%2019.56ZM105%2021.93V22.028L90.892%2022.033V21.931C92.927%2020.779%2094.331%2019.606%2095.594%2018.381H101.387L105%2021.93ZM101.504%203.516L97.928%200H97.825C97.825%200%2097.885%206.552%2091.881%2012.51C86.006%2018.342%2079.097%2018.356%2079.097%2018.356V18.458L82.74%2022.035C82.74%2022.035%2089.548%2022.102%2095.562%2016.189C101.555%2010.297%20101.504%203.516%20101.504%203.516Z'%20fill='black'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_68_67'%3e%3crect%20width='105'%20height='28'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const raycast = "/assets/raycast.8uH0_nHi.svg";
const retool = "data:image/svg+xml,%3csvg%20width='114'%20height='22'%20viewBox='0%200%20114%2022'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_68_71)'%3e%3cpath%20d='M48.54%2021.539H44.385L35.306%2012.308H33.614V21.538H30.536V0H40.846C45.186%200%2047.771%202.308%2047.771%206.154C47.771%2010%2045.186%2012.308%2040.846%2012.308H39.307L48.54%2021.539ZM44.693%206.154C44.693%203.969%2043.463%202.615%2040.846%202.615H33.614V9.692H40.846C43.462%209.692%2044.693%208.338%2044.693%206.154ZM56.42%2022C51.496%2022%2048.418%2018.339%2048.418%2013.538C48.418%208.738%2051.496%205.077%2056.266%205.077C60.113%205.077%2062.422%207.231%2063.437%2010.431C63.807%2011.631%2063.96%2012.954%2063.96%2014.308V14.615H51.373C51.465%2017.2%2053.373%2019.692%2056.42%2019.692C59.036%2019.692%2060.237%2018.185%2060.483%2017.077H63.653C62.914%2019.692%2060.452%2022%2056.42%2022ZM51.373%2012.308H61.006C60.852%209.538%2059.375%207.385%2056.266%207.385C53.158%207.385%2051.466%209.692%2051.373%2012.308ZM64.113%208V5.54H67.96V1.847H70.914V5.54H75.069V8H70.914V17.693C70.914%2018.77%2071.222%2019.139%2072.299%2019.139H75.069V21.539H71.684C68.883%2021.539%2067.96%2020.154%2067.96%2017.693V8H64.113ZM83.563%205.077C88.488%205.077%2091.719%208.738%2091.719%2013.538C91.719%2018.338%2088.488%2022%2083.563%2022C78.639%2022%2075.408%2018.339%2075.408%2013.538C75.408%208.738%2078.639%205.077%2083.563%205.077ZM83.563%207.538C80.209%207.538%2078.362%2010.308%2078.362%2013.538C78.362%2016.769%2080.209%2019.538%2083.563%2019.538C86.918%2019.538%2088.765%2016.769%2088.765%2013.538C88.765%2010.308%2086.918%207.538%2083.563%207.538ZM101.18%205.077C106.105%205.077%20109.336%208.738%20109.336%2013.538C109.336%2018.338%20106.105%2022%20101.18%2022C96.256%2022%2093.025%2018.339%2093.025%2013.538C93.025%208.738%2096.256%205.077%20101.18%205.077ZM101.18%207.538C97.826%207.538%2095.979%2010.308%2095.979%2013.538C95.979%2016.769%2097.826%2019.538%20101.18%2019.538C104.535%2019.538%20106.382%2016.769%20106.382%2013.538C106.382%2010.308%20104.535%207.538%20101.18%207.538ZM114%200V21.539H111.045V0H114ZM13.534%201.01C13.534%200.452%2013.08%200%2012.519%200H1.015C0.454999%200%200%200.452%200%201.01V5.72C0%206.278%200.454999%206.73%201.015%206.73H12.519C13.079%206.73%2013.534%207.182%2013.534%207.74V9.086C13.534%209.644%2013.08%2010.096%2012.519%2010.096H5.075C4.515%2010.096%204.06%2010.548%204.06%2011.106V15.816C4.06%2016.374%204.515%2016.826%205.075%2016.826H12.519C13.079%2016.826%2013.534%2017.278%2013.534%2017.836V20.528C13.534%2021.085%2013.988%2021.538%2014.549%2021.538H19.286C19.846%2021.538%2020.301%2021.085%2020.301%2020.528V15.816C20.301%2015.259%2019.846%2014.806%2019.286%2014.806H14.549C13.989%2014.806%2013.534%2014.355%2013.534%2013.797V12.451C13.534%2011.894%2013.988%2011.441%2014.549%2011.441H19.286C19.846%2011.441%2020.301%2010.99%2020.301%2010.432V5.721C20.301%205.163%2019.846%204.711%2019.286%204.711H14.549C13.989%204.711%2013.534%204.259%2013.534%203.701V1.01Z'%20fill='black'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_68_71'%3e%3crect%20width='114'%20height='22'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e";
const watershed = "/assets/watershed.CTMPYQIi.svg";
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "MainlineLogos",
  __ssrInlineRender: true,
  props: {
    title: {},
    subtitle: {},
    companies: {}
  },
  setup(__props) {
    const props = __props;
    const logos = { arc, descript, mercury, monzo, perplexity, ramp, raycast, retool, watershed };
    const topRow = computed(() => props.companies.slice(0, 4).map((company) => ({ ...company, src: logos[company.logo] })));
    const bottomRow = computed(() => props.companies.slice(4).map((company) => ({ ...company, src: logos[company.logo] })));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "overflow-hidden pb-28 lg:pb-32" }, _attrs))}><div class="container space-y-10 lg:space-y-16"><div class="text-center"><h2 class="mb-4 !text-xl text-balance md:!text-2xl lg:!text-3xl">${ssrInterpolate(__props.title)}<br class="max-md:hidden"><span class="text-muted-foreground">${ssrInterpolate(__props.subtitle)}</span></h2></div><div class="flex w-full flex-col items-center gap-8"><div class="hidden w-full md:block"><div class="grid grid-cols-4 items-center justify-items-center gap-x-20 lg:gap-x-28"><!--[-->`);
      ssrRenderList(topRow.value, (company) => {
        _push(`<a${ssrRenderAttr("href", company.href)} target="_blank" rel="noreferrer" class="transition-opacity hover:opacity-70"><img${ssrRenderAttr("src", company.src)}${ssrRenderAttr("alt", `${company.name} logo`)}${ssrRenderAttr("width", company.width)}${ssrRenderAttr("height", company.height)} class="object-contain opacity-50 transition-opacity hover:opacity-70 dark:invert"></a>`);
      });
      _push(`<!--]--></div></div><div class="hidden w-full md:block"><div class="grid grid-cols-5 items-center justify-items-center gap-x-20 lg:gap-x-28"><!--[-->`);
      ssrRenderList(bottomRow.value, (company) => {
        _push(`<a${ssrRenderAttr("href", company.href)} target="_blank" rel="noreferrer" class="transition-opacity hover:opacity-70"><img${ssrRenderAttr("src", company.src)}${ssrRenderAttr("alt", `${company.name} logo`)}${ssrRenderAttr("width", company.width)}${ssrRenderAttr("height", company.height)} class="object-contain opacity-50 transition-opacity hover:opacity-70 dark:invert"></a>`);
      });
      _push(`<!--]--></div></div><div class="grid w-full grid-cols-3 justify-items-center gap-6 md:hidden"><!--[-->`);
      ssrRenderList(__props.companies, (company) => {
        _push(`<a${ssrRenderAttr("href", company.href)} target="_blank" rel="noreferrer" class="inline-flex items-center justify-center"><img${ssrRenderAttr("src", logos[company.logo])}${ssrRenderAttr("alt", `${company.name} logo`)}${ssrRenderAttr("width", company.width)}${ssrRenderAttr("height", company.height)} class="max-h-8 max-w-24 object-contain"></a>`);
      });
      _push(`<!--]--></div></div></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineLogos.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "MainlinePricing",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    actionLabel: {},
    plans: {}
  },
  setup(__props) {
    const isAnnual = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "py-28 lg:py-32" }, _attrs))}><div class="container max-w-5xl"><div class="space-y-4 text-center"><h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h2><p class="text-muted-foreground mx-auto max-w-xl leading-snug text-balance">${ssrInterpolate(__props.description)}</p></div><div class="mt-8 grid items-start gap-5 text-start md:mt-12 md:grid-cols-3 lg:mt-20"><!--[-->`);
      ssrRenderList(__props.plans, (plan) => {
        _push(`<article class="${ssrRenderClass([plan.name === "Startup" ? "outline-primary origin-top outline-4" : "", "bg-card text-card-foreground rounded-xl border shadow-sm"])}"><div class="flex flex-col gap-7 px-6 py-5"><div class="space-y-2"><h3 class="text-foreground !text-base !leading-6 !font-semibold">${ssrInterpolate(plan.name)}</h3><div class="text-muted-foreground text-lg font-medium">${ssrInterpolate(isAnnual.value ? plan.yearlyPrice : plan.monthlyPrice)} `);
        if (plan.name !== "Free") {
          _push(`<span class="text-muted-foreground">per user/${ssrInterpolate(isAnnual.value ? "year" : "month")}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (plan.name !== "Free") {
          _push(`<label class="flex cursor-pointer items-center gap-2"><input${ssrIncludeBooleanAttr(Array.isArray(isAnnual.value) ? ssrLooseContain(isAnnual.value, null) : isAnnual.value) ? " checked" : ""} type="checkbox" class="size-4 accent-primary" aria-label="Toggle annual billing"><span class="text-sm font-medium">Billed annually</span></label>`);
        } else {
          _push(`<span class="text-muted-foreground text-sm">${ssrInterpolate(plan.description)}</span>`);
        }
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(plan.features, (feature) => {
          _push(`<div class="text-muted-foreground flex items-center gap-1.5"><svg class="size-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m5 12 4 4L19 6"></path></svg><span class="text-sm">${ssrInterpolate(feature)}</span></div>`);
        });
        _push(`<!--]--></div><a href="#" class="${ssrRenderClass([plan.name === "Startup" ? "bg-primary !text-primary-foreground" : "bg-background", "inline-flex h-9 w-fit items-center justify-center rounded-md border px-4 py-2 text-sm font-medium !text-foreground !no-underline"])}">${ssrInterpolate(__props.actionLabel)}</a></div></article>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlinePricing.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const templateImage = "/assets/templates.DP7ABY5z.webp";
const graveyardImage = "/assets/graveyard.V7R1pso1.webp";
const discussionsImage = "/assets/discussions.CRXI81EO.webp";
const notificationsImage = "/assets/notifications.Yt0vq5qZ.webp";
const jira = "data:image/svg+xml,%3csvg%20width='58'%20height='59'%20viewBox='0%200%2058%2059'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%204'%3e%3cpath%20id='Vector'%20d='M56.3559%2027.7959L31.1962%202.63629L28.7729%200.166626L9.81828%2019.1058L1.15905%2027.7959C0.725471%2028.23%200.481934%2028.8185%200.481934%2029.4321C0.481934%2030.0456%200.725471%2030.6341%201.15905%2031.0682L18.4621%2048.3712L28.7729%2058.6666L47.7121%2039.7274L48.0053%2039.4342L56.3559%2031.0373C56.7801%2030.6045%2057.0177%2030.0227%2057.0177%2029.4166C57.0177%2028.8106%2056.7801%2028.2287%2056.3559%2027.7959ZM28.7729%2038.045L20.1291%2029.4012L28.7729%2020.7574L37.4167%2029.4012L28.7729%2038.045Z'%20fill='%230082FF'/%3e%3cpath%20id='Vector_2'%20d='M28.7728%2020.7574C26.0542%2018.0385%2024.5218%2014.3543%2024.5102%2010.5095C24.4987%206.66458%2026.0089%202.97131%2028.711%200.236084L9.80273%2019.1444L20.0981%2029.4398L28.7728%2020.7574Z'%20fill='url(%23paint0_linear_54_3798)'/%3e%3cpath%20id='Vector_3'%20d='M37.4245%2029.3781L28.7729%2038.045C30.1301%2039.3973%2031.2069%2041.0042%2031.9417%2042.7736C32.6765%2044.5429%2033.0547%2046.4399%2033.0547%2048.3558C33.0547%2050.2717%2032.6765%2052.1687%2031.9417%2053.9381C31.2069%2055.7074%2030.1301%2057.3143%2028.7729%2058.6666L47.7353%2039.7043L37.4245%2029.3781Z'%20fill='url(%23paint1_linear_54_3798)'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_54_3798'%20x1='27.2138'%20y1='12.0133'%20x2='15.1434'%20y2='24.0837'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0.18'%20stop-color='%230050D3'/%3e%3cstop%20offset='1'%20stop-color='%230082FF'/%3e%3c/linearGradient%3e%3clinearGradient%20id='paint1_linear_54_3798'%20x1='30.4091'%20y1='46.6888'%20x2='42.4564'%20y2='34.6415'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20offset='0.18'%20stop-color='%230050D3'/%3e%3cstop%20offset='1'%20stop-color='%230082FF'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const excel = "data:image/svg+xml,%3csvg%20width='66'%20height='62'%20viewBox='0%200%2066%2062'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%202'%3e%3cpath%20id='Vector'%20d='M41.3139%2029.4884L15.6162%2024.9535V58.4617C15.6162%2059.992%2016.8567%2061.2326%2018.387%2061.2326H62.7291C64.2594%2061.2326%2065.4999%2059.992%2065.4999%2058.4617V46.1163L41.3139%2029.4884Z'%20fill='%23185C37'/%3e%3cpath%20id='Vector_2'%20d='M41.3139%200.767456H18.387C16.8567%200.767456%2015.6162%202.00798%2015.6162%203.53826V15.8837L41.3139%2031L54.9185%2035.5349L65.4999%2031V15.8837L41.3139%200.767456Z'%20fill='%2321A366'/%3e%3cpath%20id='Vector_3'%20d='M15.6162%2015.8838H41.3139V31.0001H15.6162V15.8838Z'%20fill='%23107C41'/%3e%3cpath%20id='Vector_4'%20opacity='0.1'%20d='M34.0082%2012.8605H15.6162V50.6512H34.0082C35.5364%2050.6462%2036.774%2049.4086%2036.779%2047.8804V15.6313C36.774%2014.1031%2035.5364%2012.8654%2034.0082%2012.8605Z'%20fill='black'/%3e%3cpath%20id='Vector_5'%20opacity='0.2'%20d='M32.4966%2014.3721H15.6162V52.1628H32.4966C34.0248%2052.1578%2035.2624%2050.9202%2035.2674%2049.392V17.1429C35.2624%2015.6147%2034.0248%2014.377%2032.4966%2014.3721Z'%20fill='black'/%3e%3cpath%20id='Vector_6'%20opacity='0.2'%20d='M32.4966%2014.3721H15.6162V49.1395H32.4966C34.0248%2049.1345%2035.2624%2047.8969%2035.2674%2046.3687V17.1429C35.2624%2015.6147%2034.0248%2014.377%2032.4966%2014.3721Z'%20fill='black'/%3e%3cpath%20id='Vector_7'%20opacity='0.2'%20d='M30.9849%2014.3721H15.6162V49.1395H30.9849C32.5131%2049.1345%2033.7508%2047.8969%2033.7557%2046.3687V17.1429C33.7508%2015.6147%2032.5131%2014.377%2030.9849%2014.3721Z'%20fill='black'/%3e%3cpath%20id='Vector_8'%20d='M3.27081%2014.3721H30.985C32.5153%2014.3721%2033.7558%2015.6126%2033.7558%2017.1429V44.857C33.7558%2046.3873%2032.5153%2047.6278%2030.985%2047.6278H3.27081C1.74053%2047.6279%200.5%2046.3873%200.5%2044.8571V17.1429C0.5%2015.6126%201.74053%2014.3721%203.27081%2014.3721Z'%20fill='url(%23paint0_linear_54_3761)'/%3e%3cpath%20id='Vector_9'%20d='M9.08154%2040.0063L14.9104%2030.9743L9.56981%2021.9922H13.8658L16.7803%2027.7364C17.0493%2028.2821%2017.2337%2028.6872%2017.3335%2028.9547H17.3713C17.5628%2028.5194%2017.7643%2028.0966%2017.976%2027.6865L21.0914%2021.9952H25.0352L19.5586%2030.9244L25.1743%2040.0062H20.9781L17.6117%2033.7013C17.4531%2033.433%2017.3185%2033.1512%2017.2096%2032.8593H17.1597C17.0611%2033.1453%2016.9303%2033.4192%2016.7697%2033.6756L13.3035%2040.0063H9.08154Z'%20fill='white'/%3e%3cpath%20id='Vector_10'%20d='M62.7292%200.767456H41.314V15.8837H65.5V3.53826C65.5%202.00798%2064.2595%200.767456%2062.7292%200.767456Z'%20fill='%2333C481'/%3e%3cpath%20id='Vector_11'%20d='M41.314%2031H65.5V46.1163H41.314V31Z'%20fill='%23107C41'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_54_3761'%20x1='6.27721'%20y1='12.207'%20x2='27.9786'%20y2='49.7929'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%2318884F'/%3e%3cstop%20offset='0.5'%20stop-color='%23117E43'/%3e%3cstop%20offset='1'%20stop-color='%230B6631'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const notion = "data:image/svg+xml,%3csvg%20width='63'%20height='66'%20viewBox='0%200%2063%2066'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%208'%3e%3cpath%20id='Vector'%20d='M4.41105%203.30349L40.3775%200.646943C44.7955%200.267993%2045.9304%200.523443%2048.7085%202.54299L60.1895%2010.6309C62.0829%2012.0219%2062.7134%2012.4009%2062.7134%2013.9154V58.2733C62.7134%2061.0534%2061.704%2062.6979%2058.1699%2062.9488L16.4035%2065.4786C13.7515%2065.604%2012.4886%2065.2251%2011.0995%2063.4551L2.645%2052.461C1.12855%2050.4376%200.5%2048.9231%200.5%2047.1525V7.72349C0.5%205.45044%201.50945%203.55504%204.41105%203.30349Z'%20fill='white'/%3e%3cpath%20id='Vector_2'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M40.3775%200.647593L4.41105%203.30414C1.50945%203.55504%200.5%205.45109%200.5%207.72349V47.1525C0.5%2048.9224%201.12855%2050.4369%202.645%2052.461L11.0995%2063.4545C12.4886%2065.2244%2013.7515%2065.604%2016.4035%2065.4779L58.1706%2062.9494C61.702%2062.6979%2062.7141%2061.0534%2062.7141%2058.274V13.916C62.7141%2012.4795%2062.1466%2012.0655%2060.4761%2010.8396L48.7085%202.54299C45.9311%200.523443%2044.7955%200.267993%2040.3775%200.646943V0.647593ZM17.348%2013.19C13.9374%2013.4194%2013.1639%2013.4714%2011.2269%2011.8965L6.30255%207.97959C5.80205%207.47259%206.0536%206.84014%207.3146%206.71404L41.89%204.18749C44.7936%203.93399%2046.3055%204.94604%2047.441%205.83004L53.371%2010.1265C53.6245%2010.2546%2054.255%2011.0105%2053.4964%2011.0105L17.79%2013.1601L17.348%2013.19ZM13.3719%2057.895V20.2386C13.3719%2018.5941%2013.877%2017.8355%2015.3889%2017.7081L56.4%2015.307C57.791%2015.1816%2058.4195%2016.0656%2058.4195%2017.7075V55.113C58.4195%2056.7575%2058.166%2058.1485%2055.8956%2058.274L16.6505%2060.549C14.3801%2060.6744%2013.3726%2059.9185%2013.3726%2057.895H13.3719ZM52.1119%2022.2575C52.3635%2023.395%2052.1119%2024.5325%2050.9744%2024.6625L49.0829%2025.0375V52.84C47.4404%2053.724%2045.9285%2054.229%2044.6649%2054.229C42.6453%2054.229%2042.1409%2053.5966%2040.6284%2051.7025L28.2589%2032.2415V51.07L32.1719%2051.956C32.1719%2051.956%2032.1719%2054.231%2029.0148%2054.231L20.3113%2054.736C20.0578%2054.229%2020.3113%2052.9661%2021.1934%2052.7145L23.4664%2052.084V27.189L20.312%2026.9336C20.0585%2025.7961%2020.689%2024.1535%2022.457%2024.0261L31.7955%2023.3976L44.6655%2043.1101V25.6706L41.385%2025.2936C41.1315%2023.9007%2042.1409%2022.8886%2043.4019%2022.7651L52.1119%2022.2575Z'%20fill='black'/%3e%3c/g%3e%3c/svg%3e";
const word = "data:image/svg+xml,%3csvg%20width='64'%20height='62'%20viewBox='0%200%2064%2062'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%201'%3e%3cpath%20id='Vector'%20d='M62.7291%200.767456H18.387C16.8567%200.767456%2015.6162%202.00799%2015.6162%203.53828V15.8837L41.3139%2023.4419L65.4999%2015.8837V3.53828C65.4999%202.00799%2064.2594%200.767456%2062.7291%200.767456Z'%20fill='%2341A5EE'/%3e%3cpath%20id='Vector_2'%20d='M65.4999%2015.8838H15.6162V31.0001L41.3139%2035.5349L65.4999%2031.0001V15.8838Z'%20fill='%232B7CD3'/%3e%3cpath%20id='Vector_3'%20d='M15.6162%2031V46.1163L39.8023%2049.1395L65.4999%2046.1163V31H15.6162Z'%20fill='%23185ABD'/%3e%3cpath%20id='Vector_4'%20d='M18.387%2061.2326H62.7291C64.2594%2061.2326%2065.5%2059.9921%2065.5%2058.4618V46.1163H15.6162V58.4618C15.6162%2059.9921%2016.8567%2061.2326%2018.387%2061.2326Z'%20fill='%23103F91'/%3e%3cpath%20id='Vector_5'%20opacity='0.1'%20d='M34.0082%2012.8605H15.6162V50.6512H34.0082C35.5364%2050.6462%2036.774%2049.4086%2036.779%2047.8803V15.6313C36.774%2014.1031%2035.5364%2012.8654%2034.0082%2012.8605Z'%20fill='black'/%3e%3cpath%20id='Vector_6'%20opacity='0.2'%20d='M32.4965%2014.3721H15.6162V52.1628H32.4965C34.0248%2052.1578%2035.2624%2050.9202%2035.2674%2049.3919V17.1429C35.2624%2015.6147%2034.0248%2014.377%2032.4965%2014.3721Z'%20fill='black'/%3e%3cpath%20id='Vector_7'%20opacity='0.2'%20d='M32.4965%2014.3721H15.6162V49.1395H32.4965C34.0248%2049.1345%2035.2624%2047.8969%2035.2674%2046.3687V17.1429C35.2624%2015.6147%2034.0248%2014.377%2032.4965%2014.3721Z'%20fill='black'/%3e%3cpath%20id='Vector_8'%20opacity='0.2'%20d='M30.9849%2014.3721H15.6162V49.1395H30.9849C32.5131%2049.1345%2033.7508%2047.8969%2033.7557%2046.3687V17.1429C33.7508%2015.6147%2032.5131%2014.377%2030.9849%2014.3721Z'%20fill='black'/%3e%3cpath%20id='Vector_9'%20d='M3.27082%2014.3721H30.985C32.5153%2014.3721%2033.7558%2015.6126%2033.7558%2017.1429V44.8571C33.7558%2046.3874%2032.5153%2047.6279%2030.985%2047.6279H3.27082C1.74054%2047.6279%200.5%2046.3874%200.5%2044.8571V17.1429C0.5%2015.6126%201.74054%2014.3721%203.27082%2014.3721Z'%20fill='url(%23paint0_linear_54_3776)'/%3e%3cpath%20id='Vector_10'%20d='M11.8704%2035.6226C11.9248%2036.0503%2011.9611%2036.4222%2011.9777%2036.7412H12.0412C12.0654%2036.4388%2012.1157%2036.0745%2012.1923%2035.6483C12.2689%2035.222%2012.338%2034.8617%2012.3994%2034.5675L15.3139%2021.9937H19.0823L22.1056%2034.3785C22.2813%2035.1486%2022.407%2035.9292%2022.482%2036.7154H22.5319C22.5883%2035.9537%2022.6933%2035.1964%2022.8463%2034.448L25.2574%2021.9877H28.6872L24.4517%2040.0063H20.4443L17.5722%2028.0735C17.4891%2027.7303%2017.3939%2027.2814%2017.2896%2026.7296C17.1853%2026.1779%2017.1203%2025.7743%2017.0946%2025.5203H17.0447C17.0114%2025.8136%2016.9464%2026.2489%2016.8497%2026.8264C16.7529%2027.4038%2016.6753%2027.8311%2016.6169%2028.1082L13.9171%2040.0032H9.84173L5.5835%2021.9937H9.07534L11.701%2034.5931C11.76%2034.8516%2011.816%2035.1963%2011.8704%2035.6226Z'%20fill='white'/%3e%3c/g%3e%3cdefs%3e%3clinearGradient%20id='paint0_linear_54_3776'%20x1='6.27721'%20y1='12.207'%20x2='27.9786'%20y2='49.7929'%20gradientUnits='userSpaceOnUse'%3e%3cstop%20stop-color='%232368C4'/%3e%3cstop%20offset='0.5'%20stop-color='%231A5DBE'/%3e%3cstop%20offset='1'%20stop-color='%231146AC'/%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e";
const monday = "data:image/svg+xml,%3csvg%20width='66'%20height='40'%20viewBox='0%200%2066%2040'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%206'%3e%3cpath%20id='path841'%20d='M8.33572%2039.8068C6.89885%2039.8099%205.48689%2039.4316%204.2441%2038.7104C3.00131%2037.9893%201.97223%2036.9511%201.26199%2035.702C0.562617%2034.4618%200.213823%2033.0546%200.252967%2031.6313C0.292111%2030.208%200.717718%2028.8221%201.4842%2027.6222L16.0514%204.74674C16.797%203.51732%2017.8555%202.50782%2019.1189%201.82137C20.3823%201.13491%2021.8052%200.796092%2023.2424%200.839523C24.6785%200.873937%2026.0797%201.28928%2027.3025%202.04305C28.5253%202.79682%2029.526%203.86195%2030.202%205.12944C31.5599%207.69722%2031.3902%2010.7866%2029.7637%2013.197L15.2058%2036.0724C14.4675%2037.2228%2013.4508%2038.1682%2012.2499%2038.821C11.0489%2039.4738%209.70261%2039.8129%208.33572%2039.8068Z'%20fill='%23F62B54'/%3e%3cpath%20id='path843'%20d='M33.3225%2039.8062C30.3843%2039.8062%2027.6808%2038.2352%2026.2611%2035.7107C25.5633%2034.4738%2025.2153%2033.0703%2025.2544%2031.6507C25.2936%2030.2311%2025.7184%2028.849%2026.4833%2027.6524L41.0227%204.82943C41.7573%203.58272%2042.8121%202.55524%2044.0776%201.85356C45.3431%201.15188%2046.7734%200.801539%2048.2199%200.838884C51.1827%200.903696%2053.8678%202.56102%2055.2257%205.15349C56.5744%207.74596%2056.3769%2010.8538%2054.7011%2013.258L40.1647%2036.081C39.4288%2037.2265%2038.4162%2038.1682%2037.2204%2038.8193C36.0245%2039.4703%2034.684%2039.8097%2033.3225%2039.8062Z'%20fill='%23FFCC00'/%3e%3cpath%20id='ellipse845'%20d='M57.7506%2039.9975C61.8926%2039.9975%2065.2503%2036.7102%2065.2503%2032.6552C65.2503%2028.6002%2061.8926%2025.313%2057.7506%2025.313C53.6087%2025.313%2050.251%2028.6002%2050.251%2032.6552C50.251%2036.7102%2053.6087%2039.9975%2057.7506%2039.9975Z'%20fill='%2300CA72'/%3e%3c/g%3e%3c/svg%3e";
const drive = "data:image/svg+xml,%3csvg%20width='58'%20height='51'%20viewBox='0%200%2058%2051'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%203'%3e%3cpath%20id='Vector'%20d='M4.66744%2043.5191L7.16994%2047.8416C7.68994%2048.7516%208.43744%2049.4666%209.31494%2049.9866L18.2524%2034.5166H0.377441C0.377441%2035.5241%200.637441%2036.5316%201.15744%2037.4416L4.66744%2043.5191Z'%20fill='%230066DA'/%3e%3cpath%20id='Vector_2'%20d='M28.7499%2016.3167L19.8124%200.84668C18.9349%201.36668%2018.1874%202.08168%2017.6674%202.99168L1.15744%2031.5917C0.647005%2032.4821%200.378121%2033.4904%200.377441%2034.5167H18.2524L28.7499%2016.3167Z'%20fill='%2300AC47'/%3e%3cpath%20id='Vector_3'%20d='M48.1849%2049.9866C49.0624%2049.4666%2049.8099%2048.7516%2050.3299%2047.8416L51.3699%2046.0541L56.3424%2037.4416C56.8624%2036.5316%2057.1224%2035.5241%2057.1224%2034.5166H39.2461L43.0499%2041.9916L48.1849%2049.9866Z'%20fill='%23EA4335'/%3e%3cpath%20id='Vector_4'%20d='M28.75%2016.3167L37.6875%200.84665C36.81%200.32665%2035.8025%200.0666504%2034.7625%200.0666504H22.7375C21.6975%200.0666504%2020.69%200.35915%2019.8125%200.84665L28.75%2016.3167Z'%20fill='%2300832D'/%3e%3cpath%20id='Vector_5'%20d='M39.2474%2034.5166H18.2524L9.31494%2049.9866C10.1924%2050.5066%2011.1999%2050.7666%2012.2399%2050.7666H45.2599C46.2999%2050.7666%2047.3074%2050.4741%2048.1849%2049.9866L39.2474%2034.5166Z'%20fill='%232684FC'/%3e%3cpath%20id='Vector_6'%20d='M48.0875%2017.2917L39.8325%202.99168C39.3125%202.08168%2038.565%201.36668%2037.6875%200.84668L28.75%2016.3167L39.2475%2034.5167H57.09C57.09%2033.5092%2056.83%2032.5017%2056.31%2031.5917L48.0875%2017.2917Z'%20fill='%23FFBA00'/%3e%3c/g%3e%3c/svg%3e";
const asana = "data:image/svg+xml,%3csvg%20width='57'%20height='53'%20viewBox='0%200%2057%2053'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='Group%207'%3e%3cpath%20id='Vector'%20fill-rule='evenodd'%20clip-rule='evenodd'%20d='M44.5711%2027.9387C37.8447%2027.9387%2032.3922%2033.3916%2032.3922%2040.1182C32.3922%2046.8445%2037.8447%2052.2973%2044.5711%2052.2973C51.2974%2052.2973%2056.75%2046.8445%2056.75%2040.1182C56.75%2033.3916%2051.2974%2027.9387%2044.5711%2027.9387ZM12.929%2027.9398C6.20278%2027.9398%200.75%2033.3916%200.75%2040.1182C0.75%2046.8445%206.20278%2052.2973%2012.929%2052.2973C19.6555%2052.2973%2025.1085%2046.8445%2025.1085%2040.1182C25.1085%2033.3916%2019.6555%2027.9398%2012.929%2027.9398ZM40.9288%2012.7146C40.9288%2019.4414%2035.4762%2024.8947%2028.7501%2024.8947C22.0236%2024.8947%2016.571%2019.4414%2016.571%2012.7146C16.571%205.9892%2022.0236%200.535889%2028.7501%200.535889C35.4762%200.535889%2040.9288%205.9892%2040.9288%2012.7146Z'%20fill='%23F06A6A'/%3e%3c/g%3e%3c/svg%3e";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "MainlineResourceBlock",
  __ssrInlineRender: true,
  props: {
    title: {},
    items: {}
  },
  setup(__props) {
    const stackLogos = [jira, excel, notion, word, monday, drive, jira, asana];
    const featureImages = [graveyardImage, discussionsImage, notificationsImage];
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "resource-allocation",
        class: "overflow-hidden pb-28 lg:pb-32"
      }, _attrs))}><div><h2 class="container text-center !text-3xl !tracking-tight text-balance sm:!text-4xl md:!text-5xl lg:!text-6xl">${ssrInterpolate(__props.title)}</h2><div class="mt-8 md:mt-12 lg:mt-20"><div class="text-muted-foreground container h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"></div><div class="relative container flex max-md:flex-col"><!--[-->`);
      ssrRenderList(__props.items.slice(0, 2), (item, index) => {
        _push(`<article class="relative flex flex-1 flex-col justify-between px-0 py-6 pb-10 md:px-6 md:py-8 md:pb-10"><div class="mb-5 text-balance md:mb-8"><h3 class="inline !text-base !leading-6 !font-semibold">${ssrInterpolate(item.title)} </h3><span class="text-muted-foreground">${ssrInterpolate(item.description)}</span></div>`);
        if (index === 0) {
          _push(`<div class="grid grid-cols-1 gap-4"><img${ssrRenderAttr("src", unref(templateImage))}${ssrRenderAttr("alt", item.imageAlt)} width="495" height="186" class="object-contain object-left-top"></div>`);
        } else {
          _push(`<div class="relative overflow-hidden"><div class="flex flex-col gap-5"><div class="flex translate-x-4 justify-end gap-5"><!--[-->`);
          ssrRenderList(stackLogos.slice(0, 4), (logo) => {
            _push(`<div class="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"><img${ssrRenderAttr("src", logo)} alt="" class="size-12 object-contain"></div>`);
          });
          _push(`<!--]--></div><div class="flex -translate-x-4 gap-5"><!--[-->`);
          ssrRenderList(stackLogos.slice(4), (logo, logoIndex) => {
            _push(`<div class="bg-background grid aspect-square size-16 place-items-center rounded-2xl p-2 lg:size-20"><img${ssrRenderAttr("src", logo)} alt="" class="size-12 object-contain"></div>`);
          });
          _push(`<!--]--></div></div><div class="from-muted/80 absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l to-transparent"></div><div class="from-muted absolute inset-y-0 bottom-0 left-0 z-10 w-14 bg-gradient-to-r to-transparent"></div></div>`);
        }
        if (item.href && item.linkLabel) {
          _push(ssrRenderComponent(ProjectComponent2, {
            tag: "a",
            href: item.href,
            color: "gray",
            outlined: "",
            size: "sm",
            class: ["absolute bottom-0 z-20 w-max translate-y-1/2", item.align === "left" ? "left-6" : item.align === "right" ? "right-6" : "left-1/2 -translate-x-1/2"],
            "icon-position": "after"
          }, {
            icon: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${_scopeId}><path d="M5 12h14m-6-6 6 6-6 6"${_scopeId}></path></svg>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "size-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", { d: "M5 12h14m-6-6 6 6-6 6" })
                  ]))
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.linkLabel)} `);
              } else {
                return [
                  createTextVNode(toDisplayString(item.linkLabel) + " ", 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (index === 0) {
          _push(`<div class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:block"></div>`);
        } else {
          _push(`<!---->`);
        }
        if (index === 0) {
          _push(`<div class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:hidden"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      });
      _push(`<!--]--></div><div class="text-muted-foreground container h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"></div><div class="relative container grid max-w-7xl md:grid-cols-3"><!--[-->`);
      ssrRenderList(__props.items.slice(2, 5), (item, index) => {
        _push(`<article class="relative flex flex-col justify-between px-0 py-6 pb-10 md:px-6 md:py-8 md:pb-10"><div class="mb-5 text-balance md:mb-8"><h3 class="inline !text-base !leading-6 !font-semibold">${ssrInterpolate(item.title)} </h3><span class="text-muted-foreground">${ssrInterpolate(item.description)}</span></div>`);
        if (index !== 1) {
          _push(`<div class="relative grid grid-cols-1 gap-4"><img${ssrRenderAttr("src", featureImages[index])}${ssrRenderAttr("alt", item.imageAlt)} width="305" height="280" class="object-contain object-left-top"></div>`);
        } else {
          _push(`<div class="image-container grid flex-1 place-items-center gap-4 md:-translate-y-3"><img${ssrRenderAttr("src", featureImages[index])}${ssrRenderAttr("alt", item.imageAlt)} width="320" height="103" class="object-contain object-left-top"></div>`);
        }
        if (item.href && item.linkLabel) {
          _push(ssrRenderComponent(ProjectComponent2, {
            tag: "a",
            href: item.href,
            color: "gray",
            outlined: "",
            size: "sm",
            class: ["absolute bottom-0 z-20 w-max translate-y-1/2", item.align === "left" ? "left-6" : item.align === "right" ? "right-6" : "left-1/2 -translate-x-1/2"],
            "icon-position": "after"
          }, {
            icon: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${_scopeId}><path d="M5 12h14m-6-6 6 6-6 6"${_scopeId}></path></svg>`);
              } else {
                return [
                  (openBlock(), createBlock("svg", {
                    class: "size-4",
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    "stroke-width": "2",
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "aria-hidden": "true"
                  }, [
                    createVNode("path", { d: "M5 12h14m-6-6 6 6-6 6" })
                  ]))
                ];
              }
            }),
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(item.linkLabel)} `);
              } else {
                return [
                  createTextVNode(toDisplayString(item.linkLabel) + " ", 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (index < 2) {
          _push(`<div class="absolute inset-y-0 right-0 hidden w-px bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(180deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:block"></div>`);
        } else {
          _push(`<!---->`);
        }
        if (index < 2) {
          _push(`<div class="absolute inset-x-0 bottom-0 block h-px bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_20%,black_80%,transparent)] text-muted-foreground md:hidden"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</article>`);
      });
      _push(`<!--]--></div><div class="text-muted-foreground container h-px w-full bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)] [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]"></div></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineResourceBlock.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const amy = "/assets/amy-chase.B3bzy4Tp.webp";
const jonas = "/assets/jonas-kotara.BQ_hzL6l.webp";
const kevin = "/assets/kevin-yam.BpZ728gL.webp";
const kundo = "/assets/kundo-marta.CQgN9Gzh.webp";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "MainlineTestimonials",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    actionLabel: {},
    items: {}
  },
  setup(__props) {
    const props = __props;
    ref(null);
    const images = { "amy-chase": amy, "jonas-kotara": jonas, "kevin-yam": kevin, "kundo-marta": kundo };
    const testimonials = computed(() => props.items.map((item) => ({ ...item, src: images[item.image] })));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><section class="overflow-hidden py-28 lg:py-32"><div class="container"><div class="space-y-4"><h2 class="!text-2xl !tracking-tight md:!text-4xl lg:!text-5xl">${ssrInterpolate(__props.title)}</h2><p class="text-muted-foreground max-w-md leading-snug">${ssrInterpolate(__props.description)}</p><a href="#" class="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 py-2 text-sm font-medium shadow-md !text-foreground !no-underline">${ssrInterpolate(__props.actionLabel)} <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"></path></svg></a></div><div class="relative mt-8 md:mt-12 lg:mt-20"><div class="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&amp;::-webkit-scrollbar]:hidden"><!--[-->`);
      ssrRenderList(testimonials.value, (item, index) => {
        _push(`<article class="bg-muted flex h-full min-w-0 shrink-0 grow-0 basis-4/5 snap-start flex-col overflow-hidden rounded-xl border-none sm:basis-3/5 md:basis-2/5 lg:basis-[28%] 2xl:basis-[24%]"><div class="relative h-[288px] shrink-0 lg:h-[328px]"><img${ssrRenderAttr("src", item.src)}${ssrRenderAttr("alt", item.author)} class="absolute inset-0 size-full object-cover object-top"></div><div class="flex flex-1 flex-col justify-between gap-10 p-6"><blockquote class="!text-lg !leading-none !font-medium md:!text-xl lg:!text-2xl">${ssrInterpolate(item.quote)}</blockquote><div class="space-y-0.5"><div class="text-primary font-semibold">${ssrInterpolate(item.author)}, ${ssrInterpolate(item.role)}</div><div class="text-muted-foreground text-sm">${ssrInterpolate(item.company)}</div></div></div></article>`);
      });
      _push(`<!--]--></div><div class="mt-8 flex gap-3"><button class="bg-muted hover:bg-muted/80 static size-14 rounded-full transition-colors" aria-label="Previous testimonials"><svg class="mx-auto size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m15 18-6-6 6-6"></path></svg></button><button class="bg-muted hover:bg-muted/80 static size-14 rounded-full transition-colors" aria-label="Next testimonials"><svg class="mx-auto size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg></button></div></div></div></section><div class="mx-auto h-px max-w-[80%] border-t border-dashed border-border"></div><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/home/MainlineTestimonials.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const PAD = 6;
const MARK = 16;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BranchedMenu",
  __ssrInlineRender: true,
  props: {
    items: { default: () => [] },
    defaultOpen: { default: 0 },
    defaultActive: { default: "" },
    color: { default: "#f5f5f5" },
    accentColor: { default: "#f5f5f5" },
    lineColor: { default: "#3f3f46" },
    width: { default: 240 },
    rowHeight: { default: 36 },
    indent: { default: 40 },
    trunk: { default: 14 },
    radius: { default: 10 },
    lineWidth: { default: 1.5 },
    fontSize: { default: 14 },
    drawDuration: { default: 400 },
    foldDuration: { default: 300 },
    className: { default: "" }
  },
  emits: ["select", "toggle"],
  setup(__props, { emit: __emit }) {
    var _a, _b, _c;
    const toSet = (value) => new Set(Array.isArray(value) ? value : value >= 0 ? [value] : []);
    const props = __props;
    const menuItems = computed(() => props.items);
    const open = ref(toSet(props.defaultOpen));
    const active2 = ref(props.defaultActive || (((_c = (_b = (_a = menuItems.value.find((item, index) => item.children && toSet(props.defaultOpen).has(index))) == null ? void 0 : _a.children) == null ? void 0 : _b[0]) == null ? void 0 : _c.value) ?? ""));
    const navRef = ref(null);
    const markerRef = ref(null);
    const heads = [];
    let resizeObserver = null;
    const activeSection = computed(() => menuItems.value.findIndex((item) => {
      var _a2;
      return (_a2 = item.children) == null ? void 0 : _a2.some((child) => child.value === active2.value);
    }));
    const markerShown = computed(() => activeSection.value >= 0 && open.value.has(activeSection.value));
    function placeMarker(animate) {
      const marker = markerRef.value;
      const heading = heads[activeSection.value];
      if (!marker) return;
      if (!animate) marker.style.transition = "none";
      if (markerShown.value && heading) marker.style.top = `${heading.offsetTop + (heading.offsetHeight - MARK) / 2}px`;
      marker.toggleAttribute("data-on", Boolean(markerShown.value && heading));
      if (!animate) {
        void marker.offsetHeight;
        marker.style.transition = "";
      }
    }
    function bindMarker() {
      resizeObserver == null ? void 0 : resizeObserver.disconnect();
      placeMarker(true);
      let first = true;
      resizeObserver = new ResizeObserver(() => {
        if (first) {
          first = false;
          return;
        }
        placeMarker(false);
      });
      if (navRef.value) resizeObserver.observe(navRef.value);
    }
    onMounted(bindMarker);
    onUnmounted(() => resizeObserver == null ? void 0 : resizeObserver.disconnect());
    watch(() => [activeSection.value, markerShown.value, menuItems.value, props.fontSize, props.rowHeight], bindMarker, { flush: "post" });
    const radius = computed(() => Math.min(props.radius, props.rowHeight / 2 - 2));
    const endX = computed(() => props.indent - 8);
    const rowY = (index) => PAD + index * props.rowHeight + props.rowHeight / 2;
    const branchPath = (index) => `M ${props.trunk} ${rowY(index) - radius.value} A ${radius.value} ${radius.value} 0 0 0 ${props.trunk + radius.value} ${rowY(index)} H ${endX.value}`;
    const reachPath = (index) => `M ${props.trunk} 0 V ${rowY(index) - radius.value} A ${radius.value} ${radius.value} 0 0 0 ${props.trunk + radius.value} ${rowY(index)} H ${endX.value}`;
    const pathLength = (index) => rowY(index) - radius.value + Math.PI * radius.value / 2 + (endX.value - props.trunk - radius.value);
    const trunkPath = (count) => `M ${props.trunk} 0 V ${rowY(count - 1) - radius.value}`;
    const navStyle = computed(() => ({
      "--bm-w": `${props.width}px`,
      "--bm-ink": props.color,
      "--bm-accent": props.accentColor,
      "--bm-line": props.lineColor,
      "--bm-font": `${props.fontSize}px`,
      "--bm-row": `${props.rowHeight}px`,
      "--bm-indent": `${props.indent}px`,
      "--bm-line-w": props.lineWidth,
      "--bm-draw": `${props.drawDuration}ms`,
      "--bm-fold": `${props.foldDuration}ms`
    }));
    const iconStyle = (icon) => icon ? { "--bm-icon": `url("${icon}")` } : void 0;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        ref_key: "navRef",
        ref: navRef,
        class: ["branched-menu", __props.className],
        style: navStyle.value
      }, _attrs))} data-v-0639acd2><span class="branched-menu-marker" aria-hidden="true" data-v-0639acd2></span><!--[-->`);
      ssrRenderList(menuItems.value, (item, index) => {
        var _a2;
        _push(`<div class="branched-menu-section" data-v-0639acd2><button type="button"${ssrRenderAttr("aria-expanded", item.children ? open.value.has(index) : void 0)}${ssrRenderAttr("aria-current", !item.children && item.value === active2.value ? "page" : void 0)}${ssrRenderAttr("data-active", !item.children && item.value === active2.value ? "" : void 0)} class="${ssrRenderClass([{ "branched-menu-heading-leaf": !item.children }, "branched-menu-heading"])}" data-v-0639acd2>`);
        if (!item.children && item.icon) {
          _push(`<span class="branched-menu-icon" style="${ssrRenderStyle(iconStyle(item.icon))}" aria-hidden="true" data-v-0639acd2></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span data-v-0639acd2>${ssrInterpolate(item.label)}</span></button>`);
        if ((_a2 = item.children) == null ? void 0 : _a2.length) {
          _push(`<div class="branched-menu-children" style="${ssrRenderStyle(open.value.has(index) ? null : { display: "none" })}" data-v-0639acd2><div class="branched-menu-branch-list" style="${ssrRenderStyle({ height: `${PAD * 2 + item.children.length * __props.rowHeight}px` })}" data-v-0639acd2><svg class="branched-menu-lines"${ssrRenderAttr("width", __props.indent)}${ssrRenderAttr("height", PAD * 2 + item.children.length * __props.rowHeight)} aria-hidden="true" data-v-0639acd2><path class="branched-menu-trunk"${ssrRenderAttr("d", trunkPath(item.children.length))} data-v-0639acd2></path><!--[-->`);
          ssrRenderList(item.children, (child, childIndex) => {
            _push(`<path class="branched-menu-branch"${ssrRenderAttr("d", branchPath(childIndex))} data-v-0639acd2></path>`);
          });
          _push(`<!--]--><!--[-->`);
          ssrRenderList(item.children, (child, childIndex) => {
            _push(`<path class="branched-menu-reach"${ssrRenderAttr("d", reachPath(childIndex))} style="${ssrRenderStyle({ strokeDasharray: pathLength(childIndex), strokeDashoffset: child.value === active2.value ? 0 : pathLength(childIndex) })}" data-v-0639acd2></path>`);
          });
          _push(`<!--]--></svg><!--[-->`);
          ssrRenderList(item.children, (child) => {
            _push(`<button type="button" class="branched-menu-child"${ssrRenderAttr("aria-current", child.value === active2.value ? "page" : void 0)}${ssrRenderAttr("data-active", child.value === active2.value ? "" : void 0)}${ssrRenderAttr("tabindex", open.value.has(index) ? 0 : -1)} data-v-0639acd2>`);
            if (child.icon) {
              _push(`<span class="branched-menu-icon" style="${ssrRenderStyle(iconStyle(child.icon))}" aria-hidden="true" data-v-0639acd2></span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<span class="branched-menu-label" data-v-0639acd2>${ssrInterpolate(child.label)}</span></button>`);
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/navigation/BranchedMenu.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ProjectComponent14 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0639acd2"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BranchedSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const { theme: theme2, frontmatter } = useData$1();
    function plainText(value) {
      return value.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
    }
    function iconFromText(value) {
      var _a;
      return (_a = value.match(/--sidebar-group-icon-url:\s*url\((?:'|")?([^'")]+)(?:'|")?\)/)) == null ? void 0 : _a[1];
    }
    function pageItems(entries) {
      return entries.flatMap((entry) => {
        var _a;
        if ((_a = entry.items) == null ? void 0 : _a.length) return pageItems(entry.items);
        if (!entry.link) return [];
        return [{ value: entry.link, label: plainText(entry.text ?? entry.link), icon: iconFromText(entry.text ?? "") }];
      });
    }
    function toMenuItem(entry) {
      var _a;
      const label = plainText(entry.text ?? entry.link ?? "");
      if ((_a = entry.items) == null ? void 0 : _a.length) {
        const children = pageItems(entry.items);
        return children.length ? { label, children } : null;
      }
      return entry.link ? { label, value: entry.link, icon: iconFromText(entry.text ?? "") } : null;
    }
    const sourceItems = computed(() => {
      if (frontmatter.value.sidebar === false) return [];
      const sidebar = theme2.value.sidebar;
      if (Array.isArray(sidebar)) return sidebar;
      if (!sidebar || typeof sidebar !== "object") return [];
      const path = route.path;
      const key = Object.keys(sidebar).filter((prefix) => path.startsWith(prefix)).sort((a, b) => b.length - a.length)[0];
      return key ? sidebar[key] : [];
    });
    const items = computed(() => sourceItems.value.flatMap((entry) => {
      const item = toMenuItem(entry);
      return item ? [item] : [];
    }));
    const normalizePath = (path) => path.replace(/index\.html$/, "").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
    const activeLink = computed(() => normalizePath(route.path));
    const pathContainsRoute = (path) => {
      if (!path) return false;
      const target = normalizePath(path);
      return activeLink.value === target || activeLink.value.startsWith(`${target}/`);
    };
    const selectedChild = computed(() => {
      const children = items.value.flatMap((item) => item.children ?? []);
      const routeChild = children.find((child) => pathContainsRoute(child.value));
      if (routeChild) return routeChild;
      const entryTitle = frontmatter.value.search === false ? plainText(String(frontmatter.value.sidebarTitle ?? "")) : "";
      return entryTitle ? children.find((child) => child.label === entryTitle) : void 0;
    });
    const selectedLink = computed(() => {
      var _a, _b;
      return ((_a = selectedChild.value) == null ? void 0 : _a.value) ?? ((_b = items.value.find((item) => pathContainsRoute(item.value))) == null ? void 0 : _b.value) ?? activeLink.value;
    });
    const openSection = computed(() => items.value.findIndex(
      (item) => {
        var _a;
        return (_a = item.children) == null ? void 0 : _a.some((child) => child.value === selectedLink.value || pathContainsRoute(child.value));
      }
    ));
    function navigate(path) {
      void router.go(path);
    }
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(frontmatter).sidebar !== false && items.value.length) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "branched-sidebar" }, _attrs))}>`);
        _push(ssrRenderComponent(ProjectComponent14, {
          key: unref(route).path,
          items: items.value,
          "default-open": openSection.value,
          "default-active": selectedLink.value,
          width: 248,
          "row-height": 34,
          indent: 32,
          color: "var(--vp-c-text-1)",
          "accent-color": "var(--vp-c-brand-1)",
          "line-color": "var(--vp-c-divider)",
          onSelect: (path) => navigate(path)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../guides/.config/components/navigation/BranchedSidebar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const projectComponents = {
  "CollectionArticleSubnav": _sfc_main$f,
  "CollectionSpotlightCards": ProjectComponent1,
  "FeluqaButton": ProjectComponent2,
  "FlexCarousel": _sfc_main$c,
  "MainlineCta": _sfc_main$b,
  "MainlineFaq": _sfc_main$a,
  "MainlineGuideBlocks": _sfc_main$9,
  "MainlineHero": _sfc_main$7,
  "MainlineHomeLayout": ProjectComponent8,
  "MainlineLogos": _sfc_main$5,
  "MainlinePricing": _sfc_main$4,
  "MainlineResourceBlock": _sfc_main$3,
  "MainlineTestimonials": _sfc_main$2,
  "SideRays": _sfc_main$8,
  "BranchedMenu": ProjectComponent14,
  "BranchedSidebar": _sfc_main,
  "SpotlightCard": _sfc_main$e
};
function registerProjectComponents(app) {
  for (const [name, component] of Object.entries(projectComponents)) {
    app.component(name, component);
  }
}
const zoomStep = 0.25;
const minZoom = 0.75;
const maxZoom = 4;
function markdownFromNode(node) {
  var _a, _b, _c, _d, _e;
  if (node.nodeType === Node.TEXT_NODE) return (node.textContent || "").replace(/\\/g, "\\\\").replace(/([*_`])/g, "\\$1");
  if (!(node instanceof HTMLElement)) return "";
  if (node.matches(".header-anchor, button, .mermaid-toolbar, .VPBadge")) return node.matches(".VPBadge") ? ((_a = node.textContent) == null ? void 0 : _a.trim()) || "" : "";
  const children = () => Array.from(node.childNodes).map(markdownFromNode).join("");
  const content = children().trim();
  if (!content && !["IMG", "BR", "HR"].includes(node.tagName)) return "";
  switch (node.tagName) {
    case "H1":
    case "H2":
    case "H3":
    case "H4":
    case "H5":
    case "H6":
      return `${"#".repeat(Number(node.tagName[1]))} ${content}

`;
    case "P":
      return `${content}

`;
    case "A":
      return `[${content}](${node.getAttribute("href") || ""})`;
    case "STRONG":
    case "B":
      return `**${content}**`;
    case "EM":
    case "I":
      return `*${content}*`;
    case "CODE":
      return ((_b = node.parentElement) == null ? void 0 : _b.tagName) === "PRE" ? content : `\`${content}\``;
    case "PRE": {
      const code = node.querySelector("code");
      const language = ((_c = Array.from((code == null ? void 0 : code.classList) || []).find((name) => name.startsWith("language-"))) == null ? void 0 : _c.slice(9)) || "";
      return `
\`\`\`${language}
${((_d = code == null ? void 0 : code.textContent) == null ? void 0 : _d.trimEnd()) || ((_e = node.textContent) == null ? void 0 : _e.trimEnd()) || ""}
\`\`\`

`;
    }
    case "UL":
    case "OL":
      return `${Array.from(node.children).map((item, index) => `${node.tagName === "OL" ? `${index + 1}.` : "-"} ${markdownFromNode(item).trim().replace(/\n/g, "\n  ")}`).join("\n")}

`;
    case "LI":
      return children();
    case "BLOCKQUOTE":
      return `${content.split("\n").map((line) => `> ${line}`).join("\n")}

`;
    case "IMG":
      return `![${node.getAttribute("alt") || ""}](${node.getAttribute("src") || ""})`;
    case "BR":
      return "  \n";
    case "HR":
      return "\n---\n\n";
    case "TABLE":
      return `${Array.from(node.querySelectorAll("tr")).map((row, index) => `| ${Array.from(row.children).map((cell) => {
        var _a2;
        return ((_a2 = cell.textContent) == null ? void 0 : _a2.trim().replace(/\|/g, "\\|")) || "";
      }).join(" | ")} |${index === 0 ? `
| ${Array.from(row.children).map(() => "---").join(" | ")} |` : ""}`).join("\n")}

`;
    default:
      return content;
  }
}
async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
}
const PageActions = {
  setup() {
    const { lang, frontmatter } = useData$1();
    const open = ref(false);
    const isFrench = () => String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().startsWith("fr");
    const labels = () => isFrench() ? { title: "À propos de cette page", trigger: "Markdown", copyLink: "Copier le lien de la page", copyMarkdown: "Copier en Markdown", chatgpt: "Demander à ChatGPT", claude: "Demander à Claude", copied: "Copié" } : { title: "About this page", trigger: "Markdown", copyLink: "Copy page link", copyMarkdown: "Copy as markdown", chatgpt: "Ask ChatGPT", claude: "Ask Claude", copied: "Copied" };
    const action = (label, run) => h("button", { class: "page-actions__item item", type: "button", role: "menuitem", onClick: () => {
      void run();
      open.value = false;
    } }, label);
    const pageUrl = () => window.location.href;
    const askUrl = (provider) => {
      const prompt = `${isFrench() ? "Explique cette page de documentation" : "Explain this documentation page"}: ${pageUrl()}`;
      return provider === "chatgpt" ? `https://chatgpt.com/?q=${encodeURIComponent(prompt)}` : `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
    };
    const copyMarkdown = async () => {
      const article = document.querySelector(".vp-doc");
      if (!article) return;
      const clone = article.cloneNode(true);
      clone.querySelectorAll(".header-anchor, button, .mermaid-toolbar").forEach((element) => element.remove());
      await copyText(Array.from(clone.childNodes).map(markdownFromNode).join("").trim() + "\n");
    };
    const onKeydown = (event) => {
      if (event.key === "Escape") open.value = false;
    };
    const onDocumentClick = (event) => {
      if (!(event.target instanceof Element) || !event.target.closest(".VPDocAsideMeta")) open.value = false;
    };
    onMounted(() => {
      document.addEventListener("keydown", onKeydown);
      document.addEventListener("click", onDocumentClick);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("keydown", onKeydown);
      document.removeEventListener("click", onDocumentClick);
    });
    return () => {
      const text = labels();
      return h("section", { class: "VPDocAsideMeta", "aria-label": text.title }, [
        h("h2", { class: "meta-title" }, text.title),
        h("div", { class: "meta-box" }, [
          h("div", { class: "meta-row VPLlmsPageActions" }, [
            h("button", { class: "page-actions__trigger", type: "button", "aria-haspopup": "menu", "aria-expanded": String(open.value), onClick: () => {
              open.value = !open.value;
            } }, [
              h("span", { class: "page-actions__file-icon", "aria-hidden": "true" }, [h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.8" }, [h("path", { d: "M7 3.75h7l4 4V20.25H7z" }), h("path", { d: "M14 3.75v4h4M9.5 12h6M9.5 15.5h6" })])]),
              h("span", text.trigger),
              h("span", { class: "page-actions__caret", "aria-hidden": "true" }, [h("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.8" }, [h("path", { d: "m7 10 5 5 5-5" })])])
            ]),
            open.value ? h("div", { class: "page-actions__menu VPMenu", role: "menu" }, [
              action(text.copyLink, () => copyText(pageUrl())),
              action(text.copyMarkdown, copyMarkdown),
              h("a", { class: "page-actions__item item", role: "menuitem", href: askUrl("chatgpt"), target: "_blank", rel: "noreferrer", onClick: () => {
                open.value = false;
              } }, text.chatgpt),
              h("a", { class: "page-actions__item item", role: "menuitem", href: askUrl("claude"), target: "_blank", rel: "noreferrer", onClick: () => {
                open.value = false;
              } }, text.claude)
            ]) : null
          ])
        ])
      ]);
    };
  }
};
function setZoom(target, value) {
  const zoom = Math.min(maxZoom, Math.max(minZoom, value));
  target.dataset.zoom = String(zoom);
  const image = target.querySelector("img");
  if (image) image.style.width = String(zoom * 100) + "%";
}
function createIcon(name) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("width", "18");
  svg.setAttribute("height", "18");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "1.8");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  const paths = {
    in: ["M12 5v14", "M5 12h14"],
    out: ["M5 12h14"],
    expand: ["M8 3H5a2 2 0 0 0-2 2v3", "M16 3h3a2 2 0 0 1 2 2v3", "M21 16v3a2 2 0 0 1-2 2h-3", "M3 16v3a2 2 0 0 0 2 2h3"],
    close: ["M18 6 6 18", "m6 6 12 12"]
  };
  for (const d of paths[name]) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    svg.append(path);
  }
  return svg;
}
function normalizePagerPath(path) {
  return path.replace(/\/index(?:\.html)?$/, "").replace(/\.html$/, "").replace(/\/+$/, "") || "/";
}
function installPagerIcons() {
  const icons = sidebarPageIcons;
  const iconsByPath = new Map(Object.entries(icons).map(([path, icon]) => [normalizePagerPath(path), `/${icon.replace(/^\/+/, "")}`]));
  document.querySelectorAll(".VPDocFooter .pager-link").forEach((link2) => {
    const title = link2.querySelector(".title");
    if (!title) return;
    const path = normalizePagerPath(new URL(link2.href, window.location.href).pathname);
    const iconUrl = iconsByPath.get(path);
    let icon = title.querySelector(".DocumentationPagerIcon");
    if (title.querySelector(".sidebar-group-icon:not(.DocumentationPagerIcon)")) {
      icon == null ? void 0 : icon.remove();
      title.classList.remove("DocumentationPagerTitle");
      return;
    }
    if (!iconUrl) {
      icon == null ? void 0 : icon.remove();
      title.classList.remove("DocumentationPagerTitle");
      return;
    }
    if (!icon) {
      icon = document.createElement("span");
      icon.className = "sidebar-group-icon DocumentationPagerIcon";
      icon.setAttribute("aria-hidden", "true");
      title.prepend(icon);
    }
    icon.style.setProperty("--sidebar-group-icon-url", `url("${iconUrl}")`);
    title.classList.add("DocumentationPagerTitle");
  });
}
function actionButton(action, label, icon) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "mermaid-tool";
  button.dataset.mermaidAction = action;
  button.setAttribute("aria-label", label);
  button.title = label;
  button.append(createIcon(icon));
  return button;
}
const MermaidLayout = {
  setup() {
    const route = useRoute();
    const configuredLayoutSlots = () => {
      var _a, _b;
      const content = siteContent;
      const themeSlots2 = content.themeSlots;
      const segments = route.path.split("/").filter(Boolean);
      const localized = segments.length > 1 && ((_a = content.languages) == null ? void 0 : _a.includes(segments[0])) && segments[0] !== content.defaultLanguage;
      const routeKey = localized ? `${segments[0]}/${segments[1]}` : segments[0] ?? "root";
      const slots = { ...themeSlots2 == null ? void 0 : themeSlots2.site, ...(_b = themeSlots2 == null ? void 0 : themeSlots2.guides) == null ? void 0 : _b[routeKey] };
      return Object.fromEntries(Object.entries(slots).map(([slot, name]) => [slot, () => {
        if (!name) return null;
        const component = projectComponents[name];
        return component ? h(component) : null;
      }]));
    };
    const colorProperties = {
      primary: "--vp-c-brand-1",
      secondary: "--vp-c-brand-2",
      tertiary: "--vp-c-brand-3",
      soft: "--vp-c-brand-soft",
      sidebarIcon: "--vp-sidebar-icon-color",
      inlineCode: "--vp-code-color",
      heroNameColor: "--vp-home-hero-name-color",
      heroNameBackground: "--vp-home-hero-name-background"
    };
    const applyGuideColors = () => {
      const pathGuide = route.path.split("/").filter(Boolean)[0];
      const configured = guideColors;
      const colors = configured[pathGuide] ?? Object.values(configured)[0] ?? {};
      const root2 = document.documentElement;
      for (const [key, property] of Object.entries(colorProperties)) {
        root2.style.removeProperty(property);
        const value = colors[key];
        if (typeof value === "string" && value.trim()) root2.style.setProperty(property, value.trim());
      }
      if (colors.primary && !colors.tertiary) root2.style.setProperty("--vp-c-brand-3", "var(--vp-c-brand-1)");
      if (colors.primary && !colors.soft) root2.style.setProperty("--vp-c-brand-soft", "color-mix(in srgb, var(--vp-c-brand-1) 14%, transparent)");
      root2.style.removeProperty("--docs-nav-logo-width");
      if (colors.logoWidth) root2.style.setProperty("--docs-nav-logo-width", colors.logoWidth);
      root2.style.removeProperty("--docs-nav-logo-height");
      if (colors.logoHeight) root2.style.setProperty("--docs-nav-logo-height", colors.logoHeight);
      let guideStyle = document.getElementById("configured-guide-styles");
      if (!guideStyle) {
        guideStyle = document.createElement("style");
        guideStyle.id = "configured-guide-styles";
        document.head.append(guideStyle);
      }
      const logoRules = colors.logoExtraStyle ? `.VPNavBarTitle .logo { ${colors.logoExtraStyle} }` : "";
      const codeBackgroundRules = [
        colors.inlineCodeBackgroundDarkMode ? `:root.dark { --vp-code-bg: ${colors.inlineCodeBackgroundDarkMode}; }` : "",
        colors.inlineCodeBackgroundLightMode ? `:root:not(.dark) { --vp-code-bg: ${colors.inlineCodeBackgroundLightMode}; }` : ""
      ].filter(Boolean).join("\n");
      guideStyle.textContent = `${logoRules}
${codeBackgroundRules}`;
      document.querySelectorAll(".VPNavBarTitle img.logo").forEach((logo) => {
        const source = logo.classList.contains("dark") ? colors.logoDark : colors.logoLight;
        if (typeof source === "string" && source && logo.getAttribute("src") !== source) logo.setAttribute("src", source);
        if (typeof colors.logoAlt === "string") logo.alt = colors.logoAlt;
      });
      const fontConfig = generatedFonts;
      const fonts = { ...fontConfig.site, ...fontConfig.guides[pathGuide] ?? {} };
      const fontRules = [];
      for (const role of ["body", "heading", "code"]) {
        const property = role === "body" ? "--vp-font-family-base" : role === "heading" ? "--vp-font-family-heading" : "--vp-font-family-mono";
        root2.style.removeProperty(property);
        const font = fonts[role];
        if (!font) continue;
        const family = JSON.stringify(font.family);
        root2.style.setProperty(property, `${family}, ${font.fallback}`);
        if (font.src) fontRules.push(`@font-face{font-family:${family};src:url(${JSON.stringify(font.src)}) format('${font.format}');font-style:${font.style};font-weight:${font.weight};font-display:swap}`);
      }
      let fontStyle = document.getElementById("configured-fonts");
      if (!fontStyle) {
        fontStyle = document.createElement("style");
        fontStyle.id = "configured-fonts";
        document.head.append(fontStyle);
      }
      fontStyle.textContent = fontRules.join("\n");
      if (colors.favicon) {
        let icon = document.querySelector("link[data-configured-favicon]");
        if (!icon) {
          icon = document.createElement("link");
          icon.rel = "icon";
          icon.dataset.configuredFavicon = "";
          document.head.append(icon);
        }
        icon.href = colors.favicon;
      }
    };
    let observer;
    let dialog;
    let dialogImage;
    let viewport;
    let themeObserver;
    let pointer;
    const syncDiagramTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      document.querySelectorAll(".mermaid-figure img, .mermaid-dialog img").forEach((image) => {
        const lightSource = image.dataset.lightSrc;
        const darkSource = image.dataset.darkSrc;
        if (!lightSource || !darkSource) return;
        const source = dark ? darkSource : lightSource;
        if (image.getAttribute("src") !== source) image.setAttribute("src", source);
      });
    };
    const installDialog = () => {
      if (dialog) return;
      dialog = document.createElement("dialog");
      dialog.className = "mermaid-dialog";
      dialog.setAttribute("aria-label", "Mermaid diagram viewer");
      const panel = document.createElement("div");
      panel.className = "mermaid-dialog__panel";
      const toolbar = document.createElement("div");
      toolbar.className = "mermaid-toolbar mermaid-toolbar--dialog";
      toolbar.append(
        actionButton("zoom-out", "Zoom out", "out"),
        actionButton("zoom-in", "Zoom in", "in"),
        actionButton("close", "Close diagram", "close")
      );
      viewport = document.createElement("div");
      viewport.className = "mermaid-dialog__viewport";
      dialogImage = document.createElement("img");
      dialogImage.alt = "Mermaid diagram";
      viewport.append(dialogImage);
      panel.append(toolbar, viewport);
      dialog.append(panel);
      document.body.append(dialog);
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog == null ? void 0 : dialog.close();
      });
      viewport.addEventListener("pointerdown", (event) => {
        if (event.target.closest("button")) return;
        pointer = { id: event.pointerId, x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add("is-dragging");
      });
      viewport.addEventListener("pointermove", (event) => {
        if (!pointer || pointer.id !== event.pointerId) return;
        viewport.scrollLeft = pointer.left - (event.clientX - pointer.x);
        viewport.scrollTop = pointer.top - (event.clientY - pointer.y);
      });
      const finishPan = () => {
        pointer = void 0;
        viewport == null ? void 0 : viewport.classList.remove("is-dragging");
      };
      viewport.addEventListener("pointerup", finishPan);
      viewport.addEventListener("pointercancel", finishPan);
    };
    const openDiagram = (figure) => {
      var _a;
      installDialog();
      const source = figure.querySelector("img");
      if (!dialog || !dialogImage || !viewport || !source) return;
      const lightSource = source.dataset.lightSrc || source.getAttribute("src") || source.src;
      const darkSource = source.dataset.darkSrc || lightSource.replace(/\.svg$/, ".dark.svg");
      dialogImage.dataset.lightSrc = lightSource;
      dialogImage.dataset.darkSrc = darkSource;
      dialogImage.src = document.documentElement.classList.contains("dark") ? darkSource : lightSource;
      dialogImage.alt = source.alt || "Mermaid diagram";
      setZoom(viewport, 1);
      viewport.scrollTo(0, 0);
      dialog.showModal();
      (_a = dialog.querySelector('[data-mermaid-action="close"]')) == null ? void 0 : _a.focus();
    };
    const installFigures = () => {
      const root2 = document.querySelector(".vp-doc");
      if (!root2) return;
      root2.querySelectorAll('img[alt="Mermaid diagram"]').forEach((image) => {
        var _a, _b;
        if (image.closest(".mermaid-figure")) return;
        const source = image.getAttribute("src") || image.src;
        const id = (_a = source.match(/([a-f0-9]{16})(?:\.[a-zA-Z0-9_-]+)?(?:\.dark)?\.svg(?:[?#].*)?$/)) == null ? void 0 : _a[1];
        if (!id) return;
        const figure = document.createElement("div");
        figure.className = "mermaid-figure";
        figure.dataset.zoom = "1";
        figure.tabIndex = 0;
        figure.setAttribute("role", "group");
        figure.setAttribute("aria-label", "Mermaid diagram. Use the controls to zoom or open a larger view.");
        image.dataset.lightSrc = `/mermaid/${id}.svg`;
        image.dataset.darkSrc = `/mermaid/${id}.dark.svg`;
        (_b = image.parentNode) == null ? void 0 : _b.insertBefore(figure, image);
        figure.append(image);
        const toolbar = document.createElement("div");
        toolbar.className = "mermaid-toolbar";
        toolbar.append(
          actionButton("zoom-out", "Zoom out", "out"),
          actionButton("zoom-in", "Zoom in", "in"),
          actionButton("open", "Open diagram in large view", "expand")
        );
        figure.append(toolbar);
        image.draggable = false;
      });
      syncDiagramTheme();
    };
    const handleClick = (event) => {
      var _a;
      const button = (_a = event.target) == null ? void 0 : _a.closest("[data-mermaid-action]");
      if (!button) return;
      const action = button.dataset.mermaidAction;
      if (action === "close") {
        dialog == null ? void 0 : dialog.close();
        return;
      }
      const figure = button.closest(".mermaid-figure");
      if (action === "open" && figure) {
        openDiagram(figure);
        return;
      }
      const inDialog = button.closest("dialog");
      const target = inDialog ? viewport : figure;
      if (!target) return;
      const current = Number(target.dataset.zoom || "1");
      const next = action === "zoom-in" ? current + zoomStep : current - zoomStep;
      setZoom(target, next);
    };
    const handleKeydown = (event) => {
      var _a;
      if (event.target instanceof Element && event.target.closest("button")) return;
      const figure = (_a = event.target) == null ? void 0 : _a.closest(".mermaid-figure");
      if (!figure || event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openDiagram(figure);
    };
    const installPageEnhancements = () => {
      installFigures();
      installPagerIcons();
    };
    onMounted(() => {
      applyGuideColors();
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleKeydown);
      observer = new MutationObserver(installPageEnhancements);
      observer.observe(document.body, { childList: true, subtree: true });
      themeObserver = new MutationObserver(() => {
        applyGuideColors();
        syncDiagramTheme();
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      void nextTick(installPageEnhancements);
    });
    const stopWatchingRoute = watch(() => route.path, () => void nextTick(() => {
      applyGuideColors();
      installPageEnhancements();
    }), { flush: "post" });
    onBeforeUnmount(() => {
      stopWatchingRoute();
      observer == null ? void 0 : observer.disconnect();
      themeObserver == null ? void 0 : themeObserver.disconnect();
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeydown);
      dialog == null ? void 0 : dialog.remove();
    });
    const { frontmatter, lang } = useData$1();
    const collectionForPage = () => generatedCollections.find((collection) => collection.id === frontmatter.value.collection);
    const articleLayout = () => {
      var _a;
      return ((_a = collectionForPage()) == null ? void 0 : _a.layout) === "article";
    };
    const articleCollectionLink = () => {
      const collection = collectionForPage();
      const locale = String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split("-")[0];
      return (collection == null ? void 0 : collection.links[locale]) ?? (collection == null ? void 0 : collection.links.en) ?? "/";
    };
    return () => {
      const layoutSlots = configuredLayoutSlots();
      const configuredSubnav = layoutSlots["nav-bar-content-after"];
      const renderedSubnav = configuredSubnav == null ? void 0 : configuredSubnav();
      const subnavComponent = renderedSubnav == null ? void 0 : renderedSubnav.type;
      return h(theme.Layout, null, {
        ...layoutSlots,
        "nav-bar-content-after": () => articleLayout() && subnavComponent ? h(subnavComponent, null, { actions: () => h(PageActions) }) : renderedSubnav,
        "doc-before": () => h(DocumentationNotice, { notices: siteContent.documentationNotices }),
        "doc-after": () => {
          var _a, _b;
          return articleLayout() ? h("nav", { class: "collection-article-footer", "aria-label": "Collection navigation" }, [
            h("a", { href: articleCollectionLink() }, ((_a = collectionForPage()) == null ? void 0 : _a.titles[String(frontmatter.value.requestedLanguage || lang.value).toLowerCase().split("-")[0]]) ?? ((_b = collectionForPage()) == null ? void 0 : _b.titles.en))
          ]) : null;
        },
        "aside-outline-before": () => h(Fragment, null, [articleLayout() ? null : h(PageActions), h(DocumentationLastModified)])
      });
    };
  }
};
const RawTheme = {
  ...theme,
  Layout: MermaidLayout,
  enhanceApp(context) {
    var _a;
    (_a = theme.enhanceApp) == null ? void 0 : _a.call(theme, context);
    registerProjectComponents(context.app);
  }
};
const ClientOnly = defineComponent({
  setup(_, { slots }) {
    const show = ref(false);
    onMounted(() => {
      show.value = true;
    });
    return () => show.value && slots.default ? slots.default() : null;
  }
});
function useCodeGroups() {
  if (inBrowser) {
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches(".vp-code-group input")) {
        const group = (_a = el.parentElement) == null ? void 0 : _a.parentElement;
        if (!group)
          return;
        const i = Array.from(group.querySelectorAll("input")).indexOf(el);
        if (i < 0)
          return;
        const blocks = group.querySelector(".blocks");
        if (!blocks)
          return;
        const current = Array.from(blocks.children).find((child) => child.classList.contains("active"));
        if (!current)
          return;
        const next = blocks.children[i];
        if (!next || current === next)
          return;
        current.classList.remove("active");
        next.classList.add("active");
        const label = group == null ? void 0 : group.querySelector(`label[for="${el.id}"]`);
        label == null ? void 0 : label.scrollIntoView({ block: "nearest" });
      }
    });
  }
}
function useCopyCode() {
  if (inBrowser) {
    const timeoutIdMap = /* @__PURE__ */ new WeakMap();
    window.addEventListener("click", (e) => {
      var _a;
      const el = e.target;
      if (el.matches('div[class*="language-"] > button.copy')) {
        const parent = el.parentElement;
        const sibling = (_a = el.nextElementSibling) == null ? void 0 : _a.nextElementSibling;
        if (!parent || !sibling) {
          return;
        }
        const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className);
        const ignoredNodes = [".vp-copy-ignore", ".diff.remove"];
        const clone = sibling.cloneNode(true);
        clone.querySelectorAll(ignoredNodes.join(",")).forEach((node) => node.remove());
        let text = clone.textContent || "";
        if (isShell) {
          text = text.replace(/^ *(\$|>) /gm, "").trim();
        }
        copyToClipboard(text).then(() => {
          el.classList.add("copied");
          clearTimeout(timeoutIdMap.get(el));
          const timeoutId = setTimeout(() => {
            el.classList.remove("copied");
            el.blur();
            timeoutIdMap.delete(el);
          }, 2e3);
          timeoutIdMap.set(el, timeoutId);
        });
      }
    });
  }
}
async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text);
  } catch {
    const element = document.createElement("textarea");
    const previouslyFocusedElement = document.activeElement;
    element.value = text;
    element.setAttribute("readonly", "");
    element.style.contain = "strict";
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.fontSize = "12pt";
    const selection = document.getSelection();
    const originalRange = selection ? selection.rangeCount > 0 && selection.getRangeAt(0) : null;
    document.body.appendChild(element);
    element.select();
    element.selectionStart = 0;
    element.selectionEnd = text.length;
    document.execCommand("copy");
    document.body.removeChild(element);
    if (originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}
function useUpdateHead(route, siteDataByRouteRef) {
  let isFirstUpdate = true;
  let managedHeadElements = [];
  const updateHeadTags = (newTags) => {
    if (isFirstUpdate) {
      isFirstUpdate = false;
      newTags.forEach((tag) => {
        const headEl = createHeadElement(tag);
        for (const el of document.head.children) {
          if (el.isEqualNode(headEl)) {
            managedHeadElements.push(el);
            return;
          }
        }
      });
      return;
    }
    const newElements = newTags.map(createHeadElement);
    managedHeadElements.forEach((oldEl, oldIndex) => {
      const matchedIndex = newElements.findIndex((newEl) => newEl == null ? void 0 : newEl.isEqualNode(oldEl ?? null));
      if (matchedIndex !== -1) {
        delete newElements[matchedIndex];
      } else {
        oldEl == null ? void 0 : oldEl.remove();
        delete managedHeadElements[oldIndex];
      }
    });
    newElements.forEach((el) => el && document.head.appendChild(el));
    managedHeadElements = [...managedHeadElements, ...newElements].filter(Boolean);
  };
  watchEffect(() => {
    const pageData = route.data;
    const siteData2 = siteDataByRouteRef.value;
    const pageDescription = pageData && pageData.description;
    const frontmatterHead = pageData && pageData.frontmatter.head || [];
    const title = createTitle(siteData2, pageData);
    if (title !== document.title) {
      document.title = title;
    }
    const description = pageDescription || siteData2.description;
    let metaDescriptionElement = document.querySelector(`meta[name=description]`);
    if (metaDescriptionElement) {
      if (metaDescriptionElement.getAttribute("content") !== description) {
        metaDescriptionElement.setAttribute("content", description);
      }
    } else {
      createHeadElement(["meta", { name: "description", content: description }]);
    }
    updateHeadTags(mergeHead(siteData2.head, filterOutHeadDescription(frontmatterHead)));
  });
}
function createHeadElement([tag, attrs, innerHTML]) {
  const el = document.createElement(tag);
  for (const key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
  if (innerHTML) {
    el.innerHTML = innerHTML;
  }
  if (tag === "script" && attrs.async == null) {
    el.async = false;
  }
  return el;
}
function isMetaDescription(headConfig) {
  return headConfig[0] === "meta" && headConfig[1] && headConfig[1].name === "description";
}
function filterOutHeadDescription(head) {
  return head.filter((h2) => !isMetaDescription(h2));
}
const hasFetched = /* @__PURE__ */ new Set();
const createLink = () => document.createElement("link");
const viaDOM = (url) => {
  const link2 = createLink();
  link2.rel = `prefetch`;
  link2.href = url;
  document.head.appendChild(link2);
};
const viaXHR = (url) => {
  const req = new XMLHttpRequest();
  req.open("GET", url, req.withCredentials = true);
  req.send();
};
let link;
const doFetch = inBrowser && (link = createLink()) && link.relList && link.relList.supports && link.relList.supports("prefetch") ? viaDOM : viaXHR;
function usePrefetch() {
  if (!inBrowser) {
    return;
  }
  if (!window.IntersectionObserver) {
    return;
  }
  let conn;
  if ((conn = navigator.connection) && (conn.saveData || /2g/.test(conn.effectiveType))) {
    return;
  }
  const rIC = window.requestIdleCallback || setTimeout;
  let observer = null;
  const observeLinks = () => {
    if (observer) {
      observer.disconnect();
    }
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link2 = entry.target;
          observer.unobserve(link2);
          const { pathname } = link2;
          if (!hasFetched.has(pathname)) {
            hasFetched.add(pathname);
            const pageChunkPath = pathToFile(pathname);
            if (pageChunkPath)
              doFetch(pageChunkPath);
          }
        }
      });
    });
    rIC(() => {
      document.querySelectorAll("#app a").forEach((link2) => {
        const { hostname, pathname } = new URL(link2.href instanceof SVGAnimatedString ? link2.href.animVal : link2.href, link2.baseURI);
        const extMatch = pathname.match(/\.\w+$/);
        if (extMatch && extMatch[0] !== ".html") {
          return;
        }
        if (
          // only prefetch same tab navigation, since a new tab will load
          // the lean js chunk instead.
          link2.target !== "_blank" && // only prefetch inbound links
          hostname === location.hostname
        ) {
          if (pathname !== location.pathname) {
            observer.observe(link2);
          } else {
            hasFetched.add(pathname);
          }
        }
      });
    });
  };
  onMounted(observeLinks);
  const route = useRoute();
  watch(() => route.path, observeLinks);
  onUnmounted(() => {
    observer && observer.disconnect();
  });
}
function resolveThemeExtends(theme2) {
  if (theme2.extends) {
    const base = resolveThemeExtends(theme2.extends);
    return {
      ...base,
      ...theme2,
      async enhanceApp(ctx) {
        if (base.enhanceApp)
          await base.enhanceApp(ctx);
        if (theme2.enhanceApp)
          await theme2.enhanceApp(ctx);
      }
    };
  }
  return theme2;
}
const Theme = resolveThemeExtends(RawTheme);
const VitePressApp = defineComponent({
  name: "VitePressApp",
  setup() {
    const { site: site2, lang, dir } = useData$1();
    onMounted(() => {
      watchEffect(() => {
        document.documentElement.lang = lang.value;
        document.documentElement.dir = dir.value;
      });
    });
    if (site2.value.router.prefetchLinks) {
      usePrefetch();
    }
    useCopyCode();
    useCodeGroups();
    if (Theme.setup)
      Theme.setup();
    return () => h(Theme.Layout);
  }
});
async function createApp() {
  globalThis.__VITEPRESS__ = true;
  const router = newRouter();
  const app = newApp();
  app.provide(RouterSymbol, router);
  const data = initData(router.route);
  app.provide(dataSymbol, data);
  app.component("Content", Content);
  app.component("ClientOnly", ClientOnly);
  Object.defineProperties(app.config.globalProperties, {
    $frontmatter: {
      get() {
        return data.frontmatter.value;
      }
    },
    $params: {
      get() {
        return data.page.value.params;
      }
    }
  });
  if (Theme.enhanceApp) {
    await Theme.enhanceApp({
      app,
      router,
      siteData: siteDataRef
    });
  }
  return { app, router, data };
}
function newApp() {
  return createSSRApp(VitePressApp);
}
function newRouter() {
  let isInitialPageLoad = inBrowser;
  return createRouter((path) => {
    let pageFilePath = pathToFile(path);
    let pageModule = null;
    if (pageFilePath) {
      if (isInitialPageLoad) {
        pageFilePath = pageFilePath.replace(/\.js$/, ".lean.js");
      }
      if (false) ;
      else {
        pageModule = import(
          /*@vite-ignore*/
          pageFilePath
        );
      }
    }
    if (inBrowser) {
      isInitialPageLoad = false;
    }
    return pageModule;
  }, Theme.NotFound);
}
if (inBrowser) {
  createApp().then(({ app, router, data }) => {
    router.go().then(() => {
      useUpdateHead(router.route, data.site);
      app.mount("#app");
    });
  });
}
async function render(path) {
  const { app, router } = await createApp();
  await router.go(path);
  const ctx = { content: "", vpSocialIcons: /* @__PURE__ */ new Set() };
  ctx.content = await renderToString(app, ctx);
  return ctx;
}
export {
  useRouter as a,
  createSearchTranslate as c,
  dataSymbol as d,
  escapeRegExp as e,
  inBrowser as i,
  pathToFile as p,
  render,
  useData as u
};
