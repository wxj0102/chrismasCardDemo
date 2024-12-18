import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { loadAmmo } from './utils/utils';


loadAmmo().then(() => {
  const app = createApp(App);
  app.use(router);
  app.mount('#app');
});
