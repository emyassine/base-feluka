import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Cloud Features","description":"Everything Numerimondes Cloud configures, monitors, and maintains — server hardening, database management, SSL/DNS/email, monitoring, and backups.","frontmatter":{"title":"Cloud Features","sidebarTitle":"Features","icon":"sliders-horizontal","description":"Everything Numerimondes Cloud configures, monitors, and maintains — server hardening, database management, SSL/DNS/email, monitoring, and backups.","search":false,"prev":{"text":"Cloud","link":"/services/cloud/"},"next":{"text":"Platforms","link":"/services/cloud/platforms/"}},"headers":[],"relativePath":"services/cloud/features.md","filePath":"services/cloud/features.md"}');
const _sfc_main = { name: "services/cloud/features.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Cloud · Features&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Everything managed. &lt;span class=&quot;nm-headline-accent&quot;&gt;Nothing left to a default install.&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    A subpage of &lt;a href=&quot;/services/cloud&quot;&gt;Numerimondes Cloud&lt;/a&gt;. A full breakdown of what we configure,
    monitor, and maintain on every server under management, whatever tier you&#39;re on.
&lt;/p&gt;
</code></pre></div><h2 id="server-os-hardening" tabindex="-1">Server &amp; OS hardening <a class="header-anchor" href="#server-os-hardening" aria-label="Permalink to &quot;Server &amp; OS hardening&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-lock-closed",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Access hardening`);
      } else {
        return [
          createTextVNode("Access hardening")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Minimal OS install, SSH hardening (key-only authentication, custom port, rate limiting), and kernel parameter tuning for performance and security. `);
      } else {
        return [
          createTextVNode(" Minimal OS install, SSH hardening (key-only authentication, custom port, rate limiting), and kernel parameter tuning for performance and security. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-shield-exclamation",
    color: "danger"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Threat protection`);
      } else {
        return [
          createTextVNode("Threat protection")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Automated unattended security upgrades, fail2ban brute-force protection, malware scanning, and rootkit detection, with file integrity monitoring on top. `);
      } else {
        return [
          createTextVNode(" Automated unattended security upgrades, fail2ban brute-force protection, malware scanning, and rootkit detection, with file integrity monitoring on top. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="web-server-runtime-management" tabindex="-1">Web server &amp; runtime management <a class="header-anchor" href="#web-server-runtime-management" aria-label="Permalink to &quot;Web server &amp; runtime management&quot;">​</a></h2><ul><li>Nginx and Apache configuration, tuned per application type</li><li>Multi-version runtime support — run different language versions per site where needed</li><li>Process management with automatic restart for long-running services</li><li>Cron job management and scheduled task monitoring</li></ul><p>Full list of supported runtimes and frameworks is on the <a href="/services/cloud/tech-stack">tech stack page →</a></p><h2 id="database-management" tabindex="-1">Database management <a class="header-anchor" href="#database-management" aria-label="Permalink to &quot;Database management&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-circle-stack",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Configuration &amp; tuning`);
      } else {
        return [
          createTextVNode("Configuration & tuning")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Configuration tuned to your dataset and query patterns, with slow-query logging and proactive performance analysis. `);
      } else {
        return [
          createTextVNode(" Configuration tuned to your dataset and query patterns, with slow-query logging and proactive performance analysis. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-path",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Recovery &amp; replication`);
      } else {
        return [
          createTextVNode("Recovery & replication")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Point-in-time restore capability across supported engines, with replication setups available where the workload justifies it. `);
      } else {
        return [
          createTextVNode(" Point-in-time restore capability across supported engines, with replication setups available where the workload justifies it. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><h2 id="ssl-dns-email" tabindex="-1">SSL, DNS &amp; email <a class="header-anchor" href="#ssl-dns-email" aria-label="Permalink to &quot;SSL, DNS &amp; email&quot;">​</a></h2><ul><li>SSL/TLS certificate issuance and renewal for all managed domains, including wildcard support</li><li>DNS zone management from the console — A, AAAA, CNAME, MX, TXT, SRV records</li><li>Professional mailboxes with spam filtering and correctly configured DKIM/SPF/DMARC</li><li>Email routing rules and alias management</li></ul><h2 id="monitoring-alerting" tabindex="-1">Monitoring &amp; alerting <a class="header-anchor" href="#monitoring-alerting" aria-label="Permalink to &quot;Monitoring &amp; alerting&quot;">​</a></h2><p>We monitor uptime, resource usage, and service health across managed servers, with alert thresholds set to your application&#39;s normal baseline rather than a generic default — so you hear about real anomalies, not noise. SSL expiry is tracked and renewal is automated. Specific performance figures (uptime, response time) are not published here as generic marketing claims; they are reported to each client against their own service agreement, since they depend on the tier, hardware, and workload involved.</p><h2 id="backups-disaster-recovery" tabindex="-1">Backups &amp; disaster recovery <a class="header-anchor" href="#backups-disaster-recovery" aria-label="Permalink to &quot;Backups &amp; disaster recovery&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-archive-box",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Automated encrypted backups`);
      } else {
        return [
          createTextVNode("Automated encrypted backups")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Regular automated backups of files, databases, and mail, encrypted at rest and stored on infrastructure isolated from the primary server. `);
      } else {
        return [
          createTextVNode(" Regular automated backups of files, databases, and mail, encrypted at rest and stored on infrastructure isolated from the primary server. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-arrow-uturn-left",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Restore on request`);
      } else {
        return [
          createTextVNode("Restore on request")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Point-in-time restore to a prior backup snapshot, plus on-demand manual snapshots before major deployments. `);
      } else {
        return [
          createTextVNode(" Point-in-time restore to a prior backup snapshot, plus on-demand manual snapshots before major deployments. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><p>Retention windows and off-site replication options are agreed per contract and depend on the tier — see <a href="/services/cloud/pricing">Pricing</a>.</p><h2 id="management-console" tabindex="-1">Management console <a class="header-anchor" href="#management-console" aria-label="Permalink to &quot;Management console&quot;">​</a></h2><p>Servers under management are visible through a centralised console: server and domain overview, database access, DNS zone editing, mailbox management, and an audit log of configuration changes and deployments. Role-based access lets you scope what each team member can see or change.</p><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Talk to us about your setup


    See pricing

← Numerimondes Cloud
</code></pre></div><p>:::md justified <strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("services/cloud/features.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const features = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  features as default
};
