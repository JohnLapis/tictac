import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import VueGridLayout from 'vue-grid-layout'

const vm = createApp(App)
      .use(VueGridLayout)
      .use(createI18n({locale: document.children[0].lang, fallbackLocale: 'en'}))
      .mount('#app')
