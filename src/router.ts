import { createRouter, createWebHistory } from 'vue-router';
import ChrismasCard from './pages/ChrismasCard.vue';
import CarView from './pages/CarView.vue';
import HouseView from './pages/house-view.vue';
import Physical from './pages/physical.vue';
import Physical2 from './pages/Physical2/Physical2.vue';
import Physical3 from './pages/Physical2/Physical3.vue';
import Physical4 from './pages/Physical2/Physical4.vue';

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
  }, {
    path: '/Physical4',
    component: Physical4,
  }],
});

export default router;
