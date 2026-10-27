<x-feluqa-panel::document panel="business" active="/admin" title="Business - Numerimondes" :navigation="navigation"><div class="fi-panel-page-content">
				<header>
					<p class="eyebrow">Numerimondes · Business</p>
					<h1>Business workspace</h1>

					<p>Signed in as {{ display_name }} · {{ email }}</p>

					<form method="post" action="/system/logout">
						<input type="hidden" name="csrf_token" value="{{ csrf_token }}">
						<button class="btn" type="submit">Sign out</button>
					</form>
				</header>
				<section class="webkernel-welcome-grid c2">
					<article class="card">
						<h2>CRM</h2>
						<p>
							Customer create, read, update and delete operations are available with server-side permission and CSRF checks.
						</p>

						<p>
							<a href="/admin/customers">Manage customers</a>
						</p>
					</article>
					<article class="card">
						<h2>ERP modules</h2>
						<p>
							Additional business modules will appear here when enabled for this application.
						</p>
					</article>
				</section>
				<p>
					<a href="/system">
						Feluqa Core
					</a>
				</p>
			</div>
		</x-feluqa-panel::document>