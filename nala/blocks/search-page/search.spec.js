export default {
    FeatureName: 'Search Tests',
    features: [
    {
      tcid: '1',
      name: '@na-validate-assets-present-for-user',
      path: '/channelpartners/home/search/?georouting=off&martech=off',
      tags: '@dme-search @regression @circleCi', 
      data: {
        partnerLevel: 'cpp-distributor-us:',
        signInButtonInternationalText: 'Sign In',
        searchKeyWord: 'automationregressionkeyword',
        asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
        assetURL: '/assets/public/public_1/MAPC_public_stage.pdf',
        iconPdf: 'pdf',
        asset1Tag1: 'Advertising',
        asset1Tag2: 'Arabic',
        asset1Tag3: 'Adobe Acrobat',
        asset1Tag4: 'Channel Authorization Letter',
        httpStatusCode: 200,
        asset2: 'MAPC stage education (level: distributor, gold) (region: Asia Pacific, Japan, Latin America, North America',
        descriptionText: 'Asset Type: Advertising, Channel Copy, Language: English International (EI), Spanish, Product: Adobe Acrobat, Adobe Connect, Topic: Channel Authorization Letter, Onboarding',
        iconXLS: 'excel',
        asset3: 'MAPC stage worldwide (no partner level, no specializations)',
        iconDef: 'default',
        asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
        iconDoc: 'word',
      }
    },
    {
        tcid: '2',
        name: '@na-validate-search-page-filters-part-one',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-distributor-us:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage education (level: distributor, gold) (region: Asia Pacific, Japan, Latin America, North America',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          nextPageAsset: 'Weights_Measurements_EL 2024 (24.0)_Keycard_NA',
          page3Asset: 'Partner Portal (APC) Announcement Submission Form',
        }
      },

      {
        tcid: '3',
        name: '@na-validate-search-page-filters-part-two',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-europe-east-certified:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage education (level: distributor, gold) (region: Asia Pacific, Japan, Latin America, North America',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          nextPageAsset: 'Weights_Measurements_EL 2024 (24.0)_Keycard_NA',
          page3Asset: 'Partner Portal (APC) Announcement Submission Form',
        }
      },
      {
        tcid: '4',
        name: '@apac-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-distributor-india:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage education (level: distributor, gold) (region: Asia Pacific, Japan, Latin America, North America',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
        }
      },
      {
        tcid: '5',
        name: '@china-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-china-registered:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage government (level: registered, certified, platinum) (region: China, Europe East, Latin America (NA based))',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
        }
      },
      {
        tcid: '6',
        name: '@west-europe-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-spain-platinum:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage no specialization (level: distributor, gold, platinum) (regions: EMEA, Latin America (NA based), Pacific)',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          asset5: 'MAPC stage education government (level: gold, platinum) (region: Europe West, United Kingdom)',
        }
      },
      {
        tcid: '7',
        name: '@japan-europe-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-distributor-japan:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage no specialization (level: distributor, gold, platinum) (regions: EMEA, Latin America (NA based), Pacific)',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          asset5: 'MAPC stage education government (level: gold, platinum) (region: Europe West, United Kingdom)',
        }
      },
      {
        tcid: '8',
        name: '@latin-america-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-latin-america-gold:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC special characters asset: "? ! | <> * !@#$%^&*()_+~`<>?\'|”{}][ уљађз"',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          asset5: 'Asset with a very long title very long very long very long very long very long very long very long very long Automation very long very long very long very long very long very long very long very long',
        }
      },
      {
        tcid: '9',
        name: '@latin-america-na-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-latin-na-platinum:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage government (level: registered, certified, platinum) (region: China, Europe East, Latin America (NA based))',
          asset3: 'MAPC stage worldwide (no partner level, no specializations)',
          asset4: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          asset5: 'MAPC stage no specialization (level: distributor, gold, platinum) (regions: EMEA, Latin America (NA based), Pacific)',
        }
      },
      {
        tcid: '10',
        name: '@pacific-user-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-pacific-certified:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage worldwide (no partner level, no specializations)',
          asset3: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          asset4: 'MAPC stage no specialization (level: distributor, gold, platinum) (regions: EMEA, Latin America (NA based), Pacific)',
        }
      },
      {
        tcid: '11',
        name: '@uk-user-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-uk-gold:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC public stage (no partner level, no program type, no region, no specializations)',
          asset2: 'MAPC stage worldwide (no partner level, no specializations)',
          asset3: 'MAPC stage combined (all levels, regions (except worldwide), no specializations)',
          asset4: 'MAPC stage no specialization (level: distributor, gold, platinum) (regions: EMEA, Latin America (NA based), Pacific)',
          asset5: 'MAPC stage education government (level: gold, platinum) (region: Europe West, United Kingdom)',
          asset6: 'MAPC stage education (level: distributor, gold) (region: Asia Pacific, Japan, Latin America, North America',
        }
      },

      {
        tcid: '12',
        name: '@korea-user-asset-validation-search-page',
        path: '/channelpartners/home/search/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-kr-gold:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          asset1: 'MAPC Education Elite',
          asset2: 'MAPC Government Elite',
          asset3: 'MAPC Substance Elite',
          asset4: 'MAPC VIP Marketplace',
        }
      },
      {
        tcid: '13',
        name: '@search-page-validation-search-page-test',
        path: '/channelpartners/?georouting=off&martech=off',
        tags: '@dme-search @regression @circleCi', 
        data: {
          partnerLevel: 'cpp-europe-east-certified:',
          signInButtonInternationalText: 'Sign In',
          searchKeyWord: 'automationregressionkeyword',
          searchText: 'Adobe',
        }
      },
    ]
}