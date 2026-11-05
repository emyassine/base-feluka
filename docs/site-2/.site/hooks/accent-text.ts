const accentTextSelector = '.teal-text, .green-text, .amber-text, .violet-text'

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  let visibilityObserver: IntersectionObserver | undefined

  const observeAccentText = (root: ParentNode) => {
    const targets: Element[] = []
    if (root instanceof Element && root.matches(accentTextSelector)) targets.push(root)
    targets.push(...root.querySelectorAll(accentTextSelector))

    targets.forEach((target) => {
      if (target.classList.contains('is-visible')) return

      if (!('IntersectionObserver' in window)) {
        target.classList.add('is-visible')
        return
      }

      visibilityObserver ??= new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          visibilityObserver?.unobserve(entry.target)
        })
      }, { threshold: 0.5 })

      visibilityObserver.observe(target)
    })
  }

  const startAccentTextObserver = () => {
    observeAccentText(document)

    const pageObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof Element) observeAccentText(node)
        })
      })
    })

    if (document.body) pageObserver.observe(document.body, { childList: true, subtree: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAccentTextObserver, { once: true })
  } else {
    startAccentTextObserver()
  }
}
