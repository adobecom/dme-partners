export default {
  FeatureName: 'Smoke Tests',
  features: [
    {
      tcid: '1',
      name: '@lending-page-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      // path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
    },

    {
      tcid: '2',
      name: '@home-page-validation-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-latin-na-platinum:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '3',
      name: '@price-list-validation-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonInternationalText: 'Sign In',
        expectedPublicPageURL:
          '/na/channelpartners/home/pricelists/',
      },
    },

    {
      tcid: '4',
      name: '@search-page-validation-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonInternationalText: 'Sign In',
        searchText: 'pdf',
      },
    },

    {
      tcid: '5',
      name: '@user-redirection-apac-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        expectedPublicPageURL:
          '/apac/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '6',
      name: '@user-redirection-emea-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-emea-platinum:',
        expectedPublicPageURL:
          '/emea/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '7',
      name: '@user-redirection-jp-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-japan:',
        expectedPublicPageURL:
          '/jp/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '8',
      name: '@user-redirection-latam-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-latin-america-na-platinum:',
        expectedPublicPageURL:
          '/latam/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '9',
      name: '@announcement-page-validation-smoke-test',
      path: '/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-na-certified:',
        expectedPublicPageURL:
          '/latam/channelpartners/drafts/automation/regression/protected-home#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '10',
      name: '@retail-program-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
    },

    {
      tcid: '11',
      name: '@apac-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '12',
      name: '@latam-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-latin-america-gold:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '13',
      name: '@emea-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '14',
      name: '@korea-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-kr-gold:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '15',
      name: '@uplevel-info-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-de-gold:',
        signInButtonInternationalText: 'Sign In',
        expectedResellerProgramURL:
          '/Reseller_Program_Guide_EMEA.pdf',
        expectedRetailProgramURL:
          '/EMEA_Retail_Program_Guide.pdf',
      },
    },

    {
      tcid: '16',
      name: '@cal-links-apac-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        signInButtonInternationalText: 'Sign In',
        expectedApacEmail:
          'apacpm@adobe.com',
        expectedDistributorGuidLink:
          '/Adobe_Partner_Connection_Distributor_Program_Guide_FY25_Asia_Pacific_v9.pdf',
      },
    },
  ],
};
