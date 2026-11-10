export function setup() {
  if (typeof window === 'undefined') {
    return;
  }

  document.addEventListener(
    'click',
    e => {
      if (!e.target) {
        return;
      }
      const link = (e.target as Element).closest('a');

      if (link && link.hash) {
        const url = new URL(link.href);
        if (url.origin === window.location.origin && url.pathname === window.location.pathname) {
          e.preventDefault();
          const targetId = link.hash.substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });

            // Remove hash from URL after scrolling
            setTimeout(() => {
              history.replaceState(null, document.title, window.location.pathname + window.location.search);
            }, 1500);
          }
        }
      }
    },
    true
  );
}

// Auto-run on import.
setup();
