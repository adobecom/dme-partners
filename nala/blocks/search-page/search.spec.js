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
        }
      },
    ]
}