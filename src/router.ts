import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import ChrismasCard from './pages/ChrismasCard.vue'
import CarView from './pages/CarView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/chrismas-card',
    component: ChrismasCard
  }, {
    path: '/car-view',
    component: CarView
  }]
})

export default router
