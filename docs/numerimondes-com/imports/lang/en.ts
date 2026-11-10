const languageConfig = {
  code: 'en',
  label: 'English',
  messages: {
    notFound: {
      code: '404',
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist or has been moved.',
    },
    languageUnavailable: {
      code: '406',
      title: 'Unavailable',
      message: "This page isn't available in {language}.",
    },
    suggestions: {
      availableIn: 'Available in:',
      didYouMean: 'You might be looking for:',
    },
    languageNames: {
      en: 'English',
      fr: 'French',
    },
  },
};

export default languageConfig;
