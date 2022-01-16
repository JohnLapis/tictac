import { createApp } from 'vue'
import App from './App.vue'
import VueGridLayout from 'vue-grid-layout'

const vm = createApp(App).use(VueGridLayout).mount('#app')
