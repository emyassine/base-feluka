<!doctype html>
<html lang="en" class="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
  <x-feluqa-panel::assets />
</head>
<body class="fi fi-body fi-panel-system">
  <div class="fi-simple-layout">
    <div class="fi-simple-main-ctn">
      <main id="fi-main-content" class="fi-simple-main fi-width-md" tabindex="-1">
        <div class="fi-simple-page"><div class="fi-simple-page-content">@yield("default")</div></div>
      </main>
    </div>
  </div>
</body>
</html>
