export type HomepageLanguage = 'en' | 'fr'

export interface HomepageSection {
  number: string
  eyebrow: string
  title: string
  description: string
  filename: string
  code: string
  previewLabel: string
  availability: string
  kind: 'module' | 'view' | 'targets'
}

export interface HomepageContent {
  eyebrow: string
  title: string
  description: string
  primaryAction: string
  secondaryAction: string
  currentStatus: string
  sections: HomepageSection[]
  nextTitle: string
  nextDescription: string
  startLabel: string
  architectureLabel: string
  targetStatus: string
  previewTitle: string
  previewNameLabel: string
  previewEmailLabel: string
  previewSubmit: string
  moduleName: string
  moduleFeature: string
  moduleSubmodule: string
  webTarget: string
  workstationTarget: string
  targetFormTitle: string
  targetFormHelp: string
  targetWebLabel: string
  targetWorkstationLabel: string
}

export const homepageContent: Record<HomepageLanguage, HomepageContent> = {
  en: {
    eyebrow: 'Feluqa documentation',
    title: 'One foundation. Runtimes shaped for each destination.',
    description: 'Explore the Rust framework foundations in place today, the architecture taking shape, and the product capabilities still being built.',
    primaryAction: 'Get started',
    secondaryAction: 'Explore the architecture',
    currentStatus: 'Feluqa is under active development. The web profile comes first; dynamic module installation, complete runtime shells, and multi-frontend rendering are still in progress.',
    sections: [
      {
        number: '01', eyebrow: 'Organize by domain', title: 'Keep a module close to its work.',
        description: 'A module gives related business code a clear home. Its dependencies stay explicit, while subdomains and features can grow alongside it.',
        filename: 'src/modules/sales/module.rs',
        code: 'feluqa::module! {\n    requires = ["core >= 1"]\n}',
        previewLabel: 'A domain with room to grow', availability: 'Static module composition is available today.', kind: 'module',
      },
      {
        number: '02', eyebrow: 'Compile views ahead of time', title: 'Write a view. Ship compiled output.',
        description: 'Feluqa views pair HTML with Rust expressions. The application build compiles trusted templates before production, with escaped output by default.',
        filename: 'views/account.view.rs',
        code: '<main class="account">\n    <h1>Welcome, {{ user.name }}</h1>\n    <p>{{ user.email }}</p>\n</main>',
        previewLabel: 'A small view, rendered as a page', availability: 'The build-time view compiler is implemented.', kind: 'view',
      },
      {
        number: '03', eyebrow: 'Keep contracts reusable', title: 'Let each target feel at home.',
        description: 'The product direction is one shared ecosystem with separate target runtimes. Web, workstation, mobile, and other surfaces can use shared schemas and tools while keeping their own interaction patterns.',
        filename: 'src/modules/customers/model.rs',
        code: 'pub struct Customer {\n    pub name: String,\n    pub email: String,\n}',
        previewLabel: 'One model · different target surfaces', availability: 'Multi-frontend rendering is a product goal, not a completed capability.', kind: 'targets',
      },
    ],
    nextTitle: 'Choose a useful next step.',
    nextDescription: 'Start with what works in the repository today, and follow the implementation status as the platform grows.',
    startLabel: 'Read the getting-started guide', architectureLabel: 'See implementation status',
    targetStatus: 'Target architecture · in progress', previewTitle: 'Customer details',
    previewNameLabel: 'Name', previewEmailLabel: 'Email', previewSubmit: 'Save customer',
    moduleName: 'sales', moduleFeature: 'features/loyalty', moduleSubmodule: 'submodules/invoicing',
    webTarget: 'Web application', workstationTarget: 'Workstation app', targetFormTitle: 'New customer',
    targetFormHelp: 'The same business concept can be presented in a way that suits this target.',
    targetWebLabel: 'Web', targetWorkstationLabel: 'Workstation',
  },
  fr: {
    eyebrow: 'Documentation Feluqa',
    title: 'Une fondation. Des runtimes adaptés à chaque usage.',
    description: 'Découvrez les fondations Rust déjà présentes, l’architecture en construction et les capacités produit encore en développement.',
    primaryAction: 'Bien démarrer',
    secondaryAction: 'Explorer l’architecture',
    currentStatus: 'Feluqa est en développement actif. Le profil web passe en premier ; l’installation dynamique des modules, les shells runtime complets et le rendu multi-interface restent en chantier.',
    sections: [
      {
        number: '01', eyebrow: 'Organiser par domaine', title: 'Garder un module près de son métier.',
        description: 'Un module donne un espace clair au code métier qui va ensemble. Ses dépendances restent explicites, tandis que ses sous-domaines et ses fonctionnalités peuvent évoluer avec lui.',
        filename: 'src/modules/sales/module.rs',
        code: 'feluqa::module! {\n    requires = ["core >= 1"]\n}',
        previewLabel: 'Un domaine qui peut grandir', availability: 'La composition statique des modules existe aujourd’hui.', kind: 'module',
      },
      {
        number: '02', eyebrow: 'Compiler les vues en amont', title: 'Écrire une vue. Livrer du code compilé.',
        description: 'Les vues Feluqa associent HTML et expressions Rust. Le build de l’application compile les templates de confiance avant la production et échappe les valeurs par défaut.',
        filename: 'views/account.view.rs',
        code: '<main class="account">\n    <h1>Bienvenue, {{ user.name }}</h1>\n    <p>{{ user.email }}</p>\n</main>',
        previewLabel: 'Une petite vue, rendue comme une page', availability: 'Le compilateur de vues au build est implémenté.', kind: 'view',
      },
      {
        number: '03', eyebrow: 'Réutiliser les contrats', title: 'Laisser chaque cible à sa place.',
        description: 'La direction produit vise un écosystème commun et des runtimes séparés. Le web, le poste de travail, le mobile et les autres surfaces pourront partager schémas et outils, tout en gardant leurs propres interactions.',
        filename: 'src/modules/customers/model.rs',
        code: 'pub struct Customer {\n    pub name: String,\n    pub email: String,\n}',
        previewLabel: 'Un modèle · plusieurs surfaces cibles', availability: 'Le rendu multi-interface reste un objectif produit, pas une capacité terminée.', kind: 'targets',
      },
    ],
    nextTitle: 'Choisir la prochaine étape utile.',
    nextDescription: 'Commencez par ce qui fonctionne déjà dans le dépôt et suivez l’état d’avancement à mesure que la plateforme évolue.',
    startLabel: 'Lire le guide pour bien démarrer', architectureLabel: 'Voir l’état d’avancement',
    targetStatus: 'Architecture cible · en construction', previewTitle: 'Coordonnées client',
    previewNameLabel: 'Nom', previewEmailLabel: 'E-mail', previewSubmit: 'Enregistrer le client',
    moduleName: 'sales', moduleFeature: 'features/loyalty', moduleSubmodule: 'submodules/invoicing',
    webTarget: 'Application web', workstationTarget: 'Application poste de travail', targetFormTitle: 'Nouveau client',
    targetFormHelp: 'Un même besoin métier peut prendre la forme adaptée à cette cible.',
    targetWebLabel: 'Web', targetWorkstationLabel: 'Poste de travail',
  },
}
