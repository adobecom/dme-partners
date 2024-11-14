export default {
  FeatureName: 'DME Announcements Preview',
  features: [
    {
      tcid: '1',
      name: '@desc-regression-announcements-preview-europe-west-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-spain-platinum:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '2',
      name: '@desc-regression-announcements-preview-china-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-china-registered:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '3',
      name: '@desc-regression-announcements-preview-latin-america-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-latin-america-gold:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '4',
      name: '@desc-regression-announcements-preview-europe-east-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-europe-east-certified:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '5',
      name: '@desc-regression-announcements-preview-north-america-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '6',
      name: '@desc-regression-announcements-preview-pacific-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-pacific-certified:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '7',
      name: '@desc-regression-announcements-preview-emea-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-emea-platinum:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '8',
      name: '@desc-regression-announcements-preview-united-kingdom-europe-west-multi-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-uk-gold:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '9',
      name: '@desc-regression-announcements-preview-asia-pacific-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-distributor-india:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    {
      tcid: '10',
      name: '@desc-regression-announcements-preview-latin-america-na-based-region',
      path: '/channelpartners/?georouting=off&martech=off',
      tags: '@dme-announcements-preview @regression @circleCi',
      data: {
        partnerLevel: 'cpp-latin-america-na-platinum:',
        signInButton: 'Sign In',
        expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
        selectedSortNewest: 'Date: newest',
        rootPath: '/channelpartners/',
      },
    },
    // This will also be included after MWPW-161391 resolves.
    // {
    //   tcid: '11',
    //   name: '@desc-regression-announcements-preview-japan-region',
    //   path: '/channelpartners/?georouting=off&martech=off',
    //   tags: '@dme-announcements-preview @regression @circleCi',
    //   data: {
    //     partnerLevel: 'cpp-distributor-japan:',
    //     signInButton: 'Sign In',
    //     expectedProtectedHomeURL: 'https://partners.stage.adobe.com/channelpartners/home/',
    //     selectedSortNewest: 'Date: newest',
    //     rootPath: '/channelpartners/',
    //   },
    // },
  ],
};
