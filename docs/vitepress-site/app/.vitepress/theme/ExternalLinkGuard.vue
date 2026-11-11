<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData } from 'vitepress'
import Button from '@themes/components/button/Button.vue'
import ReusableModal from '@themes/components/reusable-modal/ReusableModal.vue'

type Locale = 'en' | 'fr' | 'ar' | 'es' | 'zh' | 'hi' | 'ru'
type Preview = { title: string; description: string; siteName: string; image: string; canonical: string }

const en = {
  title: 'You are leaving Numerimondes', brandLabel: 'External link check', message: 'This link opens a website operated separately by its publisher.',
  destination: 'Destination', linkText: 'Link label', notProvided: 'No link label provided', previewHeading: 'Page preview', previewAutoNotice: 'The preview is requested automatically without cookies or a referrer. The destination may see your IP address, even if you stay here.',
  previewLoading: 'Reading page metadata…', previewUnavailable: 'This website does not allow its preview data to be read here. The link and connection details are shown below.', previewEmpty: 'No Open Graph preview data is published for this page.', securityHeading: 'Connection details',
  siteName: 'Site name', canonical: 'Canonical URL', protocol: 'Link protocol', https: 'HTTPS requested', http: 'Unencrypted HTTP', port: 'Port',
  browserTls: 'Your browser checks the certificate when you open the address. This page cannot read its issuer, expiry date, or detailed validation state.', browserTlsHttp: 'This link starts with HTTP, so the initial connection is unencrypted. Check the destination before continuing.', stay: 'Stay on this site', continue: 'Continue to website', close: 'Close dialog',
}

const translations: Record<Locale, typeof en> = {
  en,
  fr: {
    title: 'Vous quittez Numerimondes', brandLabel: 'Vérification du lien externe', message: 'Ce lien ouvre un site géré séparément par son éditeur.',
    destination: 'Destination', linkText: 'Libellé du lien', notProvided: 'Aucun libellé fourni', previewHeading: 'Aperçu de la page', previewAutoNotice: 'L’aperçu est demandé automatiquement, sans cookie ni référent. Le site de destination peut voir votre adresse IP, même si vous restez ici.',
    previewLoading: 'Lecture des métadonnées…', previewUnavailable: 'Ce site n’autorise pas la lecture de son aperçu ici. Le lien et les informations de connexion restent affichés.', previewEmpty: 'Aucune donnée Open Graph publiée pour cette page.', securityHeading: 'Détails de connexion',
    siteName: 'Nom du site', canonical: 'URL canonique', protocol: 'Protocole du lien', https: 'HTTPS demandé', http: 'HTTP non chiffré', port: 'Port',
    browserTls: 'Le navigateur vérifie le certificat lors de l’ouverture. Cette page ne peut pas lire son émetteur, sa date d’expiration ni son état détaillé.', browserTlsHttp: 'Ce lien commence en HTTP : la connexion initiale n’est pas chiffrée. Vérifiez la destination avant de continuer.', stay: 'Rester sur ce site', continue: 'Continuer vers le site', close: 'Fermer la fenêtre de dialogue',
  },
  ar: {
    title: 'أنت تغادر Numerimondes', brandLabel: 'فحص الرابط الخارجي', message: 'يفتح هذا الرابط موقعًا يديره ناشر مستقل.',
    destination: 'الوجهة', linkText: 'نص الرابط', notProvided: 'لا يوجد نص للرابط', previewHeading: 'معاينة الصفحة', previewAutoNotice: 'يُطلب العرض تلقائيًا بلا ملفات ارتباط أو مُحيل. قد يرى الموقع عنوان IP الخاص بك حتى إن بقيت هنا.',
    previewLoading: 'جارٍ قراءة بيانات الصفحة…', previewUnavailable: 'لا يسمح هذا الموقع بقراءة بيانات المعاينة هنا. ما زالت معلومات الرابط والاتصال معروضة.', previewEmpty: 'لا توجد بيانات Open Graph منشورة لهذه الصفحة.', securityHeading: 'تفاصيل الاتصال',
    siteName: 'اسم الموقع', canonical: 'الرابط الأساسي', protocol: 'بروتوكول الرابط', https: 'تم طلب HTTPS', http: 'HTTP غير مشفر', port: 'المنفذ',
    browserTls: 'يتحقق المتصفح من الشهادة عند فتح العنوان. لا تستطيع هذه الصفحة قراءة الجهة المصدرة أو تاريخ الانتهاء أو تفاصيل التحقق.', browserTlsHttp: 'يبدأ هذا الرابط باستخدام HTTP؛ الاتصال الأولي غير مشفر. تحقق من الوجهة قبل المتابعة.', stay: 'ابقَ في هذا الموقع', continue: 'المتابعة إلى الموقع', close: 'إغلاق مربع الحوار',
  },
  es: {
    title: 'Vas a salir de Numerimondes', brandLabel: 'Comprobación de enlace externo', message: 'Este enlace abre un sitio gestionado por separado por su editor.',
    destination: 'Destino', linkText: 'Texto del enlace', notProvided: 'No se proporcionó texto', previewHeading: 'Vista previa de la página', previewAutoNotice: 'La vista previa se solicita automáticamente sin cookies ni referencia. El destino puede ver tu IP aunque permanezcas aquí.',
    previewLoading: 'Leyendo metadatos…', previewUnavailable: 'Este sitio no permite leer aquí sus datos de vista previa. El enlace y la conexión siguen visibles.', previewEmpty: 'Esta página no publica datos Open Graph.', securityHeading: 'Detalles de conexión',
    siteName: 'Nombre del sitio', canonical: 'URL canónica', protocol: 'Protocolo del enlace', https: 'HTTPS solicitado', http: 'HTTP sin cifrar', port: 'Puerto',
    browserTls: 'El navegador comprueba el certificado al abrir la dirección. Esta página no puede leer su emisor, vencimiento ni estado detallado.', browserTlsHttp: 'Este enlace empieza con HTTP, por lo que la conexión inicial no está cifrada. Comprueba el destino antes de continuar.', stay: 'Permanecer aquí', continue: 'Continuar al sitio', close: 'Cerrar diálogo',
  },
  zh: {
    title: '你即将离开 Numerimondes', brandLabel: '外部链接检查', message: '此链接将打开由其他发布者运营的网站。',
    destination: '目标网站', linkText: '链接文字', notProvided: '未提供链接文字', previewHeading: '网页预览', previewAutoNotice: '预览会自动请求，不发送 Cookie 或来源页信息。即使你留在此处，目标网站也可能看到你的 IP。',
    previewLoading: '正在读取页面元数据…', previewUnavailable: '此网站不允许在这里读取预览数据。链接和连接信息仍显示在下方。', previewEmpty: '此页面未发布 Open Graph 预览数据。', securityHeading: '连接信息',
    siteName: '网站名称', canonical: '规范网址', protocol: '链接协议', https: '请求使用 HTTPS', http: '未加密的 HTTP', port: '端口',
    browserTls: '打开网址时由浏览器验证证书。此页面无法读取证书颁发者、到期时间或详细验证状态。', browserTlsHttp: '此链接以 HTTP 开始，初始连接未加密。继续前请检查目标网站。', stay: '留在此网站', continue: '继续访问', close: '关闭对话框',
  },
  hi: {
    title: 'आप Numerimondes से बाहर जा रहे हैं', brandLabel: 'बाहरी लिंक जाँच', message: 'यह लिंक किसी अन्य प्रकाशक द्वारा संचालित साइट खोलेगा।',
    destination: 'गंतव्य', linkText: 'लिंक का पाठ', notProvided: 'लिंक का पाठ उपलब्ध नहीं', previewHeading: 'पृष्ठ पूर्वावलोकन', previewAutoNotice: 'पूर्वावलोकन बिना कुकी या रेफ़रर के अपने-आप अनुरोधित होता है। आपके रुकने पर भी गंतव्य आपका IP देख सकता है।',
    previewLoading: 'पृष्ठ मेटाडेटा पढ़ रहा है…', previewUnavailable: 'यह साइट यहाँ अपना पूर्वावलोकन पढ़ने की अनुमति नहीं देती। लिंक और कनेक्शन की जानकारी नीचे दिखती है।', previewEmpty: 'इस पृष्ठ के लिए Open Graph पूर्वावलोकन प्रकाशित नहीं है।', securityHeading: 'कनेक्शन विवरण',
    siteName: 'साइट का नाम', canonical: 'कैनोनिकल URL', protocol: 'लिंक प्रोटोकॉल', https: 'HTTPS अनुरोधित', http: 'अनएन्क्रिप्टेड HTTP', port: 'पोर्ट',
    browserTls: 'पता खोलते समय ब्राउज़र प्रमाणपत्र जाँचता है। यह पृष्ठ प्रमाणपत्र जारीकर्ता, समाप्ति तिथि या विस्तृत स्थिति नहीं पढ़ सकता।', browserTlsHttp: 'यह लिंक HTTP से शुरू होता है, इसलिए शुरुआती कनेक्शन एन्क्रिप्टेड नहीं है। आगे बढ़ने से पहले गंतव्य जाँचें।', stay: 'इसी साइट पर रहें', continue: 'वेबसाइट पर जाएँ', close: 'संवाद बंद करें',
  },
  ru: {
    title: 'Вы покидаете Numerimondes', brandLabel: 'Проверка внешней ссылки', message: 'Эта ссылка открывает сайт, которым управляет другой издатель.',
    destination: 'Адрес назначения', linkText: 'Текст ссылки', notProvided: 'Текст ссылки не указан', previewHeading: 'Превью страницы', previewAutoNotice: 'Превью запрашивается автоматически без cookie и адреса источника. Сайт может увидеть ваш IP, даже если вы останетесь здесь.',
    previewLoading: 'Чтение метаданных…', previewUnavailable: 'Этот сайт не разрешает читать данные превью здесь. Ссылка и сведения о соединении остаются видимыми.', previewEmpty: 'Для этой страницы не опубликованы данные Open Graph.', securityHeading: 'Сведения о соединении',
    siteName: 'Название сайта', canonical: 'Канонический URL', protocol: 'Протокол ссылки', https: 'Запрошен HTTPS', http: 'Незашифрованный HTTP', port: 'Порт',
    browserTls: 'При открытии адреса браузер проверяет сертификат. Эта страница не может прочитать издателя, срок действия или подробный статус проверки.', browserTlsHttp: 'Эта ссылка начинается с HTTP, поэтому начальное соединение не зашифровано. Проверьте адрес перед переходом.', stay: 'Остаться на сайте', continue: 'Перейти на сайт', close: 'Закрыть диалог',
  },
}

const MAX_PREVIEW_BYTES = 160 * 1024
const PREVIEW_TIMEOUT_MS = 2500

const { lang, frontmatter } = useData()
const requested = String(frontmatter.value.requestedLanguage || lang.value || 'en').toLowerCase().split('-')[0]
const locale = ref<Locale>(Object.hasOwn(translations, requested) ? requested as Locale : 'en')
const t = computed(() => translations[locale.value])
const isRtl = computed(() => locale.value === 'ar')

const open = ref(false)
const destination = ref('')
const linkLabel = ref('')
const opensNewTab = ref(false)
const preview = ref<Preview | null>(null)
const previewState = ref<'idle' | 'loading' | 'ready' | 'empty' | 'unavailable'>('idle')
const previewCache = new Map<string, Preview | null>()
let previewController: AbortController | undefined
let previewTimeout: number | undefined

const parsed = computed(() => { try { return new URL(destination.value) } catch { return null } })
const destinationHost = computed(() => parsed.value?.host ?? '')
const isHttps = computed(() => parsed.value?.protocol === 'https:')
const port = computed(() => parsed.value?.port || (isHttps.value ? '443' : '80'))
const safeDestination = computed(() => {
  const url = parsed.value && new URL(parsed.value.href)
  if (!url) return ''
  url.username = url.password = ''
  return url.href
})

function cancelPreview() {
  previewController?.abort()
  previewController = undefined
  window.clearTimeout(previewTimeout)
}

function showPreview(value: Preview | null) {
  preview.value = value
  previewState.value = value ? 'ready' : 'empty'
}

function onLinkActivation(event: MouseEvent) {
  const isMainClick = event.type === 'click' && event.button === 0
  const isMiddleClick = event.type === 'auxclick' && event.button === 1
  if (event.defaultPrevented || event.altKey || !(isMainClick || isMiddleClick) || !(event.target instanceof Element)) return

  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || anchor.hasAttribute('download') || anchor.dataset.externalConfirm === 'false') return

  let url: URL
  try { url = new URL(anchor.href, window.location.href) } catch { return }
  if (!['http:', 'https:'].includes(url.protocol) || url.origin === window.location.origin) return

  event.preventDefault()
  cancelPreview()
  destination.value = url.href
  linkLabel.value = anchor.getAttribute('aria-label') || anchor.textContent?.trim() || anchor.getAttribute('title') || ''
  opensNewTab.value = anchor.target.toLowerCase() === '_blank' || event.type === 'auxclick' || event.metaKey || event.ctrlKey || event.shiftKey
  preview.value = null
  previewState.value = 'idle'
  open.value = true
  void loadPreview()
}

async function readLimitedHtml(response: Response): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let html = ''
  let bytes = 0
  try {
    while (bytes < MAX_PREVIEW_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = value.subarray(0, MAX_PREVIEW_BYTES - bytes)
      bytes += chunk.byteLength
      html += decoder.decode(chunk, { stream: true })
    }
    return html + decoder.decode()
  } finally {
    void reader.cancel().catch(() => {})
  }
}

const meta = (doc: Document, ...selectors: string[]) => {
  for (const selector of selectors) {
    const value = doc.querySelector<HTMLMetaElement>(selector)?.content?.trim()
    if (value) return value
  }
  return ''
}

const resolveUrl = (value: string, base: string, httpOnly = false) => {
  try {
    const url = value ? new URL(value, base) : null
    return url && (!httpOnly || /^https?:$/.test(url.protocol)) ? url.href : ''
  } catch { return '' }
}

function isLocalDestination(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (/^localhost$|\.(localhost|local|internal|test)$/.test(host)) return true
  if (host.includes(':')) return host === '::' || host === '::1' || /^(fc|fd|fe80)/.test(host)

  const octets = host.split('.').map(Number)
  if (octets.length !== 4 || octets.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return false
  const [a, b] = octets
  return a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 198 && (b === 18 || b === 19))
}

async function loadPreview() {
  const key = destination.value
  const url = parsed.value && new URL(parsed.value.href)
  if (!url) return
  if (previewCache.has(key)) return showPreview(previewCache.get(key) ?? null)
  if (isLocalDestination(url.hostname)) {
    previewState.value = 'unavailable'
    return
  }

  const controller = (previewController = new AbortController())
  const isCurrent = () => previewController === controller
  previewState.value = 'loading'
  previewTimeout = window.setTimeout(() => controller.abort(), PREVIEW_TIMEOUT_MS)

  try {
    url.username = url.password = url.hash = ''
    const response = await fetch(url.href, {
      mode: 'cors',
      redirect: 'error',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
      headers: { Accept: 'text/html' },
    })
    if (!response.ok || !response.headers.get('content-type')?.toLowerCase().includes('text/html')) throw new Error('No readable HTML response')

    const page = new DOMParser().parseFromString(await readLimitedHtml(response), 'text/html')
    const base = response.url || key
    const result: Preview = {
      title: meta(page, 'meta[property="og:title"]', 'meta[name="twitter:title"]') || page.title.trim(),
      description: meta(page, 'meta[property="og:description"]', 'meta[name="twitter:description"]', 'meta[name="description"]'),
      siteName: meta(page, 'meta[property="og:site_name"]'),
      image: resolveUrl(meta(page, 'meta[property="og:image"]', 'meta[name="twitter:image"]'), base, true),
      canonical: resolveUrl(meta(page, 'meta[property="og:url"]') || page.querySelector('link[rel="canonical"]')?.getAttribute('href') || '', base),
    }
    const value = Object.values(result).some(Boolean) ? result : null
    previewCache.set(key, value)
    if (previewCache.size > 24) previewCache.delete(previewCache.keys().next().value as string)
    if (isCurrent()) showPreview(value)
  } catch {
    if (isCurrent()) previewState.value = 'unavailable'
  } finally {
    if (isCurrent()) cancelPreview()
  }
}

function continueToDestination() {
  if (!destination.value) return
  open.value = false
  if (opensNewTab.value) window.open(destination.value, '_blank', 'noopener,noreferrer')
  else window.location.assign(destination.value)
}

watch(open, (isOpen) => { if (!isOpen) cancelPreview() })

const clickEvents = ['click', 'auxclick'] as const
onMounted(() => {
  const browserLocale = navigator.language.toLowerCase().split('-')[0]
  if (['ar', 'es', 'zh', 'hi', 'ru'].includes(browserLocale)) locale.value = browserLocale as Locale
  clickEvents.forEach((name) => document.addEventListener(name, onLinkActivation, true))
})
onBeforeUnmount(() => {
  clickEvents.forEach((name) => document.removeEventListener(name, onLinkActivation, true))
  cancelPreview()
})
</script>

<template>
  <ReusableModal
    v-model="open"
    :title="t.title"
    :close-label="t.close"
    :language="locale"
    :direction="isRtl ? 'rtl' : 'ltr'"
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

    <div class="external-check__content">
      <section class="external-check__card external-check__destination">
        <h3>{{ t.destination }}</h3>
        <p><strong>{{ destinationHost }}</strong></p>
        <code>{{ safeDestination }}</code>
        <p class="external-check__link-label"><span>{{ t.linkText }}:</span> {{ linkLabel || t.notProvided }}</p>
      </section>

      <section class="external-check__card external-check__preview" aria-live="polite">
        <h3>{{ t.previewHeading }}</h3>
        <p class="external-check__note">{{ t.previewAutoNotice }}</p>
        <div v-if="previewState === 'loading'" class="external-check__loading" role="status">
          <span class="external-check__spinner" aria-hidden="true" />
          <span>{{ t.previewLoading }}</span>
        </div>
        <p v-else-if="previewState === 'unavailable'" class="external-check__muted">{{ t.previewUnavailable }}</p>
        <p v-else-if="previewState === 'empty'" class="external-check__muted">{{ t.previewEmpty }}</p>
        <article v-else-if="preview" class="external-check__preview-content">
          <img v-if="preview.image" :src="preview.image" alt="" referrerpolicy="no-referrer" loading="lazy">
          <h4 v-if="preview.title">{{ preview.title }}</h4>
          <p v-if="preview.description">{{ preview.description }}</p>
          <dl>
            <div v-if="preview.siteName"><dt>{{ t.siteName }}</dt><dd>{{ preview.siteName }}</dd></div>
            <div v-if="preview.canonical"><dt>{{ t.canonical }}</dt><dd><code>{{ preview.canonical }}</code></dd></div>
          </dl>
        </article>
      </section>

      <section class="external-check__card external-check__security">
        <h3>{{ t.securityHeading }}</h3>
        <dl class="external-check__security-details">
          <div>
            <dt>{{ t.protocol }}</dt>
            <dd><span :class="['external-check__badge', isHttps ? 'is-secure' : 'is-insecure']">{{ isHttps ? t.https : t.http }}</span></dd>
          </div>
          <div><dt>{{ t.port }}</dt><dd>{{ port }}</dd></div>
        </dl>
        <p class="external-check__note">{{ isHttps ? t.browserTls : t.browserTlsHttp }}</p>
      </section>
    </div>

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

.external-check__content { display: grid; gap: .7rem; }
.external-check__card { min-width: 0; padding: .85rem; border: 1px solid var(--vp-c-divider); border-radius: .8rem; background: var(--vp-c-bg-soft); }
.external-check__card h3 { margin: 0 0 .55rem; font-size: .84rem; font-weight: 750; }

/* Secondary text */
.external-check__heading p,
.external-check__note,
.external-check__muted,
.external-check__loading,
.external-check__link-label,
.external-check__destination > code,
.external-check__preview-content > p,
.external-check__preview-content code,
.external-check__preview-content dt,
.external-check__security-details dt { color: var(--vp-c-text-2); }

.external-check__destination > p { margin: 0 0 .2rem; font-size: .84rem; }
.external-check__destination > code { display: block; overflow-wrap: anywhere; font-size: .74rem; }
.external-check__link-label { padding-top: .55rem; font-size: .76rem !important; }
.external-check__link-label span { font-weight: 700; }
.external-check__note { margin: .4rem 0 .6rem; font-size: .72rem; line-height: 1.45; }
.external-check__muted { margin: 0; font-size: .78rem; line-height: 1.45; }
.external-check__loading { display: flex; align-items: center; gap: .55rem; font-size: .78rem; }
.external-check__spinner { width: .85rem; height: .85rem; flex: 0 0 auto; border: 2px solid var(--vp-c-divider); border-top-color: var(--vp-c-brand-1); border-radius: 50%; animation: external-check-spin .8s linear infinite; }
@keyframes external-check-spin { to { transform: rotate(360deg); } }

.external-check__preview-content { overflow: hidden; border-radius: .55rem; background: var(--vp-c-bg); }
.external-check__preview-content > img { display: block; width: 100%; max-height: 10rem; object-fit: cover; background: var(--vp-c-bg-alt); }
.external-check__preview-content h4,
.external-check__preview-content > p,
.external-check__preview-content dl { margin: .65rem; }
.external-check__preview-content h4 { font-size: .9rem; line-height: 1.35; }
.external-check__preview-content > p { font-size: .77rem; line-height: 1.45; }
.external-check__preview-content dl { display: grid; gap: .45rem; }
.external-check__preview-content code { display: block; overflow-wrap: anywhere; font-size: .72rem; }
.external-check__preview-content dl > div,
.external-check__security-details > div { display: grid; gap: .15rem; }
.external-check__preview-content dt,
.external-check__security-details dt { font-size: .67rem; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
.external-check__preview-content dd,
.external-check__security-details dd { margin: 0; }

.external-check__security-details { display: flex; flex-wrap: wrap; gap: .65rem 1rem; margin: 0; }
.external-check__badge { display: inline-flex; border-radius: 999px; padding: .2rem .55rem; font-size: .75rem; font-weight: 700; }
.external-check__badge.is-secure { background: color-mix(in srgb, #16815d 14%, var(--vp-c-bg)); color: #16815d; }
.external-check__badge.is-insecure { background: color-mix(in srgb, #c13b32 14%, var(--vp-c-bg)); color: #b42318; }

@media (prefers-reduced-motion: reduce) { .external-check__spinner { animation: none; } }
</style>
