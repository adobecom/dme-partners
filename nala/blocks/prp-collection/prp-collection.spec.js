export default {
    FeatureName: 'PRP Collection',
    features: [
        {
            tcid: '1',
            name: '@prp-collection-apac-campus-store',
            path: '/apac/channelpartners/drafts/automation/regression/prp-collections/new-specializations-automation?georouting=off&martech=off',
            tags: '@prp-collection @regression @circleCi',
            data: {
                partnerLevel: 'cpp-distributor-india:',
                goTo: '/apac/channelpartners/home/search/?term=specializationsautomation',
                title: 'Campus Store Automation',
            }
        },
        {
            tcid: '2',
            name: '@prp-collection-fr-comercial',
            path: '/fr/channelpartners/drafts/automation/regression/prp-collections/new-specializations-automation?georouting=off&martech=off',
            tags: '@prp-collection @regression @circleCi',
            data: {
                partnerLevel: 'cpp-eur-east-fr:',
                goTo: '/fr/channelpartners/home/search/?term=specializationsautomation',
                title: 'Commercial Automation',
            }
        },
        {
            tcid: '3',
            name: '@prp-collection-emea-online-retail',
            path: '/emea/channelpartners/drafts/automation/regression/prp-collections/new-specializations-automation?georouting=off&martech=off',
            tags: '@prp-collection @regression @circleCi',
            data: {
                partnerLevel: 'cpp-eurwest:',
                goTo: '/emea/channelpartners/home/search/?term=specializationsautomation',
                title: 'Online Retail Automation',
            }
        },
        {
            tcid: '4',
            name: '@prp-collection-na-retail',
            path: '/na/channelpartners/drafts/automation/regression/prp-collections/new-specializations-automation?georouting=off&martech=off',
            tags: '@prp-collection @regression @circleCi',
            data: {
                partnerLevel: 'cpp-na-certified:',
                goTo: '/na/channelpartners/home/search/?term=specializationsautomation',
                title: 'Retail Automation',
            }
        },
    ],
};