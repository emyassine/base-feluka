<template>
  <div class="nshowc-wrapper" :style="{ '--nshowc-accent': accentColor }">
    <!-- HERO SECTION -->

    <div
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        margin: 0 auto;
        padding: 4rem 1rem;
        max-width: 720px;
      "
    >
      <Tifinagh />
      <h2
        style="
          margin: 0 0 1.2rem 0;
          letter-spacing: -0.04em;
          font-size: clamp(28px, 4vw, 44px);
          line-height: 1.15;
          max-width: 25ch;
          font-weight: 400;
          color: var(--vp-c-text-1);
        "
      >
        <span style="text-decoration: underline">We</span> are now living in an age of
        <span style="font-family: Garamond, Georgia, serif; font-style: italic; opacity: 0.9">
          nearly infinite leverage
        </span>
      </h2>

      <p
        style="
          margin: 0;
          font-size: clamp(16px, 1.1vw, 18px);
          line-height: 1.6;
          color: var(--vp-c-text-2);
          max-width: 60ch;
        "
      >
        Start owning the infrastructure that powers your operations.
      </p>
    </div>
    <!-- COMPARISON TABLE -->
    <div class="nshowc-comparison">
      <div class="nshowc-table-header">
        <div class="nshowc-feature-col">
          <h3>Feature</h3>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-plan-badge nshowc-legacy-badge">
            <component :is="lucideIcons.Cloud" :size="16" />
            <span>SaaS Platforms</span>
          </div>
          <p class="nshowc-plan-desc">Retool, Palantir, Low-code</p>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-plan-badge nshowc-sovereign-badge">
            <component :is="lucideIcons.Shield" :size="16" />
            <span>Numerimondes</span>
          </div>
          <p class="nshowc-plan-desc">WebKernel™ Ecosystem</p>
        </div>
      </div>

      <!-- DEPLOYMENT & HOSTING -->
      <div class="nshowc-category">
        <div class="nshowc-category-title">
          <component :is="lucideIcons.Server" :size="18" />
          <span>Deployment & Hosting</span>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Deployment Model</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Cloud-hosted (their servers)</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.CheckCircle2" :size="16" />
            <span>Your infrastructure</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Air-gapped deployment</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value nshowc-unavailable">
            <component :is="lucideIcons.X" :size="16" />
            <span>Not available</span>
          </div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.CheckCircle2" :size="16" />
            <span>Full offline capability</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Data residency</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Vendor's cloud regions</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.CheckCircle2" :size="16" />
            <span>100% local control</span>
          </div>
        </div>
      </div>

      <!-- OWNERSHIP & LICENSING -->
      <div class="nshowc-category">
        <div class="nshowc-category-title">
          <component :is="lucideIcons.Scale" :size="18" />
          <span>Ownership & Licensing</span>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Source code access</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value nshowc-unavailable">
            <component :is="lucideIcons.Lock" :size="16" />
            <span>Proprietary</span>
          </div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Code" :size="16" />
            <span>Eclipse Public License v2.0</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Modification rights</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value nshowc-unavailable">
            <component :is="lucideIcons.X" :size="16" />
            <span>Not permitted</span>
          </div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Edit3" :size="16" />
            <span>Full fork & modify rights</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Vendor lock-in</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">High dependency</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Unlock" :size="16" />
            <span>Zero dependency</span>
          </div>
        </div>
      </div>

      <!-- PRICING & COST MODEL -->
      <div class="nshowc-category">
        <div class="nshowc-category-title">
          <component :is="lucideIcons.DollarSign" :size="18" />
          <span>Pricing & Cost Model</span>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Pricing model</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Monthly/Annual subscription</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Zap" :size="16" />
            <span>One-time license</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Long-term costs</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Perpetual recurring fees</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.TrendingDown" :size="16" />
            <span>Predictable ROI</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Per-user licensing</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Scales with users</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Users" :size="16" />
            <span>Unlimited users</span>
          </div>
        </div>
      </div>

      <!-- TECHNICAL ARCHITECTURE -->
      <div class="nshowc-category">
        <div class="nshowc-category-title">
          <component :is="lucideIcons.Cpu" :size="18" />
          <span>Technical Architecture</span>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Module system</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Vendor marketplace only</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.GitBranch" :size="16" />
            <span>Your own git repos</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Development team</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Limited to vendor consultants</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Briefcase" :size="16" />
            <span>Hire any dev team</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Audit trail</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Vendor-controlled logs</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.FileText" :size="16" />
            <span>ADR-based governance</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Database architecture</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Vendor-managed</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Database" :size="16" />
            <span>Polyglot architecture</span>
          </div>
        </div>
      </div>

      <!-- COMPLIANCE & GOVERNANCE -->
      <div class="nshowc-category">
        <div class="nshowc-category-title">
          <component :is="lucideIcons.ShieldCheck" :size="18" />
          <span>Compliance & Governance</span>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Data sovereignty</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Subject to vendor policies</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Globe" :size="16" />
            <span>Full territorial control</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Third-party dependencies</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">External API reliance</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.Package" :size="16" />
            <span>Sovereign mirroring</span>
          </div>
        </div>
      </div>

      <div class="nshowc-row">
        <div class="nshowc-feature-col">
          <div class="nshowc-feature-name">Maintainability</div>
        </div>
        <div class="nshowc-plan-col nshowc-legacy">
          <div class="nshowc-value">Vendor-dependent</div>
        </div>
        <div class="nshowc-plan-col nshowc-sovereign">
          <div class="nshowc-value nshowc-highlight">
            <component :is="lucideIcons.History" :size="16" />
            <span>Long-term guaranteed</span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA SECTION -->
    <div class="nshowc-cta">
      <div class="nshowc-cta-content">
        <h2>Ready to own your infrastructure?</h2>
        <p>Join organizations building sovereign internal tools with WebKernel™</p>
        <div class="nshowc-cta-buttons">
          <button class="nshowc-btn nshowc-btn-primary">
            <component :is="lucideIcons.ArrowRight" :size="18" />
            Explore Numerimondes
          </button>
          <button class="nshowc-btn nshowc-btn-secondary">
            <component :is="lucideIcons.FileText" :size="18" />
            Read the Sovereignty report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import * as lucideIcons from 'lucide-vue-next';

const accentColor = ref('#2563eb');
</script>

<style scoped>
.nshowc-wrapper {
  --nshowc-accent: #2563eb;
  --cg-bg: #0a0a0a;
  --cg-surface: #111111;
  --cg-border: #1f1f1f;
  --cg-radius: 12px;
  --cg-success: #10b981;
  --cg-danger: #ef4444;

  color: var(--cg-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', Roboto, sans-serif;
  min-height: 100vh;
}

/* COMPARISON TABLE */
.nshowc-comparison {
  max-width: 1200px;
  margin: 0 auto;
  background: var(--vp-code-tab-bg);
  border: 1px solid var(--cg-border);
  border-radius: var(--cg-radius);
  overflow: hidden;
}

.nshowc-table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1px;
  background: var(--cg-border);
  border-bottom: 1px solid var(--cg-border);
}

.nshowc-feature-col {
  background: var(--vp-code-tab-bg);
  padding: 24px;
}

.nshowc-plan-col {
  background: var(--vp-code-tab-bg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.nshowc-plan-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.nshowc-legacy-badge {
  background: rgba(115, 115, 115, 0.1);
  color: var(--cg-text-secondary);
  border: 1px solid var(--cg-border);
}

.nshowc-sovereign-badge {
  background: rgba(37, 99, 235, 0.1);
  color: var(--nshowc-accent);
  border: 1px solid rgba(37, 99, 235, 0.3);
}

.nshowc-plan-desc {
  font-size: 13px;
  color: var(--cg-text-tertiary);
  margin: 0;
}

/* CATEGORY HEADERS */
.nshowc-category {
  background: var(--vp-nav-bg-color);
  border-top: 1px solid var(--cg-border);
  border-bottom: 1px solid var(--cg-border);
}

.nshowc-category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--cg-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ROWS */
.nshowc-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1px;
  background: var(--cg-border);
  border-bottom: 1px solid var(--cg-border);
}

.nshowc-row:last-child {
  border-bottom: none;
}

.nshowc-row .nshowc-feature-col {
  padding: 20px 24px;
  display: flex;
  align-items: center;
}

.nshowc-row .nshowc-plan-col {
  padding: 20px 24px;
  display: flex;
  align-items: flex-start;
  justify-content: left;
}

.nshowc-feature-name {
  font-size: 14px;
  color: var(--cg-text-primary);
}

.nshowc-value {
  font-size: 13px;
  color: var(--cg-text-secondary);
  display: flex;

  align-items: flex-start;
  text-align: left;
  gap: 8px;
}

.nshowc-value.nshowc-highlight {
  color: var(--nshowc-accent);
  font-weight: 500;
}

.nshowc-value.nshowc-unavailable {
  color: var(--cg-text-tertiary);
}

/* CTA SECTION */
.nshowc-cta {
  max-width: 900px;
  margin: 80px auto 0;
  text-align: center;
  background: var(--vp-code-tab-bg);
  border: 1px solid var(--cg-border);
  border-radius: var(--cg-radius);
  padding: 60px 40px;
}

.nshowc-cta-content h2 {
  font-size: 36px;
  font-weight: 500;
  margin-bottom: 16px;
  color: var(--cg-text-primary);
}

.nshowc-cta-content p {
  font-size: 16px;
  color: var(--cg-text-secondary);
  margin-bottom: 32px;
}

.nshowc-cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.nshowc-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--cg-border);
}

.nshowc-btn-primary {
  background: var(--nshowc-accent);
  color: #ffffff;
  border-color: var(--nshowc-accent);
}

.nshowc-btn-primary:hover {
  opacity: 0.9;
}

.nshowc-btn-secondary {
  background: transparent;
  color: var(--cg-text-primary);
  border-color: var(--cg-border);
}

.nshowc-btn-secondary:hover {
  background: var(--vp-code-tab-bg);
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .nshowc-hero-title {
    font-size: 36px;
  }

  .nshowc-table-header,
  .nshowc-row {
    grid-template-columns: 1fr;
  }

  .nshowc-plan-col {
    border-top: 1px solid var(--cg-border);
  }

  .nshowc-table-header .nshowc-feature-col {
    display: none;
  }

  .nshowc-cta-buttons {
    flex-direction: column;
  }

  .nshowc-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .nshowc-hero-title {
    font-size: 28px;
  }

  .nshowc-hero-subtitle {
    font-size: 14px;
  }

  .nshowc-cta-content h2 {
    font-size: 28px;
  }
}
</style>
