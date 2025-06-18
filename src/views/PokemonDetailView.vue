<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import axios from 'axios'
import type { PokemonDetail } from '@/types/pokemon'

const route = useRoute()
const router = useRouter()
const pokemonStore = usePokemonStore()
const pokemonData = ref<PokemonDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPokemonDetails = async () => {
  try {
    loading.value = true
    const pokemonId = route.params.id
    const response = await axios.get<PokemonDetail>(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
    )
    pokemonData.value = response.data
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch Pokemon details'
    console.error('Error fetching Pokemon details:', err)
  } finally {
    loading.value = false
  }
}

// Get dominant background gradient based on Pokemon's primary type
const getDominantBackgroundStyle = (pokemon: PokemonDetail | null): string => {
  if (!pokemon || !pokemon.types.length) return 'background: linear-gradient(180deg, #9CA3AF 0%, #D1D5DB 100%);'

  const primaryType = pokemon.types[0].type.name
  const typeGradients: { [key: string]: string } = {
    normal: 'background: linear-gradient(180deg, #A8A878 0%, #C5C29E 100%);',
    fire: 'background: linear-gradient(180deg, #F08030 0%, #F5A65B 100%);',
    water: 'background: linear-gradient(180deg, #6890F0 0%, #8FB4F5 100%);',
    electric: 'background: linear-gradient(180deg, #F8D030 0%, #FBE273 100%);',
    grass: 'background: linear-gradient(180deg, #7ECD8B 0%, #89E2B3 100%);',
    ice: 'background: linear-gradient(180deg, #98D8D8 0%, #B8E8E8 100%);',
    fighting: 'background: linear-gradient(180deg, #C03028 0%, #D85A52 100%);',
    poison: 'background: linear-gradient(180deg, #A040A0 0%, #C666C6 100%);',
    ground: 'background: linear-gradient(180deg, #E0C068 0%, #EDD494 100%);',
    flying: 'background: linear-gradient(180deg, #A890F0 0%, #C4B3F5 100%);',
    psychic: 'background: linear-gradient(180deg, #F85888 0%, #FB94B8 100%);',
    bug: 'background: linear-gradient(180deg, #A8B820 0%, #C5D24A 100%);',
    rock: 'background: linear-gradient(180deg, #B8A038 0%, #D4C466 100%);',
    ghost: 'background: linear-gradient(180deg, #705898 0%, #9A82C4 100%);',
    dragon: 'background: linear-gradient(180deg, #7038F8 0%, #9A6BFB 100%);',
    dark: 'background: linear-gradient(180deg, #705848 0%, #9A826B 100%);',
    steel: 'background: linear-gradient(180deg, #B8B8D0 0%, #D1D1E0 100%);',
    fairy: 'background: linear-gradient(180deg, #EE99AC 0%, #F4B8C7 100%);',
  }

  return typeGradients[primaryType] || 'background: linear-gradient(180deg, #9CA3AF 0%, #D1D5DB 100%);'
}

// Computed properties for easier access
const mainImage = computed(() => {
  if (!pokemonData.value) return null
  return (
    pokemonData.value.sprites.other?.['official-artwork']?.front_default ||
    pokemonData.value.sprites.front_default
  )
})

// Check if current Pokemon is in favorites
const isFavorited = computed(() => {
  if (!pokemonData.value) return false
  return pokemonStore.isFavorite(pokemonData.value.id)
})

const goBack = () => {
  router.back()
}

const toggleFavorite = () => {
  if (!pokemonData.value) return
  pokemonStore.toggleFavorite(pokemonData.value.id)
}

onMounted(() => {
  fetchPokemonDetails()
})
</script>

<template>
  <main class="min-h-screen transition-colors duration-300" :style="getDominantBackgroundStyle(pokemonData)">
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

            <!-- Favorite Heart Button -->
            <button @click="toggleFavorite"
              class="p-2 rounded-fullbg-opacity-20 hover:bg-opacity-30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
              <!-- Heart Icon - Filled when favorited, outline when not -->
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
                <g v-if="isFavorited">
                  <path fill="none" d="M0 0H24V24H0z"></path>
                  <path
                    d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
                    fill="#ffffff" stroke="#ffffff"></path>
                </g>
                <g v-else>
                  <path fill="none" d="M0 0H24V24H0z"></path>
                  <path
                    d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
                    fill="none" stroke="#ffffff" stroke-width="2"></path>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </header>



      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p class="text-white mt-2">Loading Pokemon details...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="px-4 py-8">
        <div class="bg-white bg-opacity-90 rounded-lg p-4">
          <p class="text-red-800">{{ error }}</p>
          <button @click="goBack"
            class="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors cursor-pointer">
            Go Back
          </button>
        </div>
      </div>

      <!-- Pokemon Content (temporary placeholder) -->
      <div v-else-if="pokemonData" class="px-4">
        <!-- Pokemon Name - First element with SF Pro Display typography -->
        <div class="px-4">
          <h1 class="pokedex-header text-white capitalize">
            {{ pokemonData.name }}
          </h1>
        </div>

      </div>

    </div>
  </main>
</template>

<style scoped>
.pokedex-header {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 34px;
  line-height: 41px;
  letter-spacing: 0.37px;
}
</style>
