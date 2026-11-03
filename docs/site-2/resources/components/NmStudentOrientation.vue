<script setup lang="ts">
import { computed, ref } from 'vue'

type Language = 'en' | 'fr'
type PathwayId = 'technology' | 'business' | 'health' | 'education' | 'creative' | 'community'

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
const copied = ref(false)
const copyFailed = ref(false)
const contactName = ref('')
const contact = ref('')
const contactConsent = ref(false)
const promptArea = ref<HTMLTextAreaElement | null>(null)

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
    strengthsPlaceholder: 'For example: explaining, fixing, organizing, listening, noticing details',
    themes: 'Which areas make you curious? (choose any)',
    themeOptions: ['Technology and engineering', 'Business and entrepreneurship', 'Health and wellbeing', 'Education and research', 'Design and communication', 'Environment and community'],
    activities: 'What kind of work sounds satisfying? (choose any)',
    activityOptions: ['Building or making things', 'Solving puzzles with data', 'Helping people directly', 'Creating ideas or content', 'Planning and organizing', 'Explaining and collaborating'],
    goal: 'What would you like help with first?',
    goalOptions: ['Choosing a study direction', 'Finding a first project or internship', 'Building confidence and skills', 'Exploring a business idea', 'I am still figuring it out'],
    submit: 'Show me possible paths',
    required: 'Choose your current study stage to continue.',
    resultTitle: 'Paths to explore',
    resultIntro: 'Treat these as starting points for exploration, not a fixed assessment of who you are.',
    why: 'Why this may fit',
    next: 'Try these next steps',
    nextSteps: ['Talk to one person who does this work and ask what a normal week is like.', 'Choose one small project or exercise you can finish in two weeks.', 'Notice which parts give you energy and which skills you want to strengthen.'],
    fallback: 'Your interests are still taking shape. Try a short project, a conversation with someone in a field you admire, or a free orientation session. Your next step can be an experiment.',
    promptTitle: 'Take your profile to an AI assistant',
    promptNotice: 'Your profile prompt is shown below. It is not sent anywhere by this page. Copy it, then paste it into the assistant you choose.',
    copy: 'Copy prompt',
    copied: 'Copied',
    copyError: 'Select and copy the prompt below.',
    chatgpt: 'Open ChatGPT',
    claude: 'Open Claude',
    aiNote: 'Your answers are shared with an AI provider only if you paste and send the prompt there. Do not include private or sensitive information.',
    promptRequest: 'Help me explore possible education and career directions. Use the profile below to suggest three realistic paths, explain what connects each path to my interests and strengths, and give me one small low-cost experiment for each. Ask clarifying questions where information is missing. Do not treat this as a diagnosis or promise of employment.',
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
    language: 'Langue', about: 'À propos de toi', stage: 'Où en es-tu dans tes études ?', stagePlaceholder: 'Choisis une option',
    stages: ['Lycée', 'Université ou école', 'Formation professionnelle', 'Jeune diplômé·e', 'Autre ou en pause'],
    institution: 'Où étudies-tu ? (facultatif)', institutionPlaceholder: 'École, université, centre de formation ou ville',
    field: 'Qu’étudies-tu ou qu’apprends-tu ?', fieldPlaceholder: 'Matière, programme ou sujet actuel',
    subjects: 'Quelles matières ou quels sujets aimes-tu ?', subjectsPlaceholder: 'Par exemple : biologie, maths, écriture, histoire, programmation',
    hobbies: 'Qu’aimes-tu faire en dehors des cours ?', hobbiesPlaceholder: 'Loisirs, centres d’intérêt ou activités que tu explores par plaisir',
    strengths: 'Pour quoi les autres comptent-ils souvent sur toi ?', strengthsPlaceholder: 'Par exemple : expliquer, réparer, organiser, écouter, repérer les détails',
    themes: 'Quels domaines t’intriguent ? (plusieurs choix possibles)',
    themeOptions: ['Technologie et ingénierie', 'Entreprise et entrepreneuriat', 'Santé et bien-être', 'Éducation et recherche', 'Design et communication', 'Environnement et communauté'],
    activities: 'Quel type d’activité te plairait ? (plusieurs choix possibles)',
    activityOptions: ['Construire ou fabriquer', 'Résoudre des problèmes avec des données', 'Aider directement des personnes', 'Créer des idées ou du contenu', 'Planifier et organiser', 'Expliquer et collaborer'],
    goal: 'Par quoi veux-tu commencer ?',
    goalOptions: ['Choisir une orientation d’études', 'Trouver un premier projet ou stage', 'Développer ma confiance et mes compétences', 'Explorer une idée d’entreprise', 'Je cherche encore'],
    submit: 'Afficher des pistes', required: 'Choisis ton étape d’études pour continuer.', resultTitle: 'Des pistes à explorer',
    resultIntro: 'Prends ces suggestions comme des points de départ, pas comme une évaluation définitive.', why: 'Pourquoi cette piste peut te correspondre', next: 'Prochaines étapes à essayer',
    nextSteps: ['Parle à une personne qui fait ce métier et demande-lui à quoi ressemble une semaine normale.', 'Choisis un petit projet ou exercice réalisable en deux semaines.', 'Observe ce qui te donne de l’énergie et les compétences que tu veux renforcer.'],
    fallback: 'Tes intérêts se précisent encore. Essaie un petit projet, échange avec une personne d’un domaine qui t’attire ou demande une orientation gratuite. La prochaine étape peut être une expérience.',
    promptTitle: 'Poursuis avec un assistant IA', promptNotice: 'Ton profil est affiché ci-dessous. Cette page ne l’envoie nulle part. Copie-le puis colle-le dans l’assistant de ton choix.',
    copy: 'Copier le prompt', copied: 'Copié', copyError: 'Sélectionne et copie le prompt ci-dessous.', chatgpt: 'Ouvrir ChatGPT', claude: 'Ouvrir Claude',
    aiNote: 'Tes réponses ne sont partagées avec un fournisseur d’IA que si tu colles et envoies le prompt. N’inclus pas d’information privée ou sensible.',
    promptRequest: 'Aide-moi à explorer des pistes d’études et de carrière. À partir de mon profil, propose trois pistes réalistes, explique le lien entre chacune et mes intérêts/forces, puis donne une petite expérience peu coûteuse à essayer pour chaque piste. Pose des questions si des informations manquent. Ne présente pas cela comme un diagnostic ni comme une promesse d’emploi.',
    profile: 'Mon profil', stageLabel: 'Étape d’études', institutionLabel: 'École ou lieu', fieldLabel: 'Domaine étudié', subjectsLabel: 'Matières appréciées', hobbiesLabel: 'Loisirs et centres d’intérêt', strengthsLabel: 'Forces', themesLabel: 'Domaines de curiosité', activitiesLabel: 'Activités préférées', goalLabel: 'Premier objectif',
    contactTitle: 'Souhaites-tu qu’une personne te recontacte ?',
    contactText: 'Facultatif. Si tu donnes ton accord, ton navigateur ouvrira un brouillon WhatsApp pour Numerimondes avec tes coordonnées et les pistes choisies. Vérifie-le avant envoi. Ce site ne stocke pas tes réponses.',
    name: 'Nom (facultatif)', contact: 'E-mail ou numéro WhatsApp (facultatif)',
    consent: 'J’accepte de partager ces coordonnées avec Numerimondes pour être recontacté·e au sujet de l’orientation étudiante.',
    contactButton: 'Vérifier le message WhatsApp', contactRequired: 'Ajoute ton nom et un moyen de contact, puis coche la case de consentement.',
    noContact: 'Tes coordonnées ne sont pas incluses dans le prompt IA.', reset: 'Recommencer',
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
const pathways: { id: PathwayId; themes: number[]; activities: number[]; terms: string[] }[] = [
  { id: 'technology', themes: [0], activities: [0, 1], terms: ['technology', 'tech', 'code', 'coding', 'programming', 'engineering', 'math', 'mathematics', 'robot', 'computer', 'software', 'technologie', 'programmation', 'ingénierie', 'mathématiques', 'robotique', 'informatique'] },
  { id: 'business', themes: [1], activities: [4], terms: ['business', 'businesses', 'entrepreneur', 'entrepreneurship', 'commerce', 'entreprise', 'entrepreneuriat', 'marketing', 'sell', 'selling', 'vente', 'finance', 'organizing', 'organisation'] },
  { id: 'health', themes: [2], activities: [2], terms: ['health', 'medical', 'medicine', 'biology', 'care', 'wellbeing', 'wellness', 'santé', 'médecine', 'biologie', 'soin', 'bien-être', 'nursing'] },
  { id: 'education', themes: [3], activities: [5], terms: ['education', 'teaching', 'teacher', 'research', 'reading', 'learning', 'éducation', 'enseignement', 'recherche', 'lecture', 'apprentissage', 'history', 'histoire'] },
  { id: 'creative', themes: [4], activities: [3], terms: ['design', 'art', 'writing', 'music', 'video', 'photography', 'communication', 'création', 'écriture', 'musique', 'vidéo', 'photo', 'dessin', 'design'] },
  { id: 'community', themes: [5], activities: [2, 4], terms: ['environment', 'community', 'nature', 'climate', 'social', 'volunteer', 'environnement', 'communauté', 'nature', 'climat', 'social', 'association'] },
]

const sortedPaths = computed(() => {
  const answers = `${studyField.value} ${favoriteSubjects.value} ${hobbies.value} ${strengths.value}`.toLowerCase()
  return pathways.map((path) => ({
    ...path,
    score: path.themes.filter((theme) => selectedThemes.value.includes(String(theme))).length * 3
      + path.activities.filter((activity) => preferredActivities.value.includes(String(activity))).length * 2
      + path.terms.filter((term) => answers.includes(term)).length,
  })).sort((a, b) => b.score - a.score)
})

const recommendations = computed(() => {
  if (!generated.value) return []
  const ranked = sortedPaths.value
  const picks = ranked.filter((path) => path.score > 0).slice(0, 3)
  return (picks.length ? picks : ranked.slice(0, 3)).map(({ id, score }) => ({ id, score, ...labels.value.paths[id] }))
})

const stageValue = computed(() => stage.value ? labels.value.stages[Number(stage.value)] ?? stage.value : '')
const prompt = computed(() => {
  const entries: [string, string][] = [
    [labels.value.stageLabel, stageValue.value], [labels.value.institutionLabel, institution.value.trim()],
    [labels.value.fieldLabel, studyField.value.trim()], [labels.value.subjectsLabel, favoriteSubjects.value.trim()],
    [labels.value.hobbiesLabel, hobbies.value.trim()], [labels.value.strengthsLabel, strengths.value.trim()],
    [labels.value.themesLabel, selectedThemes.value.map((i) => labels.value.themeOptions[Number(i)]).join(', ')],
    [labels.value.activitiesLabel, preferredActivities.value.map((i) => labels.value.activityOptions[Number(i)]).join(', ')],
    [labels.value.goalLabel, goal.value ? labels.value.goalOptions[Number(goal.value)] : ''],
  ].filter(([, value]) => value)
  return `${labels.value.promptRequest}\n\n${labels.value.profile}:\n${entries.map(([key, value]) => `- ${key}: ${value}`).join('\n')}`
})

const whatsappUrl = computed(() => {
  const chosenPaths = recommendations.value.map((path) => path.title).join(', ')
  const message = language.value === 'fr'
    ? `Bonjour Numerimondes, je souhaite être recontacté·e au sujet de l’orientation étudiante.\nNom : ${contactName.value.trim()}\nContact : ${contact.value.trim()}\nPistes explorées : ${chosenPaths}`
    : `Hello Numerimondes, I would like to be contacted about student orientation.\nName: ${contactName.value.trim()}\nContact: ${contact.value.trim()}\nPaths explored: ${chosenPaths}`
  return `https://wa.me/212620990692?text=${encodeURIComponent(message)}`
})

function generate() {
  if (!stage.value) return
  generated.value = true
  copied.value = false
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
  copyFailed.value = false
}
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
      <label class="nm-student-orientation__field">
        <span>{{ labels.goal }}</span>
        <select v-model="goal">
          <option value="">—</option>
          <option v-for="(option, index) in labels.goalOptions" :key="option" :value="String(index)">{{ option }}</option>
        </select>
      </label>
      <p v-if="!stage && generated" class="nm-student-orientation__error" role="alert">{{ labels.required }}</p>
      <button class="nm-student-orientation__button nm-student-orientation__button--primary" type="submit">{{ labels.submit }}</button>
    </form>

    <div v-if="generated" class="nm-student-orientation__results" aria-live="polite">
      <div class="nm-student-orientation__section-heading">
        <div><h3>{{ labels.resultTitle }}</h3><p>{{ labels.resultIntro }}</p></div>
        <button class="nm-student-orientation__text-button" type="button" @click="reset">{{ labels.reset }}</button>
      </div>
      <p v-if="recommendations.length === 0" class="nm-student-orientation__fallback">{{ labels.fallback }}</p>
      <div class="nm-student-orientation__pathways">
        <article v-for="path in recommendations" :key="path.id" class="nm-student-orientation__path">
          <span class="nm-student-orientation__path-index">{{ String(recommendations.indexOf(path) + 1).padStart(2, '0') }}</span>
          <h4>{{ path.title }}</h4>
          <p><strong>{{ labels.why }}:</strong> {{ path.why }}</p>
          <p><strong>{{ labels.next }}:</strong> {{ path.action }}</p>
        </article>
      </div>
      <ul v-if="recommendations.length" class="nm-student-orientation__steps">
        <li v-for="step in labels.nextSteps" :key="step">{{ step }}</li>
      </ul>

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
.nm-student-orientation h2, .nm-student-orientation h3, .nm-student-orientation h4 { color: var(--nmo-text); }
.nm-student-orientation h2 { margin: 0 0 .5rem; font-size: clamp(1.7rem, 4vw, 2.4rem); line-height: 1.15; }
.nm-student-orientation h3 { margin: 0 0 1rem; font-size: 1.2rem; }
.nm-student-orientation p { color: var(--nmo-muted); line-height: 1.65; }
.nm-student-orientation__header, .nm-student-orientation__form, .nm-student-orientation__results, .nm-student-orientation__ai, .nm-student-orientation__contact { margin-bottom: 1.25rem; padding: clamp(1rem, 3vw, 1.5rem); border: 1px solid var(--nmo-border); border-radius: var(--radius-lg); background: var(--vp-c-bg); }
.nm-student-orientation__header { position: relative; padding-top: 3.25rem; background: linear-gradient(135deg, color-mix(in srgb, var(--vp-c-brand-1) 10%, var(--vp-c-bg)), var(--vp-c-bg) 70%); }
.nm-student-orientation__header > p { max-width: 43rem; margin: .5rem 0 0; }
.nm-student-orientation__language { position: absolute; top: 1rem; right: 1rem; display: flex; align-items: center; gap: .5rem; color: var(--nmo-muted); font-size: .85rem; }
.nm-student-orientation select, .nm-student-orientation input:not([type=checkbox]), .nm-student-orientation textarea { box-sizing: border-box; width: 100%; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); padding: .7rem .8rem; background: var(--vp-c-bg); color: var(--nmo-text); font: inherit; }
.nm-student-orientation__language select { width: auto; padding: .4rem .6rem; }
.nm-student-orientation textarea { resize: vertical; }
.nm-student-orientation :is(input, textarea, select, button, a):focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.nm-student-orientation__form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.nm-student-orientation__form > h3, .nm-student-orientation__choices, .nm-student-orientation__error, .nm-student-orientation__form > button { grid-column: 1 / -1; }
.nm-student-orientation__form > h3 { margin: 0; }
.nm-student-orientation__field { display: grid; align-content: start; gap: .4rem; color: var(--nmo-text); font-size: .9rem; font-weight: 600; }
.nm-student-orientation__field span { line-height: 1.4; }
.nm-student-orientation__field b { color: var(--vp-c-danger-1); }
.nm-student-orientation__choices { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .65rem; margin: 0; padding: 1rem; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); }
.nm-student-orientation__choices legend { padding: 0 .35rem; color: var(--nmo-text); font-size: .9rem; font-weight: 650; }
.nm-student-orientation__choices label, .nm-student-orientation__consent { display: flex; align-items: flex-start; gap: .6rem; color: var(--nmo-muted); font-size: .9rem; line-height: 1.5; }
.nm-student-orientation__choices input, .nm-student-orientation__consent input { flex: 0 0 auto; margin-top: .2rem; accent-color: var(--vp-c-brand-1); }
.nm-student-orientation__button { display: inline-flex; min-height: 2.7rem; align-items: center; justify-content: center; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); padding: .65rem 1rem; background: var(--vp-c-bg-soft); color: var(--nmo-text); font: inherit; font-weight: 650; text-align: center; text-decoration: none; cursor: pointer; }
.nm-student-orientation__button:hover { border-color: var(--vp-c-brand-1); }
.nm-student-orientation__button--primary { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-1); color: var(--vp-c-white); }
.nm-student-orientation__error { margin: 0; color: var(--vp-c-danger-1) !important; }
.nm-student-orientation__section-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.nm-student-orientation__section-heading h3 { margin-bottom: .25rem; }
.nm-student-orientation__section-heading p { margin-top: .25rem; }
.nm-student-orientation__text-button { border: 0; padding: .4rem; background: none; color: var(--vp-c-brand-1); font: inherit; cursor: pointer; }
.nm-student-orientation__pathways { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 15rem), 1fr)); gap: .75rem; margin-top: 1rem; }
.nm-student-orientation__path { position: relative; padding: 1rem; border: 1px solid var(--nmo-border); border-radius: var(--radius-md); background: var(--nmo-surface); }
.nm-student-orientation__path h4 { margin: .35rem 0 .6rem; font-size: 1.05rem; }
.nm-student-orientation__path p { margin: .55rem 0 0; font-size: .9rem; }
.nm-student-orientation__path strong { color: var(--nmo-text); }
.nm-student-orientation__path-index { color: var(--vp-c-brand-1); font-size: .75rem; font-weight: 800; letter-spacing: .08em; }
.nm-student-orientation__steps { display: grid; gap: .45rem; margin: 1rem 0 0; padding-left: 1.25rem; color: var(--nmo-muted); line-height: 1.55; }
.nm-student-orientation__ai, .nm-student-orientation__contact { margin-top: 1.25rem; padding: 0; border: 0; background: transparent; }
.nm-student-orientation__ai > textarea { margin: .5rem 0; font-size: .85rem; }
.nm-student-orientation__actions { display: flex; flex-wrap: wrap; gap: .6rem; margin-top: .5rem; }
.nm-student-orientation__note { margin: .6rem 0 0; font-size: .82rem; }
.nm-student-orientation__contact { padding-top: 1rem; border-top: 1px solid var(--nmo-border); }
.nm-student-orientation__contact > .nm-student-orientation__field { max-width: 32rem; margin: .8rem 0; }
.nm-student-orientation__consent { margin: .8rem 0; }
@media (max-width: 640px) { .nm-student-orientation__form { grid-template-columns: 1fr; } .nm-student-orientation__form > h3, .nm-student-orientation__choices, .nm-student-orientation__error, .nm-student-orientation__form > button { grid-column: auto; } .nm-student-orientation__choices { grid-template-columns: 1fr; } .nm-student-orientation__section-heading { display: block; } }
</style>
