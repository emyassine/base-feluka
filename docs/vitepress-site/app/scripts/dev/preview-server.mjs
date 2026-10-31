import { serve } from 'vitepress'

const port = Number(process.env.PORT ?? 4173)
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Invalid PORT: ${process.env.PORT}`)
await serve({ root: process.env.DOCS_OUTPUT_DIR ?? process.cwd(), port })
