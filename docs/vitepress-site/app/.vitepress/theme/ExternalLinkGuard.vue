<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { useData } from 'vitepress'
import Button from '@themes/components/button/Button.vue'
import ReusableModal from '@themes/components/reusable-modal/ReusableModal.vue'

type Locale = 'en' | 'fr' | 'ar' | 'es' | 'zh' | 'hi' | 'ru'
type Preview = { title: string; description: string; siteName: string; image: string; canonical: string }

const en = {
  title: 'You are leaving Numerimondes', brandLabel: 'External link check', message: 'This link opens a website operated separately by its publisher.',
  linkText: 'Link label', siteName: 'Site name', canonical: 'Canonical URL', protocol: 'Link protocol', https: 'HTTPS requested', http: 'Unencrypted HTTP', port: 'Port',
  privacy: 'The preview is requested automatically without cookies or a referrer. The destination may see your IP address, even if you stay here.',
  browserTls: 'Your browser checks the certificate when you open the address. This page cannot read its issuer, expiry date, or detailed validation state.',
  browserTlsHttp: 'This link starts with HTTP, so the initial connection is unencrypted. Check the destination before continuing.',
  stay: 'Stay on this site', continue: 'Continue to website', close: 'Close dialog',
}

const translations: Record<Locale, typeof en> = {
  en,
  fr: {
    title: 'Vous quittez Numerimondes', brandLabel: 'Vérification du lien externe', message: 'Ce lien ouvre un site géré séparément par son éditeur.',
    linkText: 'Libellé du lien', siteName: 'Nom du site', canonical: 'URL canonique', protocol: 'Protocole du lien', https: 'HTTPS demandé', http: 'HTTP non chiffré', port: 'Port',
    privacy: 'L’aperçu est demandé automatiquement, sans cookie ni référent. Le site de destination peut voir votre adresse IP, même si vous restez ici.',
    browserTls: 'Le navigateur vérifie le certificat lors de l’ouverture. Cette page ne peut pas lire son émetteur, sa date d’expiration ni son état détaillé.',
    browserTlsHttp: 'Ce lien commence en HTTP : la connexion initiale n’est pas chiffrée. Vérifiez la destination avant de continuer.',
    stay: 'Rester sur ce site', continue: 'Continuer vers le site', close: 'Fermer la fenêtre de dialogue',
  },
  ar: {
    title: 'أنت تغادر Numerimondes', brandLabel: 'فحص الرابط الخارجي', message: 'يفتح هذا الرابط موقعًا يديره ناشر مستقل.',
    linkText: 'نص الرابط', siteName: 'اسم الموقع', canonical: 'الرابط الأساسي', protocol: 'بروتوكول الرابط', https: 'تم طلب HTTPS', http: 'HTTP غير مشفر', port: 'المنفذ',
    privacy: 'يُطلب العرض تلقائيًا بلا ملفات ارتباط أو مُحيل. قد يرى الموقع عنوان IP الخاص بك حتى إن بقيت هنا.',
    browserTls: 'يتحقق المتصفح من الشهادة عند فتح العنوان. لا تستطيع هذه الصفحة قراءة الجهة المصدرة أو تاريخ الانتهاء أو تفاصيل التحقق.',
    browserTlsHttp: 'يبدأ هذا الرابط باستخدام HTTP؛ الاتصال الأولي غير مشفر. تحقق من الوجهة قبل المتابعة.',
    stay: 'ابقَ في هذا الموقع', continue: 'المتابعة إلى الموقع', close: 'إغلاق مربع الحوار',
  },
  es: {
    title: 'Vas a salir de Numerimondes', brandLabel: 'Comprobación de enlace externo', message: 'Este enlace abre un sitio gestionado por separado por su editor.',
    linkText: 'Texto del enlace', siteName: 'Nombre del sitio', canonical: 'URL canónica', protocol: 'Protocolo del enlace', https: 'HTTPS solicitado', http: 'HTTP sin cifrar', port: 'Puerto',
    privacy: 'La vista previa se solicita automáticamente sin cookies ni referencia. El destino puede ver tu IP aunque permanezcas aquí.',
    browserTls: 'El navegador comprueba el certificado al abrir la dirección. Esta página no puede leer su emisor, vencimiento ni estado detallado.',
    browserTlsHttp: 'Este enlace empieza con HTTP, por lo que la conexión inicial no está cifrada. Comprueba el destino antes de continuar.',
    stay: 'Permanecer aquí', continue: 'Continuar al sitio', close: 'Cerrar diálogo',
  },
  zh: {
    title: '你即将离开 Numerimondes', brandLabel: '外部链接检查', message: '此链接将打开由其他发布者运营的网站。',
    linkText: '链接文字', siteName: '网站名称', canonical: '规范网址', protocol: '链接协议', https: '请求使用 HTTPS', http: '未加密的 HTTP', port: '端口',
    privacy: '预览会自动请求，不发送 Cookie 或来源页信息。即使你留在此处，目标网站也可能看到你的 IP。',
    browserTls: '打开网址时由浏览器验证证书。此页面无法读取证书颁发者、到期时间或详细验证状态。',
    browserTlsHttp: '此链接以 HTTP 开始，初始连接未加密。继续前请检查目标网站。',
    stay: '留在此网站', continue: '继续访问', close: '关闭对话框',
  },
  hi: {
    title: 'आप Numerimondes से बाहर जा रहे हैं', brandLabel: 'बाहरी लिंक जाँच', message: 'यह लिंक किसी अन्य प्रकाशक द्वारा संचालित साइट खोलेगा।',
    linkText: 'लिंक का पाठ', siteName: 'साइट का नाम', canonical: 'कैनोनिकल URL', protocol: 'लिंक प्रोटोकॉल', https: 'HTTPS अनुरोधित', http: 'अनएन्क्रिप्टेड HTTP', port: 'पोर्ट',
    privacy: 'पूर्वावलोकन बिना कुकी या रेफ़रर के अपने-आप अनुरोधित होता है। आपके रुकने पर भी गंतव्य आपका IP देख सकता है।',
    browserTls: 'पता खोलते समय ब्राउज़र प्रमाणपत्र जाँचता है। यह पृष्ठ प्रमाणपत्र जारीकर्ता, समाप्ति तिथि या विस्तृत स्थिति नहीं पढ़ सकता।',
    browserTlsHttp: 'यह लिंक HTTP से शुरू होता है, इसलिए शुरुआती कनेक्शन एन्क्रिप्टेड नहीं है। आगे बढ़ने से पहले गंतव्य जाँचें।',
    stay: 'इसी साइट पर रहें', continue: 'वेबसाइट पर जाएँ', close: 'संवाद बंद करें',
  },
  ru: {
    title: 'Вы покидаете Numerimondes', brandLabel: 'Проверка внешней ссылки', message: 'Эта ссылка открывает сайт, которым управляет другой издатель.',
    linkText: 'Текст ссылки', siteName: 'Название сайта', canonical: 'Канонический URL', protocol: 'Протокол ссылки', https: 'Запрошен HTTPS', http: 'Незашифрованный HTTP', port: 'Порт',
    privacy: 'Превью запрашивается автоматически без cookie и адреса источника. Сайт может увидеть ваш IP, даже если вы останетесь здесь.',
    browserTls: 'При открытии адреса браузер проверяет сертификат. Эта страница не может прочитать издателя, срок действия или подробный статус проверки.',
    browserTlsHttp: 'Эта ссылка начинается с HTTP, поэтому начальное соединение не зашифровано. Проверьте адрес перед переходом.',
    stay: 'Остаться на сайте', continue: 'Перейти на сайт', close: 'Закрыть диалог',
  },
}

const MAX_BYTES = 160 * 1024
const { lang, frontmatter } = useData()
const requested = String(frontmatter.value.requestedLanguage || lang.value || 'en').toLowerCase().split('-')[0]
const locale = ref<Locale>(Object.hasOwn(translations, requested) ? requested as Locale : 'en')
const t = computed(() => translations[locale.value])

const open = ref(false)
const target = shallowRef<URL | null>(null)
const linkLabel = ref('')
const opensNewTab = ref(false)
const preview = ref<Preview | null>(null)
const cache = new Map<string, Preview | null>()
let controller: AbortController | undefined
let timer: number | undefined

const isHttps = computed(() => target.value?.protocol === 'https:')
const shownUrl = computed(() => {
  if (!target.value) return ''
  const url = new URL(target.value.href)
  url.username = url.password = ''
  return url.href
})
const rows = computed(() => [
  [t.value.siteName, preview.value?.siteName],
  [t.value.canonical, preview.value?.canonical],
  [t.value.linkText, linkLabel.value],
  [t.value.port, target.value?.port || (isHttps.value ? '443' : '80')],
].filter(([, value]) => value))

const cancel = () => { controller?.abort(); controller = undefined; window.clearTimeout(timer) }

function onLinkActivation(event: MouseEvent) {
  const isMain = event.type === 'click' && event.button === 0
  const isMiddle = event.type === 'auxclick' && event.button === 1
  if (event.defaultPrevented || event.altKey || !(isMain || isMiddle) || !(event.target instanceof Element)) return

  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || anchor.hasAttribute('download') || anchor.dataset.externalConfirm === 'false') return

  let url: URL
  try { url = new URL(anchor.href, location.href) } catch { return }
  if (!['http:', 'https:'].includes(url.protocol) || url.origin === location.origin) return

  event.preventDefault()
  cancel()
  target.value = url
  preview.value = null
  linkLabel.value = anchor.getAttribute('aria-label') || anchor.textContent?.trim() || anchor.getAttribute('title') || ''
  opensNewTab.value = anchor.target.toLowerCase() === '_blank' || isMiddle || event.metaKey || event.ctrlKey || event.shiftKey
  open.value = true
  void loadPreview(url)
}

function isLocal(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (/^localhost$|\.(localhost|local|internal|test)$/.test(host)) return true
  if (host.includes(':')) return host === '::' || host === '::1' || /^(fc|fd|fe80)/.test(host)
  const o = host.split('.').map(Number)
  if (o.length !== 4 || o.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false
  const [a, b] = o
  return a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127) || (a === 198 && (b === 18 || b === 19))
}

async function readLimited(response: Response): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let html = ''
  let bytes = 0
  try {
    while (bytes < MAX_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = value.subarray(0, MAX_BYTES - bytes)
      bytes += chunk.byteLength
      html += decoder.decode(chunk, { stream: true })
    }
    return html + decoder.decode()
  } finally { void reader.cancel().catch(() => {}) }
}

const meta = (doc: Document, ...selectors: string[]) => {
  for (const selector of selectors) {
    const value = doc.querySelector<HTMLMetaElement>(selector)?.content?.trim()
    if (value) return value
  }
  return ''
}

const resolve = (value: string, base: string, httpOnly = false) => {
  try {
    const url = value ? new URL(value, base) : null
    return url && (!httpOnly || /^https?:$/.test(url.protocol)) ? url.href : ''
  } catch { return '' }
}

async function loadPreview(url: URL) {
  const key = url.href
  if (cache.has(key)) { preview.value = cache.get(key) ?? null; return }
  if (isLocal(url.hostname)) return

  const own = (controller = new AbortController())
  timer = window.setTimeout(() => own.abort(), 2500)
  try {
    const request = new URL(key)
    request.username = request.password = request.hash = ''
    const response = await fetch(request.href, {
      mode: 'cors', redirect: 'error', credentials: 'omit', referrerPolicy: 'no-referrer',
      signal: own.signal, headers: { Accept: 'text/html' },
    })
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('text/html')) return

    const page = new DOMParser().parseFromString(await readLimited(response), 'text/html')
    const base = response.url || key
    const result: Preview = {
      title: meta(page, 'meta[property="og:title"]', 'meta[name="twitter:title"]') || page.title.trim(),
      description: meta(page, 'meta[property="og:description"]', 'meta[name="twitter:description"]', 'meta[name="description"]'),
      siteName: meta(page, 'meta[property="og:site_name"]'),
      image: resolve(meta(page, 'meta[property="og:image"]', 'meta[name="twitter:image"]'), base, true),
      canonical: resolve(meta(page, 'meta[property="og:url"]') || page.querySelector('link[rel="canonical"]')?.getAttribute('href') || '', base),
    }
    const value = Object.values(result).some(Boolean) ? result : null
    cache.set(key, value)
    if (cache.size > 24) cache.delete(cache.keys().next().value as string)
    if (controller === own) preview.value = value
  } catch { /* preview is optional: show nothing */ } finally {
    if (controller === own) cancel()
  }
}

function continueToDestination() {
  if (!target.value) return
  open.value = false
  if (opensNewTab.value) window.open(target.value.href, '_blank', 'noopener,noreferrer')
  else location.assign(target.value.href)
}

watch(open, (isOpen) => { if (!isOpen) cancel() })

const events = ['click', 'auxclick'] as const
onMounted(() => {
  const browserLocale = navigator.language.toLowerCase().split('-')[0]
  if (['ar', 'es', 'zh', 'hi', 'ru'].includes(browserLocale)) locale.value = browserLocale as Locale
  events.forEach((name) => document.addEventListener(name, onLinkActivation, true))
})
onBeforeUnmount(() => {
  events.forEach((name) => document.removeEventListener(name, onLinkActivation, true))
  cancel()
})
</script>

<template>
  <ReusableModal
    v-model="open"
    :title="t.title"
    :close-label="t.close"
    :language="locale"
    :direction="locale === 'ar' ? 'rtl' : 'ltr'"
    fixed-header
    fixed-footer
  >
    <template #header>
      <div class="external-check__heading">
        <div class="external-check__brand" aria-label="Numerimondes">
          <img class="external-check__logo external-check__logo--light" src="/media/logo-mini-light-mode.png" alt="">
          <img class="external-check__logo external-check__logo--dark" src="/media/logo-mini-dark-mode.png" alt="">
          <span>{{ t.brandLabel }}</span>
        </div>
        <h2>{{ t.title }}</h2>
        <p>{{ t.message }}</p>
      </div>
    </template>

    <article class="external-check__card">
      <img v-if="preview?.image" :src="preview.image" alt="" referrerpolicy="no-referrer" loading="lazy">
      <div class="external-check__body">
        <h3>{{ target?.host }}</h3>
        <code>{{ shownUrl }}</code>
        <p v-if="preview?.title" class="external-check__title">{{ preview.title }}</p>
        <p v-if="preview?.description" class="external-check__muted">{{ preview.description }}</p>

        <dl>
          <div>
            <dt>{{ t.protocol }}</dt>
            <dd><span :class="['external-check__badge', isHttps ? 'is-secure' : 'is-insecure']">{{ isHttps ? t.https : t.http }}</span></dd>
          </div>
          <div v-for="[label, value] in rows" :key="label"><dt>{{ label }}</dt><dd>{{ value }}</dd></div>
        </dl>

        <p class="external-check__muted">{{ isHttps ? t.browserTls : t.browserTlsHttp }}</p>
        <p class="external-check__muted">{{ t.privacy }}</p>
      </div>
    </article>

    <template #footer>
      <Button type="button" color="gray" outlined size="sm" @click="open = false">{{ t.stay }}</Button>
      <Button type="button" color="primary" size="sm" @click="continueToDestination">{{ t.continue }}</Button>
    </template>
  </ReusableModal>
</template>

<style scoped>
.external-check__heading { min-width: 0; padding-inline-end: .5rem; }
.external-check__brand { display: flex; align-items: center; gap: .55rem; margin-bottom: .45rem; color: var(--vp-c-brand-1); font-size: .68rem; font-weight: 750; letter-spacing: .09em; text-transform: uppercase; }
.external-check__logo { width: 1.7rem; height: 1.7rem; object-fit: contain; }
.external-check__logo--dark { display: none; }
:global(html.dark) .external-check__logo--light { display: none; }
:global(html.dark) .external-check__logo--dark { display: inline-block; }
.external-check__heading h2 { margin: 0; font-size: 1.15rem; line-height: 1.35; }
.external-check__heading p { margin: .3rem 0 0; font-size: .82rem; line-height: 1.45; }

.external-check__card { overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: .8rem; background: var(--vp-c-bg-soft); }
.external-check__card > img { display: block; width: 100%; max-height: 10rem; object-fit: cover; background: var(--vp-c-bg-alt); }
.external-check__body { display: grid; gap: .5rem; min-width: 0; padding: .85rem; }
.external-check__body > * { margin: 0; }
.external-check__body h3 { font-size: .95rem; font-weight: 750; }
.external-check__body code { overflow-wrap: anywhere; font-size: .74rem; }
.external-check__title { font-size: .85rem; font-weight: 650; line-height: 1.35; }
.external-check__muted { font-size: .74rem; line-height: 1.45; }
.external-check__heading p, .external-check__muted, .external-check__body code, .external-check__body dt { color: var(--vp-c-text-2); }

.external-check__body dl { display: flex; flex-wrap: wrap; gap: .6rem 1.2rem; padding-block: .6rem; border-block: 1px solid var(--vp-c-divider); }
.external-check__body dl > div { display: grid; gap: .15rem; min-width: 0; font-size: .78rem; }
.external-check__body dt { font-size: .67rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.external-check__body dd { margin: 0; overflow-wrap: anywhere; }
.external-check__badge { display: inline-flex; border-radius: 999px; padding: .2rem .55rem; font-size: .75rem; font-weight: 700; }
.external-check__badge.is-secure { background: color-mix(in srgb, #16815d 14%, var(--vp-c-bg)); color: #16815d; }
.external-check__badge.is-insecure { background: color-mix(in srgb, #c13b32 14%, var(--vp-c-bg)); color: #b42318; }
</style>
