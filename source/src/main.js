import { createApp } from 'vue';
import i18n from './locales/i18n';
import App from './App.vue';
import router from './routes/router';

const app = createApp(App);

app.use(router);
app.use(i18n);
app.mount('#app');
