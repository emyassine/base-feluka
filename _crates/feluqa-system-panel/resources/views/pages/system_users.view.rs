<!doctype html>
<html lang="en" class="fi">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Users · Feluqa Core</title></head>
<body class="fi fi-body fi-body-has-navigation fi-body-has-topbar"><x-feluqa-panel::assets /><x-feluqa-panel::shell panel="system" active="/system/users"><div class="fi-panel-page-content"><header><p class="eyebrow">Feluqa Core · Users</p><h1>Users</h1><p>Signed in as {{ display_name }} · {{ email }}</p><form method="post" action="/system/logout"><input type="hidden" name="csrf_token" value="{{ csrf_token }}"><button class="btn" type="submit">Sign out</button></form></header>
<section class="card"><h2>Accounts</h2>{!! user_table !!}<h3>Change account state</h3><form method="post" action="/system/users/active"><input type="hidden" name="csrf_token" value="{{ csrf_token }}"><label>User ID <input name="user_id" type="number" min="1" required></label><label>Active <select name="active"><option value="true">Yes</option><option value="false">No</option></select></label><button class="btn" type="submit">Save</button></form>{!! edit_forms !!}</section>
<section class="card"><h2>Create account</h2>{!! create_form !!}</section>
<p><a href="/system">System dashboard</a> · <a href="/system/roles">Roles</a></p></div></x-feluqa-panel::shell></body></html>
