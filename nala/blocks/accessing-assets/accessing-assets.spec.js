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
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
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
      name: '@na-user-verify-asset-access-base-on-level',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
      },
    },
    {
      tcid: '4',
      name: '@korea-user-verify-asset-access-base-on-apecialisation',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-kr-gold:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
        forbiddenAsset: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-education.xlsx',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-education.xlsx',
        httpStatusCode: 404,
      },
    },
    {
      tcid: '5',
      name: '@china-user-verify-asset-access-base-on-region',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-china-registered:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
        forbiddenAsset: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-education.xlsx',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-education.xlsx',
        httpStatusCode: 200,
      },
    },
    {
      tcid: '6',
      name: '@japan-user-verify-asset-access-base-on-level',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-china-registered:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-worldwide.png',
        forbiddenAsset: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_7/MAPC-Education-Elite.pdf',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_7/MAPC-Education-Elite.pdf',
        httpStatusCode: 200,
      },
    },
    {
      tcid: '7',
      name: '@latam-user-verify-asset-access-base-on-specialization',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'pp-latin-america-gold:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf',
        forbiddenAsset: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-education-government.zip',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-education-government.zip',
        httpStatusCode: 200,
      },
    },
    {
      tcid: '8',
      name: '@emea-user-verify-asset-access-base-on-region',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        signInButtonText: 'Sign In',
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-worldwide.png',
        forbiddenAsset: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
        expectedToSeeInURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-government.mp4',
        httpStatusCode: 200,
      },
    },
    {
      tcid: '9',
      name: '@accessing-public-asset-non-logged-in-user',
      path: 'https://partners.stage.adobe.com/channelpartners/?georouting=off&martech=off',
      tags: '@dme-accessing-assets @regression @login @circleCi',
      data: {
        assetURL: 'https://partners.stage.adobe.com/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf',
        httpStatusCode: 200,
      },
    },
  ],
};
