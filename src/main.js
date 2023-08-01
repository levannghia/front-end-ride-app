import './assets/style.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Echo from 'laravel-echo'
import Pusher from 'pusher-js';
import VueGoogleMaps from '@fawmi/vue-google-maps'

import App from './App.vue'
import router from './router'

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'mykey',
    cluster: 'mt1',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    // encrypted: true,
    enabledTransports: ['ws', 'wss']

});

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyCAqdwRPpTtDGc6lWZKlSO0EPgkAKRo-8o',
        language: 'vi',
        libraries: "places",
    },
})
app.mount('#app')
