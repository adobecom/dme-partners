export default {
  FeatureName: 'DME sign in flow page',
  features: [
    {
      tcid: '1',
      name: '@login-sign-in-sign-out-public-page',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home',
        expectedPublicPageURL: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page',
      },
    },
    {
      tcid: '2',
      name: '@login-accessing-public-home-page-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      baseURL: 'https://www.stage.adobe.com/partners.html',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home',
        page: 'public page',
      },
    },
    {
      tcid: '3',
      name: '@login-accessing-restricted-home-page-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home?akamaiLocale=na&martech=off',
      baseURL: 'https://www.stage.adobe.com/partners.html',
      tags: '@dme-signin @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/protected-home',
        page: 'restricted page',
      },
    },
  ],
};
