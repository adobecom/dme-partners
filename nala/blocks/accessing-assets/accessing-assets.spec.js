export default {
  FeatureName: 'DME accessing assets',
  features: [
    {
      tcid: '1',
      name: '@accessing-restricted-asset-non-logged-in-user',
      path: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-no-specialization.pptx?download',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      expectedToSeeInURL: 'https://auth-stg1.services.adobe.com/',
    },
    {
      tcid: '2',
      name: '@login-accessing-public-asset-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf',
        httpStatusCode: 200,
      },
    },
    {
      tcid: '3',
      name: '@login-accessing-forbidden-asset-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
        expectedToSeeInURL: '/channelpartners/error/404',
      },
    },
  ],
};
