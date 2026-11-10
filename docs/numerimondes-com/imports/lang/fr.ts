const languageConfig = {
  code: 'fr',
  label: 'Francais',
  messages: {
    notFound: {
      code: '404',
      title: 'Page introuvable',
      message: "La page que vous cherchez n'existe pas ou a ete deplacee.",
    },
    languageUnavailable: {
      code: '406',
      title: 'Indisponible',
      message: "Cette page n'est pas disponible en {language}.",
    },
    suggestions: {
      availableIn: 'Disponible en :',
      didYouMean: 'Vous cherchez peut-etre :',
    },
    languageNames: {
      en: 'Anglais',
      fr: 'Francais',
    },
  },
};

export default languageConfig;
