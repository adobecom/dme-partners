export default {
  FeatureName: 'DME search assets',
  features: [
    {
      tcid: '1',
      name: '@login-accessing-restricted-asset-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf',
      tags: '@dme-search-assets @regression @login @circleCi',
      data: {
        expectedToSeeInURL: '/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf',
      },
    },
    {
      tcid: '2',
      name: '@login-accessing-restricted-asset-with-member-user-logged-in-to-adobe',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?georouting=off',
      baseURL: 'https://www.stage.adobe.com?akamaiLocale=us',
      tags: '@dme-search-assets @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        previewAssetLink: 'https://partners.stage.adobe.com/channelpartnerassets/assets/public/public_1/MAPC_public_stage.pdf?download',
        downloadAssetLink: 'https://partners.stage.adobe.com/channelpartnerassets/assets/restricted/restricted_1/MAPC-stage-combined.docx?download',
        signInButtonText: 'Sign In',
        downloadURL: '/assets/restricted/restricted_1/MAPC-stage-combined.docx',
      },
    },
  ],
};
