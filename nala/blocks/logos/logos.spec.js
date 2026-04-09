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
        downloadButtonLink: '/channelpartnerassets/prp-assets/restricted/prp-267-release-stage/region-tag1.pdf',
      },
    },
  ],
};
