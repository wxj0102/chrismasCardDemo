import { createRouter, createWebHistory } from 'vue-router'
import ChrismasCard from './pages/ChrismasCard.vue'
import CarView from './pages/CarView.vue'
import HouseView from './pages/House-view.vue'
import Physical from './pages/Physical.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/chrismas-card',
    component: ChrismasCard
  }, {
    path: '/car-view',
    component: CarView
  }, {
    path: '/house-view',
    component: HouseView
  }, {
    path: '/physical',
    component: Physical
  }]
})

export default router
