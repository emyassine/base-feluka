<!doctype html>
<html lang="en" class="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
  <x-feluqa-panel::assets />
</head>
<body class="fi fi-body fi-body-has-navigation fi-body-has-sidebar-collapsible-on-desktop">
  <x-feluqa-panel::shell :panel="panel" :active="active" :navigation="navigation" :brand_name="brand_name" :display_name="display_name" :email="email" :csrf_token="csrf_token">
    @yield("default")
  </x-feluqa-panel::shell>
</body>
</html>
