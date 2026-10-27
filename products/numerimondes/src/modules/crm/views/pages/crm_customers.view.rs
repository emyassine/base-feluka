<!doctype html>
<html lang="en"><head><link rel="stylesheet" href="/assets/feluqa/theme.css"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>CRM · Numerimondes</title><link rel="stylesheet" href="/assets/site.css"></head>
<body><main class="layout"><header><p class="eyebrow">Numerimondes · CRM</p><h1>Customers</h1><p>Signed in as {{ display_name }} · {{ email }}</p><form method="post" action="/system/logout"><input type="hidden" name="csrf_token" value="{{ csrf_token }}"><button class="btn" type="submit">Sign out</button></form></header>
<section class="card"><h2>Customer records</h2>
{!! panel.table !!}
@foreach (customer in &panel.customers)
<article class="card"><h3>Record #{{ customer.id }}</h3>
{!! customer.edit_form !!}
@if (panel.can_delete)
<form method="post" action="/admin/customers/delete"><input type="hidden" name="csrf_token" value="{{ csrf_token }}"><input type="hidden" name="id" value="{{ customer.id }}"><button class="btn" type="submit">Delete customer</button></form>
@endif
</article>
@endforeach
</section>
<nav class="card" aria-label="Customer pages"><p>Page {{ panel.page }} of {{ panel.page_count }}</p>
@if (panel.page > 1)
<form method="get" action="/admin/customers"><input type="hidden" name="page" value="{{ panel.page - 1 }}"><button class="btn" type="submit">Previous page</button></form>
@endif
@if (panel.page < panel.page_count)
<form method="get" action="/admin/customers"><input type="hidden" name="page" value="{{ panel.page + 1 }}"><button class="btn" type="submit">Next page</button></form>
@endif
</nav>
@if (panel.can_create)
<section class="card"><h2>Add customer</h2>{!! panel.create_form !!}</section>
@endif
<p><a href="/admin">Business panel</a> · <a href="/system">Feluqa Core</a></p></main><script defer src="/assets/feluqa/panel.js"></script><script defer src="/assets/feluqa-live.js"></script></body></html>
