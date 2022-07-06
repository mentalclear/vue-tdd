import { createApp } from 'vue';
import i18n from './locales/i18n';
import App from './App.vue';
import router from './routes/router';
import store from './state/store';

const app = createApp(App);

app.use(i18n);
app.use(router);
app.use(store);
app.mount('#app');
