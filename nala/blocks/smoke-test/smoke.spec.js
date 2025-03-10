export default {
  FeatureName: 'Smoke Tests',
  features: [
    {
      tcid: '1',
      name: '@lending-page-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
    },

    {
      tcid: '2',
      name: '@home-page-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-latin-na-platinum:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '3',
      name: '@price-list-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
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
      path: '/channelpartners/?georouting=off&martech=off',
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
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        expectedPublicPageURL:
          '/apac/channelpartners/home/#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '6',
      name: '@user-redirection-emea-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-emea-platinum:',
        expectedPublicPageURL:
          '/emea/channelpartners/home/#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '7',
      name: '@user-redirection-jp-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-japan:',
        expectedPublicPageURL:
          '/jp/channelpartners/home/#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '8',
      name: '@user-redirection-latam-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-latin-america-na-platinum:',
        expectedPublicPageURL:
          '/latam/channelpartners/home/#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '9',
      name: '@announcement-page-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-na-certified:',
        expectedPublicPageURL:
          '/latam/channelpartners/home/#',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '10',
      name: '@search-page-query-param-validation-smoke-test',
      path: '/na/channelpartners/home/search/?term=Logo&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-na-certified:',
        signInButtonInternationalText: 'Sign In',
        searchText: 'Logo',
      },
    },

    {
      tcid: '11',
      name: '@retail-program-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
    },

    {
      tcid: '12',
      name: '@apac-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '13',
      name: '@latam-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-latin-america-gold:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '14',
      name: '@emea-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '15',
      name: '@korea-specialization-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-kr-gold:',
        signInButtonInternationalText: 'Sign In',
      },
    },

    {
      tcid: '16',
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
      tcid: '17',
      name: '@cal-links-apac-validation-smoke-test',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-smoke-test',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        signInButtonInternationalText: 'Sign In',
        expectedApacEmail:
          'apacpm@adobe.com',
      },
    },

    {
      tcid: '18',
      name: '@join-now-button-validation-smoke-test',
      path: '/channelpartners/#?martech=off',
      tags: '@dme-smoke-test',
      data: {
        joinNowButtonText: 'Join Now',
        joinNowButtonFrenchText: 'Adhérer',
        joinNowButtonGermanText: 'Mitglied werden',
        joinNowButtonItalianText: 'Iscriviti',
        joinNowButtonSpanishText: 'Unirse ahora',
        joinNowButtonKorianText: '가입하기',
        joinNowButtonChinaText: '立即加入',
        joinNowButtonJapanText: '参加する',
        naLocaleSwitchUrl: '/na/channelpartners/#?martech=off',
        latamLocaleSwitchUrl: '/latam/channelpartners/#?martech=off',
        emeaLocaleSwitchUrl: '/emea/channelpartners/#?martech=off',
        frLocaleSwitchUrl: '/fr/channelpartners/#?martech=off',
        deLocaleSwitchUrl: '/de/channelpartners/#?martech=off',
        itLocaleSwitchUrl: '/it/channelpartners/#?martech=off',
        esLocaleSwitchUrl: '/es/channelpartners/#?martech=off',
        apacLocaleSwitchUrl: '/apac/channelpartners/#?martech=off',
        krLocaleSwitchUrl: '/kr/channelpartners/#?martech=off',
        cnLocaleSwitchUrl: '/cn/channelpartners/#?martech=off',
        jpLocaleSwitchUrl: '/jp/channelpartners/#?martech=off',
      },
    },
  ],
};
