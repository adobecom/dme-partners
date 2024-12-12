export default {
  FeatureName: 'DME Announcements page',
  features: [
    {
      tcid: '1',
      name: '@desc-regression-announcements-page-search',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression @anonymous @circleCi',
      data: {
        numberOfPublicCards: 7,
        numberOfMatchingDescCards: 6,
        numberOfMatchingTitleCards: 1,
        firstCardTitle: 'Automation regression announcements card worldwide no1',
        secondCardTitle: 'Automation regression announcements card worldwide no2',
        searchCards: 'Automation regression',
      },
    },
    {
      tcid: '2',
      name: '@desc-regression-announcements-page-load-more-sort',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression @anonymous @circleCi',
      data: {
        numberOfPublicCards: 7,
        numberOfMatchingDescCards: 6,
        searchCards: 'Automation regression',
        firstLoadResult: '2 of 6 results',
        secondLoadResult: '4 of 6 results',
        thirdLoadResult: '6 of 6 results',
      },
    },
    {
      tcid: '3',
      name: '@desc-regression-announcements-page-pagination',
      path: '/channelpartners/drafts/automation/regression/announcements-paginated?georouting=off&martech=off',
      tags: '@dme-announcements @regression @anonymous @circleCi',
      data: {
        numberOfPublicCards: 7,
        numberOfMatchingDescCards: 6,
        searchCards: 'Automation regression',
        firstPageResult: '1 - 2 of 6 results',
        secondPageResult: '3 - 4 of 6 results',
        thirdPageResult: '5 - 6 of 6 results',
        pageButtonNumber: 2,
        totalPageCount: 3,
      },
    },
    {
      tcid: '4',
      name: '@desc-regression-announcements-page-filters',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression @anonymous @circleCi',
      data: {
        numberOfPublicCards: 7,
        filterDate: 'Date',
        filterProduct: 'Product',
        filterSales: 'Sales',
        filterMarketing: 'Marketing',
        filterSolutions: 'Solutions',
        filterAdvertising: 'Advertising',
        filterAudience: 'Audience',
        filterPracticeLead: 'Practice Lead',
        filterLastNinetyDays: 'Last 90 days',
        cardsWithSalesAndPracticeLead: 2,
        cardsWithAdvertisingAndSolutions: 2,
        cardsWithAdvertising: 1,
        cardsWithLastNinetyDays: 1,
        cardsWithProduct: 2,
        cardsWithSales: 1,
        titleOfDateFilteredCard: 'Automation regression announcements card Worldwide no4',
        numberOfAudienceFiltersSelected: 2,
      },
    },
    {
      tcid: '5',
      name: '@desc-regression-announcements-page-read-article',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression @anonymous @circleCi',
      data: {
        searchCardTitle: 'Automation regression announcements card worldwide no1',
        numberOfMatchingTitleCards: 1,
        expectedToSeeInURL: '/channelpartners/drafts/automation/regression/cards/cpp-worldwide-no1',
      },
    },
    {
      tcid: '6',
      name: '@desc-announcements-page-edge-cases',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression @anonymous @circleCi',
      data: {
        numberOfPublicCards: 7,
        specialCharsTitleSearch: '? ! | <> * !@#$%^&*()_+~`<>?\\’|”{}][ уљађз',
        cardsWithSpecialChars: 1,
        dateInPastTitleSearch: 'Automation regression announcements card worldwide date in past',
        cardsWithDateInPast: 0,
        eventEndedTitleSearch: 'Automation regression announcements card worldwide event ended',
        cardsWithEventEnded: 0,
        tooLongTitleSearch: 'Automation regression announcements card worldwide too long title',
        cardsWithTooLongTitle: 1,
        noCollectionTagTitleSearch: 'Automation regression announcements card worldwide without collection tag',
        cardsWithoutCollectionTag: 0,
        noTitleSearch: 'Without card title',
        cardsWithoutTitle: 0,
        defaultCardTitle: 'Adobe Partner Connection',
      },
    },
    {
      tcid: '7',
      name: '@desc-regression-announcements-distributor-north-america',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Distributor',
          permissionRegion: 'North America',
        },
        announcementCardTitle: 'CPP Distributor North America Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Distributor Japan Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '8',
      name: '@desc-regression-announcements-distributor-japan',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Distributor',
          permissionRegion: 'Japan',
        },
        announcementCardTitle: 'CPP Distributor Japan Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Distributor India Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '9',
      name: '@desc-regression-announcements-distributor-india',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Distributor',
          permissionRegion: 'Asia Pacific',
        },
        announcementCardTitle: 'CPP Distributor India Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Platinum Spain Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '10',
      name: '@desc-regression-announcements-platinum-spain',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Platinum',
          permissionRegion: 'Europe West',
        },
        announcementCardTitle: 'CPP Platinum Spain Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Platinum Latin America-North America based Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '11',
      name: '@desc-regression-announcements-platinum-latin-america-na-based',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Platinum',
          permissionRegion: 'Latin America NA based',
        },
        announcementCardTitle: 'CPP Platinum Latin America-North America based Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Platinum EMEA Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '12',
      name: '@desc-regression-announcements-platinum-emea',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Platinum',
          permissionRegion: 'EMEA',
        },
        announcementCardTitle: 'CPP Platinum EMEA Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Gold Latin America Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '13',
      name: '@desc-regression-announcements-gold-latin-america',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Gold',
          permissionRegion: 'Latin America',
        },
        announcementCardTitle: 'CPP Gold Latin America Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Gold UK, Europe West Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '14',
      name: '@desc-regression-announcements-gold-uk-europe-west',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Gold',
          permissionRegion: 'United Kingdom%2CEurope West',
        },
        announcementCardTitle: 'CPP Gold UK, Europe West Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Certified Europe East Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '15',
      name: '@desc-regression-announcements-certified-europe-east',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Certified',
          permissionRegion: 'Europe East',
        },
        announcementCardTitle: 'CPP Certified Europe East Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Certified Pacific Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '16',
      name: '@desc-regression-announcements-certified-pacific',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Certified',
          permissionRegion: 'Pacific',
        },
        announcementCardTitle: 'CPP Certified Pacific Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Registered China Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '17',
      name: '@desc-regression-announcements-registered-china',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Registered',
          permissionRegion: 'China',
        },
        announcementCardTitle: 'CPP Registered China Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Registered Middle East & Africa Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '18',
      name: '@desc-regression-announcements-registered-middle-east-and-africa',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Registered',
          permissionRegion: 'Middle East and Africa',
        },
        announcementCardTitle: 'CPP Registered Middle East & Africa Announcement',
        numberOfMatchingTitleCards: 1,
        announcementDiffRegionCardTitle: 'CPP Distributor North America Announcement',
        zeroCards: 0,
      },
    },
    {
      tcid: '19',
      name: '@desc-regression-logged-in-platinum-user',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Platinum',
          permissionRegion: 'Europe West',
        },
        platinumCardTitle: 'CPP Platinum Spain Announcement',
        totalNumberOfCards: 11,
        numberOfMatchingTitleCards: 1,
      },
    },
    {
      tcid: '20',
      name: '@desc-regression-logged-in-gold-user',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Gold',
          permissionRegion: 'Latin America',
        },
        higherPartnerLevelCardTitle: 'CPP Platinum Latin America Announcement',
        partnerLevelCardTitle: 'CPP Gold Latin America Announcement',
        totalNumberOfCards: 10,
        numberOfHigherPartnerLevelCards: 0,
        numberOfPartnerLevelCards: 1,
      },
    },
    {
      tcid: '21',
      name: '@desc-regression-logged-in-certified-user',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Certified',
          permissionRegion: 'Europe East',
        },
        higherPartnerLevelCardTitle: 'CPP Gold Europe East Announcement',
        partnerLevelCardTitle: 'CPP Certified Europe East Announcement',
        totalNumberOfCards: 9,
        numberOfHigherPartnerLevelCards: 0,
        numberOfPartnerLevelCards: 1,
      },
    },
    {
      tcid: '22',
      name: '@desc-regression-logged-in-registered-user',
      path: '/channelpartners/drafts/automation/regression/announcements?georouting=off&martech=off',
      tags: '@dme-announcements @regression',
      data: {
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Registered',
          permissionRegion: 'China',
        },
        higherPartnerLevelCardTitle: 'CPP Certified China Announcement',
        partnerLevelCardTitle: 'CPP Registered China Announcement',
        totalNumberOfCards: 8,
        numberOfHigherPartnerLevelCards: 0,
        numberOfPartnerLevelCards: 1,
      },
    },
  ],
};
