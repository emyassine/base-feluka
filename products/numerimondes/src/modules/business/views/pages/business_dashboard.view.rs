<x-feluqa-panel::document panel="business" active="/admin" title="Business - Numerimondes" :navigation="navigation" :brand_name="brand_name" :csrf_token="csrf_token" :display_name="display_name" :email="email"><div class="fi-panel-page-content">
{!! widgets !!}
				<header>
					<p class="eyebrow">Numerimondes · Business</p>
					<h1>Business workspace</h1>



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


					</article>
					<article class="card">
						<h2>ERP modules</h2>
						<p>
							Additional business modules will appear here when enabled for this application.
						</p>
					</article>
				</section>

			</div>
		</x-feluqa-panel::document>
