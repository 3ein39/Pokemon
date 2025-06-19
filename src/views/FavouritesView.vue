<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonListItem from '@/components/PokemonListItem.vue'

const router = useRouter()
const pokemonStore = usePokemonStore()
const isInitializing = ref(false)

// Get favorite Pokemon from the store
const favoritePokemon = computed(() => pokemonStore.favoritePokemon)

// Computed property to check if we should show loading
const showLoading = computed(() => {
  return pokemonStore.loading || isInitializing.value
})

// Ensure Pokemon data is loaded when component mounts
onMounted(async () => {
  // If Pokemon data hasn't been loaded yet, fetch it
  if (pokemonStore.allPokemon.length === 0) {
    isInitializing.value = true
    try {
      await pokemonStore.fetchPokemon()
    } catch (error) {
      console.error('Error fetching Pokemon:', error)
    } finally {
      isInitializing.value = false
    }
  }
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <main class="min-h-screen favorites-gradient">
    <div class="container mx-auto">
      <!-- Header -->
      <header class="relative z-10">
        <div class="px-4 py-4">
          <div class="flex items-center justify-between">
            <!-- Back Button with Text -->
            <button @click="goBack"
              class="flex items-center gap-2 text-white hover:text-gray-200 transition-colors cursor-pointer">
              <!-- Back Arrow -->
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M13.5 7.00024C13.756 7.00024 14.012 7.09824 14.207 7.29324C14.598 7.68424 14.598 8.31624 14.207 8.70724L10.902 12.0122L14.082 15.3052C14.465 15.7032 14.454 16.3362 14.057 16.7192C13.659 17.1022 13.026 17.0912 12.643 16.6952L8.781 12.6952C8.402 12.3022 8.407 11.6792 8.793 11.2932L12.793 7.29324C12.988 7.09824 13.244 7.00024 13.5 7.00024Z"
                  fill="currentColor" />
              </svg>
              <span class="text-lg font-medium">Terug</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Page Title -->
      <div class="px-4 pb-6">
        <h1 class="pokedex-header text-white">
          Favorieten
        </h1>
      </div>

      <!-- Favorites Content -->
      <div class="px-4 pb-8">
        <!-- Loading State -->
        <div v-if="showLoading" class="flex justify-center items-center py-12">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
            <p class="text-white mt-2">Loading favorites...</p>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="favoritePokemon.length === 0" class="text-center py-12">
          <div class="text-white text-6xl mb-4">💫</div>
          <h3 class="text-xl font-semibold text-white mb-2">No Favorites Yet</h3>
          <p class="text-white text-opacity-80 mb-6">
            Start exploring Pokemon and add your favorites!
          </p>
          <button @click="router.push('/')"
            class="px-6 py-3 border hover:cursor-pointer hover:bg-white/10 text-white font-medium rounded-full transition-all duration-200">
            Explore Pokemon
          </button>
        </div>

        <!-- Favorites List -->
        <div v-else class="space-y-3">
          <PokemonListItem v-for="pokemon in favoritePokemon" :key="pokemon.id" :pokemon="pokemon" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.favorites-gradient {
  background: linear-gradient(109.73deg, #65CB9A 0%, #15D0DC 100%);
}

.pokedex-header {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 34px;
  line-height: 41px;
  letter-spacing: 0.37px;
}

.card-shadow {
  box-shadow: 0px 15px 15px 0px rgba(0, 0, 0, 0.1);
}
</style>
