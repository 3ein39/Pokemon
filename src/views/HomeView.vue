<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Pokemon } from '@/types/pokemon'
import PokemonListItem from '@/components/PokemonListItem.vue'

const pokemonData = ref<Pokemon[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPokemonData = async () => {
  try {
    loading.value = true
    const response = await axios.get(
      'https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon',
    )
    pokemonData.value = response.data
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch Pokemon data'
    console.error('Error fetching Pokemon data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPokemonData()
})
</script>

<template>
  <main class="min-h-screen">

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-2">Loading Pokémon...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ error }}</p>
      </div>
    </div>

    <!-- Pokemon List -->
    <div v-else class="px-4 py-4">
      <div class="space-y-3">
        <PokemonListItem v-for="pokemon in pokemonData" :key="pokemon.id" :pokemon="pokemon" />
      </div>
    </div>
  </main>
</template>
