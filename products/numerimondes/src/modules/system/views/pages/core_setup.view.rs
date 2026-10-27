<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Initial setup · Feluqa Core</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><main class="layout"><section class="card"><p class="eyebrow">Feluqa Core</p><h1>Initial administrator</h1><p>{{ notice }}</p><form method="post" action="/system/setup"><input type="hidden" name="csrf_token" value="{{ csrf_token }}"><label>Name <input name="display_name" autocomplete="name" required maxlength="160"></label><label>Email <input name="email" type="email" autocomplete="username" required maxlength="254"></label><label>Password <input name="password" type="password" autocomplete="new-password" required minlength="12" maxlength="1024"></label><button class="btn" type="submit">Create administrator</button></form><p><a href="/system/login">Sign in</a></p></section></main></body>
</html>
