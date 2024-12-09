export default {
  FeatureName: 'DME sign in flow page',
  features: [
    {
      tcid: '1',
      name: '@login-sign-in-sign-out-public-page',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        expectedProtectedHomeURL: '/es/channelpartners/drafts/automation/regression/protected-home',
        expectedPublicPageURL: '/es/channelpartners/drafts/automation/regression/public-page',
        logoutButtonText: 'Cerrar sesión',
        signInButtonEsGeoText: 'Iniciar sesión',
        signInButtonInternationalText: 'Sign In',
      },
    },
    {
      tcid: '2',
      name: '@login-accessing-public-home-page-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home',
        page: 'public page',
        signInButtonInternationalText: 'Sign In',
      },
    },
    {
      tcid: '3',
      name: '@login-accessing-restricted-home-page-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home?georouting=off',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home',
        page: 'restricted page',
        signInButtonInternationalText: 'Sign In',
      },
    },
    {
      tcid: '4',
      name: '@login-direct-sign-in-from-public-home-page-non-member',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'spp-platinum:',
        expectedRedirectedURL: 'https://partners.stage.adobe.com/channelpartners/error/contact-not-found',
        expectedPublicPageURL: 'https://partners.stage.adobe.com/channelpartners/',
        logoutButtonText: 'Sign Out',
        signInButtonInternationalText: 'Sign In',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '5',
      name: '@login-direct-sign-in-from-program-page-non-member',
      path: 'https://partners.stage.adobe.com/channelpartners/program/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'spp-platinum:',
        expectedRedirectedURL: 'https://partners.stage.adobe.com/channelpartners/error/contact-not-found',
        expectedPublicPageURL: 'https://partners.stage.adobe.com/channelpartners/',
        logoutButtonText: 'Sign Out',
        signInButtonInternationalText: 'Sign In',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '6',
      name: '@login-accessing-restricted-home-page-with-non-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/home/?georouting=off&martech=off',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'tpp-platinum:',
        expectedRedirectedURL: 'https://partners.stage.adobe.com/channelpartners/error/contact-not-found',
        page: 'restricted home',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '7',
      name: '@login-accessing-public-page-with-non-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'tpp-platinum:',
        expectedRedirectedURL: 'https://partners.stage.adobe.com/channelpartners/',
        page: 'public page',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '8',
      name: '@login-accessing-public-page-and-restricted-home-with-non-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'tpp-platinum:',
        expectedPublicURL: 'https://partners.stage.adobe.com/channelpartners/',
        restrictedHomePath: 'https://partners.stage.adobe.com/channelpartners/home/?georouting=off&martech=off',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartners/error/404',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '9',
      name: '@login-accessing-restricted-home-with-non-logged-in-user',
      path: 'https://partners.stage.adobe.com/channelpartners/home/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      expectedToSeeInURL: 'https://auth-stg1.services.adobe.com/',
      data: { signInButtonText: 'Sign In' },
    },
    {
      tcid: '10',
      name: '@login-functionality-with-registered-member-user',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-china-registered:',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '11',
      name: '@login-functionality-with-certified-member-user',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-pacific-certified:',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '12',
      name: '@login-functionality-with-gold-member-user',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-latin-america-gold:',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '13',
      name: '@login-functionality-with-platinum-member-user',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        signInButtonText: 'Sign In',
      },
    },
    {
      tcid: '14',
      name: '@login-sign-in-sign-out-from-program-page-with-member-user',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-program-page?georouting=off&martech=off',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-latin-america-na-platinum:',
        landingPageAfterLoginURL: 'https://partners.stage.adobe.com/latam/channelpartners/drafts/automation/regression/protected-program-page',
        landingPageAfterLogoutURL: 'https://partners.stage.adobe.com/latam/channelpartners/drafts/automation/regression/public-program-page',
        logoutButtonText: 'Sign Out',
        signInButtonInternationalText: 'Sign In',
        signInButtonText: 'Sign In', // This will require a change as soon as LA NA based is sorted out
      },
    },
  ],
};
