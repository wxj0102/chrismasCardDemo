import { createRouter, createWebHistory } from 'vue-router';
import ChrismasCard from './pages/ChrismasCard.vue';
import CarView from './pages/CarView.vue';
import HouseView from './pages/House-view.vue';
import Physical from './pages/Physical.vue';
import Physical2 from './pages/Physical2/Physical2.vue';
import Physical3 from './pages/Physical2/Physical3.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/chrismas-card',
    component: ChrismasCard,
  }, {
    path: '/car-view',
    component: CarView,
  }, {
    path: '/house-view',
    component: HouseView,
  }, {
    path: '/physical',
    component: Physical,
  }, {
    path: '/physical2',
    component: Physical2,
  }, {
    path: '/physical3',
    component: Physical3,
  }],
});

export default router;
