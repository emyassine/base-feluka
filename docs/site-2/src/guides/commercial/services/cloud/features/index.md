---
title: "Cloud Features"
sidebarTitle: "Features"
icon: "sliders-horizontal"
description: "Everything Numerimondes Cloud configures, monitors, and maintains — server hardening, database management, SSL/DNS/email, monitoring, and backups."
---

<div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
    
    <span class="nm-eyebrow">Cloud · Features</span>
    <h1 class="nm-headline">Everything managed. <span class="nm-headline-accent">Nothing left to a default install.</span></h1>
    <p style="max-width: 38rem; margin: 1rem auto 0; opacity: 0.85;">
        A subpage of <a href="/services/cloud">Numerimondes Cloud</a>. A full breakdown of what we configure,
        monitor, and maintain on every server under management, whatever tier you're on.
    </p>
</div>


## Server & OS hardening


<div class="grid-container grid-cols-2" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-lock-closed" color="primary">
            <template #heading>Access hardening</template>
            <template #description>
                Minimal OS install, SSH hardening (key-only authentication, custom port, rate limiting), and kernel parameter tuning for performance and security.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-shield-exclamation" color="danger">
            <template #heading>Threat protection</template>
            <template #description>
                Automated unattended security upgrades, fail2ban brute-force protection, malware scanning, and rootkit detection, with file integrity monitoring on top.
            </template>
        </NmCard>
    </div>
</div>


## Web server & runtime management

- Nginx and Apache configuration, tuned per application type
- Multi-version runtime support — run different language versions per site where needed
- Process management with automatic restart for long-running services
- Cron job management and scheduled task monitoring

Full list of supported runtimes and frameworks is on the [tech stack page →](/services/cloud/tech-stack)

## Database management


<div class="grid-container grid-cols-2" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-circle-stack" color="success">
            <template #heading>Configuration & tuning</template>
            <template #description>
                Configuration tuned to your dataset and query patterns, with slow-query logging and proactive performance analysis.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-arrow-path" color="info">
            <template #heading>Recovery & replication</template>
            <template #description>
                Point-in-time restore capability across supported engines, with replication setups available where the workload justifies it.
            </template>
        </NmCard>
    </div>
</div>


## SSL, DNS & email

- SSL/TLS certificate issuance and renewal for all managed domains, including wildcard support
- DNS zone management from the console — A, AAAA, CNAME, MX, TXT, SRV records
- Professional mailboxes with spam filtering and correctly configured DKIM/SPF/DMARC
- Email routing rules and alias management

## Monitoring & alerting

We monitor uptime, resource usage, and service health across managed servers, with alert thresholds set to your application's normal baseline rather than a generic default — so you hear about real anomalies, not noise. SSL expiry is tracked and renewal is automated. Specific performance figures (uptime, response time) are not published here as generic marketing claims; they are reported to each client against their own service agreement, since they depend on the tier, hardware, and workload involved.

## Backups & disaster recovery


<div class="grid-container grid-cols-2" style="margin: 1.25rem 0 2rem;">
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-archive-box" color="warning">
            <template #heading>Automated encrypted backups</template>
            <template #description>
                Regular automated backups of files, databases, and mail, encrypted at rest and stored on infrastructure isolated from the primary server.
            </template>
        </NmCard>
    </div>
    <div class="grid-item hover:elevate">
        <NmCard compact="true" icon="heroicon-o-arrow-uturn-left" color="primary">
            <template #heading>Restore on request</template>
            <template #description>
                Point-in-time restore to a prior backup snapshot, plus on-demand manual snapshots before major deployments.
            </template>
        </NmCard>
    </div>
</div>


Retention windows and off-site replication options are agreed per contract and depend on the tier — see [Pricing](/services/cloud/pricing).

## Management console

Servers under management are visible through a centralised console: server and domain overview, database access, DNS zone editing, mailbox management, and an audit log of configuration changes and deployments. Role-based access lets you scope what each team member can see or change.

---

## Next step


<div class="flex flex-wrap gap-3 mt-6 mb-4">
    
        Talk to us about your setup
    
    
        See pricing
    
    ← Numerimondes Cloud
</div>


:::md justified
**Numerimondes SARL AU** — RC 152844 · ICE 003396233000077 · Casablanca, Morocco · [contact@numerimondes.com](mailto:contact@numerimondes.com) · +212 6 20 99 06 92
:::
