<script setup lang="ts">
import { computed, ref } from 'vue'
import { homepageContent, type HomepageLanguage } from './homepage-content'

const props = defineProps<{ lang: HomepageLanguage }>()
const content = computed(() => homepageContent[props.lang])
const homePrefix = computed(() => props.lang === 'fr' ? '/fr' : '')
const previewName = ref('Amina El Idrissi')
const selectedTarget = ref<'web' | 'workstation'>('web')
</script>

<template>
  <main class="docs-home feluqa-home" :lang="lang">
    <header class="home-hero">
      <div class="home-mark" aria-hidden="true"><span>F</span><i></i></div>
      <p class="home-eyebrow">{{ content.eyebrow }}</p>
      <h1>Feluqa</h1>
      <p class="home-tagline">{{ content.title }}</p>
      <p class="home-intro">{{ content.description }}</p>
      <div class="home-actions">
        <a class="home-button home-button-primary" :href="`${homePrefix}/get-started/`">{{ content.primaryAction }}<span aria-hidden="true">↗</span></a>
        <a class="home-button home-button-secondary" :href="`${homePrefix}/internals/`">{{ content.secondaryAction }}<span aria-hidden="true">→</span></a>
      </div>
      <p class="home-status"><span class="status-dot" aria-hidden="true"></span>{{ content.currentStatus }}</p>
    </header>

    <section
      v-for="(section, index) in content.sections"
      :key="section.number"
      class="tour-section"
      :class="index % 2 ? 'tour-section-right' : 'tour-section-left'"
    >
      <div class="tour-copy">
        <p class="tour-eyebrow"><span>{{ section.number }}</span>{{ section.eyebrow }}</p>
        <h2>{{ section.title }}</h2>
        <p class="tour-description">{{ section.description }}</p>
        <p class="tour-availability"><span aria-hidden="true">●</span>{{ section.availability }}</p>
      </div>

      <div class="tour-example" :class="`tour-example-${section.kind}`">
        <div class="code-window">
          <div class="window-bar">
            <span class="window-dots" aria-hidden="true"><i></i><i></i><i></i></span>
            <span class="window-filename">{{ section.filename }}</span>
            <span class="window-language">Rust</span>
          </div>
          <pre><code>{{ section.code }}</code></pre>
        </div>

        <div class="preview-window">
          <div class="preview-bar">
            <span><i aria-hidden="true"></i>{{ section.previewLabel }}</span>
            <span class="preview-menu" aria-hidden="true">···</span>
          </div>

          <div v-if="section.kind === 'module'" class="module-preview">
            <div class="module-root"><span class="tree-icon">M</span><strong>{{ content.moduleName }}</strong><small>module</small></div>
            <div class="module-branch"><span class="tree-line"></span><div><span class="tree-icon tree-icon-soft">↳</span><span>{{ content.moduleSubmodule }}</span></div></div>
            <div class="module-branch"><span class="tree-line tree-line-short"></span><div><span class="tree-icon tree-icon-accent">✳</span><span>{{ content.moduleFeature }}</span></div></div>
            <div class="module-foot"><span class="module-foot-dot"></span>{{ section.availability }}</div>
          </div>

          <div v-else-if="section.kind === 'view'" class="view-preview">
            <div class="preview-page-label">{{ content.previewTitle }}</div>
            <div class="account-card">
              <div class="account-avatar">{{ previewName.slice(0, 1) || 'A' }}</div>
              <label class="preview-field">
                <span>{{ content.previewNameLabel }}</span>
                <input v-model="previewName" maxlength="48" autocomplete="off" />
              </label>
              <div class="preview-field preview-field-static"><span>{{ content.previewEmailLabel }}</span><b>amina@example.com</b></div>
              <button class="preview-submit" type="button"><span aria-hidden="true">✓</span>{{ content.previewSubmit }}</button>
            </div>
            <p class="preview-footnote">{{ lang === 'fr' ? 'Modifiez le nom : l’aperçu suit votre saisie.' : 'Edit the name; the preview updates as you type.' }}</p>
          </div>

          <div v-else class="targets-preview">
            <p class="target-status">{{ content.targetStatus }}</p>
            <div class="target-switch" role="group" :aria-label="content.previewLabel">
              <button type="button" :aria-pressed="selectedTarget === 'web'" @click="selectedTarget = 'web'">{{ content.targetWebLabel }}</button>
              <button type="button" :aria-pressed="selectedTarget === 'workstation'" @click="selectedTarget = 'workstation'">{{ content.targetWorkstationLabel }}</button>
            </div>
            <div class="target-device" :class="`target-device-${selectedTarget}`">
              <div class="target-device-bar"><span></span><span></span><span></span><b>{{ selectedTarget === 'web' ? content.webTarget : content.workstationTarget }}</b></div>
              <div class="target-form">
                <div class="target-form-icon" aria-hidden="true">◎</div>
                <strong>{{ content.targetFormTitle }}</strong>
                <span>{{ content.targetFormHelp }}</span>
                <i></i><i></i>
                <small>{{ content.previewSubmit }} <b aria-hidden="true">→</b></small>
              </div>
            </div>
            <p class="target-note">{{ section.availability }}</p>
          </div>
        </div>
      </div>
    </section>

    <footer class="home-next">
      <p class="home-eyebrow">{{ lang === 'fr' ? 'À vous de jouer' : 'Your next step' }}</p>
      <h2>{{ content.nextTitle }}</h2>
      <p>{{ content.nextDescription }}</p>
      <div class="home-actions">
        <a class="home-button home-button-primary" :href="`${homePrefix}/get-started/`">{{ content.startLabel }}<span aria-hidden="true">→</span></a>
        <a class="home-button home-button-secondary" :href="`${homePrefix}/agents/`">{{ content.architectureLabel }}<span aria-hidden="true">↗</span></a>
      </div>
    </footer>
  </main>
</template>

<style scoped>
.feluqa-home{--home-accent:var(--vp-c-brand-1);--home-wash:color-mix(in srgb,var(--vp-c-brand-1) 7%,var(--vp-c-bg));color:var(--vp-c-text-1);font-family:var(--vp-font-family-base);width:100%;overflow:hidden}
.feluqa-home *{box-sizing:border-box}
.home-hero{max-width:1120px;margin:0 auto;padding:84px 28px 76px;text-align:center;display:flex;flex-direction:column;align-items:center}
.home-mark{width:64px;height:64px;display:grid;place-items:center;position:relative;border:1px solid color-mix(in srgb,var(--home-accent) 28%,var(--vp-c-divider));border-radius:20px;background:linear-gradient(145deg,color-mix(in srgb,var(--home-accent) 16%,var(--vp-c-bg)),var(--vp-c-bg));box-shadow:0 14px 40px color-mix(in srgb,var(--home-accent) 14%,transparent);color:var(--home-accent);font-size:32px;font-weight:750;letter-spacing:-.08em}
.home-mark i{position:absolute;width:8px;height:8px;right:9px;top:9px;border-radius:50%;background:var(--vp-c-brand-2);box-shadow:0 0 14px color-mix(in srgb,var(--vp-c-brand-2) 60%,transparent)}
.home-eyebrow,.tour-eyebrow{margin:0;color:var(--home-accent);font-size:12px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}
.home-hero>.home-eyebrow{margin-top:22px}
.home-hero h1{margin:12px 0 0;font-family:var(--vp-font-family-heading,var(--vp-font-family-base));font-size:clamp(48px,8vw,78px);line-height:1;letter-spacing:-.065em;font-weight:700}
.home-tagline{max-width:790px;margin:24px 0 0;font-family:var(--vp-font-family-heading,var(--vp-font-family-base));font-size:clamp(26px,4vw,42px);line-height:1.16;letter-spacing:-.045em;font-weight:600}
.home-intro{max-width:690px;margin:18px 0 0;color:var(--vp-c-text-2);font-size:17px;line-height:1.7}
.home-actions{display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:28px}
.home-button{min-height:46px;padding:0 18px;display:inline-flex;align-items:center;justify-content:center;gap:12px;border:1px solid var(--vp-c-divider);border-radius:12px;text-decoration:none!important;font-weight:650;font-size:14px;transition:background-color .18s,border-color .18s,box-shadow .18s}
.home-button span{font-size:17px;transition:transform .18s}
.home-button:hover span{transform:translate(2px,-1px)}
.home-button-primary{background:var(--home-accent);color:var(--vp-c-white)!important;border-color:var(--home-accent);box-shadow:0 5px 16px color-mix(in srgb,var(--home-accent) 20%,transparent)}
.home-button-primary:hover{background:var(--vp-c-brand-2);border-color:var(--vp-c-brand-2)}
.home-button-secondary{background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)!important}
.home-button-secondary:hover{background:var(--vp-c-bg-mute);border-color:color-mix(in srgb,var(--home-accent) 35%,var(--vp-c-divider))}
.home-status{max-width:800px;margin:28px 0 0;padding:12px 16px;display:flex;gap:10px;align-items:flex-start;border:1px solid color-mix(in srgb,var(--vp-c-divider) 80%,transparent);border-radius:12px;background:color-mix(in srgb,var(--vp-c-bg-soft) 75%,transparent);color:var(--vp-c-text-2);font-size:12px;line-height:1.6;text-align:left}
.status-dot{flex:0 0 7px;width:7px;height:7px;margin-top:5px;border-radius:50%;background:#d69a35;box-shadow:0 0 0 4px color-mix(in srgb,#d69a35 16%,transparent)}
.tour-section{position:relative;contain:content;padding:86px 24px 96px;border-top:1px solid color-mix(in srgb,var(--home-accent) 10%,var(--vp-c-divider))}
.tour-section-left{background:linear-gradient(115deg,color-mix(in srgb,var(--home-accent) 9%,var(--vp-c-bg)),var(--vp-c-bg) 66%)}
.tour-section-right{background:linear-gradient(245deg,color-mix(in srgb,var(--vp-c-brand-2) 8%,var(--vp-c-bg)),var(--vp-c-bg) 66%)}
.tour-copy{max-width:760px;margin:0 auto 40px;text-align:center}
.tour-eyebrow{display:flex;align-items:center;justify-content:center;gap:10px}
.tour-eyebrow span{width:25px;height:25px;display:grid;place-items:center;border-radius:8px;background:color-mix(in srgb,var(--home-accent) 12%,var(--vp-c-bg));font-size:11px;letter-spacing:0}
.tour-copy h2,.home-next h2{margin:16px 0 0;font-family:var(--vp-font-family-heading,var(--vp-font-family-base));font-size:clamp(30px,4vw,48px);line-height:1.12;letter-spacing:-.045em;font-weight:650}
.tour-description{max-width:720px;margin:16px auto 0;color:var(--vp-c-text-2);font-size:17px;line-height:1.7}
.tour-availability{display:inline-flex;align-items:center;gap:8px;margin:18px 0 0;color:var(--vp-c-text-2);font-size:12px}
.tour-availability span{font-size:9px;color:#39a77b}
.tour-example{width:min(1120px,100%);margin:0 auto;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);align-items:center;gap:26px;direction:ltr}
.tour-section-right .tour-example{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.code-window,.preview-window{min-width:0;border:1px solid color-mix(in srgb,var(--vp-c-divider) 82%,transparent);border-radius:16px;overflow:hidden;background:var(--vp-c-bg);box-shadow:0 22px 70px rgb(0 0 0 / .08)}
.code-window{transform:translateY(12px);position:relative;z-index:1}
.window-bar,.preview-bar{height:45px;padding:0 14px;display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft);color:var(--vp-c-text-2);font-size:11px}
.window-dots{display:flex;gap:5px}.window-dots i{width:8px;height:8px;border-radius:50%;background:#ff6058}.window-dots i:nth-child(2){background:#febc2e}.window-dots i:nth-child(3){background:#28c840}
.window-filename{flex:1;overflow:hidden;text-overflow:ellipsis;text-align:center;white-space:nowrap;font-family:var(--vp-font-family-mono)}
.window-language{padding:4px 7px;border-radius:6px;background:var(--vp-c-bg-mute);font-family:var(--vp-font-family-mono);font-size:10px}
.code-window pre{min-height:200px;margin:0;padding:26px 24px;overflow:auto;background:color-mix(in srgb,var(--vp-c-bg) 95%,var(--home-accent));color:var(--vp-c-text-1);font:13px/1.8 var(--vp-font-family-mono);tab-size:4}
.code-window code{font:inherit;white-space:pre}
.preview-window{position:relative;z-index:2;min-height:245px;background:var(--vp-c-bg);box-shadow:0 26px 80px rgb(0 0 0 / .12)}
.preview-bar{font-size:10px}.preview-bar>span:first-child{display:flex;align-items:center;gap:8px}.preview-bar i{width:7px;height:7px;border-radius:50%;background:#45b985;box-shadow:0 0 0 3px rgb(69 185 133 / .16)}.preview-menu{font-weight:700;letter-spacing:2px}
.module-preview{padding:24px;min-height:198px}.module-root,.module-branch>div{display:flex;align-items:center;gap:10px}.module-root strong{font-family:var(--vp-font-family-mono);font-size:14px}.module-root small{margin-left:auto;color:var(--vp-c-text-3);font-size:10px}.tree-icon{width:25px;height:25px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--home-accent) 25%,var(--vp-c-divider));border-radius:7px;background:color-mix(in srgb,var(--home-accent) 10%,var(--vp-c-bg));color:var(--home-accent);font:700 11px var(--vp-font-family-mono)}.tree-icon-soft{color:var(--vp-c-text-2);background:var(--vp-c-bg-soft)}.tree-icon-accent{color:#a77a22;background:color-mix(in srgb,#e7bd5a 13%,var(--vp-c-bg));border-color:color-mix(in srgb,#e7bd5a 35%,var(--vp-c-divider))}.module-branch{height:40px;display:flex;align-items:center;gap:13px;padding-left:12px;border-left:1px solid var(--vp-c-divider);margin-left:12px;color:var(--vp-c-text-2);font:11px var(--vp-font-family-mono)}.module-branch>div{margin-left:4px}.tree-line{width:10px;height:1px;margin-left:-13px;background:var(--vp-c-divider)}.tree-line-short{width:24px}.module-foot{margin-top:15px;padding-top:12px;border-top:1px solid var(--vp-c-divider);display:flex;align-items:center;gap:7px;color:var(--vp-c-text-3);font-size:10px;line-height:1.5}.module-foot-dot{width:6px;height:6px;flex:0 0 6px;border-radius:50%;background:#41aa78}
.view-preview{min-height:198px;padding:22px}.preview-page-label{margin:0 0 14px;font-size:11px;font-weight:700;color:var(--vp-c-text-2)}.account-card{position:relative;padding:18px 18px 16px 62px;border:1px solid var(--vp-c-divider);border-radius:12px;background:var(--vp-c-bg-soft)}.account-avatar{position:absolute;left:17px;top:19px;width:32px;height:32px;display:grid;place-items:center;border-radius:50%;background:color-mix(in srgb,var(--home-accent) 16%,var(--vp-c-bg));color:var(--home-accent);font-weight:700}.preview-field{display:block;margin-bottom:10px}.preview-field span{display:block;margin-bottom:4px;color:var(--vp-c-text-3);font-size:9px;text-transform:uppercase;letter-spacing:.08em}.preview-field input,.preview-field-static b{width:100%;padding:6px 8px;border:1px solid var(--vp-c-divider);border-radius:7px;background:var(--vp-c-bg);color:var(--vp-c-text-1);font:12px var(--vp-font-family-base)}.preview-field-static b{display:block;font-weight:500}.preview-submit{min-height:30px;padding:0 10px;display:flex;align-items:center;gap:6px;border:0;border-radius:7px;background:var(--home-accent);color:var(--vp-c-white);font-size:10px;font-weight:650}.preview-submit span{font-size:12px}.preview-footnote{margin:10px 0 0;color:var(--vp-c-text-3);font-size:9px}
.targets-preview{padding:18px 20px 16px}.target-status{margin:0 0 12px;color:#a77a22;font-size:10px;font-weight:650}.target-switch{display:inline-flex;padding:3px;gap:2px;border:1px solid var(--vp-c-divider);border-radius:9px;background:var(--vp-c-bg-soft)}.target-switch button{padding:6px 10px;border:0;border-radius:6px;background:transparent;color:var(--vp-c-text-2);font-size:10px;cursor:pointer}.target-switch button[aria-pressed=true]{background:var(--vp-c-bg);color:var(--vp-c-text-1);box-shadow:0 1px 4px rgb(0 0 0 / .12)}.target-device{max-width:295px;margin:14px auto 0;border:1px solid var(--vp-c-divider);border-radius:11px;background:var(--vp-c-bg);overflow:hidden;box-shadow:0 8px 20px rgb(0 0 0 / .05);transition:max-width .25s ease}.target-device-workstation{max-width:100%;border-radius:7px}.target-device-bar{height:24px;padding:0 8px;display:flex;align-items:center;gap:4px;border-bottom:1px solid var(--vp-c-divider);background:var(--vp-c-bg-soft)}.target-device-bar>span{width:5px;height:5px;border-radius:50%;background:var(--vp-c-divider)}.target-device-bar b{flex:1;text-align:center;color:var(--vp-c-text-3);font-size:8px;font-weight:500}.target-form{padding:13px 16px 15px;display:grid;grid-template-columns:1fr 1fr;gap:6px}.target-form-icon{grid-column:1/-1;color:var(--home-accent);font-size:15px}.target-form strong,.target-form>span,.target-form>i,.target-form small{grid-column:1/-1}.target-form strong{font-size:11px}.target-form>span{min-height:25px;color:var(--vp-c-text-3);font-size:8px;line-height:1.4}.target-form>i{height:21px;border:1px solid var(--vp-c-divider);border-radius:5px;background:var(--vp-c-bg-soft)}.target-form small{justify-self:end;margin-top:2px;padding:5px 8px;border-radius:5px;background:var(--home-accent);color:var(--vp-c-white);font-size:8px}.target-form small b{margin-left:5px}.target-note{max-width:420px;margin:10px auto 0;color:var(--vp-c-text-3);font-size:9px;line-height:1.5;text-align:center}
.home-next{padding:90px 24px 100px;text-align:center;border-top:1px solid var(--vp-c-divider);background:linear-gradient(180deg,var(--vp-c-bg),color-mix(in srgb,var(--home-accent) 7%,var(--vp-c-bg)))}.home-next h2{max-width:700px;margin:15px auto 0}.home-next>p:not(.home-eyebrow){max-width:600px;margin:14px auto 0;color:var(--vp-c-text-2);line-height:1.7}
@media(max-width:760px){.home-hero{padding:64px 20px 58px}.home-intro{font-size:15px}.tour-section{padding:64px 18px 72px}.tour-copy{margin-bottom:28px}.tour-description{font-size:15px}.tour-example,.tour-section-right .tour-example{grid-template-columns:1fr;gap:14px}.code-window{transform:none}.code-window pre{min-height:0;padding:20px 17px;font-size:12px}.preview-window{min-height:0}.module-preview,.view-preview{min-height:0}.home-next{padding:70px 20px 78px}}
@media(prefers-reduced-motion:reduce){.feluqa-home *{scroll-behavior:auto!important;transition-duration:.01ms!important}}
</style>
