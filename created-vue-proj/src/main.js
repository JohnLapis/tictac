import { createApp } from 'vue'
import App from './App.vue'

const sth = createApp(App)
const vm = sth.mount('#app')
window.sth = sth
window.vm = vm
