export default {
  ssr: false,

  head: {
    title: 'localization',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:10000',
    suportLanguages: ['ko', 'ja', 'en', 'es', 'de', 'zh'],
    langTitleMap: {
      'ko' : '한국어',
      'ja' : '일본어',
      'en' : '영어',
      'es' : '스페인어',
      'de' : '독일어',
      'zh' : '중국어'
    },
    baseLanguage: 'ko',
    tokenKey: 'local-access-token'
  },

  css: ['~/assets/styles/main.scss'],

  plugins: [
    '~plugins/GlobalComponents.js',
    '~plugins/Notifications.js',
    '~plugins/Util.js'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
  }
}
