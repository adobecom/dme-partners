export default {
  FeatureName: 'DME Popups',
  features: [
    {
      tcid: '1',
      name: '@desc-regression-geo-pop-up-german-locale',
      path: '/channelpartners/?akamaiLocale=de&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Diese Adobe-Site passt nicht zu Ihrem Standort',
        buttonType: 'Switch:de-us|Geo_Routing_Modal',
        switchLocaleUrl: '/de/channelpartners/?akamaiLocale=de',
      },
    },
    {
      tcid: '2',
      name: '@desc-regression-geo-pop-up-spanish-locale',
      path: '/channelpartners/?akamaiLocale=es&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Este sitio de Adobe no coincide con tu ubicación',
        buttonType: 'Switch:es-us|Geo_Routing_Modal',
        switchLocaleUrl: '/es/channelpartners/?akamaiLocale=es',
      },
    },
    {
      tcid: '3',
      name: '@desc-regression-geo-pop-up-french-locale',
      path: '/channelpartners/?akamaiLocale=fr&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Ce site Adobe ne correspond pas à votre zone géographique',
        buttonType: 'Switch:fr-us|Geo_Routing_Modal',
        switchLocaleUrl: '/fr/channelpartners/?akamaiLocale=fr',
      },
    },
    {
      tcid: '4',
      name: '@desc-regression-geo-pop-up-italian-locale',
      path: '/channelpartners/?akamaiLocale=it&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Questo sito Adobe non corrisponde alla tua posizione geografica',
        buttonType: 'Switch:it-us|Geo_Routing_Modal',
        switchLocaleUrl: '/it/channelpartners/?akamaiLocale=it',
      },
    },
    {
      tcid: '5',
      name: '@desc-regression-geo-pop-up-japanese-locale',
      path: '/channelpartners/?akamaiLocale=jp&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'アドビwebサイトの地域設定がお客様の位置情報と一致しません',
        buttonType: 'Switch:jp-us|Geo_Routing_Modal',
        switchLocaleUrl: '/jp/channelpartners/?akamaiLocale=jp',
      },
    },
    {
      tcid: '6',
      name: '@desc-regression-geo-pop-up-chinese-locale',
      path: '/channelpartners/?akamaiLocale=cn&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: '此 Adobe 网站与您的位置不匹配',
        buttonType: 'Switch:cn-us|Geo_Routing_Modal',
        switchLocaleUrl: '/cn/channelpartners/?akamaiLocale=cn',
      },
    },
    {
      tcid: '7',
      name: '@desc-regression-geo-pop-up-brazilian-locale',
      path: '/channelpartners/?akamaiLocale=br&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Este sitio de Adobe no coincide con tu ubicación',
        buttonType: 'Switch:la-us|Geo_Routing_Modal',
        switchLocaleUrl: '/la/channelpartners/?akamaiLocale=br',
      },
    },
    {
      tcid: '8',
      name: '@desc-regression-accessing-german-public-page-switch-to-spanish-locale',
      path: '/de/channelpartners/?akamaiLocale=es&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Este sitio de Adobe no coincide con tu ubicación',
        switchLocaleButton: 'Switch:es-de|Geo_Routing_Modal',
        stayLocaleButton: 'Stay:de-es|Geo_Routing_Modal',
        switchLocaleUrl: '/es/channelpartners/?akamaiLocale=es',
        stayLocaleUrl: '#',
        clickButtonType: 'Switch:es-de|Geo_Routing_Modal',
        expectedToSeeInURL: '/es/channelpartners/',
      },
    },
    {
      tcid: '9',
      name: '@desc-regression-accessing-german-public-page-stay-on-german-locale',
      path: '/de/channelpartners/?akamaiLocale=es&martech=off',
      tags: '@dme-popups @geo-popups @regression @circleCi',
      data: {
        geoPopUpText: 'Este sitio de Adobe no coincide con tu ubicación',
        switchLocaleButton: 'Switch:es-de|Geo_Routing_Modal',
        stayLocaleButton: 'Stay:de-es|Geo_Routing_Modal',
        switchLocaleUrl: '/es/channelpartners/?akamaiLocale=es',
        stayLocaleUrl: '#',
        clickButtonType: 'Stay:de-es|Geo_Routing_Modal',
        expectedToSeeInURL: '/de/channelpartners/',
      },
    },
  ],
};
