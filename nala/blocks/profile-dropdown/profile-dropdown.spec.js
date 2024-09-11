export default {
  FeatureName: 'DME profile dropdown page',
  features: [
    {
      tcid: '1',
      name: '@desc-profile-dropdown-member-user-with-sales-center',
      path: 'https://partners.stage.adobe.com/channelpartners/?akamaiLocale=na&martech=off',
      tags: '@dme-profile @regression @login @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-apac:',
        profileName: 'Stage CPP Distributor',
        profileEmail: 'yugo-stage-c…@mailinator.com',
      },
    },
  ],
};
