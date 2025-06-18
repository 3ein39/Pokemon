<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

// Check if current route is a Pokemon detail page
const isPokemonDetailPage = computed(() => {
  return route.name === 'pokemon-detail' || route.path.startsWith('/pokemon/')
})
const isFavoritePage = computed(() => {
  return route.name === 'favourites' || route.path.startsWith('/favourites')
})

const isTeamPage = computed(() => {
  return route.name === 'team' || route.path.startsWith('/team')
})
</script>

<template>
  <div id="app" :class="{ 'bg-gray-50': !isPokemonDetailPage }">
    <!-- Full-width for Pokemon detail pages -->
    <main v-if="isPokemonDetailPage || isFavoritePage || isTeamPage">
      <RouterView />
    </main>
    <!-- Container for other pages -->
    <main v-else class="container mx-auto p-4">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
}
</style>

<style scoped></style>
