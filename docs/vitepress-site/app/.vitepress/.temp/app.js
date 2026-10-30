import { ssrRenderAttrs, ssrRenderSlot, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderComponent, ssrRenderVNode, ssrRenderClass, renderToString } from "@vue/server-renderer";
import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { defineComponent, mergeProps, useSSRContext, shallowRef, inject, computed, ref, watch, onUnmounted, reactive, markRaw, readonly, nextTick, h, unref, onMounted, watchEffect, watchPostEffect, onUpdated, resolveComponent, createVNode, resolveDynamicComponent, withCtx, renderSlot, createTextVNode, toDisplayString, openBlock, createBlock, createCommentVNode, Fragment, renderList, defineAsyncComponent, provide, toHandlers, withKeys, onBeforeUnmount, useSlots, createSSRApp } from "@vue/runtime-dom";
import { usePreferredDark, useDark, useMediaQuery, useWindowSize, onKeyStroke, useWindowScroll, useScrollLock } from "@vueuse/core";
const _sfc_main$1a = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$1a = _sfc_main$1a.setup;
_sfc_main$1a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPBadge.vue");
  return _sfc_setup$1a ? _sfc_setup$1a(props, ctx) : void 0;
};
function deserializeFunctions(r) {
  return Array.isArray(r) ? r.map(deserializeFunctions) : typeof r == "object" && r !== null ? Object.keys(r).reduce((t, n) => (t[n] = deserializeFunctions(r[n]), t), {}) : typeof r == "string" && r.startsWith("_vp-fn_") ? new Function(`return ${r.slice(7)}`)() : r;
}
const siteData = deserializeFunctions(JSON.parse(`{"lang":"en","dir":"ltr","title":"Numerimondes","description":"A VitePress site","base":"/","head":[],"router":{"prefetchLinks":true},"appearance":"force-auto","themeConfig":{"nav":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTIgMTJoLjAxIi8+CiAgPHBhdGggZD0iTTE2IDZWNGEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MiIvPgogIDxwYXRoIGQ9Ik0yMiAxM2ExOC4xNSAxOC4xNSAwIDAgMS0yMCAwIi8+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiB4PSIyIiB5PSI2IiByeD0iMiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Services</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIzIiByeD0iMSIvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIzIiByeD0iMSIvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIxNCIgcng9IjEiLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIxNCIgcng9IjEiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>All services</span></span>","link":"/services/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMi45OTIgMTYuMzQyYTIgMiAwIDAgMSAuMDk0IDEuMTY3bC0xLjA2NSAzLjI5YTEgMSAwIDAgMCAxLjIzNiAxLjE2OGwzLjQxMy0uOTk4YTIgMiAwIDAgMSAxLjA5OS4wOTIgMTAgMTAgMCAxIDAtNC43NzctNC43MTkiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Consulting and audit</span></span>","link":"/services/consulting/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMTggMTYgNC00LTQtNCIvPgogIDxwYXRoIGQ9Im02IDgtNCA0IDQgNCIvPgogIDxwYXRoIGQ9Im0xNC41IDQtNSAxNiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Software and automation</span></span>","link":"/services/development/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTIgMjB2MiIvPgogIDxwYXRoIGQ9Ik0xMiAydjIiLz4KICA8cGF0aCBkPSJNMTcgMjB2MiIvPgogIDxwYXRoIGQ9Ik0xNyAydjIiLz4KICA8cGF0aCBkPSJNMiAxMmgyIi8+CiAgPHBhdGggZD0iTTIgMTdoMiIvPgogIDxwYXRoIGQ9Ik0yIDdoMiIvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIi8+CiAgPHBhdGggZD0iTTIwIDE3aDIiLz4KICA8cGF0aCBkPSJNMjAgN2gyIi8+CiAgPHBhdGggZD0iTTcgMjB2MiIvPgogIDxwYXRoIGQ9Ik03IDJ2MiIvPgogIDxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjIiLz4KICA8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiByeD0iMSIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Intelligence</span></span>","link":"/services/intelligence/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTcuNSAxOUg5YTcgNyAwIDEgMSA2LjcxLTloMS43OWE0LjUgNC41IDAgMSAxIDAgOVoiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Cloud and infrastructure</span></span>","link":"/services/cloud/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxwYXRoIGQ9Ik00IDIyaDE0YTIgMiAwIDAgMCAyLTJWN2wtNS01SDZhMiAyIDAgMCAwLTIgMnY0Ii8+CiAgICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIvPgogICAgPHBhdGggZD0ibTMgMTUgMiAyIDQtNCIvPgo8L3N2Zz4K')\\" aria-hidden=\\"true\\"></span><span>Tender support</span></span>","link":"/services/tender-support/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMi45NyAxMi45MkEyIDIgMCAwIDAgMiAxNC42M3YzLjI0YTIgMiAwIDAgMCAuOTcgMS43MWwzIDEuOGEyIDIgMCAwIDAgMi4wNiAwTDEyIDE5di01LjVsLTUtMy00LjAzIDIuNDJaIi8+CiAgPHBhdGggZD0ibTcgMTYuNS00Ljc0LTIuODUiLz4KICA8cGF0aCBkPSJtNyAxNi41IDUtMyIvPgogIDxwYXRoIGQ9Ik03IDE2LjV2NS4xNyIvPgogIDxwYXRoIGQ9Ik0xMiAxMy41VjE5bDMuOTcgMi4zOGEyIDIgMCAwIDAgMi4wNiAwbDMtMS44YTIgMiAwIDAgMCAuOTctMS43MXYtMy4yNGEyIDIgMCAwIDAtLjk3LTEuNzFMMTcgMTAuNWwtNSAzWiIvPgogIDxwYXRoIGQ9Im0xNyAxNi41LTUtMyIvPgogIDxwYXRoIGQ9Im0xNyAxNi41IDQuNzQtMi44NSIvPgogIDxwYXRoIGQ9Ik0xNyAxNi41djUuMTciLz4KICA8cGF0aCBkPSJNNy45NyA0LjQyQTIgMiAwIDAgMCA3IDYuMTN2NC4zN2w1IDMgNS0zVjYuMTNhMiAyIDAgMCAwLS45Ny0xLjcxbC0zLTEuOGEyIDIgMCAwIDAtMi4wNiAwbC0zIDEuOFoiLz4KICA8cGF0aCBkPSJNMTIgOCA3LjI2IDUuMTUiLz4KICA8cGF0aCBkPSJtMTIgOCA0Ljc0LTIuODUiLz4KICA8cGF0aCBkPSJNMTIgMTMuNVY4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Products</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMjgsODhhMzIsMzIsMCwwLDEsMzItMzJoNzJWMjAwSDE2MGEzMiwzMiwwLDAsMC0zMiwzMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxNiIvPjxwYXRoIGQ9Ik0yNCwyMDBIOTZhMzIsMzIsMCwwLDEsMzIsMzJWODhBMzIsMzIsMCwwLDAsOTYsNTZIMjRaIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE2Ii8+PC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Numerimondes documentation</span></span>","link":"/numerimondes/docs/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaIi8+CiAgPHBhdGggZD0ibTMuMyA3IDguNyA1IDguNy01Ii8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/numerimondes/docs/oss/webkernel/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTggMjFhOCA4IDAgMCAwLTE2IDAiLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjUiLz4KICA8cGF0aCBkPSJNMjIgMjBjMC0zLjM3LTItNi41LTQtOGE1IDUgMCAwIDAtLjQ1LTguMyIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>The Best Recruit</span></span>","link":"/services/cloud/platforms/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41Ii8+CiAgPHBhdGggZD0iTTkgMThoNiIvPgogIDxwYXRoIGQ9Ik0xMCAyMmg0Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Insights</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTQgMnY2YTIgMiAwIDAgMCAuMjQ1Ljk2bDUuNTEgMTAuMDhBMiAyIDAgMCAxIDE4IDIySDZhMiAyIDAgMCAxLTEuNzU1LTIuOTZsNS41MS0xMC4wOEEyIDIgMCAwIDAgMTAgOFYyIi8+CiAgPHBhdGggZD0iTTYuNDUzIDE1aDExLjA5NCIvPgogIDxwYXRoIGQ9Ik04LjUgMmg3Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Research</span></span>","link":"/research/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIvPgogIDxwYXRoIGQ9Ik0xNCAydjVhMSAxIDAgMCAwIDEgMWg1Ii8+CiAgPHBhdGggZD0iTTEwIDlIOCIvPgogIDxwYXRoIGQ9Ik0xNiAxM0g4Ii8+CiAgPHBhdGggZD0iTTE2IDE3SDgiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Publications</span></span>","link":"/research/publications/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41Ii8+CiAgPHBhdGggZD0iTTkgMThoNiIvPgogIDxwYXRoIGQ9Ik0xMCAyMmg0Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Concepts</span></span>","link":"/concepts/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMjEuNDIgMTAuOTIyYTEgMSAwIDAgMC0uMDE5LTEuODM4TDEyLjgzIDUuMThhMiAyIDAgMCAwLTEuNjYgMEwyLjYgOS4wOGExIDEgMCAwIDAgMCAxLjgzMmw4LjU3IDMuOTA4YTIgMiAwIDAgMCAxLjY2IDB6Ii8+CiAgPHBhdGggZD0iTTIyIDEwdjYiLz4KICA8cGF0aCBkPSJNNiAxMi41VjE2YTYgMyAwIDAgMCAxMiAwdi0zLjUiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Education</span></span>","link":"/education/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIvPgogIDxwYXRoIGQ9Ik0xNiAzLjEyOGE0IDQgMCAwIDEgMCA3Ljc0NCIvPgogIDxwYXRoIGQ9Ik0yMiAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3Ii8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Network</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMTEgMTcgMiAyYTEgMSAwIDEgMCAzLTMiLz4KICA8cGF0aCBkPSJtMTQgMTQgMi41IDIuNWExIDEgMCAxIDAgMy0zbC0zLjg4LTMuODhhMyAzIDAgMCAwLTQuMjQgMGwtLjg4Ljg4YTEgMSAwIDEgMS0zLTNsMi44MS0yLjgxYTUuNzkgNS43OSAwIDAgMSA3LjA2LS44N2wuNDcuMjhhMiAyIDAgMCAwIDEuNDIuMjVMMjEgNCIvPgogIDxwYXRoIGQ9Im0yMSAzIDEgMTFoLTIiLz4KICA8cGF0aCBkPSJNMyAzIDIgMTRsNi41IDYuNWExIDEgMCAxIDAgMy0zIi8+CiAgPHBhdGggZD0iTTMgNGg4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Partner framework</span></span>","link":"/partnerships/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMiAyMWE4IDggMCAwIDEgMTMuMjkyLTYiLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjUiLz4KICA8cGF0aCBkPSJNMTkgMTZ2NiIvPgogIDxwYXRoIGQ9Ik0yMiAxOWgtNiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Become a partner</span></span>","link":"/partnerships/become-partner/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTYgMTBhMiAyIDAgMCAxLTIgMkg2LjgyOGEyIDIgMCAwIDAtMS40MTQuNTg2bC0yLjIwMiAyLjIwMkEuNzEuNzEgMCAwIDEgMiAxNC4yODZWNGEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6Ii8+CiAgPHBhdGggZD0iTTIwIDlhMiAyIDAgMCAxIDIgMnYxMC4yODZhLjcxLjcxIDAgMCAxLTEuMjEyLjUwMmwtMi4yMDItMi4yMDJBMiAyIDAgMCAwIDE3LjE3MiAxOUgxMGEyIDIgMCAwIDEtMi0ydi0xIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Community</span></span>","link":"/community/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNOCAydjQiLz4KICA8cGF0aCBkPSJNMTYgMnY0Ii8+CiAgPHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSI0IiByeD0iMiIvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4Ii8+CiAgPHBhdGggZD0iTTggMTRoLjAxIi8+CiAgPHBhdGggZD0iTTEyIDE0aC4wMSIvPgogIDxwYXRoIGQ9Ik0xNiAxNGguMDEiLz4KICA8cGF0aCBkPSJNOCAxOGguMDEiLz4KICA8cGF0aCBkPSJNMTIgMThoLjAxIi8+CiAgPHBhdGggZD0iTTE2IDE4aC4wMSIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Events</span></span>","link":"/community/events/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTAgMTJoNCIvPgogIDxwYXRoIGQ9Ik0xMCA4aDQiLz4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIi8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIvPgogIDxwYXRoIGQ9Ik02IDIxVjVhMiAyIDAgMCAxIDItMmg4YTIgMiAwIDAgMSAyIDJ2MTYiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>About</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTAgMTJoNCIvPgogIDxwYXRoIGQ9Ik0xMCA4aDQiLz4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIi8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIvPgogIDxwYXRoIGQ9Ik02IDIxVjVhMiAyIDAgMCAxIDItMmg4YTIgMiAwIDAgMSAyIDJ2MTYiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Company</span></span>","link":"/about/company/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iMiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iOSIgeT0iMiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgcng9IjEiLz4KICA8cGF0aCBkPSJNNSAxNnYtM2ExIDEgMCAwIDEgMS0xaDEyYTEgMSAwIDAgMSAxIDF2MyIvPgogIDxwYXRoIGQ9Ik0xMiAxMlY4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Group</span></span>","link":"/about/company/group/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMjIgNy04Ljk5MSA1LjcyN2EyIDIgMCAwIDEtMi4wMDkgMEwyIDciLz4KICA8cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Contact</span></span>","link":"/contact/"}]}],"locales":{"fr":{"nav":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTIgMTJoLjAxIi8+CiAgPHBhdGggZD0iTTE2IDZWNGEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MiIvPgogIDxwYXRoIGQ9Ik0yMiAxM2ExOC4xNSAxOC4xNSAwIDAgMS0yMCAwIi8+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiB4PSIyIiB5PSI2IiByeD0iMiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Services</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIzIiByeD0iMSIvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIzIiByeD0iMSIvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIxNCIgcng9IjEiLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIxNCIgcng9IjEiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Tous les services</span></span>","link":"/services/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMi45OTIgMTYuMzQyYTIgMiAwIDAgMSAuMDk0IDEuMTY3bC0xLjA2NSAzLjI5YTEgMSAwIDAgMCAxLjIzNiAxLjE2OGwzLjQxMy0uOTk4YTIgMiAwIDAgMSAxLjA5OS4wOTIgMTAgMTAgMCAxIDAtNC43NzctNC43MTkiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Conseil et audit</span></span>","link":"/services/consulting/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMTggMTYgNC00LTQtNCIvPgogIDxwYXRoIGQ9Im02IDgtNCA0IDQgNCIvPgogIDxwYXRoIGQ9Im0xNC41IDQtNSAxNiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Logiciel et automatisation</span></span>","link":"/services/development/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTIgMjB2MiIvPgogIDxwYXRoIGQ9Ik0xMiAydjIiLz4KICA8cGF0aCBkPSJNMTcgMjB2MiIvPgogIDxwYXRoIGQ9Ik0xNyAydjIiLz4KICA8cGF0aCBkPSJNMiAxMmgyIi8+CiAgPHBhdGggZD0iTTIgMTdoMiIvPgogIDxwYXRoIGQ9Ik0yIDdoMiIvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIi8+CiAgPHBhdGggZD0iTTIwIDE3aDIiLz4KICA8cGF0aCBkPSJNMjAgN2gyIi8+CiAgPHBhdGggZD0iTTcgMjB2MiIvPgogIDxwYXRoIGQ9Ik03IDJ2MiIvPgogIDxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjIiLz4KICA8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiByeD0iMSIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Intelligence</span></span>","link":"/services/intelligence/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTcuNSAxOUg5YTcgNyAwIDEgMSA2LjcxLTloMS43OWE0LjUgNC41IDAgMSAxIDAgOVoiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Cloud et infrastructure</span></span>","link":"/services/cloud/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxwYXRoIGQ9Ik00IDIyaDE0YTIgMiAwIDAgMCAyLTJWN2wtNS01SDZhMiAyIDAgMCAwLTIgMnY0Ii8+CiAgICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIvPgogICAgPHBhdGggZD0ibTMgMTUgMiAyIDQtNCIvPgo8L3N2Zz4K')\\" aria-hidden=\\"true\\"></span><span>Appui aux appels d’offres</span></span>","link":"/services/tender-support/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMi45NyAxMi45MkEyIDIgMCAwIDAgMiAxNC42M3YzLjI0YTIgMiAwIDAgMCAuOTcgMS43MWwzIDEuOGEyIDIgMCAwIDAgMi4wNiAwTDEyIDE5di01LjVsLTUtMy00LjAzIDIuNDJaIi8+CiAgPHBhdGggZD0ibTcgMTYuNS00Ljc0LTIuODUiLz4KICA8cGF0aCBkPSJtNyAxNi41IDUtMyIvPgogIDxwYXRoIGQ9Ik03IDE2LjV2NS4xNyIvPgogIDxwYXRoIGQ9Ik0xMiAxMy41VjE5bDMuOTcgMi4zOGEyIDIgMCAwIDAgMi4wNiAwbDMtMS44YTIgMiAwIDAgMCAuOTctMS43MXYtMy4yNGEyIDIgMCAwIDAtLjk3LTEuNzFMMTcgMTAuNWwtNSAzWiIvPgogIDxwYXRoIGQ9Im0xNyAxNi41LTUtMyIvPgogIDxwYXRoIGQ9Im0xNyAxNi41IDQuNzQtMi44NSIvPgogIDxwYXRoIGQ9Ik0xNyAxNi41djUuMTciLz4KICA8cGF0aCBkPSJNNy45NyA0LjQyQTIgMiAwIDAgMCA3IDYuMTN2NC4zN2w1IDMgNS0zVjYuMTNhMiAyIDAgMCAwLS45Ny0xLjcxbC0zLTEuOGEyIDIgMCAwIDAtMi4wNiAwbC0zIDEuOFoiLz4KICA8cGF0aCBkPSJNMTIgOCA3LjI2IDUuMTUiLz4KICA8cGF0aCBkPSJtMTIgOCA0Ljc0LTIuODUiLz4KICA8cGF0aCBkPSJNMTIgMTMuNVY4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Produits</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMjgsODhhMzIsMzIsMCwwLDEsMzItMzJoNzJWMjAwSDE2MGEzMiwzMiwwLDAsMC0zMiwzMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxNiIvPjxwYXRoIGQ9Ik0yNCwyMDBIOTZhMzIsMzIsMCwwLDEsMzIsMzJWODhBMzIsMzIsMCwwLDAsOTYsNTZIMjRaIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE2Ii8+PC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Documentation Numerimondes</span></span>","link":"/numerimondes/docs/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaIi8+CiAgPHBhdGggZD0ibTMuMyA3IDguNyA1IDguNy01Ii8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/numerimondes/docs/oss/webkernel/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTggMjFhOCA4IDAgMCAwLTE2IDAiLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjUiLz4KICA8cGF0aCBkPSJNMjIgMjBjMC0zLjM3LTItNi41LTQtOGE1IDUgMCAwIDAtLjQ1LTguMyIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>The Best Recruit</span></span>","link":"/services/cloud/platforms/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41Ii8+CiAgPHBhdGggZD0iTTkgMThoNiIvPgogIDxwYXRoIGQ9Ik0xMCAyMmg0Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Ressources</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTQgMnY2YTIgMiAwIDAgMCAuMjQ1Ljk2bDUuNTEgMTAuMDhBMiAyIDAgMCAxIDE4IDIySDZhMiAyIDAgMCAxLTEuNzU1LTIuOTZsNS41MS0xMC4wOEEyIDIgMCAwIDAgMTAgOFYyIi8+CiAgPHBhdGggZD0iTTYuNDUzIDE1aDExLjA5NCIvPgogIDxwYXRoIGQ9Ik04LjUgMmg3Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Recherche</span></span>","link":"/research/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIvPgogIDxwYXRoIGQ9Ik0xNCAydjVhMSAxIDAgMCAwIDEgMWg1Ii8+CiAgPHBhdGggZD0iTTEwIDlIOCIvPgogIDxwYXRoIGQ9Ik0xNiAxM0g4Ii8+CiAgPHBhdGggZD0iTTE2IDE3SDgiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Publications</span></span>","link":"/research/publications/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41Ii8+CiAgPHBhdGggZD0iTTkgMThoNiIvPgogIDxwYXRoIGQ9Ik0xMCAyMmg0Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Concepts</span></span>","link":"/concepts/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMjEuNDIgMTAuOTIyYTEgMSAwIDAgMC0uMDE5LTEuODM4TDEyLjgzIDUuMThhMiAyIDAgMCAwLTEuNjYgMEwyLjYgOS4wOGExIDEgMCAwIDAgMCAxLjgzMmw4LjU3IDMuOTA4YTIgMiAwIDAgMCAxLjY2IDB6Ii8+CiAgPHBhdGggZD0iTTIyIDEwdjYiLz4KICA8cGF0aCBkPSJNNiAxMi41VjE2YTYgMyAwIDAgMCAxMiAwdi0zLjUiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Formation</span></span>","link":"/education/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIvPgogIDxwYXRoIGQ9Ik0xNiAzLjEyOGE0IDQgMCAwIDEgMCA3Ljc0NCIvPgogIDxwYXRoIGQ9Ik0yMiAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3Ii8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Réseau</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMTEgMTcgMiAyYTEgMSAwIDEgMCAzLTMiLz4KICA8cGF0aCBkPSJtMTQgMTQgMi41IDIuNWExIDEgMCAxIDAgMy0zbC0zLjg4LTMuODhhMyAzIDAgMCAwLTQuMjQgMGwtLjg4Ljg4YTEgMSAwIDEgMS0zLTNsMi44MS0yLjgxYTUuNzkgNS43OSAwIDAgMSA3LjA2LS44N2wuNDcuMjhhMiAyIDAgMCAwIDEuNDIuMjVMMjEgNCIvPgogIDxwYXRoIGQ9Im0yMSAzIDEgMTFoLTIiLz4KICA8cGF0aCBkPSJNMyAzIDIgMTRsNi41IDYuNWExIDEgMCAxIDAgMy0zIi8+CiAgPHBhdGggZD0iTTMgNGg4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Réseau de partenaires</span></span>","link":"/partnerships/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMiAyMWE4IDggMCAwIDEgMTMuMjkyLTYiLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjUiLz4KICA8cGF0aCBkPSJNMTkgMTZ2NiIvPgogIDxwYXRoIGQ9Ik0yMiAxOWgtNiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Devenir partenaire</span></span>","link":"/partnerships/become-partner/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTYgMTBhMiAyIDAgMCAxLTIgMkg2LjgyOGEyIDIgMCAwIDAtMS40MTQuNTg2bC0yLjIwMiAyLjIwMkEuNzEuNzEgMCAwIDEgMiAxNC4yODZWNGEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6Ii8+CiAgPHBhdGggZD0iTTIwIDlhMiAyIDAgMCAxIDIgMnYxMC4yODZhLjcxLjcxIDAgMCAxLTEuMjEyLjUwMmwtMi4yMDItMi4yMDJBMiAyIDAgMCAwIDE3LjE3MiAxOUgxMGEyIDIgMCAwIDEtMi0ydi0xIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Communauté</span></span>","link":"/community/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNOCAydjQiLz4KICA8cGF0aCBkPSJNMTYgMnY0Ii8+CiAgPHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSI0IiByeD0iMiIvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4Ii8+CiAgPHBhdGggZD0iTTggMTRoLjAxIi8+CiAgPHBhdGggZD0iTTEyIDE0aC4wMSIvPgogIDxwYXRoIGQ9Ik0xNiAxNGguMDEiLz4KICA8cGF0aCBkPSJNOCAxOGguMDEiLz4KICA8cGF0aCBkPSJNMTIgMThoLjAxIi8+CiAgPHBhdGggZD0iTTE2IDE4aC4wMSIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Événements</span></span>","link":"/community/events/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTAgMTJoNCIvPgogIDxwYXRoIGQ9Ik0xMCA4aDQiLz4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIi8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIvPgogIDxwYXRoIGQ9Ik02IDIxVjVhMiAyIDAgMCAxIDItMmg4YTIgMiAwIDAgMSAyIDJ2MTYiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>À propos</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTAgMTJoNCIvPgogIDxwYXRoIGQ9Ik0xMCA4aDQiLz4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIi8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIvPgogIDxwYXRoIGQ9Ik02IDIxVjVhMiAyIDAgMCAxIDItMmg4YTIgMiAwIDAgMSAyIDJ2MTYiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Entreprise</span></span>","link":"/about/company/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iMiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iOSIgeT0iMiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgcng9IjEiLz4KICA8cGF0aCBkPSJNNSAxNnYtM2ExIDEgMCAwIDEgMS0xaDEyYTEgMSAwIDAgMSAxIDF2MyIvPgogIDxwYXRoIGQ9Ik0xMiAxMlY4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Groupe</span></span>","link":"/about/company/group/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMjIgNy04Ljk5MSA1LjcyN2EyIDIgMCAwIDEtMi4wMDkgMEwyIDciLz4KICA8cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Contact</span></span>","link":"/contact/"}]}],"sidebar":{"/fr/commercial/":[],"/fr/about/":[{"text":"Home","link":"/fr/about/","collapsed":false,"items":[{"text":"assets","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c69a28b23402c72de4746b80d44f480e7eb1cb25c89b554d2656fa5ac52734ed.svg')\\" aria-hidden=\\"true\\"></span><span>Brand kit</span></span>","link":"/fr/about/assets/brand-kit/"}]},{"text":"company","collapsed":true,"items":[{"text":"about","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Culture</span></span>","link":"/fr/about/company/about/culture/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Story</span></span>","link":"/fr/about/company/about/story/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg')\\" aria-hidden=\\"true\\"></span><span>Values</span></span>","link":"/fr/about/company/about/values/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ba7f72e5958718fcce1abf4eaf04572306cf148032421861bfb6de19852aadfb.svg')\\" aria-hidden=\\"true\\"></span><span>Vision</span></span>","link":"/fr/about/company/about/vision/"}]},{"text":"careers","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/4fac7d3c7451de02e0a3573b7d5ee32bd505d9f8b81acffeeac25d5cb671c03f.svg')\\" aria-hidden=\\"true\\"></span><span>Apply</span></span>","link":"/fr/about/company/careers/apply/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Open positions</span></span>","link":"/fr/about/company/careers/open-positions/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg')\\" aria-hidden=\\"true\\"></span><span>Programs</span></span>","link":"/fr/about/company/careers/programs/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg')\\" aria-hidden=\\"true\\"></span><span>Group</span></span>","link":"/fr/about/company/group/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a5f0c6358b0c3f8c27be8c40f383c51586e22dd57af69363590260d92f98b62b.svg')\\" aria-hidden=\\"true\\"></span><span>Press</span></span>","link":"/fr/about/company/press/"},{"text":"team","collapsed":true,"items":[{"text":"employees","link":"/fr/about/company/team/employees/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/3d4225c63f203710bf37f09032162ca4766dbf98e19dc6332b312f1d660466aa.svg')\\" aria-hidden=\\"true\\"></span><span>Yassine El Moumen</span></span>","link":"/fr/about/company/team/employees/elmoumenyassine/"}]}]}]},{"text":"legal","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg')\\" aria-hidden=\\"true\\"></span><span>Notice</span></span>","link":"/fr/about/legal/notice/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>Overview</span></span>","link":"/fr/about/legal/overview/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/09980f4365b8f1d442bd797eee3d36d00716b96247188728dce270a4cd2dcdf8.svg')\\" aria-hidden=\\"true\\"></span><span>Payment methods</span></span>","link":"/fr/about/legal/payment-methods/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Privacy</span></span>","link":"/fr/about/legal/privacy/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg')\\" aria-hidden=\\"true\\"></span><span>Terms</span></span>","link":"/fr/about/legal/terms/"}]}]}],"/fr/numerimondes/docs/":[{"text":"Documentation","link":"/fr/numerimondes/docs/","collapsed":false,"items":[{"text":"oss","collapsed":true,"items":[{"text":"webkernel","link":"/fr/numerimondes/docs/oss/webkernel/","collapsed":true,"items":[{"text":"docs","collapsed":true,"items":[{"text":"x","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d988cafe8d6dadf1d03c51474da728d9c9cc23856df1f2a102b54738d20f72ad.svg')\\" aria-hidden=\\"true\\"></span><span>API reference</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ee0da7da72f08abcf42ea592198272678437643e27f41b59ff55c11279564eec.svg')\\" aria-hidden=\\"true\\"></span><span>Changelog</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/changelog/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Cookbook</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/9d44c8b6ebe76675fcc5bc1dbf0cf2960aed6d43ff60070c4737c2c8648c0550.svg')\\" aria-hidden=\\"true\\"></span><span>Demo</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/demo/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/489aa4d157f438cce6d3d16ed1da822553f279986be56b7b6395b350a79c3a40.svg')\\" aria-hidden=\\"true\\"></span><span>Deployment</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e56ef5866e655b2c93539ee5cf9e58b8a1a3ed6c2d4d40b7ece2bdf63a00ae82.svg')\\" aria-hidden=\\"true\\"></span><span>Getting started</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg')\\" aria-hidden=\\"true\\"></span><span>Modules</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/modules/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/bbc035522cd72fa212f479ed56b759c2453fd57507b8b4abeded067b76368923.svg')\\" aria-hidden=\\"true\\"></span><span>Roadmap</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ae026945e5317daca96cca4786210a4cb39a5abccf8183d75222818dab868c93.svg')\\" aria-hidden=\\"true\\"></span><span>Showcase</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/9f0829ae54959b4a28b37c7f5c5736576deb37f8c97370500e260f89602e841a.svg')\\" aria-hidden=\\"true\\"></span><span>Upgrade</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/upgrade/"}]}]}]}]}]}],"/fr/education/":[{"text":"Education Subsite","link":"/fr/education/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Catalogue</span></span>","link":"/fr/education/catalogue/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg')\\" aria-hidden=\\"true\\"></span><span>Institutional</span></span>","link":"/fr/education/institutional/"}]}],"/fr/research/":[{"text":"Home","link":"/fr/research/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/954c5ca39aaca04061c3ca52a0196f5dba670fa20c8a9fce94aebcb0a4225900.svg')\\" aria-hidden=\\"true\\"></span><span>Lab</span></span>","link":"/fr/research/lab/"},{"text":"publications","link":"/fr/research/publications/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Job market: actual state</span></span>","link":"/fr/research/publications/job-market-actual-state/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Neurobiologie de quand le travail est achevé</span></span>","link":"/fr/research/publications/neurobiologie-travail-acheve/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Push technology to its farthest possible development</span></span>","link":"/fr/research/publications/push-technology-farthest/"},{"text":"series","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Satisfaction when work is done</span></span>","link":"/fr/research/publications/series/satisfaction-when-work-is-done/"}]}]}]}],"/fr/community/":[{"text":"Community Subsite","link":"/fr/community/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg')\\" aria-hidden=\\"true\\"></span><span>Become a consultant</span></span>","link":"/fr/community/become-consultant/"},{"text":"contributors","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/588dc6e7a2a50f0f9cc96d9e0a07bd13b7852e1d76308dac769def4097c888f2.svg')\\" aria-hidden=\\"true\\"></span><span>Hall of fame</span></span>","link":"/fr/community/contributors/hall-of-fame/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5dc29f4ab404b670b6fd1d8b2600f34e24c6dc176fa73d14d0b7c552467d3d4e.svg')\\" aria-hidden=\\"true\\"></span><span>How to contribute</span></span>","link":"/fr/community/contributors/how-to-contribute/"}]},{"text":"events","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f1ee05126177875f079fb6becacaf88701445133fce03c32c9eb444a4f3d4e14.svg')\\" aria-hidden=\\"true\\"></span><span>Past</span></span>","link":"/fr/community/events/past/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8429569ba11344ff12b1af62bd7d8d846b708b827fc71659918c1d5da991b943.svg')\\" aria-hidden=\\"true\\"></span><span>Upcoming</span></span>","link":"/fr/community/events/upcoming/"}]},{"text":"forum","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg')\\" aria-hidden=\\"true\\"></span><span>Education</span></span>","link":"/fr/community/forum/education/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a41df70216764f388cca7003a7cc82229f88bb7605e9b5c2ea36049da7f37dda.svg')\\" aria-hidden=\\"true\\"></span><span>General</span></span>","link":"/fr/community/forum/general/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Jobs</span></span>","link":"/fr/community/forum/jobs/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/fr/community/forum/webkernel/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Freelance jobs</span></span>","link":"/fr/community/freelance-jobs/"}]}],"/fr/partnerships/":[{"text":"Partners Subsite","link":"/fr/partnerships/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e34ce005fb84f0fdc783e06735e7ad1c56c4c03295b251098b48a04eb2782b9b.svg')\\" aria-hidden=\\"true\\"></span><span>Become a partner</span></span>","link":"/fr/partnerships/become-partner/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/81159f113b7d22c990eead1b6e1d88adcef23ad0915d3ca53202939ef83bfe6e.svg')\\" aria-hidden=\\"true\\"></span><span>Current partners</span></span>","link":"/fr/partnerships/current-partners/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg')\\" aria-hidden=\\"true\\"></span><span>Institutional</span></span>","link":"/fr/partnerships/institutional/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d2477b9310a722d95dae7d0bdb79665d0c91feb5f2acf3e252bb9665fe6485db.svg')\\" aria-hidden=\\"true\\"></span><span>Overview</span></span>","link":"/fr/partnerships/overview/"}]}],"/fr/concepts/":[]},"outline":{"label":"On this page"},"footer":{"message":"Contactez-nous à <a href=\\"mailto:contact@numerimondes.com\\">contact@numerimondes.com</a>.","copyright":"Numerimondes SARL AU"},"langMenuLabel":"Changer de langue"}},"langMenuLabel":"Change language","socialLinks":[],"sidebar":{"/commercial/":[],"/about/":[{"text":"Home","link":"/about/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Assets</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c69a28b23402c72de4746b80d44f480e7eb1cb25c89b554d2656fa5ac52734ed.svg')\\" aria-hidden=\\"true\\"></span><span>Brand kit</span></span>","link":"/about/assets/brand-kit/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Company</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>About</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Culture</span></span>","link":"/about/company/about/culture/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Story</span></span>","link":"/about/company/about/story/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg')\\" aria-hidden=\\"true\\"></span><span>Values</span></span>","link":"/about/company/about/values/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ba7f72e5958718fcce1abf4eaf04572306cf148032421861bfb6de19852aadfb.svg')\\" aria-hidden=\\"true\\"></span><span>Vision</span></span>","link":"/about/company/about/vision/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Careers</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/4fac7d3c7451de02e0a3573b7d5ee32bd505d9f8b81acffeeac25d5cb671c03f.svg')\\" aria-hidden=\\"true\\"></span><span>Apply</span></span>","link":"/about/company/careers/apply/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Open positions</span></span>","link":"/about/company/careers/open-positions/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg')\\" aria-hidden=\\"true\\"></span><span>Programs</span></span>","link":"/about/company/careers/programs/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg')\\" aria-hidden=\\"true\\"></span><span>Group</span></span>","link":"/about/company/group/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a5f0c6358b0c3f8c27be8c40f383c51586e22dd57af69363590260d92f98b62b.svg')\\" aria-hidden=\\"true\\"></span><span>Press</span></span>","link":"/about/company/press/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Team</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Employees</span></span>","link":"/about/company/team/employees/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/3d4225c63f203710bf37f09032162ca4766dbf98e19dc6332b312f1d660466aa.svg')\\" aria-hidden=\\"true\\"></span><span>Yassine El Moumen</span></span>","link":"/about/company/team/employees/elmoumenyassine/"}]}]}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Legal</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg')\\" aria-hidden=\\"true\\"></span><span>Notice</span></span>","link":"/about/legal/notice/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>Overview</span></span>","link":"/about/legal/overview/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/09980f4365b8f1d442bd797eee3d36d00716b96247188728dce270a4cd2dcdf8.svg')\\" aria-hidden=\\"true\\"></span><span>Payment methods</span></span>","link":"/about/legal/payment-methods/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Privacy</span></span>","link":"/about/legal/privacy/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg')\\" aria-hidden=\\"true\\"></span><span>Terms</span></span>","link":"/about/legal/terms/"}]}]}],"/numerimondes/docs/":[{"text":"Documentation","link":"/numerimondes/docs/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Oss</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/numerimondes/docs/oss/webkernel/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Docs</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>X</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d988cafe8d6dadf1d03c51474da728d9c9cc23856df1f2a102b54738d20f72ad.svg')\\" aria-hidden=\\"true\\"></span><span>API reference</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/architecture/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ee0da7da72f08abcf42ea592198272678437643e27f41b59ff55c11279564eec.svg')\\" aria-hidden=\\"true\\"></span><span>Changelog</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/changelog/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/contributing/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Cookbook</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/9d44c8b6ebe76675fcc5bc1dbf0cf2960aed6d43ff60070c4737c2c8648c0550.svg')\\" aria-hidden=\\"true\\"></span><span>Demo</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/demo/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/489aa4d157f438cce6d3d16ed1da822553f279986be56b7b6395b350a79c3a40.svg')\\" aria-hidden=\\"true\\"></span><span>Deployment</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/deployment/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e56ef5866e655b2c93539ee5cf9e58b8a1a3ed6c2d4d40b7ece2bdf63a00ae82.svg')\\" aria-hidden=\\"true\\"></span><span>Getting started</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg')\\" aria-hidden=\\"true\\"></span><span>Modules</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/modules/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/bbc035522cd72fa212f479ed56b759c2453fd57507b8b4abeded067b76368923.svg')\\" aria-hidden=\\"true\\"></span><span>Roadmap</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ae026945e5317daca96cca4786210a4cb39a5abccf8183d75222818dab868c93.svg')\\" aria-hidden=\\"true\\"></span><span>Showcase</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/showcase/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/9f0829ae54959b4a28b37c7f5c5736576deb37f8c97370500e260f89602e841a.svg')\\" aria-hidden=\\"true\\"></span><span>Upgrade</span></span>","link":"/numerimondes/docs/oss/webkernel/docs/2.x/upgrade/"}]}]}]}]}]}],"/education/":[{"text":"Education Subsite","link":"/education/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Catalogue</span></span>","link":"/education/catalogue/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg')\\" aria-hidden=\\"true\\"></span><span>Institutional</span></span>","link":"/education/institutional/"}]}],"/research/":[{"text":"Home","link":"/research/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/954c5ca39aaca04061c3ca52a0196f5dba670fa20c8a9fce94aebcb0a4225900.svg')\\" aria-hidden=\\"true\\"></span><span>Lab</span></span>","link":"/research/lab/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Publications</span></span>","link":"/research/publications/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Job market: actual state</span></span>","link":"/research/publications/job-market-actual-state/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Neurobiologie de quand le travail est achevé</span></span>","link":"/research/publications/neurobiologie-travail-acheve/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Push technology to its farthest possible development</span></span>","link":"/research/publications/push-technology-farthest/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Series</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Satisfaction when work is done</span></span>","link":"/research/publications/series/satisfaction-when-work-is-done/"}]}]}]}],"/community/":[{"text":"Community Subsite","link":"/community/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg')\\" aria-hidden=\\"true\\"></span><span>Become a consultant</span></span>","link":"/community/become-consultant/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Contributors</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/588dc6e7a2a50f0f9cc96d9e0a07bd13b7852e1d76308dac769def4097c888f2.svg')\\" aria-hidden=\\"true\\"></span><span>Hall of fame</span></span>","link":"/community/contributors/hall-of-fame/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5dc29f4ab404b670b6fd1d8b2600f34e24c6dc176fa73d14d0b7c552467d3d4e.svg')\\" aria-hidden=\\"true\\"></span><span>How to contribute</span></span>","link":"/community/contributors/how-to-contribute/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Events</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f1ee05126177875f079fb6becacaf88701445133fce03c32c9eb444a4f3d4e14.svg')\\" aria-hidden=\\"true\\"></span><span>Past</span></span>","link":"/community/events/past/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8429569ba11344ff12b1af62bd7d8d846b708b827fc71659918c1d5da991b943.svg')\\" aria-hidden=\\"true\\"></span><span>Upcoming</span></span>","link":"/community/events/upcoming/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Forum</span></span>","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg')\\" aria-hidden=\\"true\\"></span><span>Education</span></span>","link":"/community/forum/education/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a41df70216764f388cca7003a7cc82229f88bb7605e9b5c2ea36049da7f37dda.svg')\\" aria-hidden=\\"true\\"></span><span>General</span></span>","link":"/community/forum/general/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Jobs</span></span>","link":"/community/forum/jobs/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/community/forum/webkernel/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Freelance jobs</span></span>","link":"/community/freelance-jobs/"}]}],"/partnerships/":[{"text":"Partners Subsite","link":"/partnerships/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e34ce005fb84f0fdc783e06735e7ad1c56c4c03295b251098b48a04eb2782b9b.svg')\\" aria-hidden=\\"true\\"></span><span>Become a partner</span></span>","link":"/partnerships/become-partner/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/81159f113b7d22c990eead1b6e1d88adcef23ad0915d3ca53202939ef83bfe6e.svg')\\" aria-hidden=\\"true\\"></span><span>Current partners</span></span>","link":"/partnerships/current-partners/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg')\\" aria-hidden=\\"true\\"></span><span>Institutional</span></span>","link":"/partnerships/institutional/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d2477b9310a722d95dae7d0bdb79665d0c91feb5f2acf3e252bb9665fe6485db.svg')\\" aria-hidden=\\"true\\"></span><span>Overview</span></span>","link":"/partnerships/overview/"}]}],"/concepts/":[]},"search":{"provider":"local","options":{"miniSearch":{"searchOptions":{"fuzzy":0.2,"prefix":true,"boost":{"title":4,"text":2,"titles":1}}},"locales":{"root":{"translations":{"button":{"buttonText":"Search","buttonAriaLabel":"Search this site"},"modal":{"displayDetails":"Display details","resetButtonTitle":"Reset search","backButtonTitle":"Close search","noResultsText":"No results","footer":{"selectText":"Select","selectKeyAriaLabel":"Enter","navigateText":"Navigate","navigateUpKeyAriaLabel":"Arrow up","navigateDownKeyAriaLabel":"Arrow down","closeText":"Close","closeKeyAriaLabel":"Escape"}}}},"fr":{"translations":{"button":{"buttonText":"Rechercher","buttonAriaLabel":"Rechercher this site"},"modal":{"displayDetails":"Display details","resetButtonTitle":"Reset search","backButtonTitle":"Close search","noResultsText":"Aucun résultat","footer":{"selectText":"Select","selectKeyAriaLabel":"Enter","navigateText":"Navigate","navigateUpKeyAriaLabel":"Arrow up","navigateDownKeyAriaLabel":"Arrow down","closeText":"Close","closeKeyAriaLabel":"Escape"}}}}}}},"outline":{"label":"On this page","level":"deep"},"aside":true,"footer":{"message":"Get in touch at <a href=\\"mailto:contact@numerimondes.com\\">contact@numerimondes.com</a>.","copyright":"Numerimondes SARL AU"},"logo":{"light":"/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg","dark":"/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg","alt":"Numerimondes"},"siteTitle":false},"locales":{"root":{"label":"<span class=\\"docs-language-label\\"><img src=\\"/flags/language/en.svg\\" alt=\\"\\" aria-hidden=\\"true\\">English</span>","lang":"en"},"fr":{"label":"<span class=\\"docs-language-label\\"><img src=\\"/flags/language/fr.svg\\" alt=\\"\\" aria-hidden=\\"true\\">Français</span>","lang":"fr","link":"/fr/","themeConfig":{"nav":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTIgMTJoLjAxIi8+CiAgPHBhdGggZD0iTTE2IDZWNGEyIDIgMCAwIDAtMi0yaC00YTIgMiAwIDAgMC0yIDJ2MiIvPgogIDxwYXRoIGQ9Ik0yMiAxM2ExOC4xNSAxOC4xNSAwIDAgMS0yMCAwIi8+CiAgPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjE0IiB4PSIyIiB5PSI2IiByeD0iMiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Services</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIzIiByeD0iMSIvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIzIiByeD0iMSIvPgogIDxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjciIHg9IjE0IiB5PSIxNCIgcng9IjEiLz4KICA8cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSI3IiB4PSIzIiB5PSIxNCIgcng9IjEiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Tous les services</span></span>","link":"/services/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMi45OTIgMTYuMzQyYTIgMiAwIDAgMSAuMDk0IDEuMTY3bC0xLjA2NSAzLjI5YTEgMSAwIDAgMCAxLjIzNiAxLjE2OGwzLjQxMy0uOTk4YTIgMiAwIDAgMSAxLjA5OS4wOTIgMTAgMTAgMCAxIDAtNC43NzctNC43MTkiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Conseil et audit</span></span>","link":"/services/consulting/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMTggMTYgNC00LTQtNCIvPgogIDxwYXRoIGQ9Im02IDgtNCA0IDQgNCIvPgogIDxwYXRoIGQ9Im0xNC41IDQtNSAxNiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Logiciel et automatisation</span></span>","link":"/services/development/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTIgMjB2MiIvPgogIDxwYXRoIGQ9Ik0xMiAydjIiLz4KICA8cGF0aCBkPSJNMTcgMjB2MiIvPgogIDxwYXRoIGQ9Ik0xNyAydjIiLz4KICA8cGF0aCBkPSJNMiAxMmgyIi8+CiAgPHBhdGggZD0iTTIgMTdoMiIvPgogIDxwYXRoIGQ9Ik0yIDdoMiIvPgogIDxwYXRoIGQ9Ik0yMCAxMmgyIi8+CiAgPHBhdGggZD0iTTIwIDE3aDIiLz4KICA8cGF0aCBkPSJNMjAgN2gyIi8+CiAgPHBhdGggZD0iTTcgMjB2MiIvPgogIDxwYXRoIGQ9Ik03IDJ2MiIvPgogIDxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgcng9IjIiLz4KICA8cmVjdCB4PSI4IiB5PSI4IiB3aWR0aD0iOCIgaGVpZ2h0PSI4IiByeD0iMSIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Intelligence</span></span>","link":"/services/intelligence/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTcuNSAxOUg5YTcgNyAwIDEgMSA2LjcxLTloMS43OWE0LjUgNC41IDAgMSAxIDAgOVoiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Cloud et infrastructure</span></span>","link":"/services/cloud/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICAgIDxwYXRoIGQ9Ik00IDIyaDE0YTIgMiAwIDAgMCAyLTJWN2wtNS01SDZhMiAyIDAgMCAwLTIgMnY0Ii8+CiAgICA8cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIvPgogICAgPHBhdGggZD0ibTMgMTUgMiAyIDQtNCIvPgo8L3N2Zz4K')\\" aria-hidden=\\"true\\"></span><span>Appui aux appels d’offres</span></span>","link":"/services/tender-support/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMi45NyAxMi45MkEyIDIgMCAwIDAgMiAxNC42M3YzLjI0YTIgMiAwIDAgMCAuOTcgMS43MWwzIDEuOGEyIDIgMCAwIDAgMi4wNiAwTDEyIDE5di01LjVsLTUtMy00LjAzIDIuNDJaIi8+CiAgPHBhdGggZD0ibTcgMTYuNS00Ljc0LTIuODUiLz4KICA8cGF0aCBkPSJtNyAxNi41IDUtMyIvPgogIDxwYXRoIGQ9Ik03IDE2LjV2NS4xNyIvPgogIDxwYXRoIGQ9Ik0xMiAxMy41VjE5bDMuOTcgMi4zOGEyIDIgMCAwIDAgMi4wNiAwbDMtMS44YTIgMiAwIDAgMCAuOTctMS43MXYtMy4yNGEyIDIgMCAwIDAtLjk3LTEuNzFMMTcgMTAuNWwtNSAzWiIvPgogIDxwYXRoIGQ9Im0xNyAxNi41LTUtMyIvPgogIDxwYXRoIGQ9Im0xNyAxNi41IDQuNzQtMi44NSIvPgogIDxwYXRoIGQ9Ik0xNyAxNi41djUuMTciLz4KICA8cGF0aCBkPSJNNy45NyA0LjQyQTIgMiAwIDAgMCA3IDYuMTN2NC4zN2w1IDMgNS0zVjYuMTNhMiAyIDAgMCAwLS45Ny0xLjcxbC0zLTEuOGEyIDIgMCAwIDAtMi4wNiAwbC0zIDEuOFoiLz4KICA8cGF0aCBkPSJNMTIgOCA3LjI2IDUuMTUiLz4KICA8cGF0aCBkPSJtMTIgOCA0Ljc0LTIuODUiLz4KICA8cGF0aCBkPSJNMTIgMTMuNVY4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Produits</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0xMjgsODhhMzIsMzIsMCwwLDEsMzItMzJoNzJWMjAwSDE2MGEzMiwzMiwwLDAsMC0zMiwzMiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIxNiIvPjxwYXRoIGQ9Ik0yNCwyMDBIOTZhMzIsMzIsMCwwLDEsMzIsMzJWODhBMzIsMzIsMCwwLDAsOTYsNTZIMjRaIiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjE2Ii8+PC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Documentation Numerimondes</span></span>","link":"/numerimondes/docs/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaIi8+CiAgPHBhdGggZD0ibTMuMyA3IDguNyA1IDguNy01Ii8+CiAgPHBhdGggZD0iTTEyIDIyVjEyIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/numerimondes/docs/oss/webkernel/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTggMjFhOCA4IDAgMCAwLTE2IDAiLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjUiLz4KICA8cGF0aCBkPSJNMjIgMjBjMC0zLjM3LTItNi41LTQtOGE1IDUgMCAwIDAtLjQ1LTguMyIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>The Best Recruit</span></span>","link":"/services/cloud/platforms/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41Ii8+CiAgPHBhdGggZD0iTTkgMThoNiIvPgogIDxwYXRoIGQ9Ik0xMCAyMmg0Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Ressources</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTQgMnY2YTIgMiAwIDAgMCAuMjQ1Ljk2bDUuNTEgMTAuMDhBMiAyIDAgMCAxIDE4IDIySDZhMiAyIDAgMCAxLTEuNzU1LTIuOTZsNS41MS0xMC4wOEEyIDIgMCAwIDAgMTAgOFYyIi8+CiAgPHBhdGggZD0iTTYuNDUzIDE1aDExLjA5NCIvPgogIDxwYXRoIGQ9Ik04LjUgMmg3Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Recherche</span></span>","link":"/research/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNNiAyMmEyIDIgMCAwIDEtMi0yVjRhMiAyIDAgMCAxIDItMmg4YTIuNCAyLjQgMCAwIDEgMS43MDQuNzA2bDMuNTg4IDMuNTg4QTIuNCAyLjQgMCAwIDEgMjAgOHYxMmEyIDIgMCAwIDEtMiAyeiIvPgogIDxwYXRoIGQ9Ik0xNCAydjVhMSAxIDAgMCAwIDEgMWg1Ii8+CiAgPHBhdGggZD0iTTEwIDlIOCIvPgogIDxwYXRoIGQ9Ik0xNiAxM0g4Ii8+CiAgPHBhdGggZD0iTTE2IDE3SDgiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Publications</span></span>","link":"/research/publications/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTUgMTRjLjItMSAuNy0xLjcgMS41LTIuNSAxLS45IDEuNS0yLjIgMS41LTMuNUE2IDYgMCAwIDAgNiA4YzAgMSAuMiAyLjIgMS41IDMuNS43LjcgMS4zIDEuNSAxLjUgMi41Ii8+CiAgPHBhdGggZD0iTTkgMThoNiIvPgogIDxwYXRoIGQ9Ik0xMCAyMmg0Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Concepts</span></span>","link":"/concepts/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMjEuNDIgMTAuOTIyYTEgMSAwIDAgMC0uMDE5LTEuODM4TDEyLjgzIDUuMThhMiAyIDAgMCAwLTEuNjYgMEwyLjYgOS4wOGExIDEgMCAwIDAgMCAxLjgzMmw4LjU3IDMuOTA4YTIgMiAwIDAgMCAxLjY2IDB6Ii8+CiAgPHBhdGggZD0iTTIyIDEwdjYiLz4KICA8cGF0aCBkPSJNNiAxMi41VjE2YTYgMyAwIDAgMCAxMiAwdi0zLjUiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Formation</span></span>","link":"/education/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTYgMjF2LTJhNCA0IDAgMCAwLTQtNEg2YTQgNCAwIDAgMC00IDR2MiIvPgogIDxwYXRoIGQ9Ik0xNiAzLjEyOGE0IDQgMCAwIDEgMCA3Ljc0NCIvPgogIDxwYXRoIGQ9Ik0yMiAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3Ii8+CiAgPGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Réseau</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMTEgMTcgMiAyYTEgMSAwIDEgMCAzLTMiLz4KICA8cGF0aCBkPSJtMTQgMTQgMi41IDIuNWExIDEgMCAxIDAgMy0zbC0zLjg4LTMuODhhMyAzIDAgMCAwLTQuMjQgMGwtLjg4Ljg4YTEgMSAwIDEgMS0zLTNsMi44MS0yLjgxYTUuNzkgNS43OSAwIDAgMSA3LjA2LS44N2wuNDcuMjhhMiAyIDAgMCAwIDEuNDIuMjVMMjEgNCIvPgogIDxwYXRoIGQ9Im0yMSAzIDEgMTFoLTIiLz4KICA8cGF0aCBkPSJNMyAzIDIgMTRsNi41IDYuNWExIDEgMCAxIDAgMy0zIi8+CiAgPHBhdGggZD0iTTMgNGg4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Réseau de partenaires</span></span>","link":"/partnerships/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMiAyMWE4IDggMCAwIDEgMTMuMjkyLTYiLz4KICA8Y2lyY2xlIGN4PSIxMCIgY3k9IjgiIHI9IjUiLz4KICA8cGF0aCBkPSJNMTkgMTZ2NiIvPgogIDxwYXRoIGQ9Ik0yMiAxOWgtNiIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Devenir partenaire</span></span>","link":"/partnerships/become-partner/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTYgMTBhMiAyIDAgMCAxLTIgMkg2LjgyOGEyIDIgMCAwIDAtMS40MTQuNTg2bC0yLjIwMiAyLjIwMkEuNzEuNzEgMCAwIDEgMiAxNC4yODZWNGEyIDIgMCAwIDEgMi0yaDEwYTIgMiAwIDAgMSAyIDJ6Ii8+CiAgPHBhdGggZD0iTTIwIDlhMiAyIDAgMCAxIDIgMnYxMC4yODZhLjcxLjcxIDAgMCAxLTEuMjEyLjUwMmwtMi4yMDItMi4yMDJBMiAyIDAgMCAwIDE3LjE3MiAxOUgxMGEyIDIgMCAwIDEtMi0ydi0xIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Communauté</span></span>","link":"/community/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNOCAydjQiLz4KICA8cGF0aCBkPSJNMTYgMnY0Ii8+CiAgPHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSI0IiByeD0iMiIvPgogIDxwYXRoIGQ9Ik0zIDEwaDE4Ii8+CiAgPHBhdGggZD0iTTggMTRoLjAxIi8+CiAgPHBhdGggZD0iTTEyIDE0aC4wMSIvPgogIDxwYXRoIGQ9Ik0xNiAxNGguMDEiLz4KICA8cGF0aCBkPSJNOCAxOGguMDEiLz4KICA8cGF0aCBkPSJNMTIgMThoLjAxIi8+CiAgPHBhdGggZD0iTTE2IDE4aC4wMSIvPgo8L3N2Zz4=')\\" aria-hidden=\\"true\\"></span><span>Événements</span></span>","link":"/community/events/"}]},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTAgMTJoNCIvPgogIDxwYXRoIGQ9Ik0xMCA4aDQiLz4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIi8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIvPgogIDxwYXRoIGQ9Ik02IDIxVjVhMiAyIDAgMCAxIDItMmg4YTIgMiAwIDAgMSAyIDJ2MTYiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>À propos</span></span>","items":[{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJNMTAgMTJoNCIvPgogIDxwYXRoIGQ9Ik0xMCA4aDQiLz4KICA8cGF0aCBkPSJNMTQgMjF2LTNhMiAyIDAgMCAwLTQgMHYzIi8+CiAgPHBhdGggZD0iTTYgMTBINGEyIDIgMCAwIDAtMiAydjdhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjlhMiAyIDAgMCAwLTItMmgtMiIvPgogIDxwYXRoIGQ9Ik02IDIxVjVhMiAyIDAgMCAxIDItMmg4YTIgMiAwIDAgMSAyIDJ2MTYiLz4KPC9zdmc+')\\" aria-hidden=\\"true\\"></span><span>Entreprise</span></span>","link":"/about/company/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cmVjdCB4PSIxNiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iMiIgeT0iMTYiIHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHJ4PSIxIi8+CiAgPHJlY3QgeD0iOSIgeT0iMiIgd2lkdGg9IjYiIGhlaWdodD0iNiIgcng9IjEiLz4KICA8cGF0aCBkPSJNNSAxNnYtM2ExIDEgMCAwIDEgMS0xaDEyYTEgMSAwIDAgMSAxIDF2MyIvPgogIDxwYXRoIGQ9Ik0xMiAxMlY4Ii8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Groupe</span></span>","link":"/about/company/group/"},{"text":"<span class=\\"docs-topbar-item\\"><span class=\\"docs-topbar-icon\\" style=\\"--docs-topbar-icon-url: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj4KICA8cGF0aCBkPSJtMjIgNy04Ljk5MSA1LjcyN2EyIDIgMCAwIDEtMi4wMDkgMEwyIDciLz4KICA8cmVjdCB4PSIyIiB5PSI0IiB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHJ4PSIyIi8+Cjwvc3ZnPg==')\\" aria-hidden=\\"true\\"></span><span>Contact</span></span>","link":"/contact/"}]}],"sidebar":{"/fr/commercial/":[],"/fr/about/":[{"text":"Home","link":"/fr/about/","collapsed":false,"items":[{"text":"assets","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c69a28b23402c72de4746b80d44f480e7eb1cb25c89b554d2656fa5ac52734ed.svg')\\" aria-hidden=\\"true\\"></span><span>Brand kit</span></span>","link":"/fr/about/assets/brand-kit/"}]},{"text":"company","collapsed":true,"items":[{"text":"about","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg')\\" aria-hidden=\\"true\\"></span><span>Culture</span></span>","link":"/fr/about/company/about/culture/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Story</span></span>","link":"/fr/about/company/about/story/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg')\\" aria-hidden=\\"true\\"></span><span>Values</span></span>","link":"/fr/about/company/about/values/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ba7f72e5958718fcce1abf4eaf04572306cf148032421861bfb6de19852aadfb.svg')\\" aria-hidden=\\"true\\"></span><span>Vision</span></span>","link":"/fr/about/company/about/vision/"}]},{"text":"careers","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/4fac7d3c7451de02e0a3573b7d5ee32bd505d9f8b81acffeeac25d5cb671c03f.svg')\\" aria-hidden=\\"true\\"></span><span>Apply</span></span>","link":"/fr/about/company/careers/apply/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Open positions</span></span>","link":"/fr/about/company/careers/open-positions/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg')\\" aria-hidden=\\"true\\"></span><span>Programs</span></span>","link":"/fr/about/company/careers/programs/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg')\\" aria-hidden=\\"true\\"></span><span>Group</span></span>","link":"/fr/about/company/group/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a5f0c6358b0c3f8c27be8c40f383c51586e22dd57af69363590260d92f98b62b.svg')\\" aria-hidden=\\"true\\"></span><span>Press</span></span>","link":"/fr/about/company/press/"},{"text":"team","collapsed":true,"items":[{"text":"employees","link":"/fr/about/company/team/employees/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/3d4225c63f203710bf37f09032162ca4766dbf98e19dc6332b312f1d660466aa.svg')\\" aria-hidden=\\"true\\"></span><span>Yassine El Moumen</span></span>","link":"/fr/about/company/team/employees/elmoumenyassine/"}]}]}]},{"text":"legal","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg')\\" aria-hidden=\\"true\\"></span><span>Notice</span></span>","link":"/fr/about/legal/notice/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg')\\" aria-hidden=\\"true\\"></span><span>Overview</span></span>","link":"/fr/about/legal/overview/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/09980f4365b8f1d442bd797eee3d36d00716b96247188728dce270a4cd2dcdf8.svg')\\" aria-hidden=\\"true\\"></span><span>Payment methods</span></span>","link":"/fr/about/legal/payment-methods/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg')\\" aria-hidden=\\"true\\"></span><span>Privacy</span></span>","link":"/fr/about/legal/privacy/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg')\\" aria-hidden=\\"true\\"></span><span>Terms</span></span>","link":"/fr/about/legal/terms/"}]}]}],"/fr/numerimondes/docs/":[{"text":"Documentation","link":"/fr/numerimondes/docs/","collapsed":false,"items":[{"text":"oss","collapsed":true,"items":[{"text":"webkernel","link":"/fr/numerimondes/docs/oss/webkernel/","collapsed":true,"items":[{"text":"docs","collapsed":true,"items":[{"text":"x","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d988cafe8d6dadf1d03c51474da728d9c9cc23856df1f2a102b54738d20f72ad.svg')\\" aria-hidden=\\"true\\"></span><span>API reference</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg')\\" aria-hidden=\\"true\\"></span><span>Architecture</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ee0da7da72f08abcf42ea592198272678437643e27f41b59ff55c11279564eec.svg')\\" aria-hidden=\\"true\\"></span><span>Changelog</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/changelog/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg')\\" aria-hidden=\\"true\\"></span><span>Contributing</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Cookbook</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/9d44c8b6ebe76675fcc5bc1dbf0cf2960aed6d43ff60070c4737c2c8648c0550.svg')\\" aria-hidden=\\"true\\"></span><span>Demo</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/demo/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/489aa4d157f438cce6d3d16ed1da822553f279986be56b7b6395b350a79c3a40.svg')\\" aria-hidden=\\"true\\"></span><span>Deployment</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e56ef5866e655b2c93539ee5cf9e58b8a1a3ed6c2d4d40b7ece2bdf63a00ae82.svg')\\" aria-hidden=\\"true\\"></span><span>Getting started</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg')\\" aria-hidden=\\"true\\"></span><span>Modules</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/modules/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/bbc035522cd72fa212f479ed56b759c2453fd57507b8b4abeded067b76368923.svg')\\" aria-hidden=\\"true\\"></span><span>Roadmap</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ae026945e5317daca96cca4786210a4cb39a5abccf8183d75222818dab868c93.svg')\\" aria-hidden=\\"true\\"></span><span>Showcase</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/9f0829ae54959b4a28b37c7f5c5736576deb37f8c97370500e260f89602e841a.svg')\\" aria-hidden=\\"true\\"></span><span>Upgrade</span></span>","link":"/fr/numerimondes/docs/oss/webkernel/docs/2.x/upgrade/"}]}]}]}]}]}],"/fr/education/":[{"text":"Education Subsite","link":"/fr/education/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Catalogue</span></span>","link":"/fr/education/catalogue/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg')\\" aria-hidden=\\"true\\"></span><span>Institutional</span></span>","link":"/fr/education/institutional/"}]}],"/fr/research/":[{"text":"Home","link":"/fr/research/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/954c5ca39aaca04061c3ca52a0196f5dba670fa20c8a9fce94aebcb0a4225900.svg')\\" aria-hidden=\\"true\\"></span><span>Lab</span></span>","link":"/fr/research/lab/"},{"text":"publications","link":"/fr/research/publications/","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Job market: actual state</span></span>","link":"/fr/research/publications/job-market-actual-state/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Neurobiologie de quand le travail est achevé</span></span>","link":"/fr/research/publications/neurobiologie-travail-acheve/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg')\\" aria-hidden=\\"true\\"></span><span>Push technology to its farthest possible development</span></span>","link":"/fr/research/publications/push-technology-farthest/"},{"text":"series","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg')\\" aria-hidden=\\"true\\"></span><span>Satisfaction when work is done</span></span>","link":"/fr/research/publications/series/satisfaction-when-work-is-done/"}]}]}]}],"/fr/community/":[{"text":"Community Subsite","link":"/fr/community/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg')\\" aria-hidden=\\"true\\"></span><span>Become a consultant</span></span>","link":"/fr/community/become-consultant/"},{"text":"contributors","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/588dc6e7a2a50f0f9cc96d9e0a07bd13b7852e1d76308dac769def4097c888f2.svg')\\" aria-hidden=\\"true\\"></span><span>Hall of fame</span></span>","link":"/fr/community/contributors/hall-of-fame/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/5dc29f4ab404b670b6fd1d8b2600f34e24c6dc176fa73d14d0b7c552467d3d4e.svg')\\" aria-hidden=\\"true\\"></span><span>How to contribute</span></span>","link":"/fr/community/contributors/how-to-contribute/"}]},{"text":"events","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/f1ee05126177875f079fb6becacaf88701445133fce03c32c9eb444a4f3d4e14.svg')\\" aria-hidden=\\"true\\"></span><span>Past</span></span>","link":"/fr/community/events/past/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8429569ba11344ff12b1af62bd7d8d846b708b827fc71659918c1d5da991b943.svg')\\" aria-hidden=\\"true\\"></span><span>Upcoming</span></span>","link":"/fr/community/events/upcoming/"}]},{"text":"forum","collapsed":true,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg')\\" aria-hidden=\\"true\\"></span><span>Education</span></span>","link":"/fr/community/forum/education/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/a41df70216764f388cca7003a7cc82229f88bb7605e9b5c2ea36049da7f37dda.svg')\\" aria-hidden=\\"true\\"></span><span>General</span></span>","link":"/fr/community/forum/general/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Jobs</span></span>","link":"/fr/community/forum/jobs/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg')\\" aria-hidden=\\"true\\"></span><span>Webkernel</span></span>","link":"/fr/community/forum/webkernel/"}]},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg')\\" aria-hidden=\\"true\\"></span><span>Freelance jobs</span></span>","link":"/fr/community/freelance-jobs/"}]}],"/fr/partnerships/":[{"text":"Partners Subsite","link":"/fr/partnerships/","collapsed":false,"items":[{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/e34ce005fb84f0fdc783e06735e7ad1c56c4c03295b251098b48a04eb2782b9b.svg')\\" aria-hidden=\\"true\\"></span><span>Become a partner</span></span>","link":"/fr/partnerships/become-partner/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/81159f113b7d22c990eead1b6e1d88adcef23ad0915d3ca53202939ef83bfe6e.svg')\\" aria-hidden=\\"true\\"></span><span>Current partners</span></span>","link":"/fr/partnerships/current-partners/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg')\\" aria-hidden=\\"true\\"></span><span>Institutional</span></span>","link":"/fr/partnerships/institutional/"},{"text":"<span class=\\"sidebar-group-label\\"><span class=\\"sidebar-group-icon\\" style=\\"--sidebar-group-icon-url: url('/__docs-assets/d2477b9310a722d95dae7d0bdb79665d0c91feb5f2acf3e252bb9665fe6485db.svg')\\" aria-hidden=\\"true\\"></span><span>Overview</span></span>","link":"/fr/partnerships/overview/"}]}],"/fr/concepts/":[]},"outline":{"label":"On this page"},"footer":{"message":"Contactez-nous à <a href=\\"mailto:contact@numerimondes.com\\">contact@numerimondes.com</a>.","copyright":"Numerimondes SARL AU"},"langMenuLabel":"Changer de langue"}}},"scrollOffset":134,"cleanUrls":true}`));
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
  currentPath = normalize(`/${currentPath}`);
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath);
  }
  if (normalize(matchPath) !== currentPath) {
    return false;
  }
  const hashMatch = matchPath.match(HASH_RE);
  if (hashMatch) {
    return (inBrowser ? location.hash : "") === hashMatch[0];
  }
  return true;
}
function normalize(path) {
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
const _sfc_main$19 = /* @__PURE__ */ defineComponent({
  __name: "VPBackdrop",
  __ssrInlineRender: true,
  props: {
    show: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.show) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPBackdrop" }, _attrs))} data-v-c728ca0d></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$19 = _sfc_main$19.setup;
_sfc_main$19.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPBackdrop.vue");
  return _sfc_setup$19 ? _sfc_setup$19(props, ctx) : void 0;
};
const VPBackdrop = /* @__PURE__ */ _export_sfc(_sfc_main$19, [["__scopeId", "data-v-c728ca0d"]]);
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
const _sfc_main$18 = /* @__PURE__ */ defineComponent({
  __name: "NotFound",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const { currentLang } = useLangs();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "NotFound" }, _attrs))} data-v-54776f96><p class="code" data-v-54776f96>${ssrInterpolate(((_a = unref(theme2).notFound) == null ? void 0 : _a.code) ?? "404")}</p><h1 class="title" data-v-54776f96>${ssrInterpolate(((_b = unref(theme2).notFound) == null ? void 0 : _b.title) ?? "PAGE NOT FOUND")}</h1><div class="divider" data-v-54776f96></div><blockquote class="quote" data-v-54776f96>${ssrInterpolate(((_c = unref(theme2).notFound) == null ? void 0 : _c.quote) ?? "But if you don't change your direction, and if you keep looking, you may end up where you are heading.")}</blockquote><div class="action" data-v-54776f96><a class="link"${ssrRenderAttr("href", unref(withBase)(unref(currentLang).link))}${ssrRenderAttr("aria-label", ((_d = unref(theme2).notFound) == null ? void 0 : _d.linkLabel) ?? "go to home")} data-v-54776f96>${ssrInterpolate(((_e = unref(theme2).notFound) == null ? void 0 : _e.linkText) ?? "Take me home")}</a></div></div>`);
    };
  }
});
const _sfc_setup$18 = _sfc_main$18.setup;
_sfc_main$18.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/NotFound.vue");
  return _sfc_setup$18 ? _sfc_setup$18(props, ctx) : void 0;
};
const NotFound = /* @__PURE__ */ _export_sfc(_sfc_main$18, [["__scopeId", "data-v-54776f96"]]);
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
const _sfc_main$17 = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-c2574ecc><!--[-->`);
      ssrRenderList(__props.headers, ({ children, link: link2, title }) => {
        _push(`<li data-v-c2574ecc><a class="outline-link"${ssrRenderAttr("href", link2)}${ssrRenderAttr("title", title)} data-v-c2574ecc>${ssrInterpolate(title)}</a>`);
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
const _sfc_setup$17 = _sfc_main$17.setup;
_sfc_main$17.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocOutlineItem.vue");
  return _sfc_setup$17 ? _sfc_setup$17(props, ctx) : void 0;
};
const VPDocOutlineItem = /* @__PURE__ */ _export_sfc(_sfc_main$17, [["__scopeId", "data-v-c2574ecc"]]);
const _sfc_main$16 = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-f88f03df><div class="content" data-v-f88f03df><div class="outline-marker" data-v-f88f03df></div><div aria-level="2" class="outline-title" id="doc-outline-aria-label" role="heading" data-v-f88f03df>${ssrInterpolate(unref(resolveTitle)(unref(theme2)))}</div>`);
      _push(ssrRenderComponent(VPDocOutlineItem, {
        headers: headers.value,
        root: true
      }, null, _parent));
      _push(`</div></nav>`);
    };
  }
});
const _sfc_setup$16 = _sfc_main$16.setup;
_sfc_main$16.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideOutline.vue");
  return _sfc_setup$16 ? _sfc_setup$16(props, ctx) : void 0;
};
const VPDocAsideOutline = /* @__PURE__ */ _export_sfc(_sfc_main$16, [["__scopeId", "data-v-f88f03df"]]);
const _sfc_main$15 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$15 = _sfc_main$15.setup;
_sfc_main$15.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideCarbonAds.vue");
  return _sfc_setup$15 ? _sfc_setup$15(props, ctx) : void 0;
};
const _sfc_main$14 = /* @__PURE__ */ defineComponent({
  __name: "VPDocAside",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPDocAside" }, _attrs))} data-v-eb0753fd>`);
      ssrRenderSlot(_ctx.$slots, "aside-top", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "aside-outline-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(VPDocAsideOutline, null, null, _parent));
      ssrRenderSlot(_ctx.$slots, "aside-outline-after", {}, null, _push, _parent);
      _push(`<div class="spacer" data-v-eb0753fd></div>`);
      ssrRenderSlot(_ctx.$slots, "aside-ads-before", {}, null, _push, _parent);
      if (unref(theme2).carbonAds) {
        _push(ssrRenderComponent(_sfc_main$15, {
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
const _sfc_setup$14 = _sfc_main$14.setup;
_sfc_main$14.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocAside.vue");
  return _sfc_setup$14 ? _sfc_setup$14(props, ctx) : void 0;
};
const VPDocAside = /* @__PURE__ */ _export_sfc(_sfc_main$14, [["__scopeId", "data-v-eb0753fd"]]);
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
const _sfc_main$13 = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$13 = _sfc_main$13.setup;
_sfc_main$13.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPLink.vue");
  return _sfc_setup$13 ? _sfc_setup$13(props, ctx) : void 0;
};
const _sfc_main$12 = /* @__PURE__ */ defineComponent({
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
      _push(`<p${ssrRenderAttrs(mergeProps({ class: "VPLastUpdated" }, _attrs))} data-v-f54efff7>${ssrInterpolate(((_a = unref(theme2).lastUpdated) == null ? void 0 : _a.text) || unref(theme2).lastUpdatedText || "Last updated")}: <time${ssrRenderAttr("datetime", isoDatetime.value)} data-v-f54efff7>${ssrInterpolate(datetime.value)}</time></p>`);
    };
  }
});
const _sfc_setup$12 = _sfc_main$12.setup;
_sfc_main$12.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocFooterLastUpdated.vue");
  return _sfc_setup$12 ? _sfc_setup$12(props, ctx) : void 0;
};
const VPDocFooterLastUpdated = /* @__PURE__ */ _export_sfc(_sfc_main$12, [["__scopeId", "data-v-f54efff7"]]);
const _sfc_main$11 = /* @__PURE__ */ defineComponent({
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
        _push(`<footer${ssrRenderAttrs(mergeProps({ class: "VPDocFooter" }, _attrs))} data-v-c5b6a290>`);
        ssrRenderSlot(_ctx.$slots, "doc-footer-before", {}, null, _push, _parent);
        if (hasEditLink.value || hasLastUpdated.value) {
          _push(`<div class="edit-info" data-v-c5b6a290>`);
          if (hasEditLink.value) {
            _push(`<div class="edit-link" data-v-c5b6a290>`);
            _push(ssrRenderComponent(_sfc_main$13, {
              class: "edit-link-button",
              href: unref(editLink).url,
              "no-icon": true
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<span class="vpi-square-pen edit-link-icon" data-v-c5b6a290${_scopeId}></span> ${ssrInterpolate(unref(editLink).text)}`);
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
            _push(`<div class="last-updated" data-v-c5b6a290>`);
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
          _push(`<nav class="prev-next" aria-labelledby="doc-footer-aria-label" data-v-c5b6a290><span class="visually-hidden" id="doc-footer-aria-label" data-v-c5b6a290>Pager</span><div class="pager" data-v-c5b6a290>`);
          if ((_c = unref(control).prev) == null ? void 0 : _c.link) {
            _push(ssrRenderComponent(_sfc_main$13, {
              class: "pager-link prev",
              href: unref(control).prev.link
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<span class="desc" data-v-c5b6a290${_scopeId}>${(((_a2 = unref(theme2).docFooter) == null ? void 0 : _a2.prev) || "Previous page") ?? ""}</span><span class="title" data-v-c5b6a290${_scopeId}>${unref(control).prev.text ?? ""}</span>`);
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
          _push(`</div><div class="pager" data-v-c5b6a290>`);
          if ((_d = unref(control).next) == null ? void 0 : _d.link) {
            _push(ssrRenderComponent(_sfc_main$13, {
              class: "pager-link next",
              href: unref(control).next.link
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                var _a2, _b2;
                if (_push2) {
                  _push2(`<span class="desc" data-v-c5b6a290${_scopeId}>${(((_a2 = unref(theme2).docFooter) == null ? void 0 : _a2.next) || "Next page") ?? ""}</span><span class="title" data-v-c5b6a290${_scopeId}>${unref(control).next.text ?? ""}</span>`);
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
const _sfc_setup$11 = _sfc_main$11.setup;
_sfc_main$11.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocFooter.vue");
  return _sfc_setup$11 ? _sfc_setup$11(props, ctx) : void 0;
};
const VPDocFooter = /* @__PURE__ */ _export_sfc(_sfc_main$11, [["__scopeId", "data-v-c5b6a290"]]);
const _sfc_main$10 = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-72115c32>`);
      ssrRenderSlot(_ctx.$slots, "doc-top", {}, null, _push, _parent);
      _push(`<div class="container" data-v-72115c32>`);
      if (unref(hasAside)) {
        _push(`<div class="${ssrRenderClass([{ "left-aside": unref(leftAside) }, "aside"])}" data-v-72115c32><div class="aside-curtain" data-v-72115c32></div><div class="aside-container" data-v-72115c32><div class="aside-content" data-v-72115c32>`);
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
      _push(`<div class="content" data-v-72115c32><div class="content-container" data-v-72115c32>`);
      ssrRenderSlot(_ctx.$slots, "doc-before", {}, null, _push, _parent);
      _push(`<main class="main" data-v-72115c32>`);
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
const _sfc_setup$10 = _sfc_main$10.setup;
_sfc_main$10.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDoc.vue");
  return _sfc_setup$10 ? _sfc_setup$10(props, ctx) : void 0;
};
const VPDoc = /* @__PURE__ */ _export_sfc(_sfc_main$10, [["__scopeId", "data-v-72115c32"]]);
const _sfc_main$$ = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$$ = _sfc_main$$.setup;
_sfc_main$$.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPButton.vue");
  return _sfc_setup$$ ? _sfc_setup$$(props, ctx) : void 0;
};
const VPButton = /* @__PURE__ */ _export_sfc(_sfc_main$$, [["__scopeId", "data-v-7b0f5049"]]);
const _sfc_main$_ = /* @__PURE__ */ defineComponent({
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
          }))} data-v-190f1b43>`);
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
const _sfc_setup$_ = _sfc_main$_.setup;
_sfc_main$_.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPImage.vue");
  return _sfc_setup$_ ? _sfc_setup$_(props, ctx) : void 0;
};
const VPImage = /* @__PURE__ */ _export_sfc(_sfc_main$_, [["__scopeId", "data-v-190f1b43"]]);
const _sfc_main$Z = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-b9ee784b><div class="container" data-v-b9ee784b><div class="main" data-v-b9ee784b>`);
      ssrRenderSlot(_ctx.$slots, "home-hero-info-before", {}, null, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-hero-info", {}, () => {
        _push(`<h1 class="heading" data-v-b9ee784b>`);
        if (__props.name) {
          _push(`<span class="name clip" data-v-b9ee784b>${__props.name ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.text) {
          _push(`<span class="text" data-v-b9ee784b>${__props.text ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</h1>`);
        if (__props.tagline) {
          _push(`<p class="tagline" data-v-b9ee784b>${__props.tagline ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
      }, _push, _parent);
      ssrRenderSlot(_ctx.$slots, "home-hero-info-after", {}, null, _push, _parent);
      if (__props.actions) {
        _push(`<div class="actions" data-v-b9ee784b><!--[-->`);
        ssrRenderList(__props.actions, (action) => {
          _push(`<div class="action" data-v-b9ee784b>`);
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
        _push(`<div class="image" data-v-b9ee784b><div class="image-container" data-v-b9ee784b><div class="image-bg" data-v-b9ee784b></div>`);
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
const _sfc_setup$Z = _sfc_main$Z.setup;
_sfc_main$Z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPHero.vue");
  return _sfc_setup$Z ? _sfc_setup$Z(props, ctx) : void 0;
};
const VPHero = /* @__PURE__ */ _export_sfc(_sfc_main$Z, [["__scopeId", "data-v-b9ee784b"]]);
const _sfc_main$Y = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$Y = _sfc_main$Y.setup;
_sfc_main$Y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPHomeHero.vue");
  return _sfc_setup$Y ? _sfc_setup$Y(props, ctx) : void 0;
};
const _sfc_main$X = /* @__PURE__ */ defineComponent({
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
      _push(ssrRenderComponent(_sfc_main$13, mergeProps({
        class: "VPFeature",
        href: __props.link,
        rel: __props.rel,
        target: __props.target,
        "no-icon": true,
        tag: __props.link ? "a" : "div"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<article class="box" data-v-a719448e${_scopeId}>`);
            if (typeof __props.icon === "object" && __props.icon.wrap) {
              _push2(`<div class="icon" data-v-a719448e${_scopeId}>`);
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
              _push2(`<div class="icon" data-v-a719448e${_scopeId}>${__props.icon ?? ""}</div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`<h2 class="title" data-v-a719448e${_scopeId}>${__props.title ?? ""}</h2>`);
            if (__props.details) {
              _push2(`<p class="details" data-v-a719448e${_scopeId}>${__props.details ?? ""}</p>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.linkText) {
              _push2(`<div class="link-text" data-v-a719448e${_scopeId}><p class="link-text-value" data-v-a719448e${_scopeId}>${ssrInterpolate(__props.linkText)} <span class="vpi-arrow-right link-text-icon" data-v-a719448e${_scopeId}></span></p></div>`);
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
const _sfc_setup$X = _sfc_main$X.setup;
_sfc_main$X.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPFeature.vue");
  return _sfc_setup$X ? _sfc_setup$X(props, ctx) : void 0;
};
const VPFeature = /* @__PURE__ */ _export_sfc(_sfc_main$X, [["__scopeId", "data-v-a719448e"]]);
const _sfc_main$W = /* @__PURE__ */ defineComponent({
  __name: "VPFeatures",
  __ssrInlineRender: true,
  props: {
    features: {}
  },
  setup(__props) {
    const props = __props;
    const grid = computed(() => {
      const length = props.features.length;
      if (!length) {
        return;
      } else if (length === 2) {
        return "grid-2";
      } else if (length === 3) {
        return "grid-3";
      } else if (length % 3 === 0) {
        return "grid-6";
      } else if (length > 3) {
        return "grid-4";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.features) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPFeatures" }, _attrs))} data-v-467bb5d1><div class="container" data-v-467bb5d1><div class="items" data-v-467bb5d1><!--[-->`);
        ssrRenderList(__props.features, (feature) => {
          _push(`<div class="${ssrRenderClass([[grid.value], "item"])}" data-v-467bb5d1>`);
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
const _sfc_setup$W = _sfc_main$W.setup;
_sfc_main$W.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPFeatures.vue");
  return _sfc_setup$W ? _sfc_setup$W(props, ctx) : void 0;
};
const VPFeatures = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["__scopeId", "data-v-467bb5d1"]]);
const _sfc_main$V = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$V = _sfc_main$V.setup;
_sfc_main$V.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPHomeFeatures.vue");
  return _sfc_setup$V ? _sfc_setup$V(props, ctx) : void 0;
};
const _sfc_main$U = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-db4af229>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$U = _sfc_main$U.setup;
_sfc_main$U.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPHomeContent.vue");
  return _sfc_setup$U ? _sfc_setup$U(props, ctx) : void 0;
};
const VPHomeContent = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["__scopeId", "data-v-db4af229"]]);
const _sfc_main$T = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-67e93a94>`);
      ssrRenderSlot(_ctx.$slots, "home-hero-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$Y, null, {
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
      _push(ssrRenderComponent(_sfc_main$V, null, null, _parent));
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
const _sfc_setup$T = _sfc_main$T.setup;
_sfc_main$T.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPHome.vue");
  return _sfc_setup$T ? _sfc_setup$T(props, ctx) : void 0;
};
const VPHome = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["__scopeId", "data-v-67e93a94"]]);
const _sfc_main$S = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  const _component_Content = resolveComponent("Content");
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPPage" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "page-top", {}, null, _push, _parent);
  _push(ssrRenderComponent(_component_Content, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "page-bottom", {}, null, _push, _parent);
  _push(`</div>`);
}
const _sfc_setup$S = _sfc_main$S.setup;
_sfc_main$S.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPPage.vue");
  return _sfc_setup$S ? _sfc_setup$S(props, ctx) : void 0;
};
const VPPage = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$R = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-d0ae1441>`);
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
const _sfc_setup$R = _sfc_main$R.setup;
_sfc_main$R.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPContent.vue");
  return _sfc_setup$R ? _sfc_setup$R(props, ctx) : void 0;
};
const VPContent = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["__scopeId", "data-v-d0ae1441"]]);
const _sfc_main$Q = /* @__PURE__ */ defineComponent({
  __name: "VPFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2, frontmatter } = useData();
    const { hasSidebar } = useSidebar();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).footer && unref(frontmatter).footer !== false) {
        _push(`<footer${ssrRenderAttrs(mergeProps({
          class: ["VPFooter", { "has-sidebar": unref(hasSidebar) }]
        }, _attrs))} data-v-af9c7f49><div class="container" data-v-af9c7f49>`);
        if (unref(theme2).footer.message) {
          _push(`<p class="message" data-v-af9c7f49>${unref(theme2).footer.message ?? ""}</p>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(theme2).footer.copyright) {
          _push(`<p class="copyright" data-v-af9c7f49>${unref(theme2).footer.copyright ?? ""}</p>`);
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
const _sfc_setup$Q = _sfc_main$Q.setup;
_sfc_main$Q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPFooter.vue");
  return _sfc_setup$Q ? _sfc_setup$Q(props, ctx) : void 0;
};
const VPFooter = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["__scopeId", "data-v-af9c7f49"]]);
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
const _sfc_main$P = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-be136602>`);
      if (__props.headers.length > 0) {
        _push(`<button class="${ssrRenderClass({ open: open.value })}" data-v-be136602><span class="menu-text" data-v-be136602>${ssrInterpolate(unref(resolveTitle)(unref(theme2)))}</span><span class="vpi-chevron-right icon" data-v-be136602></span></button>`);
      } else {
        _push(`<button data-v-be136602>${ssrInterpolate(unref(theme2).returnToTopLabel || "Return to top")}</button>`);
      }
      if (open.value) {
        _push(`<div class="items" data-v-be136602><div class="header" data-v-be136602><a class="top-link" href="#" data-v-be136602>${ssrInterpolate(unref(theme2).returnToTopLabel || "Return to top")}</a></div><div class="outline" data-v-be136602>`);
        _push(ssrRenderComponent(VPDocOutlineItem, { headers: __props.headers }, null, _parent));
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$P = _sfc_main$P.setup;
_sfc_main$P.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPLocalNavOutlineDropdown.vue");
  return _sfc_setup$P ? _sfc_setup$P(props, ctx) : void 0;
};
const VPLocalNavOutlineDropdown = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["__scopeId", "data-v-be136602"]]);
const _sfc_main$O = /* @__PURE__ */ defineComponent({
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
        _push(`<div${ssrRenderAttrs(mergeProps({ class: classes.value }, _attrs))} data-v-0f2d859c><div class="container" data-v-0f2d859c>`);
        if (unref(hasSidebar)) {
          _push(`<button class="menu"${ssrRenderAttr("aria-expanded", __props.open)} aria-controls="VPSidebarNav" data-v-0f2d859c><span class="vpi-align-left menu-icon" data-v-0f2d859c></span><span class="menu-text" data-v-0f2d859c>${ssrInterpolate(unref(theme2).sidebarMenuLabel || "Menu")}</span></button>`);
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
const _sfc_setup$O = _sfc_main$O.setup;
_sfc_main$O.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPLocalNav.vue");
  return _sfc_setup$O ? _sfc_setup$O(props, ctx) : void 0;
};
const VPLocalNav = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["__scopeId", "data-v-0f2d859c"]]);
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
const _sfc_main$N = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<button${ssrRenderAttrs(mergeProps({
    class: "VPSwitch",
    type: "button",
    role: "switch"
  }, _attrs))} data-v-e3a15414><span class="check" data-v-e3a15414>`);
  if (_ctx.$slots.default) {
    _push(`<span class="icon" data-v-e3a15414>`);
    ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    _push(`</span>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</span></button>`);
}
const _sfc_setup$N = _sfc_main$N.setup;
_sfc_main$N.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSwitch.vue");
  return _sfc_setup$N ? _sfc_setup$N(props, ctx) : void 0;
};
const VPSwitch = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-e3a15414"]]);
const _sfc_main$M = /* @__PURE__ */ defineComponent({
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
            _push2(`<span class="vpi-sun sun" data-v-5ff91cbd${_scopeId}></span><span class="vpi-moon moon" data-v-5ff91cbd${_scopeId}></span>`);
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
const _sfc_setup$M = _sfc_main$M.setup;
_sfc_main$M.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSwitchAppearance.vue");
  return _sfc_setup$M ? _sfc_setup$M(props, ctx) : void 0;
};
const VPSwitchAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["__scopeId", "data-v-5ff91cbd"]]);
const _sfc_main$L = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { site: site2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavBarAppearance" }, _attrs))} data-v-77220ca7>`);
        _push(ssrRenderComponent(VPSwitchAppearance, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$L = _sfc_main$L.setup;
_sfc_main$L.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarAppearance.vue");
  return _sfc_setup$L ? _sfc_setup$L(props, ctx) : void 0;
};
const VPNavBarAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["__scopeId", "data-v-77220ca7"]]);
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
const _sfc_main$K = /* @__PURE__ */ defineComponent({
  __name: "VPMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const { page } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenuLink" }, _attrs))} data-v-bd1951a3>`);
      _push(ssrRenderComponent(_sfc_main$13, {
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
            _push2(`<span data-v-bd1951a3${_scopeId}>${__props.item.text ?? ""}</span>`);
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
const _sfc_setup$K = _sfc_main$K.setup;
_sfc_main$K.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPMenuLink.vue");
  return _sfc_setup$K ? _sfc_setup$K(props, ctx) : void 0;
};
const VPMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["__scopeId", "data-v-bd1951a3"]]);
const _sfc_main$J = /* @__PURE__ */ defineComponent({
  __name: "VPMenuGroup",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenuGroup" }, _attrs))} data-v-fdc9c63b>`);
      if (__props.text) {
        _push(`<p class="title" data-v-fdc9c63b>${ssrInterpolate(__props.text)}</p>`);
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
const _sfc_setup$J = _sfc_main$J.setup;
_sfc_main$J.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPMenuGroup.vue");
  return _sfc_setup$J ? _sfc_setup$J(props, ctx) : void 0;
};
const VPMenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["__scopeId", "data-v-fdc9c63b"]]);
const _sfc_main$I = /* @__PURE__ */ defineComponent({
  __name: "VPMenu",
  __ssrInlineRender: true,
  props: {
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPMenu" }, _attrs))} data-v-6650648f>`);
      if (__props.items) {
        _push(`<div class="items" data-v-6650648f><!--[-->`);
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
const _sfc_setup$I = _sfc_main$I.setup;
_sfc_main$I.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPMenu.vue");
  return _sfc_setup$I ? _sfc_setup$I(props, ctx) : void 0;
};
const VPMenu = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["__scopeId", "data-v-6650648f"]]);
const _sfc_main$H = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-4becbcc4><button type="button" class="button" aria-haspopup="true"${ssrRenderAttr("aria-expanded", open.value)}${ssrRenderAttr("aria-label", __props.label)} data-v-4becbcc4>`);
      if (__props.button || __props.icon) {
        _push(`<span class="text" data-v-4becbcc4>`);
        if (__props.icon) {
          _push(`<span class="${ssrRenderClass([__props.icon, "option-icon"])}" data-v-4becbcc4></span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.button) {
          _push(`<span data-v-4becbcc4>${__props.button ?? ""}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<span class="vpi-chevron-down text-icon" data-v-4becbcc4></span></span>`);
      } else {
        _push(`<span class="vpi-more-horizontal icon" data-v-4becbcc4></span>`);
      }
      _push(`</button><div class="menu" data-v-4becbcc4>`);
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
const _sfc_setup$H = _sfc_main$H.setup;
_sfc_main$H.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPFlyout.vue");
  return _sfc_setup$H ? _sfc_setup$H(props, ctx) : void 0;
};
const VPFlyout = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["__scopeId", "data-v-4becbcc4"]]);
const _sfc_main$G = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-bfbaac82>${svg.value ?? ""}</a>`);
    };
  }
});
const _sfc_setup$G = _sfc_main$G.setup;
_sfc_main$G.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSocialLink.vue");
  return _sfc_setup$G ? _sfc_setup$G(props, ctx) : void 0;
};
const VPSocialLink = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["__scopeId", "data-v-bfbaac82"]]);
const _sfc_main$F = /* @__PURE__ */ defineComponent({
  __name: "VPSocialLinks",
  __ssrInlineRender: true,
  props: {
    links: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPSocialLinks" }, _attrs))} data-v-dc7008d0><!--[-->`);
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
const _sfc_setup$F = _sfc_main$F.setup;
_sfc_main$F.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSocialLinks.vue");
  return _sfc_setup$F ? _sfc_setup$F(props, ctx) : void 0;
};
const VPSocialLinks = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["__scopeId", "data-v-dc7008d0"]]);
const _sfc_main$E = /* @__PURE__ */ defineComponent({
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
                _push2(`<div class="group translations" data-v-3437b4ce${_scopeId}><p class="trans-title" data-v-3437b4ce${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><!--[-->`);
                ssrRenderList(unref(localeLinks), (locale) => {
                  _push2(ssrRenderComponent(VPMenuLink, { item: locale }, null, _parent2, _scopeId));
                });
                _push2(`<!--]--></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto") {
                _push2(`<div class="group" data-v-3437b4ce${_scopeId}><div class="item appearance" data-v-3437b4ce${_scopeId}><p class="label" data-v-3437b4ce${_scopeId}>${ssrInterpolate(unref(theme2).darkModeSwitchLabel || "Appearance")}</p><div class="appearance-action" data-v-3437b4ce${_scopeId}>`);
                _push2(ssrRenderComponent(VPSwitchAppearance, null, null, _parent2, _scopeId));
                _push2(`</div></div></div>`);
              } else {
                _push2(`<!---->`);
              }
              if (unref(theme2).socialLinks) {
                _push2(`<div class="group" data-v-3437b4ce${_scopeId}><div class="item social-links" data-v-3437b4ce${_scopeId}>`);
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
const _sfc_setup$E = _sfc_main$E.setup;
_sfc_main$E.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarExtra.vue");
  return _sfc_setup$E ? _sfc_setup$E(props, ctx) : void 0;
};
const VPNavBarExtra = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["__scopeId", "data-v-3437b4ce"]]);
const _sfc_main$D = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-d2fa9eb3><span class="container" data-v-d2fa9eb3><span class="top" data-v-d2fa9eb3></span><span class="middle" data-v-d2fa9eb3></span><span class="bottom" data-v-d2fa9eb3></span></span></button>`);
    };
  }
});
const _sfc_setup$D = _sfc_main$D.setup;
_sfc_main$D.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarHamburger.vue");
  return _sfc_setup$D ? _sfc_setup$D(props, ctx) : void 0;
};
const VPNavBarHamburger = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["__scopeId", "data-v-d2fa9eb3"]]);
const _sfc_main$C = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const { page } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$13, mergeProps({
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
            _push2(`<span data-v-b50c0a58${_scopeId}>${__props.item.text ?? ""}</span>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenuLink.vue");
  return _sfc_setup$C ? _sfc_setup$C(props, ctx) : void 0;
};
const VPNavBarMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["__scopeId", "data-v-b50c0a58"]]);
const _sfc_main$B = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$B = _sfc_main$B.setup;
_sfc_main$B.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenuGroup.vue");
  return _sfc_setup$B ? _sfc_setup$B(props, ctx) : void 0;
};
const _sfc_main$A = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarMenu",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(theme2).nav) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          "aria-labelledby": "main-nav-aria-label",
          class: "VPNavBarMenu"
        }, _attrs))} data-v-d1d6687d><span id="main-nav-aria-label" class="visually-hidden" data-v-d1d6687d> Main Navigation </span><!--[-->`);
        ssrRenderList(unref(theme2).nav, (item) => {
          _push(`<!--[-->`);
          if ("link" in item) {
            _push(ssrRenderComponent(VPNavBarMenuLink, { item }, null, _parent));
          } else if ("component" in item) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props), null), _parent);
          } else {
            _push(ssrRenderComponent(_sfc_main$B, { item }, null, _parent));
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
const _sfc_setup$A = _sfc_main$A.setup;
_sfc_main$A.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarMenu.vue");
  return _sfc_setup$A ? _sfc_setup$A(props, ctx) : void 0;
};
const VPNavBarMenu = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["__scopeId", "data-v-d1d6687d"]]);
function createSearchTranslate(defaultTranslations) {
  const { localeIndex, theme: theme2 } = useData();
  function translate(key) {
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
  return translate;
}
const _sfc_main$z = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSearchButton",
  __ssrInlineRender: true,
  setup(__props) {
    const defaultTranslations = {
      button: {
        buttonText: "Search",
        buttonAriaLabel: "Search"
      }
    };
    const translate = createSearchTranslate(defaultTranslations);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        type: "button",
        class: "DocSearch DocSearch-Button",
        "aria-label": unref(translate)("button.buttonAriaLabel")
      }, _attrs))}><span class="DocSearch-Button-Container"><span class="vp-icon DocSearch-Search-Icon"></span><span class="DocSearch-Button-Placeholder">${ssrInterpolate(unref(translate)("button.buttonText"))}</span></span><span class="DocSearch-Button-Keys"><kbd class="DocSearch-Button-Key"></kbd><kbd class="DocSearch-Button-Key">K</kbd></span></button>`);
    };
  }
});
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearchButton.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const _sfc_main$y = /* @__PURE__ */ defineComponent({
  __name: "VPNavBarSearch",
  __ssrInlineRender: true,
  setup(__props) {
    const VPLocalSearchBox = defineAsyncComponent(() => import("./VPLocalSearchBox.CXydmlFz.js"));
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
        _push(ssrRenderComponent(_sfc_main$z, {
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
          _push(ssrRenderComponent(_sfc_main$z, { onClick: load }, null, _parent));
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
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSearch.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarSocialLinks.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
const VPNavBarSocialLinks = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["__scopeId", "data-v-21ee45fc"]]);
const _sfc_main$w = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-f1d8bdef><a class="title"${ssrRenderAttr("href", link2.value ?? unref(normalizeLink$1)(unref(currentLang).link))}${ssrRenderAttr("rel", rel.value)}${ssrRenderAttr("target", target.value)} data-v-f1d8bdef>`);
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
        _push(`<span data-v-f1d8bdef>${unref(theme2).siteTitle ?? ""}</span>`);
      } else if (unref(theme2).siteTitle === void 0) {
        _push(`<span data-v-f1d8bdef>${ssrInterpolate(unref(site2).title)}</span>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "nav-bar-title-after", {}, null, _push, _parent);
      _push(`</a></div>`);
    };
  }
});
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTitle.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const VPNavBarTitle = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["__scopeId", "data-v-f1d8bdef"]]);
const _sfc_main$v = /* @__PURE__ */ defineComponent({
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
              _push2(`<div class="items" data-v-5ab6e467${_scopeId}><p class="title" data-v-5ab6e467${_scopeId}>${ssrInterpolate(unref(currentLang).label)}</p><!--[-->`);
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
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBarTranslations.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const VPNavBarTranslations = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-5ab6e467"]]);
const _sfc_main$u = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-930cb55f><div class="wrapper" data-v-930cb55f><div class="container" data-v-930cb55f><div class="title" data-v-930cb55f>`);
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
      _push(`</div><div class="content" data-v-930cb55f><div class="content-body" data-v-930cb55f>`);
      ssrRenderSlot(_ctx.$slots, "nav-bar-content-before", {}, null, _push, _parent);
      _push(ssrRenderComponent(_sfc_main$y, { class: "search" }, null, _parent));
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
      _push(`</div></div></div></div><div class="divider" data-v-930cb55f><div class="divider-line" data-v-930cb55f></div></div></div>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavBar.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const VPNavBar = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["__scopeId", "data-v-930cb55f"]]);
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenAppearance",
  __ssrInlineRender: true,
  setup(__props) {
    const { site: site2, theme: theme2 } = useData();
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(site2).appearance && unref(site2).appearance !== "force-dark" && unref(site2).appearance !== "force-auto") {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavScreenAppearance" }, _attrs))} data-v-99fe17e3><p class="text" data-v-99fe17e3>${ssrInterpolate(unref(theme2).darkModeSwitchLabel || "Appearance")}</p>`);
        _push(ssrRenderComponent(VPSwitchAppearance, null, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenAppearance.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const VPNavScreenAppearance = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-99fe17e3"]]);
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const closeScreen = inject("close-screen");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$13, mergeProps({
        class: "VPNavScreenMenuLink",
        href: __props.item.link,
        target: __props.item.target,
        rel: __props.item.rel,
        "no-icon": __props.item.noIcon,
        onClick: unref(closeScreen)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-ee4d9bf3${_scopeId}>${__props.item.text ?? ""}</span>`);
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
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuLink.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const VPNavScreenMenuLink = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-ee4d9bf3"]]);
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroupLink",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    const closeScreen = inject("close-screen");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$13, mergeProps({
        class: "VPNavScreenMenuGroupLink",
        href: __props.item.link,
        target: __props.item.target,
        rel: __props.item.rel,
        "no-icon": __props.item.noIcon,
        onClick: unref(closeScreen)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span data-v-aaed5a88${_scopeId}>${__props.item.text ?? ""}</span>`);
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
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroupLink.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const VPNavScreenMenuGroupLink = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-aaed5a88"]]);
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenMenuGroupSection",
  __ssrInlineRender: true,
  props: {
    text: {},
    items: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "VPNavScreenMenuGroupSection" }, _attrs))} data-v-9d750500>`);
      if (__props.text) {
        _push(`<p class="title" data-v-9d750500>${ssrInterpolate(__props.text)}</p>`);
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
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroupSection.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const VPNavScreenMenuGroupSection = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-9d750500"]]);
const _sfc_main$p = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-eb0bbe36><button class="button"${ssrRenderAttr("aria-controls", groupId.value)}${ssrRenderAttr("aria-expanded", isOpen.value)} data-v-eb0bbe36><span class="button-text" data-v-eb0bbe36>${__props.text ?? ""}</span><span class="vpi-plus button-icon" data-v-eb0bbe36></span></button><div${ssrRenderAttr("id", groupId.value)} class="items" data-v-eb0bbe36><!--[-->`);
      ssrRenderList(__props.items, (item) => {
        _push(`<!--[-->`);
        if ("link" in item) {
          _push(`<div class="item" data-v-eb0bbe36>`);
          _push(ssrRenderComponent(VPNavScreenMenuGroupLink, { item }, null, _parent));
          _push(`</div>`);
        } else if ("component" in item) {
          _push(`<div class="item" data-v-eb0bbe36>`);
          ssrRenderVNode(_push, createVNode(resolveDynamicComponent(item.component), mergeProps({ ref_for: true }, item.props, { "screen-menu": "" }), null), _parent);
          _push(`</div>`);
        } else {
          _push(`<div class="group" data-v-eb0bbe36>`);
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
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenuGroup.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const VPNavScreenMenuGroup = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-eb0bbe36"]]);
const _sfc_main$o = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenMenu.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenSocialLinks.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "VPNavScreenTranslations",
  __ssrInlineRender: true,
  setup(__props) {
    const { localeLinks, currentLang } = useLangs({ correspondingLink: true });
    const isOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(localeLinks).length && unref(currentLang).label) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: ["VPNavScreenTranslations", { open: isOpen.value }]
        }, _attrs))} data-v-d9af7dda><button class="title" data-v-d9af7dda><span class="vpi-languages icon lang" data-v-d9af7dda></span> ${ssrInterpolate(unref(currentLang).label)} <span class="vpi-chevron-down icon chevron" data-v-d9af7dda></span></button><ul class="list" data-v-d9af7dda><!--[-->`);
        ssrRenderList(unref(localeLinks), (locale) => {
          _push(`<li class="item" data-v-d9af7dda>`);
          _push(ssrRenderComponent(_sfc_main$13, {
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
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreenTranslations.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const VPNavScreenTranslations = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-d9af7dda"]]);
const _sfc_main$l = /* @__PURE__ */ defineComponent({
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
        }, _attrs))} data-v-8ab7a49c><div class="container" data-v-8ab7a49c>`);
        ssrRenderSlot(_ctx.$slots, "nav-screen-content-before", {}, null, _push, _parent);
        _push(ssrRenderComponent(_sfc_main$o, { class: "menu" }, null, _parent));
        _push(ssrRenderComponent(VPNavScreenTranslations, { class: "translations" }, null, _parent));
        _push(ssrRenderComponent(VPNavScreenAppearance, { class: "appearance" }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$n, { class: "social-links" }, null, _parent));
        ssrRenderSlot(_ctx.$slots, "nav-screen-content-after", {}, null, _push, _parent);
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNavScreen.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const VPNavScreen = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-8ab7a49c"]]);
const _sfc_main$k = /* @__PURE__ */ defineComponent({
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
        _push(`<header${ssrRenderAttrs(mergeProps({ class: "VPNav" }, _attrs))} data-v-894db4ed>`);
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
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPNav.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const VPNav = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-894db4ed"]]);
const _sfc_main$j = /* @__PURE__ */ defineComponent({
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
              _push2(`<div class="item"${ssrRenderAttr("role", itemRole.value)}${ssrRenderAttr("tabindex", __props.item.items && 0)} data-v-3e073260${_scopeId}><div class="indicator" data-v-3e073260${_scopeId}></div>`);
              if (__props.item.link) {
                _push2(ssrRenderComponent(_sfc_main$13, {
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
                _push2(`<div class="caret" role="button" aria-label="toggle section" tabindex="0" data-v-3e073260${_scopeId}><span class="vpi-chevron-right caret-icon" data-v-3e073260${_scopeId}></span></div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              _push2(`<!---->`);
            }
            if (__props.item.items && __props.item.items.length) {
              _push2(`<div class="items" data-v-3e073260${_scopeId}>`);
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
                __props.item.link ? (openBlock(), createBlock(_sfc_main$13, {
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
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSidebarItem.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const VPSidebarItem = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-3e073260"]]);
const _sfc_main$i = /* @__PURE__ */ defineComponent({
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
        _push(`<div class="${ssrRenderClass([{ "no-transition": disableTransition.value }, "group"])}" data-v-565bdc0a>`);
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
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSidebarGroup.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const VPSidebarGroup = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-565bdc0a"]]);
const _sfc_main$h = /* @__PURE__ */ defineComponent({
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
        }, _attrs))} data-v-c34b50cd><div class="curtain" data-v-c34b50cd></div><nav class="nav" id="VPSidebarNav" aria-labelledby="sidebar-aria-label" tabindex="-1" data-v-c34b50cd><span class="visually-hidden" id="sidebar-aria-label" data-v-c34b50cd> Sidebar Navigation </span>`);
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
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSidebar.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const VPSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-c34b50cd"]]);
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "VPSkipLink",
  __ssrInlineRender: true,
  setup(__props) {
    const { theme: theme2 } = useData();
    const route = useRoute();
    const backToTop = ref();
    watch(() => route.path, () => backToTop.value.focus());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><span tabindex="-1" data-v-f95ff431></span><a href="#VPContent" class="VPSkipLink visually-hidden" data-v-f95ff431>${ssrInterpolate(unref(theme2).skipToContentLabel || "Skip to content")}</a><!--]-->`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSkipLink.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const VPSkipLink = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-f95ff431"]]);
const _sfc_main$f = /* @__PURE__ */ defineComponent({
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
        }, _attrs))} data-v-b7f5faf8>`);
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
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/Layout.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const Layout = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-b7f5faf8"]]);
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
const _sfc_main$e = /* @__PURE__ */ defineComponent({
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
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSponsorsGrid.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
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
        _push(ssrRenderComponent(_sfc_main$e, {
          size: sponsor.size,
          data: sponsor.items
        }, null, _parent));
        _push(`</section>`);
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPSponsors.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
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
      _push(ssrRenderComponent(_sfc_main$d, {
        mode: "aside",
        tier: __props.tier,
        size: __props.size,
        data: __props.data
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPDocAsideSponsors.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
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
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "VPHomeSponsors" }, _attrs))} data-v-e461a049><div class="container" data-v-e461a049><div class="header" data-v-e461a049><div class="love" data-v-e461a049><span class="vpi-heart icon" data-v-e461a049></span></div>`);
      if (__props.message) {
        _push(`<h2 class="message" data-v-e461a049>${ssrInterpolate(__props.message)}</h2>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="sponsors" data-v-e461a049>`);
      _push(ssrRenderComponent(_sfc_main$d, { data: __props.data }, null, _parent));
      _push(`</div>`);
      if (__props.actionLink) {
        _push(`<div class="action" data-v-e461a049>`);
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPHomeSponsors.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-38642a05><div class="profile" data-v-38642a05><figure class="avatar" data-v-38642a05><img class="avatar-img"${ssrRenderAttr("src", __props.member.avatar)}${ssrRenderAttr("alt", __props.member.name)} data-v-38642a05></figure><div class="data" data-v-38642a05><h1 class="name" data-v-38642a05>${ssrInterpolate(__props.member.name)}</h1>`);
      if (__props.member.title || __props.member.org) {
        _push(`<p class="affiliation" data-v-38642a05>`);
        if (__props.member.title) {
          _push(`<span class="title" data-v-38642a05>${ssrInterpolate(__props.member.title)}</span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.member.title && __props.member.org) {
          _push(`<span class="at" data-v-38642a05> @ </span>`);
        } else {
          _push(`<!---->`);
        }
        if (__props.member.org) {
          _push(ssrRenderComponent(_sfc_main$13, {
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
        _push(`<p class="desc" data-v-38642a05>${__props.member.desc ?? ""}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.member.links) {
        _push(`<div class="links" data-v-38642a05>`);
        _push(ssrRenderComponent(VPSocialLinks, {
          links: __props.member.links
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
      if (__props.member.sponsor) {
        _push(`<div class="sp" data-v-38642a05>`);
        _push(ssrRenderComponent(_sfc_main$13, {
          class: "sp-link",
          href: __props.member.sponsor,
          "no-icon": ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="vpi-heart sp-icon" data-v-38642a05${_scopeId}></span> ${ssrInterpolate(__props.member.actionText || "Sponsor")}`);
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembersItem.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const VPTeamMembersItem = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-38642a05"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
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
      }, _attrs))} data-v-4e6ddcbd><div class="container" data-v-4e6ddcbd><!--[-->`);
      ssrRenderList(__props.members, (member) => {
        _push(`<div class="item" data-v-4e6ddcbd>`);
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPTeamMembers.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = {};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPTeamPage.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = {};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageSection.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = {};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../node_modules/vitepress/dist/client/theme-default/components/VPTeamPageTitle.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const theme = {
  Layout,
  enhanceApp: ({ app }) => {
    app.component("Badge", _sfc_main$1a);
  }
};
const root = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const about = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const numerimondes = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const education = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const research = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const community = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const partnerships = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const commercial = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const concepts$1 = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const contact = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const faq = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const fr = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const services = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const solutions = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const webkernel = {
  logoLight: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoDark: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg",
  logoAlt: "Numerimondes",
  logoHeight: "2rem",
  favicon: "/__docs-assets/f447ec8d711a13e8451ec277043fb4bb4a28265ddb09803ce0f5d5b6a236f75e.svg"
};
const guideColors = {
  root,
  about,
  numerimondes,
  education,
  research,
  community,
  partnerships,
  commercial,
  concepts: concepts$1,
  contact,
  faq,
  fr,
  services,
  solutions,
  webkernel
};
const site = {};
const guides = {
  "001-commercial": {},
  root: {},
  "005-about": {},
  about: {},
  "010-products": {},
  numerimondes: {},
  "020-education": {},
  education: {},
  "030-research": {},
  research: {},
  "040-community": {},
  community: {},
  "050-partnerships": {},
  partnerships: {},
  commercial: {},
  concepts: {},
  contact: {},
  faq: {},
  fr: {},
  services: {},
  solutions: {},
  webkernel: {}
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
const showLanguageFlags = true;
const themeSlots = {
  site: {},
  guides: {}
};
const documentationNotices = {
  en: {
    exploringTitle: "In progress",
    exploring: "This information is being prepared and may change.",
    validatedTitle: "Verified",
    validated: "This information has been reviewed.",
    fallbackTitle: "Language availability"
  },
  fr: {
    exploringTitle: "In progress",
    exploring: "Ces informations sont en préparation et peuvent évoluer.",
    validatedTitle: "Verified",
    validated: "Ces informations ont été vérifiées.",
    fallbackTitle: "Language availability"
  }
};
const siteContent = {
  languages,
  defaultLanguage,
  showLanguageFlags,
  themeSlots,
  documentationNotices
};
const sidebarPageIcons = {
  "/commercial/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/services/": "__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg",
  "/services/audit/": "__docs-assets/e452276c3688e173398bf25c798c5a65bdee08616fe119a0e4fae0e41c3b32f5.svg",
  "/services/audit/methodology/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/services/automation/": "__docs-assets/f712344b4596dd027ed271f6598d37c057e21082769621b2185377ad939e378f.svg",
  "/services/automation/pricing-model/": "__docs-assets/f94f5983985bcfbf93e8b1f3b4d465e441cf38478b56b0c93d15694e911807b4.svg",
  "/services/cloud/": "__docs-assets/046e7bc4d2a5d408be5bc2c67c739a5be3ed00b52ccb3f5d9727139a4a7b2ea0.svg",
  "/services/cloud/features/": "__docs-assets/12902d85e906edb33e160a2edfa9a803860f4f9523960da3da8e5a24e824f3e2.svg",
  "/services/cloud/platforms/": "__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg",
  "/services/cloud/pricing/": "__docs-assets/f94f5983985bcfbf93e8b1f3b4d465e441cf38478b56b0c93d15694e911807b4.svg",
  "/services/cloud/tech-stack/": "__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg",
  "/services/consulting/": "__docs-assets/329f93dd4bc5edeb37dc7f5c09fd247f450916e32193bc71699288b454a4aedb.svg",
  "/services/consulting/how-we-sprint/": "__docs-assets/f712344b4596dd027ed271f6598d37c057e21082769621b2185377ad939e378f.svg",
  "/services/development/": "__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg",
  "/services/development/webkernel-path/": "__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg",
  "/services/infrastructure/": "__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg",
  "/services/infrastructure/self-hosting/": "__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg",
  "/services/intelligence/": "__docs-assets/09da49141b4aba6ea08be188c50a106ae87ef6559d03e44b2f6430b4da0be795.svg",
  "/services/tender-support/": "__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg",
  "/services/tender-support/deal-structuring/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/services/tender-support/narrative-assembly/": "__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg",
  "/contact/": "__docs-assets/4c68dca63d2d58d2d73b9099e3313779df5b8cf0a6ac09f8e27559208c3aa837.svg",
  "/faq/": "__docs-assets/bfade24700bb2d82d0cd4e72d9bf0b0f409f76fea8747216e221a826d1ba1b09.svg",
  "/solutions/": "__docs-assets/f15c80d9fefe1635d51b6bb28bbe57c3728261dd24e03cef1c9a4e69c3201583.svg",
  "/solutions/home-2/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/solutions/modernization/": "__docs-assets/b3edda20134ee44be236b7ea56af8d3a6199e862f882a1b25d690d18c20e2dc6.svg",
  "/webkernel/": "__docs-assets/e417258015955cb7cc18735cfc2757ace86399a0ab1e6fc79c0ec6bc44c0c62a.svg",
  "/about/": "__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg",
  "/about/assets/brand-kit/": "__docs-assets/c69a28b23402c72de4746b80d44f480e7eb1cb25c89b554d2656fa5ac52734ed.svg",
  "/about/company/about/culture/": "__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg",
  "/about/company/about/story/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/about/company/about/values/": "__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg",
  "/about/company/about/vision/": "__docs-assets/ba7f72e5958718fcce1abf4eaf04572306cf148032421861bfb6de19852aadfb.svg",
  "/about/company/careers/apply/": "__docs-assets/4fac7d3c7451de02e0a3573b7d5ee32bd505d9f8b81acffeeac25d5cb671c03f.svg",
  "/about/company/careers/open-positions/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/about/company/careers/programs/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/about/company/group/": "__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg",
  "/about/company/press/": "__docs-assets/a5f0c6358b0c3f8c27be8c40f383c51586e22dd57af69363590260d92f98b62b.svg",
  "/about/company/team/employees/": "__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg",
  "/about/company/team/employees/elmoumenyassine/": "__docs-assets/3d4225c63f203710bf37f09032162ca4766dbf98e19dc6332b312f1d660466aa.svg",
  "/about/legal/notice/": "__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg",
  "/about/legal/overview/": "__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg",
  "/about/legal/payment-methods/": "__docs-assets/09980f4365b8f1d442bd797eee3d36d00716b96247188728dce270a4cd2dcdf8.svg",
  "/about/legal/privacy/": "__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg",
  "/about/legal/terms/": "__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg",
  "/numerimondes/docs/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/numerimondes/docs/oss/webkernel/": "__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/": "__docs-assets/d988cafe8d6dadf1d03c51474da728d9c9cc23856df1f2a102b54738d20f72ad.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/architecture/": "__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/changelog/": "__docs-assets/ee0da7da72f08abcf42ea592198272678437643e27f41b59ff55c11279564eec.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/contributing/": "__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/demo/": "__docs-assets/9d44c8b6ebe76675fcc5bc1dbf0cf2960aed6d43ff60070c4737c2c8648c0550.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/deployment/": "__docs-assets/489aa4d157f438cce6d3d16ed1da822553f279986be56b7b6395b350a79c3a40.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/": "__docs-assets/e56ef5866e655b2c93539ee5cf9e58b8a1a3ed6c2d4d40b7ece2bdf63a00ae82.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/modules/": "__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/": "__docs-assets/bbc035522cd72fa212f479ed56b759c2453fd57507b8b4abeded067b76368923.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/showcase/": "__docs-assets/ae026945e5317daca96cca4786210a4cb39a5abccf8183d75222818dab868c93.svg",
  "/numerimondes/docs/oss/webkernel/docs/2.x/upgrade/": "__docs-assets/9f0829ae54959b4a28b37c7f5c5736576deb37f8c97370500e260f89602e841a.svg",
  "/education/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/education/catalogue/": "__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg",
  "/education/institutional/": "__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg",
  "/research/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/research/lab/": "__docs-assets/954c5ca39aaca04061c3ca52a0196f5dba670fa20c8a9fce94aebcb0a4225900.svg",
  "/research/publications/": "__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg",
  "/research/publications/job-market-actual-state/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/research/publications/neurobiologie-travail-acheve/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/research/publications/push-technology-farthest/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/research/publications/series/satisfaction-when-work-is-done/": "__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg",
  "/community/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/community/become-consultant/": "__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg",
  "/community/contributors/hall-of-fame/": "__docs-assets/588dc6e7a2a50f0f9cc96d9e0a07bd13b7852e1d76308dac769def4097c888f2.svg",
  "/community/contributors/how-to-contribute/": "__docs-assets/5dc29f4ab404b670b6fd1d8b2600f34e24c6dc176fa73d14d0b7c552467d3d4e.svg",
  "/community/events/past/": "__docs-assets/f1ee05126177875f079fb6becacaf88701445133fce03c32c9eb444a4f3d4e14.svg",
  "/community/events/upcoming/": "__docs-assets/8429569ba11344ff12b1af62bd7d8d846b708b827fc71659918c1d5da991b943.svg",
  "/community/forum/education/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/community/forum/general/": "__docs-assets/a41df70216764f388cca7003a7cc82229f88bb7605e9b5c2ea36049da7f37dda.svg",
  "/community/forum/jobs/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/community/forum/webkernel/": "__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg",
  "/community/freelance-jobs/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/partnerships/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/partnerships/become-partner/": "__docs-assets/e34ce005fb84f0fdc783e06735e7ad1c56c4c03295b251098b48a04eb2782b9b.svg",
  "/partnerships/current-partners/": "__docs-assets/81159f113b7d22c990eead1b6e1d88adcef23ad0915d3ca53202939ef83bfe6e.svg",
  "/partnerships/institutional/": "__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg",
  "/partnerships/overview/": "__docs-assets/d2477b9310a722d95dae7d0bdb79665d0c91feb5f2acf3e252bb9665fe6485db.svg",
  "/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/concepts/dopaminergic-closure/": "__docs-assets/f712344b4596dd027ed271f6598d37c057e21082769621b2185377ad939e378f.svg",
  "/fr/concepts/dopaminergic-closure/": "__docs-assets/2813d1f674fc98ed727bea64dcc4b6f16962ac0eb1d34f5c55c94d1d4f68e54f.svg",
  "/concepts/kardashev-scale/": "__docs-assets/225354becde48e7bd8ae369f348807a3d9d9577f0e24506bf0b13217710298c9.svg",
  "/fr/concepts/kardashev-scale/": "__docs-assets/2813d1f674fc98ed727bea64dcc4b6f16962ac0eb1d34f5c55c94d1d4f68e54f.svg",
  "/concepts/labour-market-signals/": "__docs-assets/68c9355c357abdf84655f995ad26b45a56cf6a83456ee512455e039ed5115b78.svg",
  "/fr/concepts/labour-market-signals/": "__docs-assets/2813d1f674fc98ed727bea64dcc4b6f16962ac0eb1d34f5c55c94d1d4f68e54f.svg",
  "/concepts/skill-obsolescence/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/fr/concepts/skill-obsolescence/": "__docs-assets/2813d1f674fc98ed727bea64dcc4b6f16962ac0eb1d34f5c55c94d1d4f68e54f.svg",
  "/concepts/task-completion/": "__docs-assets/32544f1317d7d9e68ad15e833bee6b4d5d0636920d0cff9798ed157670dfeba9.svg",
  "/fr/concepts/task-completion/": "__docs-assets/2813d1f674fc98ed727bea64dcc4b6f16962ac0eb1d34f5c55c94d1d4f68e54f.svg",
  "/concepts/technological-acceleration/": "__docs-assets/e56ef5866e655b2c93539ee5cf9e58b8a1a3ed6c2d4d40b7ece2bdf63a00ae82.svg",
  "/fr/concepts/technological-acceleration/": "__docs-assets/2813d1f674fc98ed727bea64dcc4b6f16962ac0eb1d34f5c55c94d1d4f68e54f.svg",
  "/fr/commercial/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/fr/services/": "__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg",
  "/fr/services/audit/": "__docs-assets/e452276c3688e173398bf25c798c5a65bdee08616fe119a0e4fae0e41c3b32f5.svg",
  "/fr/services/audit/methodology/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/services/automation/": "__docs-assets/f712344b4596dd027ed271f6598d37c057e21082769621b2185377ad939e378f.svg",
  "/fr/services/automation/pricing-model/": "__docs-assets/f94f5983985bcfbf93e8b1f3b4d465e441cf38478b56b0c93d15694e911807b4.svg",
  "/fr/services/cloud/": "__docs-assets/046e7bc4d2a5d408be5bc2c67c739a5be3ed00b52ccb3f5d9727139a4a7b2ea0.svg",
  "/fr/services/cloud/features/": "__docs-assets/12902d85e906edb33e160a2edfa9a803860f4f9523960da3da8e5a24e824f3e2.svg",
  "/fr/services/cloud/platforms/": "__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg",
  "/fr/services/cloud/pricing/": "__docs-assets/f94f5983985bcfbf93e8b1f3b4d465e441cf38478b56b0c93d15694e911807b4.svg",
  "/fr/services/cloud/tech-stack/": "__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg",
  "/fr/services/consulting/": "__docs-assets/329f93dd4bc5edeb37dc7f5c09fd247f450916e32193bc71699288b454a4aedb.svg",
  "/fr/services/consulting/how-we-sprint/": "__docs-assets/f712344b4596dd027ed271f6598d37c057e21082769621b2185377ad939e378f.svg",
  "/fr/services/development/": "__docs-assets/6e57bf8fa4d8fd7a362991106f7c7cc890be48e23093dcb149b9c22cf94a772a.svg",
  "/fr/services/development/webkernel-path/": "__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg",
  "/fr/services/infrastructure/": "__docs-assets/f05abee557b5cfe40c538ac20f7820760440ba4493eead97164c230319b20107.svg",
  "/fr/services/infrastructure/self-hosting/": "__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg",
  "/fr/services/intelligence/": "__docs-assets/09da49141b4aba6ea08be188c50a106ae87ef6559d03e44b2f6430b4da0be795.svg",
  "/fr/services/tender-support/": "__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg",
  "/fr/services/tender-support/deal-structuring/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/fr/services/tender-support/narrative-assembly/": "__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg",
  "/fr/contact/": "__docs-assets/4c68dca63d2d58d2d73b9099e3313779df5b8cf0a6ac09f8e27559208c3aa837.svg",
  "/fr/faq/": "__docs-assets/bfade24700bb2d82d0cd4e72d9bf0b0f409f76fea8747216e221a826d1ba1b09.svg",
  "/fr/solutions/": "__docs-assets/f15c80d9fefe1635d51b6bb28bbe57c3728261dd24e03cef1c9a4e69c3201583.svg",
  "/fr/solutions/home-2/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/fr/solutions/modernization/": "__docs-assets/b3edda20134ee44be236b7ea56af8d3a6199e862f882a1b25d690d18c20e2dc6.svg",
  "/fr/webkernel/": "__docs-assets/e417258015955cb7cc18735cfc2757ace86399a0ab1e6fc79c0ec6bc44c0c62a.svg",
  "/fr/about/": "__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg",
  "/fr/about/assets/brand-kit/": "__docs-assets/c69a28b23402c72de4746b80d44f480e7eb1cb25c89b554d2656fa5ac52734ed.svg",
  "/fr/about/company/about/culture/": "__docs-assets/5e26656dd7926ce4ec2316e213f286594a4eefab072a626f4bb6a704fce5ad83.svg",
  "/fr/about/company/about/story/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/about/company/about/values/": "__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg",
  "/fr/about/company/about/vision/": "__docs-assets/ba7f72e5958718fcce1abf4eaf04572306cf148032421861bfb6de19852aadfb.svg",
  "/fr/about/company/careers/apply/": "__docs-assets/4fac7d3c7451de02e0a3573b7d5ee32bd505d9f8b81acffeeac25d5cb671c03f.svg",
  "/fr/about/company/careers/open-positions/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/fr/about/company/careers/programs/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/fr/about/company/group/": "__docs-assets/a893c5c1372dbdf86564d3b24431eb4af0f49230794deff906710e345dee57c5.svg",
  "/fr/about/company/press/": "__docs-assets/a5f0c6358b0c3f8c27be8c40f383c51586e22dd57af69363590260d92f98b62b.svg",
  "/fr/about/company/team/employees/": "__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg",
  "/fr/about/company/team/employees/elmoumenyassine/": "__docs-assets/3d4225c63f203710bf37f09032162ca4766dbf98e19dc6332b312f1d660466aa.svg",
  "/fr/about/legal/notice/": "__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg",
  "/fr/about/legal/overview/": "__docs-assets/1f40d7072b60c672a26ad36e9a98ffc912a0fd0d643560f3db8790544a0f1070.svg",
  "/fr/about/legal/payment-methods/": "__docs-assets/09980f4365b8f1d442bd797eee3d36d00716b96247188728dce270a4cd2dcdf8.svg",
  "/fr/about/legal/privacy/": "__docs-assets/72f8897026ebd32a4314bb1aabafb4e702246aeb2059ee471eb0baef61220af9.svg",
  "/fr/about/legal/terms/": "__docs-assets/7e3a52fc2ae24d688c80a8d936b3d85d49187b1f0dbfc341d12ca159c506af5f.svg",
  "/fr/numerimondes/docs/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/numerimondes/docs/oss/webkernel/": "__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/api-reference/": "__docs-assets/d988cafe8d6dadf1d03c51474da728d9c9cc23856df1f2a102b54738d20f72ad.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/architecture/": "__docs-assets/25aa6522219efc1b593fef67d3c310d864bd7918506a455daa4a95ce5fe4d47b.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/changelog/": "__docs-assets/ee0da7da72f08abcf42ea592198272678437643e27f41b59ff55c11279564eec.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/contributing/": "__docs-assets/0c677ea4c6c9d89705c9898b9a6357e1270379144544cc6a6215c6c4900d2936.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/cookbook/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/demo/": "__docs-assets/9d44c8b6ebe76675fcc5bc1dbf0cf2960aed6d43ff60070c4737c2c8648c0550.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/deployment/": "__docs-assets/489aa4d157f438cce6d3d16ed1da822553f279986be56b7b6395b350a79c3a40.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/getting-started/": "__docs-assets/e56ef5866e655b2c93539ee5cf9e58b8a1a3ed6c2d4d40b7ece2bdf63a00ae82.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/modules/": "__docs-assets/92a57e63c2284df07a84e7eff285d0dde49060d13eabe8c8ce701869c25bca6c.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/roadmap/": "__docs-assets/bbc035522cd72fa212f479ed56b759c2453fd57507b8b4abeded067b76368923.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/showcase/": "__docs-assets/ae026945e5317daca96cca4786210a4cb39a5abccf8183d75222818dab868c93.svg",
  "/fr/numerimondes/docs/oss/webkernel/docs/2.x/upgrade/": "__docs-assets/9f0829ae54959b4a28b37c7f5c5736576deb37f8c97370500e260f89602e841a.svg",
  "/fr/education/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/fr/education/catalogue/": "__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg",
  "/fr/education/institutional/": "__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg",
  "/fr/research/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/fr/research/lab/": "__docs-assets/954c5ca39aaca04061c3ca52a0196f5dba670fa20c8a9fce94aebcb0a4225900.svg",
  "/fr/research/publications/": "__docs-assets/38bb7af14100d3ba72c3a2e620b1d8898b02a3ca5046e0f009215e00b0dbd1ab.svg",
  "/fr/research/publications/job-market-actual-state/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/research/publications/neurobiologie-travail-acheve/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/research/publications/push-technology-farthest/": "__docs-assets/e98035a5aef7741d75fd4c95cadc3b7177d435b2b0908895e56c95ffb0916b06.svg",
  "/fr/research/publications/series/satisfaction-when-work-is-done/": "__docs-assets/44f937aab59e3fedf3e6a909015f89ae8318b89aaacd50faf8955e1ef290751a.svg",
  "/fr/community/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/fr/community/become-consultant/": "__docs-assets/ab26b2e0ebea40f4abf23ee9eb4662ab537c33a4b338f89accfc0b8ab1ab1e94.svg",
  "/fr/community/contributors/hall-of-fame/": "__docs-assets/588dc6e7a2a50f0f9cc96d9e0a07bd13b7852e1d76308dac769def4097c888f2.svg",
  "/fr/community/contributors/how-to-contribute/": "__docs-assets/5dc29f4ab404b670b6fd1d8b2600f34e24c6dc176fa73d14d0b7c552467d3d4e.svg",
  "/fr/community/events/past/": "__docs-assets/f1ee05126177875f079fb6becacaf88701445133fce03c32c9eb444a4f3d4e14.svg",
  "/fr/community/events/upcoming/": "__docs-assets/8429569ba11344ff12b1af62bd7d8d846b708b827fc71659918c1d5da991b943.svg",
  "/fr/community/forum/education/": "__docs-assets/621f0c2209fd2c3ac02c9f58a2c303582ade02153861508f551d4da4e37cc543.svg",
  "/fr/community/forum/general/": "__docs-assets/a41df70216764f388cca7003a7cc82229f88bb7605e9b5c2ea36049da7f37dda.svg",
  "/fr/community/forum/jobs/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/fr/community/forum/webkernel/": "__docs-assets/6d1dd0b962deefa66c1b05951396f4a5346580941e5af395c83d9f7ad7edcc1b.svg",
  "/fr/community/freelance-jobs/": "__docs-assets/c34b5ca7a9c4e87557b2107d4578b192686a77caeb3f305ce201bf82bfd44e4b.svg",
  "/fr/partnerships/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg",
  "/fr/partnerships/become-partner/": "__docs-assets/e34ce005fb84f0fdc783e06735e7ad1c56c4c03295b251098b48a04eb2782b9b.svg",
  "/fr/partnerships/current-partners/": "__docs-assets/81159f113b7d22c990eead1b6e1d88adcef23ad0915d3ca53202939ef83bfe6e.svg",
  "/fr/partnerships/institutional/": "__docs-assets/8c57db9fa38f1802c4d54794a300f24f9c8340552c6c5d52bae64ac8cde786e4.svg",
  "/fr/partnerships/overview/": "__docs-assets/d2477b9310a722d95dae7d0bdb79665d0c91feb5f2acf3e252bb9665fe6485db.svg",
  "/fr/": "__docs-assets/e8b9ace2549de5c52546ca01e4f0048e6a6895161983a52e900fad3c7603a8b0.svg"
};
const generatedCollections = [
  {
    id: "concepts",
    path: "concepts",
    sourcePath: "concepts",
    layout: "doc",
    indexLayout: "list",
    titles: {
      en: "Concepts",
      fr: "Concepts"
    },
    descriptions: {
      en: "Atomic definitions used across research publications.",
      fr: "Définitions atomiques utilisées dans les publications de recherche."
    },
    links: {
      en: "/concepts/",
      fr: "/fr/concepts/"
    },
    categories: {
      en: [],
      fr: []
    },
    articles: {
      en: [
        {
          title: "Dopaminergic closure",
          description: "Completion as a distinct dopaminergic event at the end of a work unit.",
          date: "",
          category: "",
          wordCount: 45,
          readingTime: 1,
          url: "/concepts/dopaminergic-closure/"
        },
        {
          title: "Kardashev Scale",
          description: "Method of ranking civilizations by energy capture — from planetary to stellar to galactic scales.",
          date: "",
          category: "",
          wordCount: 89,
          readingTime: 1,
          url: "/concepts/kardashev-scale/"
        },
        {
          title: "Labour-market signals",
          description: "How to read noisy labour data without treating headlines as a single market.",
          date: "",
          category: "",
          wordCount: 32,
          readingTime: 1,
          url: "/concepts/labour-market-signals/"
        },
        {
          title: "Skill obsolescence",
          description: "How fast mid-stack skills lose economic relevance.",
          date: "",
          category: "",
          wordCount: 28,
          readingTime: 1,
          url: "/concepts/skill-obsolescence/"
        },
        {
          title: "Task completion",
          description: "Designing work so that done is a real, checkable boundary.",
          date: "",
          category: "",
          wordCount: 32,
          readingTime: 1,
          url: "/concepts/task-completion/"
        },
        {
          title: "Technological acceleration",
          description: "Acceleration as a systems property — not mere feature velocity.",
          date: "",
          category: "",
          wordCount: 36,
          readingTime: 1,
          url: "/concepts/technological-acceleration/"
        }
      ],
      fr: [
        {
          title: "Accélération technologique",
          description: "Définition de « Accélération technologique », publiée dans la collection des concepts de recherche.",
          date: "",
          category: "",
          wordCount: 45,
          readingTime: 1,
          url: "/fr/concepts/technological-acceleration/"
        },
        {
          title: "Achèvement de tâche",
          description: "Définition de « Achèvement de tâche », publiée dans la collection des concepts de recherche.",
          date: "",
          category: "",
          wordCount: 41,
          readingTime: 1,
          url: "/fr/concepts/task-completion/"
        },
        {
          title: "Clôture dopaminergique",
          description: "Définition de « Clôture dopaminergique », publiée dans la collection des concepts de recherche.",
          date: "",
          category: "",
          wordCount: 54,
          readingTime: 1,
          url: "/fr/concepts/dopaminergic-closure/"
        },
        {
          title: "Échelle de Kardashev",
          description: "Définition de « Échelle de Kardashev », publiée dans la collection des concepts de recherche.",
          date: "",
          category: "",
          wordCount: 98,
          readingTime: 1,
          url: "/fr/concepts/kardashev-scale/"
        },
        {
          title: "Obsolescence des compétences",
          description: "Définition de « Obsolescence des compétences », publiée dans la collection des concepts de recherche.",
          date: "",
          category: "",
          wordCount: 37,
          readingTime: 1,
          url: "/fr/concepts/skill-obsolescence/"
        },
        {
          title: "Signaux du marché du travail",
          description: "Définition de « Signaux du marché du travail », publiée dans la collection des concepts de recherche.",
          date: "",
          category: "",
          wordCount: 41,
          readingTime: 1,
          url: "/fr/concepts/labour-market-signals/"
        }
      ]
    }
  }
];
const DocumentationNotice = defineComponent({
  name: "DocumentationNotice",
  setup: () => () => null
});
const DocumentationLastModified = defineComponent({
  name: "DocumentationLastModified",
  setup: () => () => null
});
const _sfc_main$5 = {
  __name: "NmCard",
  __ssrInlineRender: true,
  props: { title: String, description: String, icon: String, color: String },
  setup(__props) {
    const props = __props;
    const iconGlyph = computed(() => {
      var _a;
      return ((_a = props.icon) == null ? void 0 : _a.replace(/^heroicon-[os]-/, "").replaceAll("-", " ")) ?? "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "nm-card" }, _attrs))}>`);
      if (__props.icon) {
        _push(`<div class="nm-card__icon" aria-hidden="true">${ssrInterpolate(iconGlyph.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="nm-card__body">`);
      if (_ctx.$slots.heading || __props.title) {
        _push(`<h3 class="nm-card__title">`);
        ssrRenderSlot(_ctx.$slots, "heading", {}, () => {
          _push(`${ssrInterpolate(__props.title)}`);
        }, _push, _parent);
        _push(`</h3>`);
      } else {
        _push(`<!---->`);
      }
      if (_ctx.$slots.description || __props.description) {
        _push(`<p class="nm-card__description">`);
        ssrRenderSlot(_ctx.$slots, "description", {}, () => {
          _push(`${ssrInterpolate(__props.description)}`);
        }, _push, _parent);
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></article>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../../site-2/resources/components/NmCard.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const concepts = [
  {
    title: "Dopaminergic closure",
    family: "Neurobiology & Cognitive Mechanics",
    summary: "The neural settling that occurs when a predicted work outcome is actually completed — the open loop closes.",
    url: "/concepts/dopaminergic-closure"
  },
  {
    title: "Kardashev Scale",
    family: "Physics & Technological Paradigms",
    summary: "A ladder of civilization technological level based on how much energy a society can harness and direct.",
    url: "/concepts/kardashev-scale"
  },
  {
    title: "Labour-market signals",
    family: "Economics & Labour Markets",
    summary: "Observable indicators — vacancies, wages, time-to-hire — used as noisy instruments on skill demand.",
    url: "/concepts/labour-market-signals"
  },
  {
    title: "Skill obsolescence",
    family: "Economics & Labour Markets",
    summary: "The decay rate of a skill’s market value under automation, platform change, and institutional lag.",
    url: "/concepts/skill-obsolescence"
  },
  {
    title: "Task completion",
    family: "Neurobiology & Cognitive Mechanics",
    summary: "An explicit, verifiable end state for a unit of work — not pause, handoff, or “almost”.",
    url: "/concepts/task-completion"
  },
  {
    title: "Technological acceleration",
    family: "Physics & Technological Paradigms",
    summary: "The compounding rate at which tools, energy systems, and knowledge close the loop from discovery to deployment.",
    url: "/concepts/technological-acceleration"
  }
];
const _sfc_main$4 = {
  __name: "NmConceptsIndex",
  __ssrInlineRender: true,
  setup(__props) {
    const query = ref("");
    const groups = computed(() => {
      var _a;
      const q = query.value.trim().toLocaleLowerCase();
      const result = {};
      for (const item of concepts) {
        if (q && !`${item.family} ${item.title} ${item.summary}`.toLocaleLowerCase().includes(q)) continue;
        (result[_a = item.family] || (result[_a] = [])).push(item);
      }
      return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)).map(([family, items]) => [family, items.sort((a, b) => a.title.localeCompare(b.title))]));
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "nm-concepts" }, _attrs))}><label class="nm-concepts__search">Search concepts <input${ssrRenderAttr("value", query.value)} type="search" autocomplete="off" placeholder="Search concepts…"></label><!--[-->`);
      ssrRenderList(groups.value, (items, family) => {
        _push(`<section class="nm-concepts__family"><h2>${ssrInterpolate(family)}</h2><div class="nm-concepts__grid"><!--[-->`);
        ssrRenderList(items, (item) => {
          _push(`<a${ssrRenderAttr("href", item.url)} class="nm-concepts__card"><strong>${ssrInterpolate(item.title)}</strong><span>${ssrInterpolate(item.summary)}</span></a>`);
        });
        _push(`<!--]--></div></section>`);
      });
      _push(`<!--]-->`);
      if (!Object.keys(groups.value).length) {
        _push(`<p role="status">No concepts match this search.</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../../site-2/resources/components/NmConceptsIndex.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = {
  __name: "NmContents",
  __ssrInlineRender: true,
  setup(__props) {
    const headings = ref([]);
    onMounted(() => {
      headings.value = [...document.querySelectorAll(".vp-doc h2, .vp-doc h3")].map((h2) => ({ id: h2.id, text: h2.textContent || "" })).filter((h2) => h2.id);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({
        class: "nm-contents",
        "aria-label": "On this page"
      }, _attrs))}><strong>On this page</strong><ul><!--[-->`);
      ssrRenderList(headings.value, (item) => {
        _push(`<li><a${ssrRenderAttr("href", `#${item.id}`)}>${ssrInterpolate(item.text)}</a></li>`);
      });
      _push(`<!--]--></ul></nav>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../../site-2/resources/components/NmContents.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "NmDynamicList",
  __ssrInlineRender: true,
  props: { title: { type: String, default: "Updates" }, items: { type: Array, default: () => [] }, emptyMessage: { type: String, default: "No items have been published yet." } },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "nm-dynamic-list" }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "title", {}, () => {
        _push(`<h2>${ssrInterpolate(__props.title)}</h2>`);
      }, _push, _parent);
      if (__props.items.length) {
        _push(`<ul><!--[-->`);
        ssrRenderList(__props.items, (item) => {
          _push(`<li>`);
          if (item.href) {
            _push(`<a${ssrRenderAttr("href", item.href)}>${ssrInterpolate(item.title)}</a>`);
          } else {
            _push(`<span>${ssrInterpolate(item.title)}</span>`);
          }
          if (item.description) {
            _push(`<p>${ssrInterpolate(item.description)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul>`);
      } else {
        _push(`<p>${ssrInterpolate(__props.emptyMessage)}</p>`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../../site-2/resources/components/NmDynamicList.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "NmStat",
  __ssrInlineRender: true,
  props: { label: String, value: String, description: String, color: String, icon: String },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "nm-stat" }, _attrs))}><span class="nm-stat__label">${ssrInterpolate(__props.label)}</span><strong class="nm-stat__value">${ssrInterpolate(__props.value)}</strong>`);
      if (__props.description) {
        _push(`<span class="nm-stat__description">${ssrInterpolate(__props.description)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../../site-2/resources/components/NmStat.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "NmTriptych",
  __ssrInlineRender: true,
  props: { alt: String },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "nm-triptych",
        role: "img",
        "aria-label": __props.alt || "Numerimondes technology and consulting"
      }, _attrs))}><span>Strategy</span><span>Engineering</span><span>Operations</span></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../../../../site-2/resources/components/NmTriptych.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const projectComponents = {
  "NmCard": _sfc_main$5,
  "NmConceptsIndex": _sfc_main$4,
  "NmContents": _sfc_main$3,
  "NmDynamicList": _sfc_main$2,
  "NmStat": _sfc_main$1,
  "NmTriptych": _sfc_main
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
    useRouter();
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
      root2.classList.toggle("docs-language-flags", Boolean(siteContent.showLanguageFlags));
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
