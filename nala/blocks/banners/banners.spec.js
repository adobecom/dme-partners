export default {
  FeatureName: 'DME Renew Banners',
  features: [
    {
      tcid: '1',
      name: '@desc-regression-banners-logged-in-non-member-user',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'SPP',
          partnerLevel: 'Platinum',
          permissionRegion: 'North America',
        },
      },
    },
    {
      tcid: '2',
      name: '@desc-regression-banners-logged-in-member-platinum-user-anniversary-date-out-of-range',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 35,
          partnerLevel: 'Platinum',
          permissionRegion: 'Europe West',
        },
      },
    },
    {
      tcid: '3',
      name: '@desc-regression-banners-logged-in-member-distributor-user-anniversary-date-out-of-range',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 35,
          partnerLevel: 'Distributor',
          permissionRegion: 'Japan',
        },
      },
    },
    {
      tcid: '4',
      name: '@desc-regression-banners-logged-in-member-gold-user-anniversary-date-out-of-range',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 35,
          partnerLevel: 'Gold',
          permissionRegion: 'United Kingdom,Europe West',
        },
      },
    },
    {
      tcid: '5',
      name: '@desc-regression-banners-logged-in-member-certified-user-anniversary-date-out-of-range',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 35,
          partnerLevel: 'Certified',
          permissionRegion: 'Pacific',
        },
      },
    },
    {
      tcid: '6',
      name: '@desc-regression-banners-logged-in-member-registered-user-anniversary-date-out-of-range',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 35,
          partnerLevel: 'Registered',
          permissionRegion: 'China',
        },
      },
    },
    {
      tcid: '7',
      name: '@desc-regression-banners-logged-in-member-platinum-user-anniversary-date-last-90-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: -35,
          partnerLevel: 'Platinum',
          permissionRegion: 'Europe West',
        },
      },
    },
    {
      tcid: '8',
      name: '@desc-regression-banners-logged-in-member-distributor-user-anniversary-date-last-90-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: -35,
          partnerLevel: 'Distributor',
          permissionRegion: 'Japan',
        },
      },
    },
    {
      tcid: '9',
      name: '@desc-regression-banners-logged-in-member-platinum-user-anniversary-date-next-30-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 10,
          partnerLevel: 'Platinum',
          permissionRegion: 'Europe West',
        },
      },
    },
    {
      tcid: '10',
      name: '@desc-regression-banners-logged-in-member-distributor-user-anniversary-date-next-30-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 10,
          partnerLevel: 'Distributor',
          permissionRegion: 'Japan',
        },
      },
    },
    {
      tcid: '11',
      name: '@desc-regression-banners-logged-in-member-gold-user-anniversary-date-last-90-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: -35,
          partnerLevel: 'Gold',
          permissionRegion: 'United Kingdom,Europe West',
        },
        paragraphIndex: 1,
        bannerText: 'Your account is suspended. You need to renew your membership to be able to continue using your benefits with Adobe in the next 55 days.',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '12',
      name: '@desc-regression-banners-logged-in-member-certified-user-anniversary-date-last-90-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: -35,
          partnerLevel: 'Certified',
          permissionRegion: 'Pacific',
        },
        paragraphIndex: 1,
        bannerText: 'Your account is suspended. You need to renew your membership to be able to continue using your benefits with Adobe in the next 55 days.',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '13',
      name: '@desc-regression-banners-logged-in-member-registered-user-anniversary-date-last-90-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: -35,
          partnerLevel: 'Registered',
          permissionRegion: 'China',
        },
        paragraphIndex: 1,
        bannerText: 'Your account is suspended. You need to renew your membership to be able to continue using your benefits with Adobe in the next 55 days.',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '14',
      name: '@desc-regression-banners-logged-in-member-gold-user-anniversary-date-next-30-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 10,
          partnerLevel: 'Gold',
          permissionRegion: 'United Kingdom,Europe West',
        },
        paragraphIndex: 1,
        bannerText: 'Your membership will expire in 9 days. Make sure to renew so that you don’t loose your benefits with Adobe.',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '15',
      name: '@desc-regression-banners-logged-in-member-certified-user-anniversary-date-next-30-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 10,
          partnerLevel: 'Certified',
          permissionRegion: 'Pacific',
        },
        paragraphIndex: 1,
        bannerText: 'Your membership will expire in 9 days. Make sure to renew so that you don’t loose your benefits with Adobe.',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '16',
      name: '@desc-regression-banners-logged-in-member-registered-user-anniversary-date-next-30-days',
      path: '/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @anonymous',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          daysToAnniversary: 10,
          partnerLevel: 'Registered',
          permissionRegion: 'China',
        },
        paragraphIndex: 1,
        bannerText: 'Your membership will expire in 9 days. Make sure to renew so that you don’t loose your benefits with Adobe.',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '17',
      name: '@desc-regression-banners-sign-in-registered-us-user-anniversary-date-next-30-days',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @circleCi',
      data: {
        partnerLevel: 'cpp-us-registered:',
        paragraphIndex: 1,
        bannerText: 'Your membership will expire',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '18',
      name: '@desc-regression-banners-sign-in-certified-us-user-anniversary-date-last-90-days',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @circleCi',
      data: {
        partnerLevel: 'cpp-us-certified:',
        paragraphIndex: 1,
        bannerText: 'Your account is suspended',
        renewButtonText: 'Renew now',
        renewLinkPath: 'https://channelpartners.adobe.com/s/renewal/',
      },
    },
    {
      tcid: '19',
      name: '@desc-regression-banners-sign-in-gold-user-anniversary-date-out-of-range',
      path: 'https://partners.stage.adobe.com/channelpartners/drafts/automation/regression/public-page?akamaiLocale=na',
      tags: '@dme-banners @regression @circleCi',
      data: {
        partnerLevel: 'cpp-us-gold:',
      },
    },
  ],
};
