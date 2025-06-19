import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: () => import('../views/PokemonDetailView.vue'),
      beforeEnter: (to) => {
        // Validate that ID is a number
        const id = parseInt(to.params.id as string)
        if (isNaN(id) || id < 1 || id > 1010) {
          return { name: 'not-found' }
        }
      },
    },
    {
      path: '/team',
      name: 'team',
      component: () => import('../views/TeamView.vue'),
    },
    {
      path: '/favourites',
      name: 'favourites',
      component: () => import('../views/FavouritesView.vue'),
    },
    {
      path: '/404',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      // Catch-all route for 404s - must be last
      path: '/:pathMatch(.*)*',
      redirect: { name: 'not-found' },
    },
  ],
})

export default router
