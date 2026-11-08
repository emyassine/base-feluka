<!--
  StudentOrientationGuide.vue

  Part 1 (<script>)        : the engine. Pure TypeScript, no Vue. Catalogs, search, lexicon, profile building, ranking.
  Part 2 (<script setup>)  : the component. State, pickers, catalog loading (file / URL / API / IndexedDB), UI glue.

  Extending the data (three ways, all optional):
    1. Props    <StudentOrientationGuide :occupation-sources="[{ id:'esco', kind:'occupation', url:'/data/esco-fr.json', persist:true }]" />
    2. Search   <StudentOrientationGuide search-endpoint="https://api.example.org/jobs?q={q}&lang={lang}" />
    3. Runtime  const o = ref(); o.value.addRecords('occupation', [...]); o.value.registerSource({...})
  Accepted record shapes: "Nurse" | { title | label | name | preferredLabel | {en,fr}, aliases, riasec:"SIA",
  pathways:[], skills:[], keywords:[], level:1-5 } | { occupations:[...], experiences:[...] }.
  Records with only a title are fine: the lexicon infers RIASEC, pathway and skills automatically.
-->
<script lang="ts">
/* ═══════════════════════════ ENGINE ═══════════════════════════ */
import { allowsOptionalStorage } from '@spmpst/browser-storage'

export type Language = 'en' | 'fr'
export type PathwayId = 'technology' | 'business' | 'health' | 'education' | 'creative' | 'community'
export type Kind = 'occupation' | 'experience'
export type Vec = Record<string, number>
export type LText = { en?: string; fr?: string; any?: string }
export type ExpKind = 'job' | 'internship' | 'volunteer' | 'project' | 'club' | 'competition' | 'training' | 'hobby'

export interface CatalogSource { id: string; kind: Kind; label?: string; url?: string; load?: () => Promise<unknown>; persist?: boolean; refresh?: boolean }
export interface NormRec { id: string; kind: Kind; title: LText; aliases: string[]; riasec: string; pathways: PathwayId[]; skills: string[]; keywords: string[]; level?: number; expKind?: ExpKind; source: string }
export interface Entry extends NormRec { vec: Vec; code: string; primary: PathwayId | ''; skillIds: string[]; tokens: string[]; hay: string; titles: string[]; tstems: string[]; wv: Vec; wn: number; stamp: number }
export interface Pick { id: string; stance: 1 | 0 | -1; months?: number }
export interface Ref { type: 'theme' | 'activity' | 'text' | 'occupation' | 'experience' | 'goal'; idx?: number; id?: string; field?: string; phrase?: string }
export interface Evidence { ref: Ref; vec: Vec; w: number }
export interface Inputs { stage: number; fields: { key: string; text: string; w: number }[]; themes: number[]; activities: number[]; goal: number; occPicks: Pick[]; expPicks: Pick[]; occ: Catalog; exp: Catalog }
export interface Profile { vec: Vec; neg: Vec; ev: Evidence[]; mass: number; stems: Set<string>; code: string[]; likedOcc: Entry[]; rejOcc: Entry[]; likedExp: Entry[]; rejExp: Entry[] }
export interface Reason { feature: string; ref: Ref }
export interface Rec { id: string; fit: number; reasons: Reason[]; gaps: string[]; conv: number; sources: number; similarTo?: string }
export interface ExpRec { id: string; builds: string[]; score: number }
export interface PathRec { id: PathwayId; score: number; occupations: Rec[]; experiences: ExpRec[] }
export interface Analysis { clarity: number; diffuse: boolean; mass: number; signals: string[]; paths: PathRec[]; wildcard?: Rec & { pathway: PathwayId } }
export interface StoredSource { id: string; kind: Kind; label: string; items: NormRec[]; savedAt: number }

export const PATHWAY_IDS: PathwayId[] = ['technology', 'business', 'health', 'education', 'creative', 'community']
export const KINDS: Kind[] = ['occupation', 'experience']
const EXP_KINDS: ExpKind[] = ['job', 'internship', 'volunteer', 'project', 'club', 'competition', 'training', 'hobby']

export const SKILLS: Record<string, [string, string]> = {
  analysis: ['Analysis', 'Analyse'], programming: ['Programming', 'Programmation'], communication: ['Communication', 'Communication'],
  empathy: ['Empathy', 'Empathie'], organization: ['Organization', 'Organisation'], creativity: ['Creativity', 'Créativité'],
  leadership: ['Leadership', 'Leadership'], handson: ['Hands-on making', 'Travail manuel'], research: ['Research', 'Recherche'],
  teaching: ['Teaching', 'Pédagogie'], sales: ['Sales', 'Vente'], writing: ['Writing', 'Rédaction'], design: ['Design', 'Design'],
  problemSolving: ['Problem solving', 'Résolution de problèmes'], teamwork: ['Teamwork', 'Travail d’équipe'],
  numeracy: ['Numeracy', 'Aisance avec les chiffres'], science: ['Science', 'Sciences'], languages: ['Languages', 'Langues'],
  care: ['Care', 'Soin'], negotiation: ['Negotiation', 'Négociation'],
}
export const RIASEC_LABEL: Record<string, [string, string]> = {
  R: ['Hands-on (Realistic)', 'Pratique (Réaliste)'], I: ['Analytical (Investigative)', 'Analytique (Investigateur)'],
  A: ['Creative (Artistic)', 'Créatif (Artistique)'], S: ['People-oriented (Social)', 'Relationnel (Social)'],
  E: ['Driven (Enterprising)', 'Entreprenant'], C: ['Methodical (Conventional)', 'Méthodique (Conventionnel)'],
}
const HEX: Record<string, number> = { R: 0, I: 1, A: 2, S: 3, E: 4, C: 5 }
const hexDist = (a: string, b: string) => { const d = Math.abs(HEX[a] - HEX[b]); return Math.min(d, 6 - d) }

/* ── text normalisation: accent folding, light iterative stemming, negation ── */
export const fold = (s: string) => s.toLowerCase().replace(/œ/g, 'oe').normalize('NFD').replace(/\p{M}/gu, '').replace(/[^a-z0-9]+/g, ' ').trim()
const toks = (s: string) => fold(s).split(' ').filter(Boolean)
const SUF = ['ations', 'ation', 'ements', 'ement', 'ings', 'ing', 'eurs', 'eur', 'ers', 'er', 'es', 'ed', 's', 'x', 'e']
function stem(t: string): string {
  for (let k = 0; k < 3; k++) {
    const s = SUF.find((x) => t.length - x.length >= 3 && t.endsWith(x))
    if (!s) break
    t = t.slice(0, -s.length)
  }
  return t
}
const NEG = new Set(['not', 'no', 'never', 'hate', 'hates', 'dislike', 'dislikes', 'don', 'without', 'avoid', 'pas', 'jamais', 'deteste', 'hais', 'sans', 'evite', 'aucun', 'aucune'])

/* ── sparse vectors. Keys: r:<RIASEC letter>, p:<pathway>, s:<skill>, k:<free keyword> ── */
const vAdd = (t: Vec, s: Vec, k = 1) => { for (const f in s) t[f] = (t[f] ?? 0) + s[f] * k; return t }
const dot = (a: Vec, b: Vec) => { let s = 0; for (const f in a) { const o = b[f]; if (o) s += a[f] * o } return s }
const norm = (a: Vec) => Math.sqrt(dot(a, a))
const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x))

function feats(spec: string, k = 1): Vec {
  const v: Vec = {}
  for (const tok of spec.split(' ')) {
    if (!tok) continue
    const [name, w] = tok.split('=')
    const key = name.length === 1 ? `r:${name}` : (PATHWAY_IDS as string[]).includes(name) ? `p:${name}` : `s:${name}`
    v[key] = (v[key] ?? 0) + (w === undefined ? 1 : parseFloat(w)) * k
  }
  return v
}

/* ── themes & activities live in the same feature space as everything else ── */
export const THEME_SPECS = ['technology I=.5 R=.5', 'business E=.8 C=.3', 'health S=.7 I=.4', 'education S=.5 I=.4 A=.2', 'creative A=.9 E=.2', 'community S=.6 R=.3 E=.2']
export const ACTIVITY_SPECS = ['R=1 handson technology=.4', 'I=.8 C=.3 analysis problemSolving numeracy', 'S=1 care empathy', 'A=1 creativity creative=.4', 'C=.7 E=.4 organization', 'S=.6 E=.3 teaching communication teamwork']
const GOAL_SPECS = ['', '', '', 'E=.7 business=.6', '']
const THEME_VECS = THEME_SPECS.map((s) => feats(s))
const ACTIVITY_VECS = ACTIVITY_SPECS.map((s) => feats(s))
const GOAL_VECS = GOAL_SPECS.map((s) => feats(s))
const PROTO: Record<string, Vec> = Object.fromEntries(PATHWAY_IDS.map((id, i) => [id, Object.fromEntries(Object.entries(THEME_VECS[i]).filter(([f]) => f[0] === 'r'))]))

/* ── concept lexicon (EN + FR). A hit pushes the concept's vector into the profile ── */
const LEX: [string, string][] = [
  ['code|coding|coder|programming|programmation|program|software|logiciel|app|apps|website|site web|web|developer|développeur|algorithm|algorithme|python|javascript|html|informatique|computer|ordinateur|computing|tech|technology|technologie|ai|ia|intelligence artificielle', 'I=.7 R=.3 technology programming problemSolving'],
  ['math|maths|mathematics|mathématiques|mathématique|statistics|statistiques|algebra|algèbre|geometry|géométrie|calculus|calcul|logic|logique|numbers|chiffres', 'I=.8 C=.3 numeracy analysis'],
  ['data|données|analytics|spreadsheet|excel|dashboard|tableau de bord|sql|statistician', 'I=.7 C=.5 analysis numeracy technology'],
  ['robot|robots|robotics|robotique|electronics|électronique|arduino|raspberry|engine|moteur|mechanic|mécanique|mechanical|engineering|engineer|ingénierie|ingénieur|build|building|construire|fabriquer|bricolage|repair|réparer|fix|fixing|tools|outils|diy|3d printing|impression 3d|drone|drones|electricity|électricité', 'R=.9 I=.3 technology handson'],
  ['science|sciences|physics|physique|chemistry|chimie|laboratory|laboratoire|lab|experiment|experiments|expérimentation|astronomy|astronomie|scientist|scientifique|svt', 'I=.9 science research'],
  ['biology|biologie|anatomy|anatomie|medicine|médecine|medical|médical|health|santé|disease|maladie|nursing|infirmier|doctor|médecin|hospital|hôpital|pharmacy|pharmacie|first aid|premiers secours|dentist|dentiste', 'I=.5 S=.7 health science care'],
  ['caregiver|soin|soins|soigner|helping|help|aider|aide|wellbeing|bien-être|wellness|therapy|thérapie|listening|listen|écouter|écoute|empathy|empathie|support|soutien|kindness|gentillesse|comfort|réconforter', 'S=1 care empathy'],
  ['teach|teaching|teacher|enseigner|enseignement|enseignant|professeur|tutor|tutoring|tutorat|explain|explaining|expliquer|explication|mentor|mentoring|coach|coaching|pedagogy|pédagogie', 'S=.8 A=.2 education teaching communication'],
  ['research|recherche|reading|read|lecture|lire|books|book|livres|livre|library|bibliothèque|curious|curieux|curiosity|curiosité|investigate|investigation|enquête|learn|apprendre', 'I=.6 research education'],
  ['history|histoire|culture|philosophy|philosophie|literature|littérature|geography|géographie|humanities|humanités|sociology|sociologie|anthropology|anthropologie', 'I=.4 A=.4 S=.2 education research writing'],
  ['writing|write|écriture|écrire|novel|roman|poem|poème|poetry|poésie|blog|journalism|journalisme|journalist|journaliste|storytelling|story|stories|récit|essay|essai|article|articles', 'A=.9 E=.2 creative writing communication'],
  ['drawing|dessin|dessiner|draw|art|arts|painting|peinture|illustration|design|designer|graphic|graphisme|creative|créatif|créative|créativité|creativity|photography|photographie|photo|photos|canva|figma|animation|calligraphy|calligraphie', 'A=1 creative design creativity'],
  ['music|musique|guitar|guitare|piano|singing|chant|chanter|instrument|dance|danse|theatre|théâtre|acting|actor|acteur|film|films|cinéma|cinema|video|vidéo|youtube|podcast|editing|montage|content|contenu|tiktok|instagram|streaming', 'A=.9 E=.2 creative creativity communication'],
  ['business|businesses|entreprise|entrepreneur|entrepreneurship|entrepreneuriat|startup|start-up|commerce|sell|selling|vendre|vente|sales|negotiate|negotiation|négocier|négociation|marketing|market|marché|customer|customers|client|clients|pitch|trading|trade|boutique|shop|dropshipping|freelance', 'E=1 business sales negotiation'],
  ['finance|money|argent|budget|accounting|comptabilité|economics|économie|bank|banque|invest|investir|investment|investissement|tax|fiscalité|stock|bourse|crypto', 'C=.7 E=.4 I=.2 business numeracy analysis'],
  ['organize|organizing|organiser|organisation|organization|planning|plan|planifier|planification|schedule|agenda|manage|management|gérer|gestion|coordinate|coordonner|event|events|événement|événements|logistics|logistique|admin|administration', 'C=.6 E=.5 organization business'],
  ['lead|leader|leading|leadership|captain|capitaine|president|président|delegate|délégué|motivate|motiver|team|équipe|teamwork|collaborate|collaborer|collaboration', 'E=.6 S=.3 leadership teamwork'],
  ['environment|environnement|nature|climate|climat|ecology|écologie|sustainable|durable|sustainability|renewable|renouvelable|energy|énergie|recycling|recyclage|garden|gardening|jardin|jardinage|agriculture|farm|farming|ferme|animals|animal|animaux|plants|plant|plantes|plante|forest|forêt|ocean|océan|wildlife', 'R=.5 I=.4 S=.3 community science handson'],
  ['community|communauté|volunteer|volunteering|bénévole|bénévolat|association|ong|ngo|charity|charité|social|society|société|solidarity|solidarité|justice|rights|droits|youth|jeunes|neighbourhood|neighborhood|quartier|refugees|réfugiés|humanitarian|humanitaire', 'S=.9 community empathy'],
  ['law|droit|legal|juridique|lawyer|avocat|debate|débat|politics|politique|public|diplomacy|diplomatie|government|gouvernement|court|tribunal', 'E=.6 C=.3 I=.3 community communication negotiation'],
  ['languages|langues|langue|language|english|anglais|french|français|arabic|arabe|spanish|espagnol|german|allemand|translation|traduction|translate|traduire|bilingual|bilingue|multilingual|polyglot', 'A=.2 S=.3 E=.2 languages communication'],
  ['communication|communicate|communiquer|speaking|parler|presentation|présentation|public speaking|prise de parole|social media|réseaux sociaux|talk|talking|discuter|conversation|storyteller', 'E=.4 A=.3 S=.3 creative communication'],
  ['sport|sports|football|soccer|basketball|fitness|gym|running|athletics|athlétisme|swimming|natation|handball|volleyball|tennis|martial arts|arts martiaux|yoga|hiking|randonnée|cycling|vélo', 'R=.6 S=.3 teamwork care'],
  ['games|game|gaming|jeux|jeu|jeux vidéo|video games|chess|échecs|puzzle|puzzles|énigmes|énigme|strategy|stratégie|riddle|escape game', 'I=.6 A=.2 technology problemSolving analysis'],
  ['cooking|cook|cuisine|cuisiner|baking|pâtisserie|chef|food|nourriture|restaurant|hospitality|hôtellerie|tourism|tourisme|hotel|hôtel|barista', 'R=.4 A=.3 E=.3 handson creativity'],
  ['detail|details|détail|détails|precision|précision|accuracy|rigueur|rigorous|rigoureux|careful|méthodique|methodical|documents|document|archives|filing|classement|checklist|paperwork|paperasse', 'C=1 organization analysis'],
  ['travel|travelling|voyage|voyager|cultures|international|étranger|abroad|exchange|échange|erasmus', 'E=.2 S=.3 A=.2 languages communication'],
  ['psychology|psychologie|behaviour|behavior|comportement|mind|esprit|mental|emotions|émotions|people|gens|relationships|relations|personality|personnalité', 'S=.7 I=.4 empathy research health'],
  ['solve|solving|résoudre|résolution|problem|problems|problème|problèmes|troubleshooting|dépannage|debug|debugging', 'I=.6 problemSolving analysis'],
  ['architecture|architect|architecte|construction|chantier|house|maison|blueprint|plans|urbanisme|city|ville|urban|urbain|interior|intérieur|decoration|décoration', 'R=.3 A=.5 I=.3 handson design community'],
  ['fashion|mode|couture|sewing|style|beauty|beauté|makeup|maquillage|hair|coiffure|textile|tailoring|stylisme', 'A=.8 E=.3 creative design creativity'],
]
const CONCEPTS: Vec[] = LEX.map(([, spec]) => feats(spec))
const LEX_INDEX = new Map<string, { c: number; stems: string[]; text: string }[]>()
LEX.forEach(([terms], c) => terms.split('|').forEach((t) => {
  const st = toks(t).map(stem)
  if (!st.length) return
  const arr = LEX_INDEX.get(st[0]) ?? []
  arr.push({ c, stems: st, text: t })
  LEX_INDEX.set(st[0], arr)
}))

interface LexHit { c: number; phrase: string; neg: boolean }
function matchConcepts(text: string): LexHit[] {
  const raw = toks(text)
  const st = raw.map(stem)
  const out = new Map<string, LexHit>()
  for (let i = 0; i < st.length; i++) {
    for (const cd of LEX_INDEX.get(st[i]) ?? []) {
      if (!cd.stems.every((s, j) => st[i + j] === s)) continue
      let neg = false
      for (let k = Math.max(0, i - 3); k < i; k++) if (NEG.has(raw[k])) neg = true
      const key = `${cd.c}|${neg}|${cd.text}`
      if (!out.has(key)) out.set(key, { c: cd.c, phrase: raw.slice(i, i + cd.stems.length).join(' '), neg })
    }
  }
  return [...out.values()]
}

/* ── record normalisation: accepts strings and most real-world JSON shapes ── */
const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '')
const listOf = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : str((x as Record<string, unknown>)?.label ?? (x as Record<string, unknown>)?.name))).filter(Boolean)
  return typeof v === 'string' ? v.split(/[;,|]/).map((s) => s.trim()).filter(Boolean) : []
}
export const titleOf = (e: { title: LText }, lang: Language) => e.title[lang] ?? e.title.en ?? e.title.fr ?? e.title.any ?? ''

export function normalizeRecord(raw: unknown, kind: Kind, source: string): NormRec | null {
  const o: Record<string, unknown> = typeof raw === 'string' ? { title: raw } : raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const t = o.title ?? o.label ?? o.name ?? o.preferredLabel ?? o.libelle ?? o.titre
  const title: LText = typeof t === 'string' ? { any: t.trim() } : t && typeof t === 'object' ? { en: str((t as LText).en) || undefined, fr: str((t as LText).fr) || undefined } : {}
  const fr = str(o.title_fr ?? o.titleFr ?? o.label_fr ?? o.libelle_fr ?? o.name_fr)
  const en = str(o.title_en ?? o.titleEn ?? o.label_en ?? o.name_en)
  if (fr) title.fr = fr
  if (en) title.en = en
  const main = title.en ?? title.fr ?? title.any
  if (!main) return null
  const rawId = str(o.id ?? o.code ?? o.uri ?? o.conceptUri ?? o.isco ?? o.rome)
  const level = Number(o.level ?? o.educationLevel)
  const ek = str(o.expKind ?? o.type) as ExpKind
  return {
    id: `${source}:${rawId || fold(main)}`, kind, title, source,
    aliases: [...listOf(o.aliases), ...listOf(o.altLabels), ...listOf(o.synonyms)],
    riasec: str(o.riasec ?? o.holland).toUpperCase().replace(/[^RIASEC]/g, '').slice(0, 3),
    pathways: listOf(o.pathways ?? o.pathway).filter((p): p is PathwayId => (PATHWAY_IDS as string[]).includes(p)),
    skills: listOf(o.skills), keywords: listOf(o.keywords ?? o.tags),
    level: level >= 1 && level <= 5 ? level : undefined,
    expKind: kind === 'experience' ? (EXP_KINDS.includes(ek) ? ek : 'project') : undefined,
  }
}

function buildEntry(r: NormRec): Entry {
  const vec: Vec = {}
  ;[...r.riasec].forEach((ch, i) => { vec[`r:${ch}`] = [1, 0.66, 0.33][i] })
  r.pathways.forEach((p) => { vec[`p:${p}`] = 1 })
  r.skills.forEach((s) => { if (SKILLS[s]) vec[`s:${s}`] = 1; else vec[`k:${fold(s)}`] = 0.6 })
  const explicit = Object.keys(vec).length > 0
  const names = [r.title.en, r.title.fr, r.title.any, ...r.aliases].filter(Boolean) as string[]
  // Auto-enrichment: a bare title like "Hydrogeologist" still gets a RIASEC code, pathway and skills.
  const seen = new Set<number>()
  for (const h of matchConcepts([...names, ...r.keywords].join(' . '))) if (!h.neg && !seen.has(h.c)) { seen.add(h.c); vAdd(vec, CONCEPTS[h.c], explicit ? 0.35 : 0.9) }
  const pv = PATHWAY_IDS.map((id) => vec[`p:${id}`] ?? 0)
  if (Math.max(...pv) < 0.5) {
    const rv: Vec = Object.fromEntries(Object.entries(vec).filter(([f]) => f[0] === 'r'))
    const rn = norm(rv)
    if (rn) for (const id of PATHWAY_IDS) { const c = dot(rv, PROTO[id]) / (rn * norm(PROTO[id])); if (c > 0.3) vec[`p:${id}`] = (vec[`p:${id}`] ?? 0) + 0.7 * c }
  }
  const code = Object.entries(vec).filter(([f]) => f[0] === 'r').sort((a, b) => b[1] - a[1])
  const top = code[0]?.[1] ?? 0
  const primary = (PATHWAY_IDS.map((id) => [id, vec[`p:${id}`] ?? 0] as const).sort((a, b) => b[1] - a[1])[0] ?? ['', 0])
  const titles = names.map(fold)
  const tokens = [...new Set(titles.flatMap((t) => t.split(' ')))].filter(Boolean)
  return {
    ...r, vec, wv: {}, wn: 0, stamp: 0, titles, tokens, hay: tokens.join(' '),
    code: code.filter(([, v]) => v >= 0.3 * top).slice(0, 3).map(([f]) => f[2]).join(''),
    primary: primary[1] > 0 ? (primary[0] as PathwayId) : '',
    skillIds: Object.keys(vec).filter((f) => f.startsWith('s:') && vec[f] >= 0.3).map((f) => f.slice(2)),
    tstems: [...new Set(tokens.map(stem))].filter((s) => s.length >= 4),
  }
}

/* ── fuzzy search over a very large catalog ── */
function lev(a: string, b: string, max: number): number {
  if (a === b) return 0
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    let min = i
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
      if (cur[j] < min) min = cur[j]
    }
    if (min > max) return max + 1
    prev = cur
  }
  return prev[b.length]
}
function tokenScore(t: string, e: Entry, fuzzy: boolean): number {
  if (e.hay.includes(t)) {
    let best = 0
    for (const tok of e.tokens) {
      if (tok === t) return 1
      if (tok.startsWith(t)) best = Math.max(best, 0.85)
      else if (t.length >= 3 && tok.includes(t)) best = Math.max(best, 0.5)
    }
    if (best) return best
  }
  if (fuzzy && t.length >= 4) {
    const d = t.length >= 8 ? 2 : 1
    for (const tok of e.tokens) if (Math.abs(tok.length - t.length) <= d && lev(tok, t, d) <= d) return 0.55
  }
  return 0
}

/* ── catalog: items + dedupe + IDF-weighted vectors (weights recomputed lazily when the catalog grows) ── */
export class Catalog {
  items: Entry[] = []
  byId = new Map<string, Entry>()
  private keys = new Set<string>()
  private df = new Map<string, number>()
  private stamp = 1
  constructor(public kind: Kind) {}
  add(recs: NormRec[]): number {
    let n = 0
    for (const r of recs) {
      const key = fold(r.title.en ?? r.title.fr ?? r.title.any ?? '')
      if (!key || this.keys.has(key) || this.byId.has(r.id)) continue
      const e = buildEntry(r)
      this.keys.add(key); this.byId.set(e.id, e); this.items.push(e)
      for (const f in e.vec) this.df.set(f, (this.df.get(f) ?? 0) + 1)
      n++
    }
    if (n) this.stamp++
    return n
  }
  w(f: string): number {
    if (f[0] === 'r') return 1
    if (f[0] === 'p') return 0.8
    return 0.5 + Math.log((this.items.length + 2) / ((this.df.get(f) ?? 0) + 1)) / Math.log(this.items.length + 2)
  }
  weighted(v: Vec): Vec { const o: Vec = {}; for (const f in v) o[f] = v[f] * Math.sqrt(this.w(f)); return o }
  ensure(e: Entry) { if (e.stamp !== this.stamp) { e.wv = this.weighted(e.vec); e.wn = norm(e.wv); e.stamp = this.stamp } }
  cos(a: Entry, b: Entry): number { this.ensure(a); this.ensure(b); return a.wn && b.wn ? dot(a.wv, b.wv) / (a.wn * b.wn) : 0 }
  search(q: string, limit = 30): Entry[] {
    const qt = toks(q)
    if (!qt.length) return []
    const full = qt.join(' ')
    const run = (fuzzy: boolean) => {
      const out: { s: number; e: Entry }[] = []
      for (const e of this.items) {
        let sum = 0
        let ok = true
        for (const t of qt) { const s = tokenScore(t, e, fuzzy); if (!s) { ok = false; break } sum += s }
        if (!ok) continue
        let s = sum / qt.length
        if (e.titles.some((t) => t.startsWith(full))) s += 0.25
        if (e.titles.includes(full)) s += 0.2
        out.push({ s: s - (e.titles[0]?.length ?? 0) / 1000, e })
      }
      return out
    }
    let res = run(false)
    if (res.length < 6 && full.length >= 4) res = run(true)
    return res.sort((a, b) => b.s - a.s).slice(0, limit).map((x) => x.e)
  }
}

/* ── IndexedDB: large catalogs are stored once in the browser, never the student's answers ── */
let dbPromise: Promise<IDBDatabase | null> | null = null
function db(): Promise<IDBDatabase | null> {
  if (!allowsOptionalStorage('offline')) return Promise.resolve(null)
  return (dbPromise ??= new Promise((res) => {
    try {
      const r = indexedDB.open('nm-orientation-catalogs', 1)
      r.onupgradeneeded = () => r.result.createObjectStore('sources', { keyPath: 'id' })
      r.onsuccess = () => res(r.result)
      r.onerror = () => res(null)
      r.onblocked = () => res(null)
    } catch { res(null) }
  }))
}
function req<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T | undefined> {
  return db().then((d) => (d ? new Promise<T | undefined>((res) => {
    try { const r = run(d.transaction('sources', mode).objectStore('sources')); r.onsuccess = () => res(r.result); r.onerror = () => res(undefined) } catch { res(undefined) }
  }) : undefined))
}
export const idbPut = (s: StoredSource) => req('readwrite', (st) => st.put(s))
export const idbAll = async (): Promise<StoredSource[]> => (await req<StoredSource[]>('readonly', (st) => st.getAll())) ?? []
export const idbClear = () => req('readwrite', (st) => st.clear())
function closeOrientationDatabase() {
  const openedDatabase = dbPromise
  dbPromise = null
  void openedDatabase?.then((database) => database?.close())
}
if (typeof window !== 'undefined') {
  window.addEventListener('spmpst-storage-consent-change', closeOrientationDatabase)
  window.addEventListener('spmpst-storage-removing', (event) => {
    const detail = event instanceof CustomEvent ? event.detail : undefined
    if (detail?.kind === 'indexedDB' && detail.name === 'nm-orientation-catalogs') closeOrientationDatabase()
  })
}

/* ── profile: every answer becomes weighted, attributable evidence ── */
const EXP_W: Record<ExpKind, number> = { job: 1.2, internship: 1.2, volunteer: 1.1, project: 1.1, club: 1, competition: 1, training: 0.9, hobby: 0.9 }
const durationFactor = (m = 3) => 0.7 + 0.3 * Math.min(1, Math.log1p(m) / Math.log1p(12))

export function buildProfile(inp: Inputs): Profile {
  const ev: Evidence[] = []
  const neg: Vec = {}
  const push = (ref: Ref, vec: Vec, w: number) => { if (w > 0 && Object.keys(vec).length) ev.push({ ref, vec, w }) }
  inp.themes.forEach((i) => THEME_VECS[i] && push({ type: 'theme', idx: i }, THEME_VECS[i], 1))
  inp.activities.forEach((i) => ACTIVITY_VECS[i] && push({ type: 'activity', idx: i }, ACTIVITY_VECS[i], 0.8))
  if (inp.goal >= 0) push({ type: 'goal' }, GOAL_VECS[inp.goal] ?? {}, 0.6)

  const stems = new Set<string>()
  for (const f of inp.fields) {
    toks(f.text).forEach((t) => stems.add(stem(t)))
    const groups = new Map<string, { c: number; neg: boolean; phrases: string[] }>()
    for (const h of matchConcepts(f.text)) {
      const g = groups.get(`${h.c}|${h.neg}`) ?? { c: h.c, neg: h.neg, phrases: [] }
      g.phrases.push(h.phrase)
      groups.set(`${h.c}|${h.neg}`, g)
    }
    for (const g of groups.values()) {
      const w = f.w * (1 + 0.5 * Math.log(g.phrases.length))   // saturating: three synonyms are not three times the evidence
      if (g.neg) vAdd(neg, CONCEPTS[g.c], w * 0.8)
      else push({ type: 'text', field: f.key, phrase: g.phrases[0] }, CONCEPTS[g.c], w)
    }
  }

  const likedOcc: Entry[] = [], rejOcc: Entry[] = [], likedExp: Entry[] = [], rejExp: Entry[] = []
  for (const pk of inp.occPicks) {
    const e = inp.occ.byId.get(pk.id)
    if (!e) continue
    if (pk.stance === 1) { push({ type: 'occupation', id: e.id }, e.vec, 1.3); likedOcc.push(e) }
    else if (pk.stance === 0) push({ type: 'occupation', id: e.id }, e.vec, 0.4)
    else { vAdd(neg, e.vec, 1); rejOcc.push(e) }
  }
  for (const pk of inp.expPicks) {
    const e = inp.exp.byId.get(pk.id)
    if (!e) continue
    const w = EXP_W[e.expKind ?? 'project'] * durationFactor(pk.months) * 1.1   // lived experience outweighs self-description
    if (pk.stance === 1) { push({ type: 'experience', id: e.id }, e.vec, w); likedExp.push(e) }
    else if (pk.stance === 0) push({ type: 'experience', id: e.id }, e.vec, w * 0.4)
    else { vAdd(neg, e.vec, w * 0.8); rejExp.push(e) }
  }

  const sum: Vec = {}
  let mass = 0
  for (const x of ev) { vAdd(sum, x.vec, x.w); mass += x.w }
  const vec: Vec = {}                                            // Rocchio: positives minus a fraction of negatives
  for (const f in sum) { const v = sum[f] - 0.6 * (neg[f] ?? 0); if (v > 0) vec[f] = v }
  const letters = Object.entries(vec).filter(([f]) => f[0] === 'r').sort((a, b) => b[1] - a[1])
  const top = letters[0]?.[1] ?? 0
  const code = letters.filter(([, v]) => v >= 0.3 * top).slice(0, 3).map(([f]) => f[2])
  return { vec, neg, ev, mass, stems, code, likedOcc, rejOcc, likedExp, rejExp }
}

/* ── ranking ── */
interface Weights { content: number; skill: number; holland: number; text: number; neighbor: number; stage: number }
export function weightsFor(goal: number): { w: Weights; lambda: number } {
  const w: Weights = { content: 0.4, skill: 0.14, holland: 0.16, text: 0.08, neighbor: 0.14, stage: 0.08 }
  let lambda = 0.75
  if (goal === 0) { w.stage = 0.04; w.holland = 0.2 }
  if (goal === 1) { w.stage = 0.16; w.text = 0.12; w.content = 0.32 }
  if (goal === 2) { w.skill = 0.26; w.content = 0.3 }
  if (goal === 4) lambda = 0.6
  return { w, lambda }
}
const STAGE_FIT = [[3, 2], [4, 1.5], [2, 1.2], [3.5, 1.5], [3, 2]]
const stageFit = (level: number | undefined, stage: number) => {
  if (!level || stage < 0) return 0.7
  const [c, s] = STAGE_FIT[stage]
  return Math.exp(-((level - c) ** 2) / (2 * s * s))
}
function congruence(pc: string[], oc: string): number {         // Holland hexagon: adjacent types earn partial credit
  const W = [3, 2, 1]
  let s = 0, t = 0
  for (let i = 0; i < Math.min(3, pc.length, oc.length); i++) { s += (W[i] * (3 - hexDist(pc[i], oc[i]))) / 3; t += W[i] }
  return t ? s / t : 0
}
const textFit = (e: Entry, stems: Set<string>) => {
  if (!stems.size || !e.tstems.length) return 0
  let hits = 0
  for (const s of e.tstems) if (stems.has(s)) hits++
  return Math.min(1, hits / Math.max(1, Math.min(2, e.tstems.length)))
}
function skillProfile(p: Profile): Vec {
  const o: Vec = {}
  let m = 0
  for (const f in p.vec) if (f.startsWith('s:')) m = Math.max(m, p.vec[f])
  if (m) for (const f in p.vec) if (f.startsWith('s:')) o[f.slice(2)] = p.vec[f] / m
  return o
}
const gapsOf = (e: Entry, ps: Vec) => e.skillIds.filter((s) => (ps[s] ?? 0) < 0.25)

interface Scored { e: Entry; score: number }
function rank(p: Profile, cat: Catalog, w: Weights, o: { exclude: Set<string>; liked: Entry[]; rejected: Entry[]; stage: number }): Scored[] {
  const pw = cat.weighted(p.vec), pn = norm(pw), nw = cat.weighted(p.neg), nn = norm(nw), ps = skillProfile(p)
  const used = w.content + w.skill + w.holland + w.stage + (p.stems.size ? w.text : 0) + (o.liked.length ? w.neighbor : 0)
  const out: Scored[] = []
  for (const e of cat.items) {
    if (o.exclude.has(e.id)) continue
    cat.ensure(e)
    const content = pn && e.wn ? Math.max(0, dot(e.wv, pw)) / (pn * e.wn) : 0
    let skill = 0
    for (const s of e.skillIds) skill += Math.sqrt(ps[s] ?? 0)
    skill = e.skillIds.length ? skill / e.skillIds.length : 0
    let nb = 0
    if (o.liked.length) { const s = o.liked.map((l) => cat.cos(e, l)).sort((a, b) => b - a); nb = (s[0] + (s[1] ?? s[0])) / 2 }
    if (o.rejected.length) nb -= 0.6 * Math.max(...o.rejected.map((r) => cat.cos(e, r)))
    let score = (w.content * content + w.skill * skill + w.holland * congruence(p.code, e.code) + (p.stems.size ? w.text * textFit(e, p.stems) : 0)
      + (o.liked.length ? w.neighbor * Math.max(0, nb) : 0) + w.stage * stageFit(e.level, o.stage)) / used
    if (nn && e.wn) score -= 0.2 * Math.max(0, dot(e.wv, nw) / (nn * e.wn))
    out.push({ e, score })
  }
  return out.sort((a, b) => b.score - a.score)
}

/* second stage: do independent kinds of evidence agree? (themes, activities, text, professions, experiences) */
function convergence(e: Entry, p: Profile, cat: Catalog) {
  const by = new Map<string, number>()
  for (const x of p.ev) {
    let c = 0
    for (const f in e.vec) { const v = x.vec[f]; if (v) c += v * e.vec[f] * cat.w(f) }
    by.set(x.ref.type, (by.get(x.ref.type) ?? 0) + c * x.w)
  }
  const vals = [...by.values()]
  const mx = Math.max(0, ...vals)
  const n = mx ? vals.filter((v) => v >= 0.2 * mx).length : 0
  return { n, conv: clamp((n - 1) / 3) }
}
const refKey = (r: Ref) => `${r.type}|${r.idx ?? ''}|${r.id ?? ''}|${r.field ?? ''}`
function explain(e: Entry, p: Profile, cat: Catalog): Reason[] {
  const shared = Object.keys(e.vec).map((f) => [f, (p.vec[f] ?? 0) * e.vec[f] * cat.w(f)] as const).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  const out: Reason[] = []
  const used = new Set<string>()
  for (const [f] of shared) {
    if (out.length >= 3) break
    let best: Evidence | undefined
    let bv = 0
    for (const x of p.ev) { const v = (x.vec[f] ?? 0) * x.w; if (v > bv) { bv = v; best = x } }
    if (!best || used.has(refKey(best.ref))) continue
    used.add(refKey(best.ref))
    out.push({ feature: f, ref: best.ref })
  }
  return out
}

/* Maximal Marginal Relevance: relevant, but not three flavours of the same job */
function mmr<T extends { e: Entry; final: number }>(pool: T[], k: number, lambda: number, cat: Catalog, seed: Entry[]): T[] {
  const left = [...pool]
  const chosen: T[] = []
  const maxF = Math.max(1e-9, ...left.map((x) => x.final))
  while (chosen.length < k && left.length) {
    let bi = 0, bv = -Infinity
    left.forEach((x, i) => {
      let sim = 0
      for (const y of [...chosen.map((z) => z.e), ...seed]) sim = Math.max(sim, cat.cos(x.e, y))
      const v = lambda * (x.final / maxF) - (1 - lambda) * sim
      if (v > bv) { bv = v; bi = i }
    })
    chosen.push(left.splice(bi, 1)[0])
  }
  return chosen
}

function suggestExperiences(occs: Entry[], weights: number[], fallback: Vec, ps: Vec, p: Profile, inp: Inputs): ExpRec[] {
  const target: Vec = {}
  if (occs.length) occs.forEach((o, i) => vAdd(target, o.vec, weights[i])); else vAdd(target, fallback)
  const tw = inp.exp.weighted(target), tn = norm(tw)
  const gaps = new Set(occs.flatMap((o) => gapsOf(o, ps)))
  const taken = new Set(inp.expPicks.map((x) => x.id))
  const out: ExpRec[] = []
  for (const x of inp.exp.items) {
    if (taken.has(x.id)) continue
    inp.exp.ensure(x)
    const sim = x.wn && tn ? dot(x.wv, tw) / (x.wn * tn) : 0
    const builds = x.skillIds.filter((s) => gaps.has(s))
    let score = 0.6 * sim + 0.4 * (gaps.size ? Math.min(1, builds.length / Math.min(gaps.size, 3)) : 0)
    if (inp.stage === 0 && (x.expKind === 'job' || x.expKind === 'internship')) score *= 0.7
    out.push({ id: x.id, builds, score })
  }
  return out.sort((a, b) => b.score - a.score).slice(0, 2)
}

export function analyze(inp: Inputs): Analysis {
  const p = buildProfile(inp)
  if (p.mass < 0.5) return { clarity: 0, diffuse: false, mass: p.mass, signals: [], paths: [] }
  const clarity = 1 - Math.exp(-p.mass / 4)
  const { w, lambda } = weightsFor(inp.goal)
  const ps = skillProfile(p)
  const exclude = new Set(inp.occPicks.map((x) => x.id))
  const cands = rank(p, inp.occ, w, { exclude, liked: p.likedOcc, rejected: p.rejOcc, stage: inp.stage }).slice(0, 120)
    .map((s) => { const c = convergence(s.e, p, inp.occ); return { ...s, final: s.score * (0.88 + 0.24 * c.conv), conv: c.conv, n: c.n } })
    .sort((a, b) => b.final - a.final).slice(0, 60)
  const topFinal = cands[0]?.final ?? 0
  const toRec = (c: (typeof cands)[number]): Rec => {
    let similarTo: string | undefined, best = 0.55
    for (const l of p.likedOcc) { const s = inp.occ.cos(c.e, l); if (s > best) { best = s; similarTo = l.id } }
    return { id: c.e.id, fit: Math.round(Math.min(1, c.final * 1.2) * (0.6 + 0.4 * clarity) * 100), reasons: explain(c.e, p, inp.occ), gaps: gapsOf(c.e, ps).slice(0, 3), conv: c.conv, sources: c.n, similarTo }
  }

  // Pathway score = rank-discounted sum of its best professions + anchors from professions the student picked + direct profile signal
  const buckets = new Map<string, number[]>()
  const add = (id: string, v: number) => { if (id) buckets.set(id, [...(buckets.get(id) ?? []), v]) }
  cands.forEach((c) => add(c.e.primary, c.final))
  for (const pk of inp.occPicks) { const e = inp.occ.byId.get(pk.id); if (e && pk.stance >= 0) add(e.primary, pk.stance === 1 ? 0.9 : 0.4) }
  const maxP = Math.max(1e-9, ...PATHWAY_IDS.map((id) => p.vec[`p:${id}`] ?? 0))
  const scores = PATHWAY_IDS.map((id, idx) => ({
    id, idx,
    score: (buckets.get(id) ?? []).sort((a, b) => b - a).slice(0, 4).reduce((s, v, i) => s + v * 0.75 ** i, 0) + (0.5 * (p.vec[`p:${id}`] ?? 0)) / maxP,
  })).sort((a, b) => b.score - a.score)
  const top = scores.slice(0, 3)
  const chosen: Entry[] = []
  const paths: PathRec[] = top.map((t) => {
    const picked = mmr(cands.filter((c) => c.e.primary === t.id), 3, lambda, inp.occ, [])
    chosen.push(...picked.map((c) => c.e))
    return { id: t.id, score: t.score, occupations: picked.map(toRec), experiences: suggestExperiences(picked.map((c) => c.e), picked.map((c) => c.final), THEME_VECS[t.idx], ps, p, inp) }
  })
  // Wildcard: strong fit, different pathway, far from what we already show (serendipity with a floor)
  const topIds = new Set<string>(top.map((t) => t.id))
  const pool = cands.filter((c) => c.e.primary && !topIds.has(c.e.primary) && c.final >= 0.5 * topFinal)
  const wc = pool.length ? mmr(pool, 1, 0.55, inp.occ, chosen)[0] : undefined
  const signals = Object.entries(p.vec).filter(([f]) => f[0] === 'r' || f.startsWith('s:')).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f]) => f)
  return {
    clarity, mass: p.mass, signals, paths,
    diffuse: scores.length >= 4 && scores[0].score < 1.25 * scores[3].score,
    wildcard: wc ? { ...toRec(wc), pathway: wc.e.primary as PathwayId } : undefined,
  }
}

export function suggest(kind: Kind, inp: Inputs, limit = 12): string[] {
  const cat = kind === 'occupation' ? inp.occ : inp.exp
  const taken = new Set((kind === 'occupation' ? inp.occPicks : inp.expPicks).map((x) => x.id))
  const p = buildProfile(inp)
  if (p.mass < 0.5) return cat.items.filter((e) => !taken.has(e.id)).slice(0, limit).map((e) => e.id)
  const occ = kind === 'occupation'
  return rank(p, cat, weightsFor(inp.goal).w, { exclude: taken, liked: occ ? p.likedOcc : p.likedExp, rejected: occ ? p.rejOcc : p.rejExp, stage: inp.stage }).slice(0, limit).map((s) => s.e.id)
}

/* ── built-in seed catalogs (compact rows: id|en|fr|riasec|pathway|skills|level|aliases) ── */
const OCC_SEED = `
software-developer|Software developer|Développeur·se logiciel|IRC|technology|programming,problemSolving,analysis|4|web developer;développeur web;programmer;full stack
data-scientist|Data scientist|Data scientist|IAC|technology|analysis,numeracy,programming,research|5|machine learning;ingénieur IA
data-analyst|Data analyst|Analyste de données|ICE|technology|analysis,numeracy,communication|4|business intelligence;BI analyst
cybersecurity|Cybersecurity analyst|Analyste en cybersécurité|IRC|technology|problemSolving,analysis,programming|4|pentester;sécurité informatique
network-tech|Network technician|Technicien·ne réseaux|RIC|technology|handson,problemSolving|2|IT support;support informatique;helpdesk
mechanical-eng|Mechanical engineer|Ingénieur·e mécanique|RIC|technology|handson,numeracy,problemSolving,design|4|ingénieur mécanicien
civil-eng|Civil engineer|Ingénieur·e en génie civil|RIE|technology|numeracy,organization,problemSolving|4|bâtiment;travaux publics;BTP
electrician|Electrician|Électricien·ne|RCI|technology|handson,problemSolving|1|installation électrique
robotics-eng|Robotics engineer|Ingénieur·e en robotique|RIA|technology|programming,handson,problemSolving,creativity|4|automatisme;mécatronique;électronique
entrepreneur|Entrepreneur|Entrepreneur·e|ESA|business|leadership,sales,creativity,organization|3|startup founder;créateur d’entreprise;fondateur
marketing-manager|Marketing manager|Responsable marketing|EAS|business|communication,creativity,analysis,sales|4|digital marketing;community manager;growth
accountant|Accountant|Comptable|CEI|business|numeracy,organization,analysis|3|comptabilité;expert-comptable;audit
financial-analyst|Financial analyst|Analyste financier|ICE|business|analysis,numeracy,research|4|finance;banque;investment
sales-rep|Sales representative|Commercial·e|ESC|business|sales,communication,negotiation|2|business developer;account manager;vendeur
project-manager|Project manager|Chef·fe de projet|ECS|business|organization,leadership,teamwork,communication|4|product owner;scrum master;gestion de projet
hr-officer|HR officer|Chargé·e de ressources humaines|SEC|business|empathy,organization,communication|3|recruiter;recrutement;RH
logistics|Logistics coordinator|Responsable logistique|CER|business|organization,numeracy,problemSolving|3|supply chain;transport;achats
ecommerce|E-commerce manager|Responsable e-commerce|ECA|business|sales,analysis,creativity,organization|3|online store;boutique en ligne;dropshipping
hospitality-manager|Hospitality manager|Responsable hôtellerie-restauration|ERS|business|leadership,organization,communication|3|hôtel;restaurant;tourisme
physician|Physician|Médecin|ISR|health|science,care,analysis,empathy|5|doctor;general practitioner;généraliste
nurse|Nurse|Infirmier·ère|SIR|health|care,empathy,teamwork|3|nursing;soins infirmiers
pharmacist|Pharmacist|Pharmacien·ne|ICS|health|science,care,numeracy|5|pharmacie
physiotherapist|Physiotherapist|Kinésithérapeute|SRI|health|care,handson,empathy|4|physical therapy;rééducation
psychologist|Psychologist|Psychologue|SIA|health|empathy,research,communication|5|therapist;thérapeute;psychothérapie
nutritionist|Nutritionist|Nutritionniste|SIC|health|science,care,teaching|4|diététicien;dietitian;alimentation
lab-tech|Medical lab technician|Technicien·ne de laboratoire médical|IRC|health|science,analysis,handson|2|laboratoire;biologie médicale
veterinarian|Veterinarian|Vétérinaire|IRS|health|science,care,handson|5|animals;animaux
public-health|Public health specialist|Spécialiste en santé publique|ISC|health|research,analysis,communication|5|épidémiologie;epidemiologist
teacher|Teacher|Enseignant·e|SAE|education|teaching,communication,empathy,organization|4|professeur;instituteur;school teacher
researcher|Researcher|Chercheur·se|IAR|education|research,science,analysis,writing|5|scientist;scientifique;PhD;doctorant
librarian|Librarian|Bibliothécaire|CSI|education|organization,research,communication|3|documentaliste;archiviste;archivist
trainer|Corporate trainer|Formateur·rice|SEA|education|teaching,communication,leadership|3|coach;formation professionnelle
career-counselor|Career counselor|Conseiller·ère d’orientation|SAI|education|empathy,communication,research|4|orientation;guidance counselor
translator|Translator|Traducteur·rice|ACI|creative|languages,writing,research|4|interprète;interpreter;traduction
graphic-designer|Graphic designer|Graphiste|AEI|creative|design,creativity,communication|3|designer graphique;brand design;illustrator;illustrateur
ux-designer|UX/UI designer|Designer UX/UI|AIE|creative|design,research,creativity,problemSolving|4|product designer;interface
video-producer|Video producer|Producteur·rice vidéo|AER|creative|creativity,teamwork,organization,handson|3|filmmaker;vidéaste;montage;réalisateur
journalist|Journalist|Journaliste|AES|creative|writing,research,communication|4|reporter;presse;media
architect|Architect|Architecte|AIR|creative|design,numeracy,creativity,organization|5|architecture
photographer|Photographer|Photographe|ARE|creative|creativity,handson,design|2|photography;photo
content-creator|Content creator|Créateur·rice de contenu|AES|creative|creativity,communication,writing,sales|2|youtuber;influencer;influenceur;podcast;blogger
musician|Musician|Musicien·ne|ARS|creative|creativity,handson,teamwork|2|music;musique;compositeur;composer
game-designer|Game designer|Concepteur·rice de jeux vidéo|AIE|creative|creativity,programming,design,teamwork|4|jeu vidéo;game developer;gamedev
social-worker|Social worker|Assistant·e social·e|SEC|community|empathy,communication,organization|3|travail social;éducateur spécialisé
environmental-scientist|Environmental scientist|Spécialiste de l’environnement|IRS|community|science,research,analysis|4|écologue;ecologist;climate;climat
urban-planner|Urban planner|Urbaniste|EIA|community|analysis,design,organization,communication|4|aménagement du territoire;city planner
ngo-officer|NGO project officer|Chargé·e de projet en ONG|SEA|community|organization,communication,leadership,empathy|3|humanitaire;association;nonprofit;développement
agri-tech|Agricultural technician|Technicien·ne agricole|RIS|community|handson,science|2|agriculture;agronome;farm;ferme
renewable-tech|Renewable energy technician|Technicien·ne en énergies renouvelables|RIC|community|handson,science|2|solar;solaire;éolien;photovoltaïque
lawyer|Lawyer|Avocat·e|ESI|community|communication,negotiation,research,writing|5|juriste;droit;legal;attorney
civil-servant|Public administrator|Agent·e de l’administration publique|CES|community|organization,communication|3|fonctionnaire;civil servant;administration
`
const EXP_SEED = `
hackathon|Hackathon|Hackathon|IRE|technology|programming,teamwork,problemSolving|competition
coding-club|Coding club|Club d’informatique|IRC|technology|programming,teamwork|club
robotics-club|Robotics club|Club de robotique|RIA|technology|handson,programming,teamwork|club
personal-app|Personal app or website project|Projet personnel d’application ou de site web|IRA|technology|programming,creativity|project
repair-workshop|Repairing devices or bikes|Réparation d’appareils ou de vélos|RIC|technology|handson,problemSolving|hobby
tech-internship|IT or engineering internship|Stage en informatique ou ingénierie|IRC|technology|programming,teamwork,problemSolving|internship
online-course|Online course or bootcamp|Cours en ligne ou bootcamp|ICR|technology|research,analysis|training
science-fair|Science fair or olympiad|Concours de sciences ou olympiade|IRA|education|science,research,communication|competition
lab-internship|Laboratory internship|Stage en laboratoire|IRC|health|science,analysis,handson|internship
clinic-volunteer|Volunteering in a clinic or care home|Bénévolat en clinique ou maison de retraite|SRI|health|care,empathy|volunteer
first-aid|First-aid training|Formation aux premiers secours|SRI|health|care,teamwork|training
peer-tutoring|Peer tutoring|Tutorat entre élèves|SAE|education|teaching,communication,empathy|volunteer
youth-camp|Youth camp counselor|Animateur·rice de colonie ou de centre de loisirs|SEA|education|teaching,leadership,teamwork|job
babysitting|Babysitting or private tutoring|Garde d’enfants ou cours particuliers|SAE|education|care,teaching,empathy|job
language-exchange|Language exchange or studying abroad|Échange linguistique ou séjour d’études à l’étranger|SAE|education|languages,communication|training
debate-club|Debate club|Club de débat|EAS|community|communication,negotiation,research|club
student-council|Student council or association|Conseil étudiant ou association|ESC|community|leadership,organization,teamwork|club
club-treasurer|Club treasurer|Trésorier·ère d’un club|CEI|business|numeracy,organization|club
event-organizing|Organizing an event|Organisation d’un événement|ESC|business|organization,leadership,teamwork|project
small-business|Selling products or running a small business|Vente de produits ou petite entreprise|ESA|business|sales,negotiation,creativity|job
retail-job|Customer-facing part-time job|Job étudiant au contact de la clientèle|ESC|business|sales,communication|job
family-business|Helping in a family business|Aide dans une entreprise familiale|ECR|business|organization,sales|job
business-internship|Business or finance internship|Stage en entreprise ou en finance|ECI|business|analysis,organization,communication|internship
catering|Cooking or catering|Cuisine ou restauration|RAE|business|handson,creativity,teamwork|job
school-newspaper|School newspaper or blog|Journal ou blog scolaire|AES|creative|writing,communication,research|club
video-channel|Video channel or podcast|Chaîne vidéo ou podcast|AES|creative|creativity,communication|project
design-portfolio|Design or drawing portfolio|Portfolio de design ou de dessin|AEI|creative|design,creativity|project
theatre-music|Theatre, band or choir|Théâtre, groupe de musique ou chorale|ASE|creative|creativity,teamwork|club
photo-project|Photography project|Projet photo|ARE|creative|creativity,design|project
food-bank|Volunteering at a food bank or charity|Bénévolat dans une banque alimentaire ou une association|SEC|community|empathy,organization,teamwork|volunteer
community-garden|Community garden or clean-up|Jardin partagé ou opération de nettoyage|RSI|community|handson,teamwork|volunteer
environmental-project|Environmental project|Projet environnemental|IRS|community|science,teamwork,research|project
sports-captain|Sports team captain or coach|Capitaine ou entraîneur·se d’une équipe sportive|ESR|community|leadership,teamwork,communication|club
`
const rows = (s: string) => s.trim().split('\n').map((l) => l.split('|'))
export const SEED_OCCUPATIONS: NormRec[] = rows(OCC_SEED).map(([id, en, fr, h, p, sk, lv, al = '']) =>
  normalizeRecord({ id, title: { en, fr }, riasec: h, pathways: [p], skills: sk, level: Number(lv), aliases: al }, 'occupation', 'builtin') as NormRec)
export const SEED_EXPERIENCES: NormRec[] = rows(EXP_SEED).map(([id, en, fr, h, p, sk, ek]) =>
  normalizeRecord({ id, title: { en, fr }, riasec: h, pathways: [p], skills: sk, expKind: ek }, 'experience', 'builtin') as NormRec)
</script>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, shallowRef } from 'vue'

const props = withDefaults(defineProps<{
  occupationSources?: CatalogSource[]
  experienceSources?: CatalogSource[]
  searchEndpoint?: string
  searchHeaders?: Record<string, string>
}>(), { occupationSources: () => [], experienceSources: () => [], searchEndpoint: '', searchHeaders: () => ({}) })
const emit = defineEmits<{ generated: [analysis: Analysis] }>()

const language = ref<Language>('en')
const stage = ref('')
const institution = ref('')
const studyField = ref('')
const favoriteSubjects = ref('')
const hobbies = ref('')
const strengths = ref('')
const selectedThemes = ref<string[]>([])
const preferredActivities = ref<string[]>([])
const goal = ref('')
const generated = ref(false)
const analyzing = ref(false)
const copied = ref(false)
const copyFailed = ref(false)
const contactName = ref('')
const contact = ref('')
const contactConsent = ref(false)
const promptArea = ref<HTMLTextAreaElement | null>(null)
const result = shallowRef<Analysis | null>(null)

/* ───────── catalogs, pickers, storage ───────── */
interface Hit { id: string; custom?: string }
interface PickerUi { query: string; open: boolean; active: number; hits: Hit[]; suggested: boolean; loading: boolean }
const DURATIONS = [1, 3, 9, 18]
const GLYPH: Record<string, string> = { '1': '♥', '0': '◐', '-1': '⊘' }
const catalogs: Record<Kind, Catalog> = { occupation: new Catalog('occupation'), experience: new Catalog('experience') }
const customRecs: NormRec[] = []
const catalogVersion = ref(0)
const picks = reactive<Record<Kind, Pick[]>>({ occupation: [], experience: [] })
const ui = reactive<Record<Kind, PickerUi>>({
  occupation: { query: '', open: false, active: -1, hits: [], suggested: false, loading: false },
  experience: { query: '', open: false, active: -1, hits: [], suggested: false, loading: false },
})
const status = reactive({ busy: false, message: '', error: '' })
const stored = ref<{ id: string; kind: Kind; label: string; count: number }[]>([])
const importKind = ref<Kind>('occupation')
const urlInput = ref('')
const tick = () => new Promise<void>((r) => setTimeout(r))
const timers: Partial<Record<Kind, number>> = {}
const aborts: Partial<Record<Kind, AbortController>> = {}

function resetCatalogs() {
  catalogs.occupation = new Catalog('occupation')
  catalogs.experience = new Catalog('experience')
  catalogs.occupation.add(SEED_OCCUPATIONS)
  catalogs.experience.add(SEED_EXPERIENCES)
  for (const r of customRecs) catalogs[r.kind].add([r])
}
resetCatalogs()

async function refreshStored() {
  stored.value = (await idbAll()).map(({ id, kind, label, items }) => ({ id, kind, label, count: items.length }))
}

/** Normalise, enrich and index records in small chunks so the page stays responsive with very large files. */
async function ingest(kind: Kind, raws: unknown[], sourceId: string, label: string, opts: { persist?: boolean; silent?: boolean } = {}): Promise<number> {
  if (!opts.silent) status.busy = true
  const recs: NormRec[] = []
  let added = 0
  for (let i = 0; i < raws.length; i += 1500) {
    const chunk: NormRec[] = []
    for (const raw of raws.slice(i, i + 1500)) { const r = normalizeRecord(raw, kind, sourceId); if (r) chunk.push(r) }
    added += catalogs[kind].add(chunk)
    if (opts.persist) recs.push(...chunk)
    if (!opts.silent) status.message = `${Math.min(i + 1500, raws.length).toLocaleString(language.value)} / ${raws.length.toLocaleString(language.value)}`
    await tick()
  }
  catalogVersion.value++
  if (opts.persist && recs.length) { await idbPut({ id: sourceId, kind, label, items: recs, savedAt: Date.now() }); await refreshStored() }
  if (!opts.silent) status.busy = false
  return added
}

function splitPayload(payload: unknown, fallback: Kind): Partial<Record<Kind, unknown[]>> {
  if (Array.isArray(payload)) return { [fallback]: payload }
  if (!payload || typeof payload !== 'object') return {}
  const o = payload as Record<string, unknown>
  const occ = o.occupations ?? o.professions ?? o.metiers
  const exp = o.experiences
  const out: Partial<Record<Kind, unknown[]>> = {}
  if (Array.isArray(occ)) out.occupation = occ
  if (Array.isArray(exp)) out.experience = exp
  const items = o.items ?? o.results ?? o.data
  if (!occ && !exp && Array.isArray(items)) out[fallback] = items
  return out
}
async function ingestPayload(payload: unknown, base: string, label: string, fallback: Kind, persist: boolean): Promise<number> {
  const parts = splitPayload(payload, fallback)
  let n = 0
  for (const k of KINDS) { const list = parts[k]; if (list?.length) n += await ingest(k, list, `${base}:${k}`, label, { persist }) }
  return n
}
async function loadSource(src: CatalogSource) {
  if (!src.refresh && stored.value.some((s) => s.id === `${src.id}:${src.kind}`)) return
  const payload = src.load ? await src.load() : src.url ? await (await fetch(src.url)).json() : null
  if (payload) await ingestPayload(payload, src.id, src.label ?? src.id, src.kind, src.persist ?? !!src.url)
}
async function boot(withSources = true) {
  resetCatalogs()
  catalogVersion.value++
  const rows = await idbAll()
  stored.value = rows.map(({ id, kind, label, items }) => ({ id, kind, label, count: items.length }))
  for (const row of rows) for (let i = 0; i < row.items.length; i += 1500) { catalogs[row.kind].add(row.items.slice(i, i + 1500)); await tick() }
  catalogVersion.value++
  if (!withSources) return
  for (const src of [...props.occupationSources, ...props.experienceSources]) {
    try { await loadSource(src) } catch (e) { status.error = e instanceof Error ? e.message : String(e) }
  }
}
async function onFile(ev: Event) {
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  status.error = ''; status.busy = true; status.message = labels.value.working
  try {
    const n = await ingestPayload(JSON.parse(await file.text()), `file:${file.name}`, file.name, importKind.value, true)
    status.message = labels.value.imported.replace('{n}', n.toLocaleString(language.value))
  } catch (e) { status.error = e instanceof Error ? e.message : String(e) } finally { status.busy = false; input.value = '' }
}
async function loadUrl() {
  const url = urlInput.value.trim()
  if (!url) return
  status.error = ''; status.busy = true; status.message = labels.value.working
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
    const n = await ingestPayload(await res.json(), `url:${url}`, url, importKind.value, true)
    status.message = labels.value.imported.replace('{n}', n.toLocaleString(language.value))
  } catch (e) { status.error = e instanceof Error ? e.message : String(e) } finally { status.busy = false }
}
async function clearCache() {
  await idbClear()
  await boot(false)
  for (const k of KINDS) picks[k] = picks[k].filter((p) => catalogs[k].byId.has(p.id))
  status.message = ''
}

/* remote search: results are merged into the local index, so ranking and recommendations see them too */
async function remoteSearch(kind: Kind, q: string) {
  const base = props.searchEndpoint
  if (!base || q.length < 2) return
  aborts[kind]?.abort()
  const ac = new AbortController()
  aborts[kind] = ac
  ui[kind].loading = true
  try {
    const url = base.includes('{q}')
      ? base.replace('{q}', encodeURIComponent(q)).replace('{lang}', language.value).replace('{kind}', kind)
      : `${base}${base.includes('?') ? '&' : '?'}q=${encodeURIComponent(q)}&lang=${language.value}&kind=${kind}`
    const res = await fetch(url, { signal: ac.signal, headers: { Accept: 'application/json', ...props.searchHeaders } })
    if (!res.ok) return
    const parts = splitPayload(await res.json(), kind)
    let added = 0
    for (const k of KINDS) { const list = parts[k]; if (list?.length) added += await ingest(k, list, `remote:${k}`, 'API', { silent: true }) }
    if (added && ui[kind].query.trim() === q) refreshHits(kind, false)
  } catch { /* offline or aborted: local results still work */ } finally { if (aborts[kind] === ac) ui[kind].loading = false }
}

function inputs(): Inputs {
  return {
    stage: stage.value === '' ? -1 : Number(stage.value),
    fields: [
      { key: 'field', text: studyField.value, w: 1 }, { key: 'subjects', text: favoriteSubjects.value, w: 1 },
      { key: 'hobbies', text: hobbies.value, w: 0.8 }, { key: 'strengths', text: strengths.value, w: 1.2 },
    ],
    themes: selectedThemes.value.map(Number), activities: preferredActivities.value.map(Number),
    goal: goal.value === '' ? -1 : Number(goal.value),
    occPicks: picks.occupation, expPicks: picks.experience, occ: catalogs.occupation, exp: catalogs.experience,
  }
}

/* ───────── combobox behaviour ───────── */
function refreshHits(kind: Kind, remote = true) {
  const u = ui[kind]
  const q = u.query.trim()
  if (!q) {
    u.suggested = true
    u.hits = suggest(kind, inputs()).map((id) => ({ id }))
  } else {
    u.suggested = false
    const taken = new Set(picks[kind].map((p) => p.id))
    const found = catalogs[kind].search(q, 40).filter((e) => !taken.has(e.id)).slice(0, 12)
    u.hits = found.map((e) => ({ id: e.id }))
    if (q.length >= 2 && !catalogs[kind].search(q, 3).some((e) => e.titles.includes(fold(q)))) u.hits.push({ id: '', custom: q })
    if (remote) remoteSearch(kind, q)
  }
  u.active = u.hits.length ? 0 : -1
}
function onInput(kind: Kind) {
  ui[kind].open = true
  window.clearTimeout(timers[kind])
  timers[kind] = window.setTimeout(() => refreshHits(kind), 90)
}
function onFocus(kind: Kind) { ui[kind].open = true; refreshHits(kind) }
function addCustom(kind: Kind, title: string): string {
  const rec = normalizeRecord({ title }, kind, 'custom')
  if (!rec) return ''
  customRecs.push(rec)
  catalogs[kind].add([rec])
  catalogVersion.value++
  return catalogs[kind].byId.has(rec.id) ? rec.id : catalogs[kind].search(title, 1)[0]?.id ?? ''
}
function choose(kind: Kind, hit: Hit) {
  const id = hit.custom ? addCustom(kind, hit.custom) : hit.id
  if (!id || picks[kind].some((p) => p.id === id)) return
  picks[kind].push({ id, stance: 1, months: kind === 'experience' ? 3 : undefined })
  ui[kind].query = ''
  refreshHits(kind, false)
}
function onKey(kind: Kind, ev: KeyboardEvent) {
  const u = ui[kind]
  const n = u.hits.length
  if (ev.key === 'ArrowDown') { ev.preventDefault(); if (!u.open) onFocus(kind); else if (n) u.active = (u.active + 1) % n }
  else if (ev.key === 'ArrowUp') { ev.preventDefault(); if (n) u.active = (u.active - 1 + n) % n }
  else if (ev.key === 'Enter') { if (u.open && u.hits[u.active]) { ev.preventDefault(); choose(kind, u.hits[u.active]) } else if (u.query) ev.preventDefault() }
  else if (ev.key === 'Escape') u.open = false
  else if (ev.key === 'Backspace' && !u.query && picks[kind].length) picks[kind].pop()
}
function cycle(kind: Kind, i: number) { const p = picks[kind][i]; p.stance = p.stance === 1 ? 0 : p.stance === 0 ? -1 : 1 }

/* ───────── copy ───────── */
const text = {
  en: {
    title: 'Find a direction worth exploring',
    intro: 'A short self-reflection tool for students and recent graduates. Your answers stay in this page unless you choose to copy or send them.',
    language: 'Language',
    about: 'About you',
    stage: 'Where are you in your studies?',
    stagePlaceholder: 'Choose one',
    stages: ['Secondary school', 'University or college', 'Vocational training', 'Recent graduate', 'Other or taking a break'],
    institution: 'Where do you study? (optional)',
    institutionPlaceholder: 'School, university, training center, or city',
    field: 'What are you studying or learning?',
    fieldPlaceholder: 'Your subject, program, or current focus',
    subjects: 'Which subjects or topics do you enjoy?',
    subjectsPlaceholder: 'For example: biology, maths, writing, history, coding',
    hobbies: 'What do you enjoy doing outside class?',
    hobbiesPlaceholder: 'Hobbies, interests, activities, or things you explore for fun',
    strengths: 'What do people often rely on you for?',
    strengthsPlaceholder: 'For example: explaining, fixing, organizing, listening, noticing details. You can also say what you dislike: "I don’t enjoy sales".',
    themes: 'Which areas make you curious? (choose any)',
    themeOptions: ['Technology and engineering', 'Business and entrepreneurship', 'Health and wellbeing', 'Education and research', 'Design and communication', 'Environment and community'],
    activities: 'What kind of work sounds satisfying? (choose any)',
    activityOptions: ['Building or making things', 'Solving puzzles with data', 'Helping people directly', 'Creating ideas or content', 'Planning and organizing', 'Explaining and collaborating'],
    goal: 'What would you like help with first?',
    goalOptions: ['Choosing a study direction', 'Finding a first project or internship', 'Building confidence and skills', 'Exploring a business idea', 'I am still figuring it out'],
    matchesTitle: 'Professions and experiences',
    matchesIntro: 'Optional, but it sharpens the results a lot. Add professions that attract you, things you have already tried, and mark what you did not enjoy.',
    occLabel: 'Professions that attract you (or that you want to rule out)',
    occPlaceholder: 'Search a profession…',
    expLabel: 'Experiences you have had',
    expPlaceholder: 'Search: internship, club, project, job…',
    suggested: 'Suggested from your answers',
    examples: 'Examples',
    addCustom: 'Add “{q}” as your own',
    stanceOcc: ['Attracts me', 'Unsure', 'Not for me'],
    stanceExp: ['Enjoyed it', 'Mixed', 'Did not enjoy'],
    duration: ['Weeks', '1–6 months', '6–12 months', '1 year or more'],
    durationLabel: 'How long',
    remove: 'Remove',
    expKinds: { job: 'Job', internship: 'Internship', volunteer: 'Volunteering', project: 'Project', club: 'Club', competition: 'Competition', training: 'Training', hobby: 'Hobby' },
    catalogTitle: 'Profession database (advanced)',
    catalogText: 'The built-in list can be extended with a very large JSON file or an API. Imported databases are stored in this browser only (IndexedDB). Your answers are never stored.',
    catalogCount: '{o} professions and {e} experiences loaded.',
    importAs: 'Import as',
    kindOptions: ['Professions', 'Experiences'],
    importFile: 'Import a JSON file',
    urlPlaceholder: 'https://example.org/professions.json',
    loadUrl: 'Load from URL',
    clearCache: 'Remove stored databases',
    stored: 'Stored in this browser',
    imported: '{n} entries added.',
    working: 'Working…',
    analyzing: 'Analyzing…',
    submit: 'Show me possible paths',
    required: 'Choose your current study stage to continue.',
    resultTitle: 'Paths to explore',
    resultIntro: 'Treat these as starting points for exploration, not a fixed assessment of who you are.',
    clarity: 'How much your answers tell us',
    signals: 'Strongest signals in your answers',
    diffuse: 'Your signals point in several directions. That is normal at this stage; compare the paths below and try the wildcard.',
    why: 'Why this may fit',
    next: 'Try this next',
    professionsFor: 'Professions to look at',
    fit: 'Fit signal',
    because: 'Because',
    gaps: 'Skills to build',
    similarTo: 'Similar to',
    tryExp: 'Experiences to try',
    builds: 'builds',
    wildcard: 'Wildcard: a path you did not point to',
    wildcardWhy: 'It matches strengths in your profile but sits outside your top areas.',
    nextSteps: ['Talk to one person who does this work and ask what a normal week is like.', 'Choose one small project or exercise you can finish in two weeks.', 'Notice which parts give you energy and which skills you want to strengthen.'],
    fallback: 'We do not have enough yet to suggest paths. Add a few interests, pick some areas or professions, then try again. A short project or a conversation with someone in a field you admire also works as a first step.',
    promptTitle: 'Take your profile to an AI assistant',
    promptNotice: 'Your profile prompt is shown below. It is not sent anywhere by this page. Copy it, then paste it into the assistant you choose.',
    copy: 'Copy prompt',
    copied: 'Copied',
    copyError: 'Select and copy the prompt below.',
    chatgpt: 'Open ChatGPT',
    claude: 'Open Claude',
    aiNote: 'Your answers are shared with an AI provider only if you paste and send the prompt there. Do not include private or sensitive information.',
    promptRequest: 'Help me explore possible education and career directions. Use the profile below to suggest three realistic paths, explain what connects each path to my interests and strengths, and give me one small low-cost experiment for each. The "preliminary matches" come from a simple local algorithm: challenge them, do not just accept them. Ask clarifying questions where information is missing. Do not treat this as a diagnosis or promise of employment.',
    profile: 'My profile',
    stageLabel: 'Study stage',
    institutionLabel: 'School or location',
    fieldLabel: 'Study area',
    subjectsLabel: 'Enjoyed subjects',
    hobbiesLabel: 'Hobbies and interests',
    strengthsLabel: 'Strengths',
    themesLabel: 'Areas of curiosity',
    activitiesLabel: 'Preferred activities',
    goalLabel: 'First goal',
    occLikedLabel: 'Professions that attract me',
    occRejectedLabel: 'Professions I want to rule out',
    expLikedLabel: 'Experiences I enjoyed',
    expRejectedLabel: 'Experiences I did not enjoy',
    localLabel: 'Preliminary matches',
    contactTitle: 'Would you like a person to follow up?',
    contactText: 'Optional. If you opt in, your browser opens a WhatsApp draft to Numerimondes with your contact details and selected paths. Review it before sending. This site does not store your answers.',
    name: 'Name (optional)',
    contact: 'Email or WhatsApp number (optional)',
    consent: 'I agree to share these contact details with Numerimondes so someone can follow up about student orientation.',
    contactButton: 'Review WhatsApp message',
    contactRequired: 'Add a name and contact method, then select the consent box to continue.',
    noContact: 'Your contact details are not included in the AI prompt.',
    reset: 'Start again',
    paths: {
      technology: { title: 'Technology and engineering', why: 'You show interest in making, systems, problem-solving or technical subjects.', action: 'Build a simple app, repair something, or follow a beginner project in a tool you are curious about.' },
      business: { title: 'Business and entrepreneurship', why: 'Your answers point toward initiative, organizing, solving practical needs or understanding how ideas become useful services.', action: 'Interview three people about a problem they have, then sketch one small service or product that could help.' },
      health: { title: 'Health and wellbeing', why: 'You are drawn to wellbeing, science, care or helping people directly.', action: 'Explore a health-related topic with a qualified source and speak with a professional about their daily work and training.' },
      education: { title: 'Education and research', why: 'You enjoy learning, explaining ideas, asking questions or helping others understand.', action: 'Teach one topic to a friend, make a short guide, or try a small research question and summarize what you learn.' },
      creative: { title: 'Design and communication', why: 'Your interests suggest creativity, communication, storytelling or making information easier to use.', action: 'Create a poster, short video, portfolio piece or clear explanation for a topic you care about.' },
      community: { title: 'Environment and community', why: 'You care about people, places, practical improvement or solving shared problems.', action: 'Find one local organization or community project and ask how you could contribute a small, useful task.' },
    },
  },
  fr: {
    title: 'Trouve une voie à explorer',
    intro: 'Un outil de réflexion pour les étudiants et jeunes diplômés. Tes réponses restent dans cette page sauf si tu choisis de les copier ou de les envoyer.',
    language: 'Langue',
    about: 'À propos de toi',
    stage: 'Où en es-tu dans tes études ?',
    stagePlaceholder: 'Choisis une option',
    stages: ['Lycée', 'Université ou école', 'Formation professionnelle', 'Jeune diplômé·e', 'Autre ou en pause'],
    institution: 'Où étudies-tu ? (facultatif)',
    institutionPlaceholder: 'École, université, centre de formation ou ville',
    field: 'Qu’étudies-tu ou qu’apprends-tu ?',
    fieldPlaceholder: 'Matière, programme ou sujet actuel',
    subjects: 'Quelles matières ou quels sujets aimes-tu ?',
    subjectsPlaceholder: 'Par exemple : biologie, maths, écriture, histoire, programmation',
    hobbies: 'Qu’aimes-tu faire en dehors des cours ?',
    hobbiesPlaceholder: 'Loisirs, centres d’intérêt ou activités que tu explores par plaisir',
    strengths: 'Pour quoi les autres comptent-ils souvent sur toi ?',
    strengthsPlaceholder: 'Par exemple : expliquer, réparer, organiser, écouter, repérer les détails. Tu peux aussi dire ce que tu n’aimes pas : « je n’aime pas la vente ».',
    themes: 'Quels domaines t’intriguent ? (plusieurs choix possibles)',
    themeOptions: ['Technologie et ingénierie', 'Entreprise et entrepreneuriat', 'Santé et bien-être', 'Éducation et recherche', 'Design et communication', 'Environnement et communauté'],
    activities: 'Quel type d’activité te plairait ? (plusieurs choix possibles)',
    activityOptions: ['Construire ou fabriquer', 'Résoudre des problèmes avec des données', 'Aider directement des personnes', 'Créer des idées ou du contenu', 'Planifier et organiser', 'Expliquer et collaborer'],
    goal: 'Par quoi veux-tu commencer ?',
    goalOptions: ['Choisir une orientation d’études', 'Trouver un premier projet ou stage', 'Développer ma confiance et mes compétences', 'Explorer une idée d’entreprise', 'Je cherche encore'],
    matchesTitle: 'Métiers et expériences',
    matchesIntro: 'Facultatif, mais cela affine beaucoup les résultats. Ajoute des métiers qui t’attirent, ce que tu as déjà essayé, et indique ce que tu n’as pas aimé.',
    occLabel: 'Métiers qui t’attirent (ou que tu veux écarter)',
    occPlaceholder: 'Rechercher un métier…',
    expLabel: 'Expériences que tu as vécues',
    expPlaceholder: 'Rechercher : stage, club, projet, job…',
    suggested: 'Suggestions d’après tes réponses',
    examples: 'Exemples',
    addCustom: 'Ajouter « {q} » à ma façon',
    stanceOcc: ['Ça m’attire', 'Je ne sais pas', 'Pas pour moi'],
    stanceExp: ['J’ai aimé', 'Mitigé', 'Je n’ai pas aimé'],
    duration: ['Quelques semaines', '1 à 6 mois', '6 à 12 mois', '1 an ou plus'],
    durationLabel: 'Durée',
    remove: 'Retirer',
    expKinds: { job: 'Job', internship: 'Stage', volunteer: 'Bénévolat', project: 'Projet', club: 'Club', competition: 'Concours', training: 'Formation', hobby: 'Loisir' },
    catalogTitle: 'Base de métiers (avancé)',
    catalogText: 'La liste intégrée peut être étendue avec un très gros fichier JSON ou une API. Les bases importées sont conservées uniquement dans ce navigateur (IndexedDB). Tes réponses ne sont jamais stockées.',
    catalogCount: '{o} métiers et {e} expériences chargés.',
    importAs: 'Importer comme',
    kindOptions: ['Métiers', 'Expériences'],
    importFile: 'Importer un fichier JSON',
    urlPlaceholder: 'https://exemple.org/metiers.json',
    loadUrl: 'Charger depuis une URL',
    clearCache: 'Supprimer les bases stockées',
    stored: 'Stocké dans ce navigateur',
    imported: '{n} entrées ajoutées.',
    working: 'Traitement…',
    analyzing: 'Analyse…',
    submit: 'Afficher des pistes',
    required: 'Choisis ton étape d’études pour continuer.',
    resultTitle: 'Des pistes à explorer',
    resultIntro: 'Prends ces suggestions comme des points de départ, pas comme une évaluation définitive.',
    clarity: 'Ce que tes réponses nous apprennent',
    signals: 'Signaux les plus forts dans tes réponses',
    diffuse: 'Tes signaux vont dans plusieurs directions. C’est normal à ce stade : compare les pistes ci-dessous et regarde la piste surprise.',
    why: 'Pourquoi cette piste peut te correspondre',
    next: 'À essayer ensuite',
    professionsFor: 'Métiers à regarder',
    fit: 'Signal de correspondance',
    because: 'Parce que',
    gaps: 'Compétences à développer',
    similarTo: 'Proche de',
    tryExp: 'Expériences à tenter',
    builds: 'développe',
    wildcard: 'Piste surprise : une voie que tu n’avais pas indiquée',
    wildcardWhy: 'Elle correspond à des forces de ton profil mais sort de tes domaines principaux.',
    nextSteps: ['Parle à une personne qui fait ce métier et demande-lui à quoi ressemble une semaine normale.', 'Choisis un petit projet ou exercice réalisable en deux semaines.', 'Observe ce qui te donne de l’énergie et les compétences que tu veux renforcer.'],
    fallback: 'Nous n’avons pas encore assez d’éléments pour proposer des pistes. Ajoute quelques centres d’intérêt, choisis des domaines ou des métiers, puis réessaie. Un petit projet ou un échange avec une personne d’un domaine qui t’attire est aussi un bon premier pas.',
    promptTitle: 'Poursuis avec un assistant IA',
    promptNotice: 'Ton profil est affiché ci-dessous. Cette page ne l’envoie nulle part. Copie-le puis colle-le dans l’assistant de ton choix.',
    copy: 'Copier le prompt',
    copied: 'Copié',
    copyError: 'Sélectionne et copie le prompt ci-dessous.',
    chatgpt: 'Ouvrir ChatGPT',
    claude: 'Ouvrir Claude',
    aiNote: 'Tes réponses ne sont partagées avec un fournisseur d’IA que si tu colles et envoies le prompt. N’inclus pas d’information privée ou sensible.',
    promptRequest: 'Aide-moi à explorer des pistes d’études et de carrière. À partir de mon profil, propose trois pistes réalistes, explique le lien entre chacune et mes intérêts/forces, puis donne une petite expérience peu coûteuse à essayer pour chaque piste. Les « premières correspondances » viennent d’un algorithme local simple : challenge-les, ne les accepte pas telles quelles. Pose des questions si des informations manquent. Ne présente pas cela comme un diagnostic ni comme une promesse d’emploi.',
    profile: 'Mon profil',
    stageLabel: 'Étape d’études',
    institutionLabel: 'École ou lieu',
    fieldLabel: 'Domaine étudié',
    subjectsLabel: 'Matières appréciées',
    hobbiesLabel: 'Loisirs et centres d’intérêt',
    strengthsLabel: 'Forces',
    themesLabel: 'Domaines de curiosité',
    activitiesLabel: 'Activités préférées',
    goalLabel: 'Premier objectif',
    occLikedLabel: 'Métiers qui m’attirent',
    occRejectedLabel: 'Métiers que je veux écarter',
    expLikedLabel: 'Expériences que j’ai aimées',
    expRejectedLabel: 'Expériences que je n’ai pas aimées',
    localLabel: 'Premières correspondances',
    contactTitle: 'Souhaites-tu qu’une personne te recontacte ?',
    contactText: 'Facultatif. Si tu donnes ton accord, ton navigateur ouvrira un brouillon WhatsApp pour Numerimondes avec tes coordonnées et les pistes choisies. Vérifie-le avant envoi. Ce site ne stocke pas tes réponses.',
    name: 'Nom (facultatif)',
    contact: 'E-mail ou numéro WhatsApp (facultatif)',
    consent: 'J’accepte de partager ces coordonnées avec Numerimondes pour être recontacté·e au sujet de l’orientation étudiante.',
    contactButton: 'Vérifier le message WhatsApp',
    contactRequired: 'Ajoute ton nom et un moyen de contact, puis coche la case de consentement.',
    noContact: 'Tes coordonnées ne sont pas incluses dans le prompt IA.',
    reset: 'Recommencer',
    paths: {
      technology: { title: 'Technologie et ingénierie', why: 'Tu sembles attiré·e par la création, les systèmes, la résolution de problèmes ou les matières techniques.', action: 'Crée une petite application, répare un objet ou suis un projet débutant avec un outil qui t’intrigue.' },
      business: { title: 'Entreprise et entrepreneuriat', why: 'Tes réponses évoquent l’initiative, l’organisation, les besoins concrets ou la transformation d’idées en services utiles.', action: 'Interroge trois personnes sur un problème qu’elles rencontrent, puis imagine un petit service ou produit qui pourrait aider.' },
      health: { title: 'Santé et bien-être', why: 'Tu t’intéresses au bien-être, aux sciences, au soin ou à l’aide directe aux personnes.', action: 'Explore un sujet de santé avec une source qualifiée et échange avec un professionnel sur son quotidien et sa formation.' },
      education: { title: 'Éducation et recherche', why: 'Tu aimes apprendre, expliquer, poser des questions ou aider les autres à comprendre.', action: 'Explique un sujet à un ami, rédige un petit guide ou mène une question de recherche simple.' },
      creative: { title: 'Design et communication', why: 'Tes intérêts suggèrent de la créativité, de la communication, du récit ou la mise en forme d’informations utiles.', action: 'Crée une affiche, une courte vidéo, un élément de portfolio ou une explication claire sur un sujet qui te tient à cœur.' },
      community: { title: 'Environnement et communauté', why: 'Tu tiens aux personnes, aux lieux, aux améliorations concrètes ou à la résolution de problèmes communs.', action: 'Repère une organisation ou un projet local et propose ton aide sur une petite tâche utile.' },
    },
  },
} as const

const labels = computed(() => text[language.value])
const lang = computed(() => (language.value === 'fr' ? 1 : 0))
const skillLabel = (id: string) => SKILLS[id]?.[lang.value] ?? id
function featLabel(f: string): string {
  const k = f.slice(2)
  if (f[0] === 'r') return RIASEC_LABEL[k]?.[lang.value] ?? k
  if (f[0] === 's') return skillLabel(k)
  if (f[0] === 'p') return labels.value.paths[k as PathwayId]?.title ?? k
  return k
}
function pickTitle(kind: Kind, id: string): string {
  const e = catalogs[kind].byId.get(id)
  return e ? titleOf(e, language.value) : id
}
function hitTitle(kind: Kind, hit: Hit) { return pickTitle(kind, hit.id) }
function hitSub(kind: Kind, hit: Hit): string {
  const e = catalogs[kind].byId.get(hit.id)
  if (!e) return ''
  return kind === 'experience' ? labels.value.expKinds[e.expKind ?? 'project'] : e.primary ? labels.value.paths[e.primary].title : ''
}
function stanceLabel(kind: Kind, stance: number) {
  const arr = kind === 'occupation' ? labels.value.stanceOcc : labels.value.stanceExp
  return arr[stance === 1 ? 0 : stance === 0 ? 1 : 2]
}
function describeRef(ref: Ref): string {
  const l = labels.value
  const fields: Record<string, string> = { field: l.fieldLabel, subjects: l.subjectsLabel, hobbies: l.hobbiesLabel, strengths: l.strengthsLabel }
  switch (ref.type) {
    case 'theme': return l.themeOptions[ref.idx ?? 0]
    case 'activity': return l.activityOptions[ref.idx ?? 0]
    case 'text': return `${fields[ref.field ?? ''] ?? ''}: “${ref.phrase}”`
    case 'occupation': return pickTitle('occupation', ref.id ?? '')
    case 'experience': return pickTitle('experience', ref.id ?? '')
    default: return l.goalLabel
  }
}

/* ───────── results view (language-agnostic analysis → localized strings) ───────── */
const view = computed(() => {
  void catalogVersion.value
  const r = result.value
  if (!r) return null
  const occView = (rec: Rec) => {
    if (!catalogs.occupation.byId.has(rec.id)) return null
    return {
      id: rec.id, title: pickTitle('occupation', rec.id), fit: rec.fit,
      reasons: rec.reasons.map((x) => `${featLabel(x.feature)} ← ${describeRef(x.ref)}`),
      gaps: rec.gaps.map(skillLabel), similar: rec.similarTo ? pickTitle('occupation', rec.similarTo) : '',
    }
  }
  type OccView = NonNullable<ReturnType<typeof occView>>
  const paths = r.paths.map((p) => ({
    id: p.id, ...labels.value.paths[p.id],
    occupations: p.occupations.map(occView).filter((x): x is OccView => !!x),
    experiences: p.experiences.map((x) => ({ id: x.id, title: pickTitle('experience', x.id), builds: x.builds.map(skillLabel) })),
  }))
  const wc = r.wildcard ? occView(r.wildcard) : null
  return {
    paths, clarity: Math.round(r.clarity * 100), diffuse: r.diffuse, signals: r.signals.map(featLabel),
    wildcard: wc ? { ...wc, pathway: labels.value.paths[r.wildcard!.pathway].title } : null,
  }
})

const stageValue = computed(() => (stage.value ? labels.value.stages[Number(stage.value)] ?? stage.value : ''))
const prompt = computed(() => {
  void catalogVersion.value
  const l = labels.value
  const names = (kind: Kind, stance: number) => picks[kind].filter((p) => p.stance === stance).map((p) => pickTitle(kind, p.id)).join(', ')
  const local = view.value?.paths.map((p) => `${p.title}${p.occupations.length ? ` (${p.occupations.map((o) => o.title).join(', ')})` : ''}`).join('; ') ?? ''
  const entries: [string, string][] = [
    [l.stageLabel, stageValue.value], [l.institutionLabel, institution.value.trim()],
    [l.fieldLabel, studyField.value.trim()], [l.subjectsLabel, favoriteSubjects.value.trim()],
    [l.hobbiesLabel, hobbies.value.trim()], [l.strengthsLabel, strengths.value.trim()],
    [l.themesLabel, selectedThemes.value.map((i) => l.themeOptions[Number(i)]).join(', ')],
    [l.activitiesLabel, preferredActivities.value.map((i) => l.activityOptions[Number(i)]).join(', ')],
    [l.occLikedLabel, names('occupation', 1)], [l.occRejectedLabel, names('occupation', -1)],
    [l.expLikedLabel, names('experience', 1)], [l.expRejectedLabel, names('experience', -1)],
    [l.goalLabel, goal.value ? l.goalOptions[Number(goal.value)] : ''], [l.localLabel, local],
  ].filter(([, v]) => v) as [string, string][]
  return `${l.promptRequest}\n\n${l.profile}:\n${entries.map(([k, v]) => `- ${k}: ${v}`).join('\n')}`
})

const whatsappUrl = computed(() => {
  const chosen = view.value?.paths.map((p) => p.title).join(', ') ?? ''
  const message = language.value === 'fr'
    ? `Bonjour Numerimondes, je souhaite être recontacté·e au sujet de l’orientation étudiante.\nNom : ${contactName.value.trim()}\nContact : ${contact.value.trim()}\nPistes explorées : ${chosen}`
    : `Hello Numerimondes, I would like to be contacted about student orientation.\nName: ${contactName.value.trim()}\nContact: ${contact.value.trim()}\nPaths explored: ${chosen}`
  return `https://wa.me/212620990692?text=${encodeURIComponent(message)}`
})
const catalogCount = computed(() => {
  void catalogVersion.value
  return labels.value.catalogCount
    .replace('{o}', catalogs.occupation.items.length.toLocaleString(language.value))
    .replace('{e}', catalogs.experience.items.length.toLocaleString(language.value))
})

async function generate() {
  if (!stage.value) return
  generated.value = true
  copied.value = false
  analyzing.value = true
  await nextTick()
  await tick()
  result.value = analyze(inputs())
  analyzing.value = false
  emit('generated', result.value)
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(prompt.value)
    copied.value = true
    copyFailed.value = false
  } catch {
    promptArea.value?.focus()
    promptArea.value?.select()
    copyFailed.value = true
  }
}

function sendOrientationRequest() {
  if (!contactName.value.trim() || !contact.value.trim() || !contactConsent.value) return
  window.open(whatsappUrl.value, '_blank', 'noopener,noreferrer')
}

function reset() {
  stage.value = ''; institution.value = ''; studyField.value = ''; favoriteSubjects.value = ''
  hobbies.value = ''; strengths.value = ''; selectedThemes.value = []; preferredActivities.value = []
  goal.value = ''; generated.value = false; copied.value = false; contactName.value = ''; contact.value = ''; contactConsent.value = false
  copyFailed.value = false; result.value = null
  for (const k of KINDS) { picks[k] = []; ui[k].query = ''; ui[k].open = false }
}

onMounted(() => { void boot() })
onBeforeUnmount(() => { for (const k of KINDS) { window.clearTimeout(timers[k]); aborts[k]?.abort() } })

defineExpose({
  /** Add records at runtime (array of strings or objects). Set persist to keep them in this browser. */
  addRecords: (kind: Kind, raws: unknown[], opts: { sourceId?: string; label?: string; persist?: boolean } = {}) =>
    ingest(kind, raws, opts.sourceId ?? `api:${kind}`, opts.label ?? 'API', { persist: opts.persist }),
  registerSource: (src: CatalogSource) => loadSource(src),
  clearCache,
})
</script>

<template>
  <section class="nm-student-orientation" :lang="language">
    <header class="nm-student-orientation__header">
      <label class="nm-student-orientation__language">
        <span>{{ labels.language }}</span>
        <select v-model="language" :aria-label="labels.language">
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </label>
      <h2>{{ labels.title }}</h2>
      <p>{{ labels.intro }}</p>
    </header>

    <form class="nm-student-orientation__form" @submit.prevent="generate">
      <h3>{{ labels.about }}</h3>
      <label class="nm-student-orientation__field">
        <span>{{ labels.stage }} <b aria-hidden="true">*</b></span>
        <select v-model="stage" required>
          <option value="" disabled>{{ labels.stagePlaceholder }}</option>
          <option v-for="(option, index) in labels.stages" :key="option" :value="String(index)">{{ option }}</option>
        </select>
      </label>
      <label class="nm-student-orientation__field">
        <span>{{ labels.institution }}</span>
        <input v-model="institution" maxlength="160" :placeholder="labels.institutionPlaceholder" />
      </label>
      <label class="nm-student-orientation__field">
        <span>{{ labels.field }}</span>
        <input v-model="studyField" maxlength="240" :placeholder="labels.fieldPlaceholder" />
      </label>
      <label class="nm-student-orientation__field">
        <span>{{ labels.subjects }}</span>
        <textarea v-model="favoriteSubjects" rows="2" maxlength="500" :placeholder="labels.subjectsPlaceholder" />
      </label>
      <label class="nm-student-orientation__field">
        <span>{{ labels.hobbies }}</span>
        <textarea v-model="hobbies" rows="2" maxlength="500" :placeholder="labels.hobbiesPlaceholder" />
      </label>
      <label class="nm-student-orientation__field">
        <span>{{ labels.strengths }}</span>
        <textarea v-model="strengths" rows="2" maxlength="500" :placeholder="labels.strengthsPlaceholder" />
      </label>

      <fieldset class="nm-student-orientation__choices">
        <legend>{{ labels.themes }}</legend>
        <label v-for="(option, index) in labels.themeOptions" :key="option">
          <input v-model="selectedThemes" type="checkbox" :value="String(index)" />
          <span>{{ option }}</span>
        </label>
      </fieldset>
      <fieldset class="nm-student-orientation__choices">
        <legend>{{ labels.activities }}</legend>
        <label v-for="(option, index) in labels.activityOptions" :key="option">
          <input v-model="preferredActivities" type="checkbox" :value="String(index)" />
          <span>{{ option }}</span>
        </label>
      </fieldset>

      <h3 class="nm-student-orientation__subhead">{{ labels.matchesTitle }}</h3>
      <p class="nm-student-orientation__lead">{{ labels.matchesIntro }}</p>

      <div v-for="kind in KINDS" :key="kind" class="nm-student-orientation__picker">
        <span :id="`nmo-${kind}-label`" class="nm-student-orientation__picker-label">{{ kind === 'occupation' ? labels.occLabel : labels.expLabel }}</span>
        <ul v-if="picks[kind].length" class="nm-student-orientation__chips">
          <li v-for="(pick, i) in picks[kind]" :key="pick.id" class="nm-student-orientation__chip" :data-stance="pick.stance">
            <span class="nm-student-orientation__chip-title">{{ pickTitle(kind, pick.id) }}</span>
            <button type="button" class="nm-student-orientation__chip-button" :aria-label="`${pickTitle(kind, pick.id)}: ${stanceLabel(kind, pick.stance)}`" @click="cycle(kind, i)">
              <span aria-hidden="true">{{ GLYPH[String(pick.stance)] }}</span> {{ stanceLabel(kind, pick.stance) }}
            </button>
            <select v-if="kind === 'experience'" v-model.number="pick.months" class="nm-student-orientation__chip-select" :aria-label="`${pickTitle(kind, pick.id)}: ${labels.durationLabel}`">
              <option v-for="(d, di) in labels.duration" :key="d" :value="DURATIONS[di]">{{ d }}</option>
            </select>
            <button type="button" class="nm-student-orientation__chip-button" :aria-label="`${labels.remove}: ${pickTitle(kind, pick.id)}`" @click="picks[kind].splice(i, 1)">×</button>
          </li>
        </ul>
        <div class="nm-student-orientation__combo">
          <input
            v-model="ui[kind].query" type="text" role="combobox" autocomplete="off" aria-autocomplete="list"
            :placeholder="kind === 'occupation' ? labels.occPlaceholder : labels.expPlaceholder"
            :aria-labelledby="`nmo-${kind}-label`" :aria-expanded="ui[kind].open && ui[kind].hits.length > 0"
            :aria-controls="`nmo-${kind}-list`" :aria-activedescendant="ui[kind].active >= 0 ? `nmo-${kind}-opt-${ui[kind].active}` : undefined"
            :aria-busy="ui[kind].loading"
            @input="onInput(kind)" @focus="onFocus(kind)" @blur="ui[kind].open = false" @keydown="onKey(kind, $event)"
          />
          <ul v-if="ui[kind].open && ui[kind].hits.length" :id="`nmo-${kind}-list`" role="listbox" class="nm-student-orientation__options" :aria-labelledby="`nmo-${kind}-label`">
            <li v-for="(hit, i) in ui[kind].hits" :id="`nmo-${kind}-opt-${i}`" :key="hit.id || hit.custom" role="option"
              :aria-selected="i === ui[kind].active" :class="{ 'is-active': i === ui[kind].active, 'is-custom': !!hit.custom }"
              @mousedown.prevent="choose(kind, hit)" @mousemove="ui[kind].active = i">
              <template v-if="hit.custom">{{ labels.addCustom.replace('{q}', hit.custom) }}</template>
              <template v-else>
                <span>{{ hitTitle(kind, hit) }}</span>
                <small>{{ hitSub(kind, hit) }}</small>
              </template>
            </li>
            <li class="nm-student-orientation__options-note" role="presentation">{{ ui[kind].suggested ? labels.suggested : '' }}</li>
          </ul>
        </div>
      </div>

      <details class="nm-student-orientation__catalog">
        <summary>{{ labels.catalogTitle }}</summary>
        <p>{{ labels.catalogText }}</p>
        <p class="nm-student-orientation__note" role="status">{{ catalogCount }}</p>
        <div class="nm-student-orientation__row">
          <label class="nm-student-orientation__inline">
            <span>{{ labels.importAs }}</span>
            <select v-model="importKind">
              <option v-for="(k, i) in KINDS" :key="k" :value="k">{{ labels.kindOptions[i] }}</option>
            </select>
          </label>
          <label class="nm-student-orientation__inline">
            <span>{{ labels.importFile }}</span>
            <input type="file" accept=".json,application/json" :disabled="status.busy" @change="onFile" />
          </label>
        </div>
        <div class="nm-student-orientation__row">
          <input v-model="urlInput" type="url" :placeholder="labels.urlPlaceholder" :aria-label="labels.loadUrl" />
          <button type="button" class="nm-student-orientation__button" :disabled="status.busy" @click="loadUrl">{{ labels.loadUrl }}</button>
        </div>
        <template v-if="stored.length">
          <p class="nm-student-orientation__note"><strong>{{ labels.stored }}</strong></p>
          <ul class="nm-student-orientation__stored">
            <li v-for="s in stored" :key="s.id">{{ s.label }} · {{ labels.kindOptions[s.kind === 'occupation' ? 0 : 1] }} · {{ s.count.toLocaleString(language) }}</li>
          </ul>
          <button type="button" class="nm-student-orientation__button" @click="clearCache">{{ labels.clearCache }}</button>
        </template>
        <p v-if="status.message" class="nm-student-orientation__note" role="status">{{ status.message }}</p>
        <p v-if="status.error" class="nm-student-orientation__error" role="alert">{{ status.error }}</p>
      </details>

      <label class="nm-student-orientation__field">
        <span>{{ labels.goal }}</span>
        <select v-model="goal">
          <option value="">—</option>
          <option v-for="(option, index) in labels.goalOptions" :key="option" :value="String(index)">{{ option }}</option>
        </select>
      </label>
      <p v-if="!stage && generated" class="nm-student-orientation__error" role="alert">{{ labels.required }}</p>
      <button class="nm-student-orientation__button nm-student-orientation__button--primary" type="submit" :disabled="analyzing">{{ analyzing ? labels.analyzing : labels.submit }}</button>
    </form>

    <div v-if="generated && view" class="nm-student-orientation__results" aria-live="polite">
      <div class="nm-student-orientation__section-heading">
        <div><h3>{{ labels.resultTitle }}</h3><p>{{ labels.resultIntro }}</p></div>
        <button class="nm-student-orientation__text-button" type="button" @click="reset">{{ labels.reset }}</button>
      </div>

      <p v-if="view.paths.length === 0" class="nm-student-orientation__fallback">{{ labels.fallback }}</p>
      <template v-else>
        <div class="nm-student-orientation__meter-row">
          <span>{{ labels.clarity }}</span>
          <span class="nm-student-orientation__fit" role="img" :aria-label="`${labels.clarity}: ${view.clarity}%`"><i :style="{ width: view.clarity + '%' }" /></span>
        </div>
        <p v-if="view.signals.length" class="nm-student-orientation__note"><strong>{{ labels.signals }}:</strong> {{ view.signals.join(', ') }}</p>
        <p v-if="view.diffuse" class="nm-student-orientation__note">{{ labels.diffuse }}</p>

        <div class="nm-student-orientation__pathways">
          <article v-for="(path, index) in view.paths" :key="path.id" class="nm-student-orientation__path">
            <span class="nm-student-orientation__path-index">{{ index + 1 }}</span>
            <h4>{{ path.title }}</h4>
            <p><strong>{{ labels.why }}:</strong> {{ path.why }}</p>
            <template v-if="path.occupations.length">
              <h5>{{ labels.professionsFor }}</h5>
              <ul class="nm-student-orientation__occs">
                <li v-for="o in path.occupations" :key="o.id">
                  <div class="nm-student-orientation__occ-head">
                    <strong>{{ o.title }}</strong>
                    <span class="nm-student-orientation__fit" role="img" :aria-label="`${labels.fit}: ${o.fit}%`"><i :style="{ width: o.fit + '%' }" /></span>
                  </div>
                  <p v-if="o.reasons.length">{{ labels.because }}: {{ o.reasons.join(' · ') }}</p>
                  <p v-if="o.similar">{{ labels.similarTo }}: {{ o.similar }}</p>
                  <p v-if="o.gaps.length">{{ labels.gaps }}: {{ o.gaps.join(', ') }}</p>
                </li>
              </ul>
            </template>
            <p><strong>{{ labels.next }}:</strong> {{ path.action }}</p>
            <template v-if="path.experiences.length">
              <h5>{{ labels.tryExp }}</h5>
              <ul class="nm-student-orientation__occs">
                <li v-for="x in path.experiences" :key="x.id">
                  <strong>{{ x.title }}</strong>
                  <p v-if="x.builds.length">{{ labels.builds }}: {{ x.builds.join(', ') }}</p>
                </li>
              </ul>
            </template>
          </article>
        </div>

        <article v-if="view.wildcard" class="nm-student-orientation__path nm-student-orientation__path--wild">
          <h4>{{ labels.wildcard }}</h4>
          <p><strong>{{ view.wildcard.title }}</strong> ({{ view.wildcard.pathway }}). {{ labels.wildcardWhy }}</p>
          <p v-if="view.wildcard.reasons.length">{{ labels.because }}: {{ view.wildcard.reasons.join(' · ') }}</p>
        </article>

        <ul class="nm-student-orientation__steps">
          <li v-for="step in labels.nextSteps" :key="step">{{ step }}</li>
        </ul>
      </template>

      <section class="nm-student-orientation__ai">
        <h3>{{ labels.promptTitle }}</h3>
        <p>{{ labels.promptNotice }}</p>
        <textarea ref="promptArea" :value="prompt" readonly rows="9" aria-label="Generated AI prompt" />
        <div class="nm-student-orientation__actions">
          <button class="nm-student-orientation__button nm-student-orientation__button--primary" type="button" @click="copyPrompt">{{ copied ? labels.copied : labels.copy }}</button>
          <a class="nm-student-orientation__button" href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">{{ labels.chatgpt }}</a>
          <a class="nm-student-orientation__button" href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">{{ labels.claude }}</a>
        </div>
        <p v-if="copyFailed" class="nm-student-orientation__note" role="status">{{ labels.copyError }}</p>
        <p class="nm-student-orientation__note">{{ labels.aiNote }}</p>
      </section>

      <section class="nm-student-orientation__contact">
        <h3>{{ labels.contactTitle }}</h3>
        <p>{{ labels.contactText }}</p>
        <label class="nm-student-orientation__field"><span>{{ labels.name }}</span><input v-model="contactName" maxlength="120" autocomplete="name" /></label>
        <label class="nm-student-orientation__field"><span>{{ labels.contact }}</span><input v-model="contact" maxlength="254" autocomplete="email" /></label>
        <label class="nm-student-orientation__consent"><input v-model="contactConsent" type="checkbox" /><span>{{ labels.consent }}</span></label>
        <button class="nm-student-orientation__button" type="button" @click="sendOrientationRequest">{{ labels.contactButton }}</button>
        <p class="nm-student-orientation__note">{{ labels.noContact }}</p>
      </section>
    </div>
  </section>
</template>

<style scoped>
.nm-student-orientation { --nmo-border: var(--vp-c-divider); --nmo-surface: var(--vp-c-bg-soft); --nmo-text: var(--vp-c-text-1); --nmo-muted: var(--vp-c-text-2); max-width: 54rem; margin: 2rem auto; color: var(--nmo-text); }
.nm-student-orientation h2, .nm-student-orientation h3, .nm-student-orientation h4, .nm-student-orientation h5 { color: var(--nmo-text); }
.nm-student-orientation h2 { margin: 0 0 .5rem; font-size: clamp(1.7rem, 4vw, 2.4rem); line-height: 1.15; }
.nm-student-orientation h3 { margin: 0 0 1rem; font-size: 1.2rem; }
.nm-student-orientation h5 { margin: .9rem 0 .3rem; font-size: .85rem; font-weight: 650; }
.nm-student-orientation p { color: var(--nmo-muted); line-height: 1.65; }
.nm-student-orientation__header, .nm-student-orientation__form, .nm-student-orientation__results, .nm-student-orientation__ai, .nm-student-orientation__contact { margin-bottom: 1.25rem; padding: clamp(1rem, 3vw, 1.5rem); border: 1px solid var(--nmo-border); border-radius: var(--radius-lg); background: var(--vp-c-bg); }
.nm-student-orientation__header { position: relative; padding-top: 3.25rem; background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg)), var(--vp-c-bg) 70%); }
.nm-student-orientation__header > p { max-width: 43rem; margin: .5rem 0 0; }
.nm-student-orientation__language { position: absolute; top: 1rem; right: 1rem; display: flex; align-items: center; gap: .5rem; color: var(--nmo-muted); font-size: .85rem; }
.nm-student-orientation select, .nm-student-orientation input:not([type=checkbox]), .nm-student-orientation textarea { box-sizing: border-box; width: 100%; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); padding: .7rem .8rem; background: var(--vp-c-bg); color: var(--nmo-text); font: inherit; }
.nm-student-orientation__language select { width: auto; padding: .4rem .6rem; }
.nm-student-orientation textarea { resize: vertical; }
.nm-student-orientation :is(input, textarea, select, button, a, summary):focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.nm-student-orientation__form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.nm-student-orientation__form > h3, .nm-student-orientation__form > .nm-student-orientation__lead, .nm-student-orientation__choices, .nm-student-orientation__picker, .nm-student-orientation__catalog, .nm-student-orientation__error, .nm-student-orientation__form > button { grid-column: 1 / -1; }
.nm-student-orientation__form > h3 { margin: 0; }
.nm-student-orientation__form > .nm-student-orientation__subhead { margin-top: .5rem; }
.nm-student-orientation__lead { margin: -.5rem 0 0; }
.nm-student-orientation__field { display: grid; align-content: start; gap: .4rem; color: var(--nmo-text); font-size: .9rem; font-weight: 600; }
.nm-student-orientation__field span { line-height: 1.4; }
.nm-student-orientation__field b { color: var(--vp-c-danger-1); }
.nm-student-orientation__choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; margin: 0; padding: 1rem; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); }
.nm-student-orientation__choices legend { padding: 0 .35rem; color: var(--nmo-text); font-size: .9rem; font-weight: 650; }
.nm-student-orientation__choices label, .nm-student-orientation__consent { display: flex; align-items: flex-start; gap: .6rem; color: var(--nmo-muted); font-size: .9rem; line-height: 1.5; }
.nm-student-orientation__choices input, .nm-student-orientation__consent input { flex: 0 0 auto; margin-top: .2rem; accent-color: var(--vp-c-brand-1); }

.nm-student-orientation__picker { display: grid; gap: .5rem; }
.nm-student-orientation__picker-label { color: var(--nmo-text); font-size: .9rem; font-weight: 600; }
.nm-student-orientation__chips { display: flex; flex-wrap: wrap; gap: .4rem; margin: 0; padding: 0; list-style: none; }
.nm-student-orientation__chip { display: inline-flex; flex-wrap: wrap; align-items: center; gap: .35rem; padding: .25rem .35rem .25rem .7rem; border: 1px solid var(--nmo-border); border-radius: 999px; background: var(--nmo-surface); font-size: .85rem; }
.nm-student-orientation__chip[data-stance="1"] { border-color: var(--vp-c-brand-1); }
.nm-student-orientation__chip[data-stance="-1"] { border-color: var(--vp-c-danger-1); }
.nm-student-orientation__chip[data-stance="-1"] .nm-student-orientation__chip-title { text-decoration: line-through; text-decoration-thickness: 1px; }
.nm-student-orientation__chip-button { border: 0; border-radius: 999px; padding: .2rem .55rem; background: var(--vp-c-bg); color: var(--nmo-muted); font: inherit; font-size: .78rem; cursor: pointer; }
.nm-student-orientation__chip-button:hover { color: var(--nmo-text); }
.nm-student-orientation .nm-student-orientation__chip-select { width: auto; padding: .15rem .4rem; border-radius: 999px; font-size: .78rem; }
.nm-student-orientation__combo { position: relative; }
.nm-student-orientation__options { position: absolute; z-index: 20; inset: calc(100% + .25rem) 0 auto; max-height: 17rem; margin: 0; padding: .25rem; overflow: auto; list-style: none; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); background: var(--vp-c-bg); box-shadow: var(--vp-shadow-3); }
.nm-student-orientation__options li[role=option] { display: flex; justify-content: space-between; gap: 1rem; padding: .5rem .6rem; border-radius: var(--radius-md); cursor: pointer; font-size: .9rem; }
.nm-student-orientation__options li small { color: var(--nmo-muted); text-align: right; }
.nm-student-orientation__options li.is-active { background: var(--nmo-surface); }
.nm-student-orientation__options li.is-custom { color: var(--vp-c-brand-1); }
.nm-student-orientation__options-note { padding: .3rem .6rem; color: var(--nmo-muted); font-size: .75rem; }
.nm-student-orientation__options-note:empty { display: none; }

.nm-student-orientation__catalog { padding: .75rem 1rem; border: 1px dashed var(--nmo-border); border-radius: var(--radius-md); }
.nm-student-orientation__catalog summary { cursor: pointer; font-size: .9rem; font-weight: 650; }
.nm-student-orientation__catalog > p { margin: .6rem 0 0; font-size: .85rem; }
.nm-student-orientation__row { display: flex; flex-wrap: wrap; align-items: center; gap: .6rem; margin-top: .75rem; }
.nm-student-orientation__row > input[type=url] { flex: 1 1 14rem; width: auto; }
.nm-student-orientation__inline { display: flex; flex-wrap: wrap; align-items: center; gap: .5rem; color: var(--nmo-muted); font-size: .85rem; }
.nm-student-orientation__inline select, .nm-student-orientation__inline input { width: auto; }
.nm-student-orientation__stored { margin: .25rem 0 .6rem; padding-left: 1.1rem; color: var(--nmo-muted); font-size: .85rem; }

.nm-student-orientation__button { display: inline-flex; min-height: 2.7rem; align-items: center; justify-content: center; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); padding: .65rem 1rem; background: var(--vp-c-bg-soft); color: var(--nmo-text); font: inherit; font-weight: 650; text-align: center; text-decoration: none; cursor: pointer; }
.nm-student-orientation__button:hover { border-color: var(--vp-c-brand-1); }
.nm-student-orientation__button:disabled { opacity: .6; cursor: progress; }
.nm-student-orientation__button--primary { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: var(--vp-c-white); }
.nm-student-orientation__error { margin: 0; color: var(--vp-c-danger-1) !important; }
.nm-student-orientation__section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.nm-student-orientation__section-heading h3 { margin-bottom: .25rem; }
.nm-student-orientation__section-heading p { margin-top: .25rem; }
.nm-student-orientation__text-button { border: 0; padding: .4rem; background: none; color: var(--vp-c-brand-1); font: inherit; cursor: pointer; }
.nm-student-orientation__meter-row { display: flex; align-items: center; gap: .75rem; color: var(--nmo-muted); font-size: .85rem; }
.nm-student-orientation__meter-row .nm-student-orientation__fit { flex: 0 1 12rem; }
.nm-student-orientation__fit { display: block; flex: 0 0 5rem; height: .4rem; overflow: hidden; border-radius: 999px; background: var(--nmo-border); }
.nm-student-orientation__fit i { display: block; height: 100%; background: var(--vp-c-brand-1); }
.nm-student-orientation__pathways { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: .75rem; margin-top: 1rem; }
.nm-student-orientation__path { position: relative; padding: 1rem; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); background: var(--nmo-surface); }
.nm-student-orientation__path--wild { margin-top: .75rem; border-style: dashed; }
.nm-student-orientation__path h4 { margin: .35rem 0 .6rem; font-size: 1.05rem; }
.nm-student-orientation__path p { margin: .55rem 0 0; font-size: .9rem; }
.nm-student-orientation__path strong { color: var(--nmo-text); }
.nm-student-orientation__path-index { color: var(--vp-c-brand-1); font-size: .8rem; font-weight: 800; }
.nm-student-orientation__occs { display: grid; gap: .6rem; margin: 0; padding: 0; list-style: none; }
.nm-student-orientation__occs p { margin: .25rem 0 0; font-size: .8rem; line-height: 1.5; }
.nm-student-orientation__occ-head { display: flex; align-items: center; justify-content: space-between; gap: .75rem; }
.nm-student-orientation__steps { display: grid; gap: .45rem; margin: 1rem 0 0; padding-left: 1.25rem; color: var(--nmo-muted); line-height: 1.55; }
.nm-student-orientation__ai, .nm-student-orientation__contact { margin-top: 1.25rem; padding: 0; border: 0; background: transparent; }
.nm-student-orientation__ai > textarea { margin: .5rem 0; font-size: .85rem; }
.nm-student-orientation__actions { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .5rem; }
.nm-student-orientation__note { margin: .6rem 0 0; font-size: .82rem; }
.nm-student-orientation__contact { padding-top: 1rem; border-top: 1px solid var(--nmo-border); }
.nm-student-orientation__contact > .nm-student-orientation__field { max-width: 32rem; margin: .8rem 0; }
.nm-student-orientation__consent { margin: .8rem 0; }
@media (max-width: 640px) {
  .nm-student-orientation__form { grid-template-columns: 1fr; }
  .nm-student-orientation__form > h3, .nm-student-orientation__form > .nm-student-orientation__lead, .nm-student-orientation__choices, .nm-student-orientation__picker, .nm-student-orientation__catalog, .nm-student-orientation__error, .nm-student-orientation__form > button { grid-column: auto; }
  .nm-student-orientation__choices { grid-template-columns: 1fr; }
  .nm-student-orientation__section-heading { display: block; }
}
</style>
