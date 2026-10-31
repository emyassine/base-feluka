---
title: "Cloud Tech Stack"
sidebarTitle: "Tech Stack"
icon: "@spmpst::icon::code-xml"
description: "Every runtime, database engine, and framework supported and managed on Numerimondes Cloud."
---

<div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
    
    <span class="nm-eyebrow">Cloud · Tech Stack</span>
    <h1 class="nm-headline">Any runtime. <span class="nm-headline-accent">Any database. Any framework.</span></h1>
    <p style="max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;">
        A subpage of <a href="/services/cloud">Numerimondes Cloud</a>. Our management layer is
        stack-agnostic by design. If it runs on Linux, we can configure, monitor, and maintain it.
    </p>
</div>


## Runtimes & languages


<div class="grid-container grid-cols-3" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item">
        <NmStat label="PHP" value="7.4–8.4" description="Multi-version, per-site" color="primary" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label="Node.js" value="LTS & current" description="PM2-managed processes" color="success" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label="Python" value="Django · FastAPI · Flask" description="Gunicorn / Uvicorn" color="warning" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label="Ruby" value="Rails · Rack" description="Puma / Unicorn" color="info" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label="Go" value="High-performance" description="APIs & services" color="primary" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label="Java" value="Spring · Tomcat" description="JVM tuning included" color="success" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label=".NET" value="ASP.NET Core" description="Linux-hosted" color="warning" icon="heroicon-o-code-bracket"  />
    </div>
    <div class="grid-item">
        <NmStat label="Rust" value="Systems-level" description="Apps & services" color="info" icon="heroicon-o-code-bracket"  />
    </div>
</div>


Also configured on request: Deno, Bun, Elixir/Phoenix, and legacy Perl applications.

## Database engines


<div class="grid-container grid-cols-2" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-circle-stack" color="primary">
            <template #heading>Relational</template>
            <template #description>
                MySQL (5.7 / 8.0 / 8.4), PostgreSQL (14–16), MariaDB (including Galera cluster support), and SQLite for embedded use.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-bolt" color="success">
            <template #heading>Cache, queues & search</template>
            <template #description>
                Redis for cache, sessions, and queues; RabbitMQ and Kafka for messaging and event streaming; Elasticsearch and ClickHouse for search and analytics.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-server-stack" color="warning">
            <template #heading>Document & wide-column</template>
            <template #description>
                MongoDB (Community & Enterprise) and Cassandra for distributed, wide-column workloads.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-archive-box" color="info">
            <template #heading>Object storage</template>
            <template #description>
                MinIO for S3-compatible object storage on infrastructure you control.
            </template>
        </NmCard>
    </div>
</div>


Additional engines are configured on request — ask us about anything not listed here.

## Frameworks & platforms

We configure the server environment for each framework's specific requirements rather than applying one generic configuration to everything:

- **PHP** — Laravel (queue workers, Horizon, Octane), Symfony (Messenger, Doctrine), WordPress (optimised Nginx + PHP-FPM), Magento (with Varnish + Redis), Drupal
- **JavaScript / TypeScript** — Next.js (SSR & SSG), Nuxt, React, Angular, Svelte/SvelteKit, Strapi, Ghost
- **Python** — Django (Gunicorn + Nginx + Celery), FastAPI (Uvicorn)
- **Ruby** — Rails (Puma with Nginx reverse proxy)
- **Java** — Spring Boot (JVM tuning + systemd service)
- **Sovereign foundation** — [Webkernel](/numerimondes/docs/oss/webkernel), our own PHP-based enterprise framework

## Using something not listed?

If it runs on Linux, we can very likely manage it. Contact us with your stack and we will confirm support before you commit.

---

## Next step


<div class="flex flex-wrap gap-3 mt-6 mb-4">
    
        Ask about your stack
    
    
        See pricing
    
    ← Numerimondes Cloud
</div>


:::md justified
**Numerimondes SARL AU** — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · [contact@numerimondes.com](mailto:contact@numerimondes.com) · +212 6 20 99 06 92
:::
