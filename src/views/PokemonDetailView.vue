<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import type { PokemonDetail } from '@/types/pokemon'

const route = useRoute()
const router = useRouter()
const pokemonData = ref<PokemonDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPokemonDetails = async () => {
  try {
    loading.value = true
    const pokemonId = route.params.id
    const response = await axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    pokemonData.value = response.data
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch Pokemon details'
    console.error('Error fetching Pokemon details:', err)
  } finally {
    loading.value = false
  }
}

// Type color mapping for Pokemon types
const getTypeColorClass = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-500',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-700',
    steel: 'bg-slate-500',
    fairy: 'bg-rose-400',
  }
  return typeColors[type] || 'bg-gray-500'
}

// Computed properties for easier access
const mainImage = computed(() => {
  if (!pokemonData.value) return null
  return pokemonData.value.sprites.other?.['official-artwork']?.front_default ||
    pokemonData.value.sprites.front_default
})

const formattedHeight = computed(() => {
  if (!pokemonData.value) return ''
  return `${(pokemonData.value.height / 10).toFixed(1)} m`
})

const formattedWeight = computed(() => {
  if (!pokemonData.value) return ''
  return `${(pokemonData.value.weight / 10).toFixed(1)} kg`
})

const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchPokemonDetails()
})
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-2">Loading Pokemon details...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
        <button @click="goBack"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
          Go Back
        </button>
      </div>
    </div>

    <!-- Pokemon Details -->
    <div v-else-if="pokemonData" class="pb-8">
        {{ pokemonData }}

    </div>
  </main>
</template>
