export default {
  FeatureName: 'DME redirects flow',
  features: [
    {
      tcid: '1',
      name: '@redirects-for-na-locale',
      path: '/na/channelpartners/drafts/automation/regression/redirects/redirects-test?georouting=off&martech=off',
      tags: '@dme-redirects @regression @anonymous',
      data: {
        partnerLevel: 'cpp-distributor-us:',
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Distributor',
          permissionRegion: 'North America',
        },
        cbcEnablementLabel: 'cbconnection.adobe.com/en/news/enablement-news-partner-lock',
        cbcEnablementLink: 'https://cbconnection-stage.adobe.com/en/news/enablement-news-partner-lock',
        cbcEnablementLinkSignInUser: 'https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fen%2Fnews%2Fenablement-news-partner-lock',
        helpXAdobeLink: 'https://helpx.adobe.com/',
        oldPortalMainLink: 'https://io-partners-dx.adobe.com/api/v1/web/dx-partners-runtime/sfdc-redirect?program_type=channel&request_type=distributor_finder',
        oldPortalLink: 'https://io-partners-dx.stage.adobe.com/api/v1/web/dx-partners-runtime/sfdc-redirect?program_type=channel&request_type=distributor_finder',
        salesCenterMainLink: 'https://channelpartners.adobe.com/s/salescenter/dashboard',
        salesCenterLink: 'https://channelpartners.stage2.adobe.com/s/salescenter/dashboard',
        adobeLink: 'https://www.adobe.com/',
        businessAdobeLink: 'https://business.adobe.com/',
      },
    },
    {
      tcid: '2',
      name: '@redirects-for-emea-locale',
      path: '/emea/channelpartners/drafts/automation/regression/redirects/redirects-test?georouting=off&martech=off',
      tags: '@dme-redirects @regression @anonymous',
      data: {
        partnerLevel: 'cpp-europe-east-certified:',
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Certified',
          permissionRegion: 'Europe East',
        },
        cbcEnablementLabel: 'cbconnection.adobe.com/en/news/enablement-news-partner-lock',
        cbcEnablementLink: 'https://cbconnection-stage.adobe.com/en/news/enablement-news-partner-lock',
        cbcEnablementLinkSignInUser: 'https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fen%2Fnews%2Fenablement-news-partner-lock',
        helpXAdobeLink: 'https://helpx.adobe.com/uk/',
        oldPortalMainLink: 'https://io-partners-dx.adobe.com/api/v1/web/dx-partners-runtime/sfdc-redirect?program_type=channel&request_type=distributor_finder',
        oldPortalLink: 'https://io-partners-dx.stage.adobe.com/api/v1/web/dx-partners-runtime/sfdc-redirect?program_type=channel&request_type=distributor_finder',
        salesCenterMainLink: 'https://channelpartners.adobe.com/s/salescenter/dashboard',
        salesCenterLink: 'https://channelpartners.stage2.adobe.com/s/salescenter/dashboard',
        adobeLink: 'https://www.adobe.com/uk/',
        businessAdobeLink: 'https://business.adobe.com/uk/',
      },
    },
    {
      tcid: '3',
      name: '@redirects-for-cn-locale',
      path: '/cn/channelpartners/drafts/automation/regression/redirects/redirects-test?georouting=off&martech=off',
      tags: '@dme-redirects @regression @anonymous',
      data: {
        partnerLevel: 'cpp-china-registered:',
        partnerData: {
          partnerPortal: 'CPP',
          partnerLevel: 'Registered',
          permissionRegion: 'China',
        },
        cbcEnablementLabel: 'cbconnection.adobe.com/en/news/enablement-news-partner-lock',
        cbcEnablementLink: 'https://cbconnection-stage.adobe.com/zh_cn/news/enablement-news-partner-lock',
        cbcEnablementLinkSignInUser: 'https://cbconnection-stage.adobe.com/bin/fusion/modalImsLogin?resource=%2Fzh_cn%2Fnews%2Fenablement-news-partner-lock',
        helpXAdobeLink: 'https://helpx.adobe.com/cn/',
        oldPortalMainLink: 'https://io-partners-dx.adobe.com/api/v1/web/dx-partners-runtime/sfdc-redirect?program_type=channel&request_type=distributor_finder',
        oldPortalLink: 'https://io-partners-dx.stage.adobe.com/api/v1/web/dx-partners-runtime/sfdc-redirect?program_type=channel&request_type=distributor_finder',
        salesCenterMainLink: 'https://channelpartners.adobe.com/s/salescenter/dashboard',
        salesCenterLink: 'https://channelpartners.stage2.adobe.com/s/salescenter/dashboard',
        adobeLink: 'https://www.adobe.com/cn/',
        businessAdobeLink: 'https://business.adobe.com/cn/',
      },
    },
  ],
};
