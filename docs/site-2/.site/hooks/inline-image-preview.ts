const inlineImageSelector = '.inline-image-preview'

const enhanceInlineImages = (root: ParentNode) => {
  const wrappers: Element[] = []
  if (root instanceof Element && root.matches(inlineImageSelector)) wrappers.push(root)
  wrappers.push(...root.querySelectorAll(inlineImageSelector))

  wrappers.forEach((wrapper) => {
    if (wrapper.hasAttribute('data-preview-ready')) return

    const image = wrapper.querySelector(':scope > img')
    if (!(image instanceof HTMLImageElement)) return

    wrapper.setAttribute('data-preview-ready', '')
    if (!wrapper.hasAttribute('tabindex')) wrapper.setAttribute('tabindex', '0')

    const caption = wrapper.getAttribute('data-preview-caption') || image.getAttribute('data-preview-caption') || ''
    if (caption && !wrapper.hasAttribute('aria-label')) {
      const alt = image.getAttribute('alt')?.trim()
      wrapper.setAttribute('aria-label', alt ? `${alt}. ${caption}` : caption)
    }

    const preview = document.createElement('span')
    preview.className = 'inline-image-preview__popover'
    preview.setAttribute('aria-hidden', 'true')

    const previewImage = document.createElement('img')
    previewImage.src = wrapper.getAttribute('data-preview-src') || image.currentSrc || image.src
    previewImage.alt = ''
    previewImage.loading = 'lazy'
    preview.append(previewImage)

    if (caption) {
      const captionElement = document.createElement('span')
      captionElement.className = 'inline-image-preview__caption'
      captionElement.textContent = caption
      preview.append(captionElement)
    }

    wrapper.append(preview)
  })
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const startInlineImagePreviews = () => {
    enhanceInlineImages(document)

    const pageObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) enhanceInlineImages(node)
        })
      })
    })

    if (document.body) pageObserver.observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startInlineImagePreviews, { once: true })
  } else {
    startInlineImagePreviews()
  }
}
