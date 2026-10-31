---
title: "Infrastructure"
sidebarTitle: "Infrastructure"
icon: "@spmpst::icon::server"
description: "Keep it running. Hosting, monitoring, migrations, and operator training for systems you already own."
---

<div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
    
    <span class="nm-eyebrow">Run-stage · Operations</span>
    <h1 class="nm-headline">The question this service answers: <span class="nm-headline-accent">"keep it running."</span></h1>
    <p style="max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;">
        Software already exists — yours or ours — and someone needs to keep it healthy: hosting, monitoring,
        migrations, and training your team to run it without calling us every time something changes.
    </p>
</div>


## Where this service starts and stops


<div class="grid-container grid-cols-2" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-check-circle" color="success">
            <template #heading>Infrastructure includes</template>
            <template #description>
                Managed operations, CI/CD pipelines, legacy migrations, and hands-on operator training — as a consulting engagement, on whatever infrastructure you already have.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-x-circle" color="danger">
            <template #heading>Infrastructure does not include</template>
            <template #description>
                Writing new application code (that's <a href="/services/development">Development</a>). Automating a specific business process with no-code/AI workflows (that's <a href="/services/automation">Automation</a>). The actual hosting product itself (that's <a href="/services/cloud">Numerimondes Cloud</a>).
            </template>
        </NmCard>
    </div>
</div>



<div class="my-8">
    <NmTriptych
        left="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
        center="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
        right="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80"
        height="180px"
     />
</div>


## What we operate


<div class="grid-container grid-cols-2" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-cog-6-tooth" color="primary">
            <template #heading>Maintenance & managed operations</template>
            <template #description>
                Keep production healthy without surrendering control. Monitoring, updates, and incident discipline on infrastructure you own.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-arrow-path-rounded-square" color="success">
            <template #heading>CI/CD & deployment pipelines</template>
            <template #description>
                Build, test, and release pipelines your team can operate — not a fragile setup only we understand.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-arrow-path" color="info">
            <template #heading>Legacy migration & upgrades</template>
            <template #description>
                Phased transition, minimal disruption. Exit stacked SaaS rents where ownership makes economic sense.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-academic-cap" color="warning">
            <template #heading>Operator training</template>
            <template #description>
                Your people run the stack. Hands-on sessions, runbooks, and escalation paths that survive staff turnover.
            </template>
        </NmCard>
    </div>
</div>


## Where you host

This service is about the work — the migration, the pipeline, the training — not about where things physically run. That question has three honest answers:


<div class="grid-container grid-cols-3" style="margin: 1.5rem 0 2rem;">
    <div class="grid-item">
        <NmStat
            label="Option A"
            value="Your hardware"
            description="On-prem, home server, or your existing VPS"
            color="primary"
            icon="heroicon-o-building-office"
         />
    </div>
    <div class="grid-item">
        <NmStat
            label="Option B"
            value="A third party"
            description="Any provider you already rent from"
            color="success"
            icon="heroicon-o-cloud"
         />
    </div>
    <div class="grid-item">
        <NmStat
            label="Option C"
            value="Numerimondes Cloud"
            description="Our own managed server product"
            color="warning"
            icon="heroicon-o-server"
         />
    </div>
</div>


If you want the hardware itself managed — hardening, monitoring, backups, 24/7 emergency response — that is exactly what [Numerimondes Cloud](/services/cloud) does, and it is sold as its own product with its own console and pricing, independent of a services engagement. An Infrastructure consulting mission and a Numerimondes Cloud subscription can be bought together or entirely separately.

## Pricing method

Infrastructure work is either project-based (a migration, a pipeline build-out) or a recurring managed-operations retainer. Same discipline as everywhere else:

| Formula | Scope | Typical basis |
|---|---|---|
| **Migration project** | One-time legacy system move or platform upgrade | Fixed price per milestone |
| **Pipeline build-out** | CI/CD setup for one or several services | Fixed price |
| **Advisory retainer** | Ongoing operational strategy, not day-to-day server management | Monthly retainer, order of magnitude given upfront |
| **Operator training** | Hands-on sessions for your internal team | Fixed price per session or programme |

Payment stays milestone-based: never fully upfront, never a single invoice at the end.

## How it connects


<div class="grid-container grid-cols-2" style="margin: 0.5rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-magnifying-glass" color="primary">
            <template #heading>From audit findings</template>
            <template #description>
                Level 1 and Level 2 audits surface lock-in and migration opportunities. Infrastructure work turns those findings into running systems.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-code-bracket" color="success">
            <template #heading>Beside development</template>
            <template #description>
                Custom apps from <a href="/services/development">Development</a> need environments, pipelines, and operators. We close that loop.
            </template>
        </NmCard>
    </div>
</div>


---

## Go deeper


<div class="grid-container grid-cols-1" style="margin: 1rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-shield-check" color="warning">
            <template #heading><a href="/services/infrastructure/self-hosting" style="text-decoration:none;">Why self-hosting, and when it doesn't make sense</a></template>
            <template #description>
                An honest look at the sovereignty argument — including the cases where renting is still the right call.
            </template>
        </NmCard>
    </div>
</div>


---

## Next step


<div class="flex flex-wrap gap-3 mt-6 mb-4">
    
        Request an infrastructure briefing
    
    
        Numerimondes Cloud
    
    
        Start with an audit
    
    ← Services
</div>


:::md justified
**Numerimondes SARL AU** — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · [contact@numerimondes.com](mailto:contact@numerimondes.com) · +212 6 20 99 06 92
:::
