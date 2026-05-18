export default {
  FeatureName: 'DME Logos',
  features: [
    {
      tcid: '1',
      name: '@desc-validate-logos-details',
      path: '/na/channelpartners/home/marketing/logos/?georouting=off&martech=off',
      tags: '@dme-logos @regression @circleCi',
      data: {
        partnerLevel: 'cpp-na-certified:',
        downloadButtonLink: '/channelpartnerassets/apc-assets/restricted/prod/restricted_4/InDesign_CC_mnemonic.zip',
      },
    },
  ],
};
