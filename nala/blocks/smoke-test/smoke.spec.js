export default {
  FeatureName: 'Smoke Tests',
  features: [
    {
      tcid: '1',
      name: '@lending-page-validation-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
    },

    {
      tcid: '2',
      name: '@home-page-validation-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-latin-na-platinum:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '3',
      name: '@price-list-validation-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      basedURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonInternationalText: 'Sign In',
        expectedPublicPageURL:
          'https://partners.stage.adobe.com/na/channelpartners/home/pricelists/',
      },
    },

    {
      tcid: '4',
      name: '@search-page-validation-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      basedURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonInternationalText: 'Sign In',
        searchText: 'pdf',
      },
    },

    {
      tcid: '5',
      name: '@user-redirection-apac-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      basedURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        expectedPublicPageURL:
          'https://partners.stage.adobe.com/apac/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '6',
      name: '@user-redirection-emea-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      basedURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-emea-platinum:',
        expectedPublicPageURL:
          'https://partners.stage.adobe.com/emea/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '7',
      name: '@user-redirection-jp-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      basedURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-distributor-japan:',
        expectedPublicPageURL:
          'https://partners.stage.adobe.com/jp/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '8',
      name: '@user-redirection-latam-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      basedURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-latin-america-na-platinum:',
        expectedPublicPageURL:
          'https://partners.stage.adobe.com/latam/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '9',
      name: '@announcement-page-validation-smoke-test',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      data: {
        partnerLevel: 'cpp-na-certified:',
        expectedPublicPageURL:
          'https://partners.stage.adobe.com/latam/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },
  ],
};
