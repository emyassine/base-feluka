import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Cloud Tech Stack","description":"Every runtime, database engine, and framework supported and managed on Numerimondes Cloud.","frontmatter":{"requestedLanguage":"fr","contentLanguage":"en","languageFallbackNotice":"Cette page n’est pas disponible en Français. La version English est affichée.","title":"Cloud Tech Stack","sidebarTitle":"Tech Stack","icon":"code-xml","description":"Every runtime, database engine, and framework supported and managed on Numerimondes Cloud.","prev":{"text":"Pricing","link":"/fr/services/cloud/pricing/"},"next":{"text":"Consulting","link":"/fr/services/consulting/"}},"headers":[],"relativePath":"fr/services/cloud/tech-stack/index.md","filePath":"fr/services/cloud/tech-stack/index.md"}');
const _sfc_main = { name: "fr/services/cloud/tech-stack/index.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmStat = resolveComponent("NmStat");
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Cloud · Tech Stack&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Any runtime. &lt;span class=&quot;nm-headline-accent&quot;&gt;Any database. Any framework.&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    A subpage of &lt;a href=&quot;/services/cloud&quot;&gt;Numerimondes Cloud&lt;/a&gt;. Our management layer is
    stack-agnostic by design. If it runs on Linux, we can configure, monitor, and maintain it.
&lt;/p&gt;
</code></pre></div><h2 id="runtimes-languages" tabindex="-1">Runtimes &amp; languages <a class="header-anchor" href="#runtimes-languages" aria-label="Permalink to &quot;Runtimes &amp; languages&quot;">​</a></h2><div class="grid-container grid-cols-3" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "PHP",
    value: "7.4–8.4",
    description: "Multi-version, per-site",
    color: "primary",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Node.js",
    value: "LTS & current",
    description: "PM2-managed processes",
    color: "success",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Python",
    value: "Django · FastAPI · Flask",
    description: "Gunicorn / Uvicorn",
    color: "warning",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Ruby",
    value: "Rails · Rack",
    description: "Puma / Unicorn",
    color: "info",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Go",
    value: "High-performance",
    description: "APIs & services",
    color: "primary",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Java",
    value: "Spring · Tomcat",
    description: "JVM tuning included",
    color: "success",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: ".NET",
    value: "ASP.NET Core",
    description: "Linux-hosted",
    color: "warning",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Rust",
    value: "Systems-level",
    description: "Apps & services",
    color: "info",
    icon: "heroicon-o-code-bracket"
  }, null, _parent));
  _push(`</div></div><p>Also configured on request: Deno, Bun, Elixir/Phoenix, and legacy Perl applications.</p><h2 id="database-engines" tabindex="-1">Database engines <a class="header-anchor" href="#database-engines" aria-label="Permalink to &quot;Database engines&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-circle-stack",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Relational`);
      } else {
        return [
          createTextVNode("Relational")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` MySQL (5.7 / 8.0 / 8.4), PostgreSQL (14–16), MariaDB (including Galera cluster support), and SQLite for embedded use. `);
      } else {
        return [
          createTextVNode(" MySQL (5.7 / 8.0 / 8.4), PostgreSQL (14–16), MariaDB (including Galera cluster support), and SQLite for embedded use. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-bolt",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Cache, queues &amp; search`);
      } else {
        return [
          createTextVNode("Cache, queues & search")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Redis for cache, sessions, and queues; RabbitMQ and Kafka for messaging and event streaming; Elasticsearch and ClickHouse for search and analytics. `);
      } else {
        return [
          createTextVNode(" Redis for cache, sessions, and queues; RabbitMQ and Kafka for messaging and event streaming; Elasticsearch and ClickHouse for search and analytics. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-server-stack",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Document &amp; wide-column`);
      } else {
        return [
          createTextVNode("Document & wide-column")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` MongoDB (Community &amp; Enterprise) and Cassandra for distributed, wide-column workloads. `);
      } else {
        return [
          createTextVNode(" MongoDB (Community & Enterprise) and Cassandra for distributed, wide-column workloads. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-archive-box",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Object storage`);
      } else {
        return [
          createTextVNode("Object storage")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` MinIO for S3-compatible object storage on infrastructure you control. `);
      } else {
        return [
          createTextVNode(" MinIO for S3-compatible object storage on infrastructure you control. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><p>Additional engines are configured on request — ask us about anything not listed here.</p><h2 id="frameworks-platforms" tabindex="-1">Frameworks &amp; platforms <a class="header-anchor" href="#frameworks-platforms" aria-label="Permalink to &quot;Frameworks &amp; platforms&quot;">​</a></h2><p>We configure the server environment for each framework&#39;s specific requirements rather than applying one generic configuration to everything:</p><ul><li><strong>PHP</strong> — Laravel (queue workers, Horizon, Octane), Symfony (Messenger, Doctrine), WordPress (optimised Nginx + PHP-FPM), Magento (with Varnish + Redis), Drupal</li><li><strong>JavaScript / TypeScript</strong> — Next.js (SSR &amp; SSG), Nuxt, React, Angular, Svelte/SvelteKit, Strapi, Ghost</li><li><strong>Python</strong> — Django (Gunicorn + Nginx + Celery), FastAPI (Uvicorn)</li><li><strong>Ruby</strong> — Rails (Puma with Nginx reverse proxy)</li><li><strong>Java</strong> — Spring Boot (JVM tuning + systemd service)</li><li><strong>Sovereign foundation</strong> — <a href="/fr/numerimondes/docs/oss/webkernel">Webkernel</a>, our own PHP-based enterprise framework</li></ul><h2 id="using-something-not-listed" tabindex="-1">Using something not listed? <a class="header-anchor" href="#using-something-not-listed" aria-label="Permalink to &quot;Using something not listed?&quot;">​</a></h2><p>If it runs on Linux, we can very likely manage it. Contact us with your stack and we will confirm support before you commit.</p><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Ask about your stack


    See pricing

← Numerimondes Cloud
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("fr/services/cloud/tech-stack/index.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  index as default
};
