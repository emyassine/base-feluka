<!doctype html>
<html lang="en" class="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ title }}</title>
  <x-feluqa-panel::assets />
</head>
<body class="fi fi-body fi-body-has-navigation fi-body-has-topbar fi-body-has-sidebar-collapsible-on-desktop fi-body-has-sidebar-fully-collapsible-on-desktop">
  <x-feluqa-panel::shell :panel="panel" :active="active" :navigation="navigation" :display_name="display_name" :email="email">
    @yield("default")
  </x-feluqa-panel::shell>
</body>
</html>
