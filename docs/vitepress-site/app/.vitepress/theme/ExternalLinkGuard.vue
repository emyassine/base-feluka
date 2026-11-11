<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'
import Button from '@themes/components/button/Button.vue'
import ReusableModal from '@themes/components/reusable-modal/ReusableModal.vue'

type TabId = 'overview' | 'preview' | 'security'
type Locale = 'en' | 'fr' | 'ar' | 'es' | 'zh' | 'hi' | 'ru'
type Preview = { title: string; description: string; siteName: string; image: string; canonical: string }

const { lang, frontmatter } = useData()
const open = ref(false)
const destination = ref('')
const safeDestination = ref('')
const destinationHost = ref('')
const linkLabel = ref('')
const opensNewTab = ref(false)
const activeTab = ref<TabId>('overview')
const preview = ref<Preview | null>(null)
const previewState = ref<'idle' | 'loading' | 'ready' | 'empty' | 'unavailable'>('idle')
const previewCache = new Map<string, Preview | null>()
let previewController: AbortController | undefined
let previewTimeout: number | undefined

const translations: Record<Locale, {
  title: string; brandLabel: string; message: string; tabs: Record<TabId, string>
  destination: string; linkText: string; notProvided: string; previewNotice: string
  previewAction: string; previewLoading: string; previewUnavailable: string; previewEmpty: string
  pageTitle: string; description: string; siteName: string; canonical: string
  protocol: string; https: string; http: string; port: string; browserTls: string; browserTlsHttp: string
  stay: string; continue: string; close: string
}> = {
  en: {
    title: 'You are leaving Numerimondes', brandLabel: 'External link check', message: 'This link opens a website operated separately by its publisher.',
    tabs: { overview: 'Link', preview: 'OG preview', security: 'Security' }, destination: 'Destination', linkText: 'Link label', notProvided: 'No link label provided',
    previewNotice: 'Loading a preview sends a no-cookie, no-referrer request from your browser. The destination may see your IP address; some sites block previews.', previewAction: 'Load preview', previewLoading: 'Reading page metadata…', previewUnavailable: 'Preview unavailable. The website may block reads from other origins.', previewEmpty: 'The website did not provide readable Open Graph metadata.',
    pageTitle: 'Title', description: 'Description', siteName: 'Site name', canonical: 'Canonical URL', protocol: 'Link protocol', https: 'HTTPS requested', http: 'Unencrypted HTTP', port: 'Port',
    browserTls: 'Your browser checks the certificate when you open the address. This page cannot read its issuer, expiry date, or detailed validation state.', browserTlsHttp: 'This link starts with HTTP, so the initial connection is unencrypted. Check the destination before continuing.', stay: 'Stay on this site', continue: 'Continue to website', close: 'Close dialog',
  },
  fr: {
    title: 'Vous quittez Numerimondes', brandLabel: 'Vérification du lien externe', message: 'Ce lien ouvre un site géré séparément par son éditeur.',
    tabs: { overview: 'Lien', preview: 'Aperçu OG', security: 'Sécurité' }, destination: 'Destination', linkText: 'Libellé du lien', notProvided: 'Aucun libellé fourni',
    previewNotice: 'Le chargement envoie une requête sans cookie ni référent depuis votre navigateur. Le site de destination peut voir votre adresse IP ; certains sites bloquent les aperçus.', previewAction: 'Charger l’aperçu', previewLoading: 'Lecture des métadonnées…', previewUnavailable: 'Aperçu indisponible. Le site peut bloquer les lectures depuis un autre domaine.', previewEmpty: 'Le site n’a pas fourni de métadonnées Open Graph lisibles.',
    pageTitle: 'Titre', description: 'Description', siteName: 'Nom du site', canonical: 'URL canonique', protocol: 'Protocole du lien', https: 'HTTPS demandé', http: 'HTTP non chiffré', port: 'Port',
    browserTls: 'Le navigateur vérifie le certificat lors de l’ouverture. Cette page ne peut pas lire son émetteur, sa date d’expiration ni son état détaillé.', browserTlsHttp: 'Ce lien commence en HTTP : la connexion initiale n’est pas chiffrée. Vérifiez la destination avant de continuer.', stay: 'Rester sur ce site', continue: 'Continuer vers le site', close: 'Fermer la fenêtre de dialogue',
  },
  ar: {
    title: 'أنت تغادر Numerimondes', brandLabel: 'فحص الرابط الخارجي', message: 'يفتح هذا الرابط موقعًا يديره ناشر مستقل.',
    tabs: { overview: 'الرابط', preview: 'معاينة OG', security: 'الأمان' }, destination: 'الوجهة', linkText: 'نص الرابط', notProvided: 'لا يوجد نص للرابط',
    previewNotice: 'يرسل تحميل المعاينة طلبًا بلا ملفات ارتباط أو مُحيل من متصفحك. قد يرى الموقع عنوان IP الخاص بك، وقد تمنع بعض المواقع المعاينات.', previewAction: 'تحميل المعاينة', previewLoading: 'جارٍ قراءة بيانات الصفحة…', previewUnavailable: 'المعاينة غير متاحة. قد يمنع الموقع القراءة من نطاق آخر.', previewEmpty: 'لم يوفّر الموقع بيانات Open Graph قابلة للقراءة.',
    pageTitle: 'العنوان', description: 'الوصف', siteName: 'اسم الموقع', canonical: 'الرابط الأساسي', protocol: 'بروتوكول الرابط', https: 'تم طلب HTTPS', http: 'HTTP غير مشفر', port: 'المنفذ',
    browserTls: 'يتحقق المتصفح من الشهادة عند فتح العنوان. لا تستطيع هذه الصفحة قراءة الجهة المصدرة أو تاريخ الانتهاء أو تفاصيل التحقق.', browserTlsHttp: 'يبدأ هذا الرابط باستخدام HTTP؛ الاتصال الأولي غير مشفر. تحقق من الوجهة قبل المتابعة.', stay: 'ابقَ في هذا الموقع', continue: 'المتابعة إلى الموقع', close: 'إغلاق مربع الحوار',
  },
  es: {
    title: 'Vas a salir de Numerimondes', brandLabel: 'Comprobación de enlace externo', message: 'Este enlace abre un sitio gestionado por separado por su editor.',
    tabs: { overview: 'Enlace', preview: 'Vista OG', security: 'Seguridad' }, destination: 'Destino', linkText: 'Texto del enlace', notProvided: 'No se proporcionó texto',
    previewNotice: 'La vista previa envía una solicitud sin cookies ni referencia desde tu navegador. El destino puede ver tu IP; algunos sitios bloquean estas vistas.', previewAction: 'Cargar vista previa', previewLoading: 'Leyendo metadatos…', previewUnavailable: 'Vista previa no disponible. El sitio puede bloquear lecturas de otros orígenes.', previewEmpty: 'El sitio no proporcionó metadatos Open Graph legibles.',
    pageTitle: 'Título', description: 'Descripción', siteName: 'Nombre del sitio', canonical: 'URL canónica', protocol: 'Protocolo del enlace', https: 'HTTPS solicitado', http: 'HTTP sin cifrar', port: 'Puerto',
    browserTls: 'El navegador comprueba el certificado al abrir la dirección. Esta página no puede leer su emisor, vencimiento ni estado detallado.', browserTlsHttp: 'Este enlace empieza con HTTP, por lo que la conexión inicial no está cifrada. Comprueba el destino antes de continuar.', stay: 'Permanecer aquí', continue: 'Continuar al sitio', close: 'Cerrar diálogo',
  },
  zh: {
    title: '你即将离开 Numerimondes', brandLabel: '外部链接检查', message: '此链接将打开由其他发布者运营的网站。',
    tabs: { overview: '链接', preview: 'OG 预览', security: '安全' }, destination: '目标网站', linkText: '链接文字', notProvided: '未提供链接文字',
    previewNotice: '加载预览会从浏览器发送不带 Cookie 和来源页信息的请求。目标网站可能看到你的 IP；有些网站会阻止预览。', previewAction: '加载预览', previewLoading: '正在读取页面元数据…', previewUnavailable: '无法预览。目标网站可能禁止跨域读取。', previewEmpty: '目标网站未提供可读取的 Open Graph 元数据。',
    pageTitle: '标题', description: '说明', siteName: '网站名称', canonical: '规范网址', protocol: '链接协议', https: '请求使用 HTTPS', http: '未加密的 HTTP', port: '端口',
    browserTls: '打开网址时由浏览器验证证书。此页面无法读取证书颁发者、到期时间或详细验证状态。', browserTlsHttp: '此链接以 HTTP 开始，初始连接未加密。继续前请检查目标网站。', stay: '留在此网站', continue: '继续访问', close: '关闭对话框',
  },
  hi: {
    title: 'आप Numerimondes से बाहर जा रहे हैं', brandLabel: 'बाहरी लिंक जाँच', message: 'यह लिंक किसी अन्य प्रकाशक द्वारा संचालित साइट खोलेगा।',
    tabs: { overview: 'लिंक', preview: 'OG पूर्वावलोकन', security: 'सुरक्षा' }, destination: 'गंतव्य', linkText: 'लिंक का पाठ', notProvided: 'लिंक का पाठ उपलब्ध नहीं',
    previewNotice: 'पूर्वावलोकन के लिए ब्राउज़र बिना कुकी और रेफ़रर के अनुरोध भेजता है। गंतव्य आपका IP देख सकता है; कुछ साइटें पूर्वावलोकन रोकती हैं।', previewAction: 'पूर्वावलोकन लोड करें', previewLoading: 'पृष्ठ मेटाडेटा पढ़ रहा है…', previewUnavailable: 'पूर्वावलोकन उपलब्ध नहीं। साइट दूसरे स्रोत से पढ़ने को रोक सकती है।', previewEmpty: 'साइट ने पढ़ने योग्य Open Graph मेटाडेटा नहीं दिया।',
    pageTitle: 'शीर्षक', description: 'विवरण', siteName: 'साइट का नाम', canonical: 'कैनोनिकल URL', protocol: 'लिंक प्रोटोकॉल', https: 'HTTPS अनुरोधित', http: 'अनएन्क्रिप्टेड HTTP', port: 'पोर्ट',
    browserTls: 'पता खोलते समय ब्राउज़र प्रमाणपत्र जाँचता है। यह पृष्ठ प्रमाणपत्र जारीकर्ता, समाप्ति तिथि या विस्तृत स्थिति नहीं पढ़ सकता।', browserTlsHttp: 'यह लिंक HTTP से शुरू होता है, इसलिए शुरुआती कनेक्शन एन्क्रिप्टेड नहीं है। आगे बढ़ने से पहले गंतव्य जाँचें।', stay: 'इसी साइट पर रहें', continue: 'वेबसाइट पर जाएँ', close: 'संवाद बंद करें',
  },
  ru: {
    title: 'Вы покидаете Numerimondes', brandLabel: 'Проверка внешней ссылки', message: 'Эта ссылка открывает сайт, которым управляет другой издатель.',
    tabs: { overview: 'Ссылка', preview: 'Превью OG', security: 'Безопасность' }, destination: 'Адрес назначения', linkText: 'Текст ссылки', notProvided: 'Текст ссылки не указан',
    previewNotice: 'Для превью браузер отправляет запрос без cookie и адреса страницы-источника. Сайт назначения может увидеть ваш IP; некоторые сайты блокируют превью.', previewAction: 'Загрузить превью', previewLoading: 'Чтение метаданных…', previewUnavailable: 'Превью недоступно. Сайт может запрещать запросы с других доменов.', previewEmpty: 'Сайт не предоставил читаемые метаданные Open Graph.',
    pageTitle: 'Заголовок', description: 'Описание', siteName: 'Название сайта', canonical: 'Канонический URL', protocol: 'Протокол ссылки', https: 'Запрошен HTTPS', http: 'Незашифрованный HTTP', port: 'Порт',
    browserTls: 'При открытии адреса браузер проверяет сертификат. Эта страница не может прочитать издателя, срок действия или подробный статус проверки.', browserTlsHttp: 'Эта ссылка начинается с HTTP, поэтому начальное соединение не зашифровано. Проверьте адрес перед переходом.', stay: 'Остаться на сайте', continue: 'Перейти на сайт', close: 'Закрыть диалог',
  },
}

function pageLocale(): Locale {
  const requestedLocale = String(frontmatter.value.requestedLanguage || lang.value || 'en').toLowerCase().split('-')[0]
  return Object.hasOwn(translations, requestedLocale) ? requestedLocale as Locale : 'en'
}
const locale = ref<Locale>(pageLocale())
const t = computed(() => translations[locale.value])
const isRtl = computed(() => locale.value === 'ar')

const isHttps = computed(() => {
  try { return new URL(destination.value).protocol === 'https:' } catch { return false }
})
const port = computed(() => {
  try {
    const url = new URL(destination.value)
    return url.port || (url.protocol === 'https:' ? '443' : '80')
  } catch { return '' }
})

function onLinkActivation(event: MouseEvent) {
  if (event.defaultPrevented || event.altKey || (event.type === 'click' && event.button !== 0) || (event.type === 'auxclick' && event.button !== 1)) return
  if (!(event.target instanceof Element)) return

  const anchor = event.target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor || anchor.hasAttribute('download') || anchor.dataset.externalConfirm === 'false') return

  let url: URL
  try { url = new URL(anchor.href, window.location.href) } catch { return }
  if (!['http:', 'https:'].includes(url.protocol) || url.origin === window.location.origin) return

  event.preventDefault()
  destination.value = url.href
  const visibleUrl = new URL(url.href)
  visibleUrl.username = ''
  visibleUrl.password = ''
  safeDestination.value = visibleUrl.href
  destinationHost.value = url.host
  linkLabel.value = anchor.getAttribute('aria-label') || anchor.textContent?.trim() || anchor.getAttribute('title') || ''
  opensNewTab.value = anchor.target.toLowerCase() === '_blank' || event.type === 'auxclick' || event.metaKey || event.ctrlKey || event.shiftKey
  preview.value = previewCache.get(url.href) ?? null
  previewState.value = previewCache.has(url.href) ? (preview.value ? 'ready' : 'empty') : 'idle'
  activeTab.value = 'overview'
  open.value = true
}

const maxPreviewBytes = 160 * 1024

async function readLimitedHtml(response: Response, signal: AbortSignal): Promise<string> {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let output = ''
  let bytesRead = 0
  try {
    while (bytesRead < maxPreviewBytes) {
      if (signal.aborted) throw new DOMException('Preview timed out', 'AbortError')
      const part = await reader.read()
      if (part.done) break
      const remaining = maxPreviewBytes - bytesRead
      const chunk = part.value.subarray(0, remaining)
      bytesRead += chunk.byteLength
      output += decoder.decode(chunk, { stream: true })
      if (chunk.byteLength < part.value.byteLength) {
        await reader.cancel()
        break
      }
    }
    return output + decoder.decode()
  } finally {
    reader.releaseLock()
  }
}

function meta(documentNode: Document, selector: string): string {
  return documentNode.querySelector<HTMLMetaElement>(selector)?.content?.trim() ?? ''
}

function isLocalDestination(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')
  if (host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.test')) return true
  if (host === '::' || host === '::1' || host.startsWith('fc') || host.startsWith('fd') || host.startsWith('fe80:')) return true
  const octets = host.split('.').map(Number)
  if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false
  const [first, second] = octets
  return first === 0 || first === 10 || first === 127 || first >= 224
    || (first === 169 && second === 254)
    || (first === 172 && second >= 16 && second <= 31)
    || (first === 192 && second === 168)
    || (first === 100 && second >= 64 && second <= 127)
    || (first === 198 && (second === 18 || second === 19))
}

async function loadPreview() {
  if (!destination.value || previewState.value === 'loading') return
  if (previewCache.has(destination.value)) {
    preview.value = previewCache.get(destination.value) ?? null
    previewState.value = preview.value ? 'ready' : 'empty'
    return
  }

  previewController?.abort()
  previewController = new AbortController()
  const controller = previewController
  if (isLocalDestination(new URL(destination.value).hostname)) {
    previewState.value = 'unavailable'
    return
  }
  previewState.value = 'loading'
  previewTimeout = window.setTimeout(() => controller.abort(), 2500)

  try {
    const previewUrl = new URL(destination.value)
    previewUrl.username = ''
    previewUrl.password = ''
    previewUrl.hash = ''
    const response = await fetch(previewUrl.href, {
      method: 'GET',
      mode: 'cors',
      redirect: 'error',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
      headers: { Accept: 'text/html' },
    })
    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok || !contentType.toLowerCase().includes('text/html')) throw new Error('No readable HTML response')

    const html = await readLimitedHtml(response, controller.signal)
    const page = new DOMParser().parseFromString(html, 'text/html')
    const baseUrl = response.url || destination.value
    const rawImage = meta(page, 'meta[property="og:image"]') || meta(page, 'meta[name="twitter:image"]')
    let image = ''
    try {
      const imageUrl = new URL(rawImage, baseUrl)
      if (['http:', 'https:'].includes(imageUrl.protocol)) image = imageUrl.href
    } catch { image = '' }
    const canonicalLink = page.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href || ''
    const result: Preview = {
      title: meta(page, 'meta[property="og:title"]') || meta(page, 'meta[name="twitter:title"]') || page.querySelector('title')?.textContent?.trim() || '',
      description: meta(page, 'meta[property="og:description"]') || meta(page, 'meta[name="twitter:description"]') || meta(page, 'meta[name="description"]'),
      siteName: meta(page, 'meta[property="og:site_name"]'),
      image,
      canonical: (() => {
        const ogUrl = meta(page, 'meta[property="og:url"]')
        try { return new URL(ogUrl || canonicalLink, baseUrl).href } catch { return '' }
      })(),
    }
    const hasMetadata = Boolean(result.title || result.description || result.siteName || result.image || result.canonical)
    preview.value = hasMetadata ? result : null
    previewCache.set(destination.value, preview.value)
    if (previewCache.size > 24) previewCache.delete(previewCache.keys().next().value as string)
    previewState.value = hasMetadata ? 'ready' : 'empty'
  } catch {
    previewState.value = 'unavailable'
  } finally {
    if (previewTimeout !== undefined) window.clearTimeout(previewTimeout)
    previewTimeout = undefined
    if (previewController === controller) previewController = undefined
  }
}

function setTab(id: TabId) {
  activeTab.value = id
}

function onTabKeydown(event: KeyboardEvent) {
  const ids: TabId[] = ['overview', 'preview', 'security']
  const index = ids.indexOf(activeTab.value)
  const next = event.key === 'ArrowRight' ? (index + 1) % ids.length
    : event.key === 'ArrowLeft' ? (index + ids.length - 1) % ids.length
      : event.key === 'Home' ? 0
        : event.key === 'End' ? ids.length - 1
          : -1
  if (next < 0) return
  event.preventDefault()
  const id = ids[next]
  setTab(id)
  document.getElementById(`external-link-tab-${id}`)?.focus()
}

function continueToDestination() {
  const url = destination.value
  if (!url) return
  open.value = false
  if (opensNewTab.value) window.open(url, '_blank', 'noopener,noreferrer')
  else window.location.assign(url)
}

onMounted(() => {
  const browserLocale = navigator.language.toLowerCase().split('-')[0]
  if (['ar', 'es', 'zh', 'hi', 'ru'].includes(browserLocale)) locale.value = browserLocale as Locale
  document.addEventListener('click', onLinkActivation, true)
  document.addEventListener('auxclick', onLinkActivation, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onLinkActivation, true)
  document.removeEventListener('auxclick', onLinkActivation, true)
  previewController?.abort()
  if (previewTimeout !== undefined) window.clearTimeout(previewTimeout)
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

    <div class="external-check__tabs" role="tablist" :aria-label="t.title" @keydown="onTabKeydown">
      <Button
        v-for="tab in (['overview', 'preview', 'security'] as TabId[])"
        :id="`external-link-tab-${tab}`"
        :key="tab"
        role="tab"
        type="button"
        size="sm"
        :color="activeTab === tab ? 'primary' : 'gray'"
        :outlined="activeTab !== tab"
        :aria-selected="activeTab === tab"
        :tabindex="activeTab === tab ? 0 : -1"
        aria-controls="external-link-panel"
        @click="setTab(tab)"
      >{{ t.tabs[tab] }}</Button>
    </div>

    <section v-if="activeTab === 'overview'" id="external-link-panel" class="external-check__panel" role="tabpanel" aria-labelledby="external-link-tab-overview">
      <dl class="external-check__details">
        <div><dt>{{ t.destination }}</dt><dd><strong>{{ destinationHost }}</strong><code>{{ safeDestination }}</code></dd></div>
        <div><dt>{{ t.linkText }}</dt><dd>{{ linkLabel || t.notProvided }}</dd></div>
      </dl>
    </section>

    <section v-else-if="activeTab === 'preview'" id="external-link-panel" class="external-check__panel" role="tabpanel" aria-labelledby="external-link-tab-preview">
      <p class="external-check__note">{{ t.previewNotice }}</p>
      <div v-if="previewState === 'idle'" class="external-check__empty">
        <Button type="button" color="gray" outlined size="sm" @click="loadPreview">{{ t.previewAction }}</Button>
      </div>
      <p v-else-if="previewState === 'loading'" role="status">{{ t.previewLoading }}</p>
      <p v-else-if="previewState === 'unavailable'" role="status">{{ t.previewUnavailable }}</p>
      <p v-else-if="previewState === 'empty'" role="status">{{ t.previewEmpty }}</p>
      <article v-else-if="preview" class="external-check__preview">
        <img v-if="preview.image" :src="preview.image" alt="" referrerpolicy="no-referrer" loading="lazy">
        <h3 v-if="preview.title">{{ preview.title }}</h3>
        <p v-if="preview.description">{{ preview.description }}</p>
        <dl>
          <div v-if="preview.siteName"><dt>{{ t.siteName }}</dt><dd>{{ preview.siteName }}</dd></div>
          <div v-if="preview.canonical"><dt>{{ t.canonical }}</dt><dd><code>{{ preview.canonical }}</code></dd></div>
        </dl>
      </article>
    </section>

    <section v-else id="external-link-panel" class="external-check__panel" role="tabpanel" aria-labelledby="external-link-tab-security">
      <dl class="external-check__details">
        <div><dt>{{ t.protocol }}</dt><dd><span :class="['external-check__badge', isHttps ? 'is-secure' : 'is-insecure']">{{ isHttps ? t.https : t.http }}</span></dd></div>
        <div><dt>{{ t.port }}</dt><dd>{{ port }}</dd></div>
      </dl>
      <p class="external-check__note">{{ isHttps ? t.browserTls : t.browserTlsHttp }}</p>
    </section>

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
.external-check__heading p { margin: .3rem 0 0; color: var(--vp-c-text-2); font-size: .82rem; line-height: 1.45; }
.external-check__tabs { display: flex; flex-wrap: wrap; gap: .4rem; margin: -.1rem 0 1rem; }
.external-check__panel { min-height: 8.5rem; }
.external-check__details { display: grid; gap: .65rem; margin: 0; }
.external-check__details > div, .external-check__preview dl > div { display: grid; gap: .2rem; }
.external-check__details dt, .external-check__preview dt { color: var(--vp-c-text-2); font-size: .72rem; font-weight: 700; letter-spacing: .05em; text-transform: uppercase; }
.external-check__details dd, .external-check__preview dd { margin: 0; }
.external-check__details code, .external-check__preview code { display: block; overflow-wrap: anywhere; margin-top: .2rem; color: var(--vp-c-text-2); font-size: .75rem; }
.external-check__note { margin: .75rem 0; color: var(--vp-c-text-2); font-size: .78rem; line-height: 1.5; }
.external-check__empty { display: flex; align-items: center; justify-content: flex-end; flex-wrap: wrap; gap: .75rem; padding: .85rem; border: 1px solid var(--vp-c-divider); border-radius: .75rem; background: var(--vp-c-bg-soft); }
.external-check__empty p { margin: 0; color: var(--vp-c-text-2); font-size: .82rem; }
.external-check__preview { overflow: hidden; border: 1px solid var(--vp-c-divider); border-radius: .8rem; background: var(--vp-c-bg-soft); }
.external-check__preview > img { display: block; width: 100%; max-height: 12rem; object-fit: cover; background: var(--vp-c-bg-alt); }
.external-check__preview h3, .external-check__preview > p, .external-check__preview dl { margin: .75rem; }
.external-check__preview h3 { font-size: 1rem; line-height: 1.4; }
.external-check__preview > p { color: var(--vp-c-text-2); font-size: .82rem; line-height: 1.5; }
.external-check__preview dl { display: grid; gap: .55rem; }
.external-check__badge { display: inline-flex; border-radius: 999px; padding: .2rem .55rem; font-size: .75rem; font-weight: 700; }
.external-check__badge.is-secure { background: color-mix(in srgb, #16815d 14%, var(--vp-c-bg)); color: #16815d; }
.external-check__badge.is-insecure { background: color-mix(in srgb, #c13b32 14%, var(--vp-c-bg)); color: #b42318; }
</style>
