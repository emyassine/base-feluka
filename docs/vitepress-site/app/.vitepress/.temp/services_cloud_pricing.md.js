import { _ as _export_sfc } from "./plugin-vue_export-helper.DqPog0PX.js";
import { ssrRenderAttrs, ssrRenderStyle, ssrRenderComponent } from "@vue/server-renderer";
import { resolveComponent, withCtx, createTextVNode, useSSRContext } from "@vue/runtime-dom";
const __pageData = JSON.parse('{"title":"Cloud Pricing","description":"Numerimondes Cloud pricing — shared hosting from 400 MAD, or a quote for VPS, bare-metal dedicated, and managed hardware you already own.","frontmatter":{"title":"Cloud Pricing","sidebarTitle":"Pricing","icon":"currency-dollar","description":"Numerimondes Cloud pricing — shared hosting from 400 MAD, or a quote for VPS, bare-metal dedicated, and managed hardware you already own.","search":false,"prev":{"text":"Platforms","link":"/services/cloud/platforms/"},"next":{"text":"Tech Stack","link":"/services/cloud/tech-stack/"}},"headers":[],"relativePath":"services/cloud/pricing.md","filePath":"services/cloud/pricing.md"}');
const _sfc_main = { name: "services/cloud/pricing.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NmCard = resolveComponent("NmCard");
  const _component_NmStat = resolveComponent("NmStat");
  _push(`<div${ssrRenderAttrs(_attrs)}><div style="${ssrRenderStyle({ "display": "flex", "flex-direction": "column", "align-items": "center", "text-align": "center" })}"><pre><code>&lt;span class=&quot;nm-eyebrow&quot;&gt;Cloud · Pricing&lt;/span&gt;
&lt;h1 class=&quot;nm-headline&quot;&gt;Transparent where we can be. &lt;span class=&quot;nm-headline-accent&quot;&gt;Quoted where it depends.&lt;/span&gt;&lt;/h1&gt;
&lt;p style=&quot;max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;&quot;&gt;
    Four tiers, one management standard. Shared hosting has a published rate because it is
    standardised. VPS, bare metal, and your own hardware are quoted, because the right price
    depends on capacity, workload, and hardware — we will not pretend otherwise with a fake number.
&lt;/p&gt;
</code></pre></div><h2 id="the-four-tiers" tabindex="-1">The four tiers <a class="header-anchor" href="#the-four-tiers" aria-label="Permalink to &quot;The four tiers&quot;">​</a></h2><div class="grid-container grid-cols-2" style="${ssrRenderStyle({ "margin": "1.25rem 0 2rem" })}"><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-squares-2x2",
    color: "primary"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Shared hosting`);
      } else {
        return [
          createTextVNode("Shared hosting")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Published rate below. Suited to standard web projects, brochure sites, and smaller applications. `);
      } else {
        return [
          createTextVNode(" Published rate below. Suited to standard web projects, brochure sites, and smaller applications. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-server",
    color: "success"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`VPS`);
      } else {
        return [
          createTextVNode("VPS")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` A virtual private server sized to your workload. Quoted against the resources you need — CPU, RAM, storage. `);
      } else {
        return [
          createTextVNode(" A virtual private server sized to your workload. Quoted against the resources you need — CPU, RAM, storage. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-cpu-chip",
    color: "warning"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Bare metal dedicated`);
      } else {
        return [
          createTextVNode("Bare metal dedicated")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` A physical server reserved entirely for you. Quoted against the specific hardware and location required. `);
      } else {
        return [
          createTextVNode(" A physical server reserved entirely for you. Quoted against the specific hardware and location required. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="grid-item hover:elevate">`);
  _push(ssrRenderComponent(_component_NmCard, {
    compact: "true",
    icon: "heroicon-o-building-office",
    color: "info"
  }, {
    heading: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Bring your own`);
      } else {
        return [
          createTextVNode("Bring your own")
        ];
      }
    }),
    description: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Your existing server or rented VPS. Quoted as a flat management fee, since the hardware cost is already yours. `);
      } else {
        return [
          createTextVNode(" Your existing server or rented VPS. Quoted as a flat management fee, since the hardware cost is already yours. ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div><hr><h2 id="shared-hosting-—-published-rate" tabindex="-1">Shared hosting — published rate <a class="header-anchor" href="#shared-hosting-—-published-rate" aria-label="Permalink to &quot;Shared hosting — published rate&quot;">​</a></h2><p>Prices in Moroccan Dirhams, excluding VAT. All management fees are included in the price — no separate support-tier add-on.</p><table tabindex="0"><thead><tr><th>Item</th><th>Price</th></tr></thead><tbody><tr><td><strong>First year</strong></td><td>400 MAD HT</td></tr><tr><td><strong>Annual renewal (year 2 onward)</strong></td><td>1,000 MAD HT / year</td></tr><tr><td><strong>Storage included</strong></td><td>20 GB</td></tr><tr><td><strong>Additional storage</strong></td><td>12 MAD / GB / year</td></tr></tbody></table><p>What&#39;s included at this tier:</p><ul><li>Unlimited databases — MySQL &amp; PostgreSQL (additional engines on request)</li><li>Unlimited professional mailboxes</li><li>Full DNS zone editor</li><li>Automatic SSL/TLS for all domains</li><li>Management console access</li><li>Daily backups, 7-day retention</li><li>Monitoring with email alerts</li></ul><hr><h2 id="vps-bare-metal-bring-your-own-—-quoted" tabindex="-1">VPS, bare metal &amp; bring your own — quoted <a class="header-anchor" href="#vps-bare-metal-bring-your-own-—-quoted" aria-label="Permalink to &quot;VPS, bare metal &amp; bring your own — quoted&quot;">​</a></h2><p>These three tiers are priced individually because the right number depends on real variables: how much CPU and RAM the workload needs, whether the hardware is dedicated or shared, where it needs to be physically located, and — for bring-your-own — what state the existing hardware is already in. We would rather quote accurately than publish a number that doesn&#39;t hold once we see your actual requirements.</p><div class="grid-container grid-cols-4" style="${ssrRenderStyle({ "margin": "1.5rem 0 2rem" })}"><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Step 1",
    value: "Share",
    description: "Your workload or hardware specs",
    color: "primary",
    icon: "heroicon-o-document-text"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Step 2",
    value: "Quote",
    description: "Fixed monthly rate, no surprise fees",
    color: "success",
    icon: "heroicon-o-currency-dollar"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Step 3",
    value: "Deploy",
    description: "Configured and secured to our standard",
    color: "warning",
    icon: "heroicon-o-rocket-launch"
  }, null, _parent));
  _push(`</div><div class="grid-item">`);
  _push(ssrRenderComponent(_component_NmStat, {
    label: "Step 4",
    value: "Manage",
    description: "Flat fee, no per-incident billing",
    color: "info",
    icon: "heroicon-o-cog-6-tooth"
  }, null, _parent));
  _push(`</div></div><p>For <strong>Bring Your Own</strong>, the arrangement is specifically:</p><ol><li><strong>Share your server specs</strong> — hardware details and current OS state. We assess and provide a fixed management quote.</li><li><strong>Agree a flat management fee</strong> — covering configuration, monitoring, and ongoing management, with no per-task billing and no surprise charges for a security incident or a backup restore.</li><li><strong>We apply the management layer</strong> — OS hardening, stack configuration, monitoring, and backups, without taking ownership of the hardware.</li><li><strong>You stay in control</strong> — the server remains yours; you retain root access at all times. We add management, we do not take ownership.</li></ol><h2 id="payment-terms" tabindex="-1">Payment terms <a class="header-anchor" href="#payment-terms" aria-label="Permalink to &quot;Payment terms&quot;">​</a></h2><p>Whichever tier applies, invoicing is direct from Numerimondes SARL AU — you are not billed by a third-party hosting provider. Shared hosting is billed annually as shown above. VPS, bare metal, and bring-your-own management fees are billed monthly unless otherwise agreed in the quote.</p><hr><h2 id="questions-about-pricing" tabindex="-1">Questions about pricing <a class="header-anchor" href="#questions-about-pricing" aria-label="Permalink to &quot;Questions about pricing&quot;">​</a></h2><p>We are glad to discuss volume arrangements, multi-server setups, or management of non-standard hardware not covered by the tiers above.</p><hr><h2 id="next-step" tabindex="-1">Next step <a class="header-anchor" href="#next-step" aria-label="Permalink to &quot;Next step&quot;">​</a></h2><div class="flex flex-wrap gap-3 mt-6 mb-4"><pre><code>    Request a VPS / bare-metal / BYO quote


    See what&#39;s included

← Numerimondes Cloud
</code></pre></div><p>:::md justified Prices shown for shared hosting are excluding VAT (HT) and subject to change; the rate applicable at signature is the one confirmed in your order. VPS, bare metal, and bring-your-own management fees are quoted individually and confirmed in writing before any commitment.</p><p><strong>Numerimondes SARL AU</strong> — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · <a href="mailto:contact@numerimondes.com" target="_blank" rel="noreferrer">contact@numerimondes.com</a> · +212 6 20 99 06 92 :::</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("services/cloud/pricing.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const pricing = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  pricing as default
};
