@rs
let page_title = page.title;
@endrs
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Webkernel and Numerimondes: software, platforms and digital infrastructure.">
  <title>{{ page_title }} · Webkernel</title>
  <link rel="preload" href="/assets/fonts/geist-sans.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/fonts/geist-mono.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/assets/site.css">
</head>
<body>
@include("app::partials.header", page = page)
@yield("content")
@include("app::partials.footer")
  <script>
    const toggle = document.querySelector('[data-theme-toggle]');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.documentElement.dataset.theme = savedTheme;
    toggle?.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = nextTheme;
      toggle.setAttribute('aria-checked', String(nextTheme === 'dark'));
      localStorage.setItem('theme', nextTheme);
    });
  </script>
</body>
</html>
