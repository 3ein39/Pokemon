<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { Pokemon } from '@/types/pokemon'
import PokemonListItem from '@/components/PokemonListItem.vue'
import HomeCard from '@/components/HomeCard.vue'
import SearchComponent from '@/components/SearchComponent.vue'

const pokemonData = ref<Pokemon[]>([])
const filteredPokemon = ref<Pokemon[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPokemonData = async () => {
  try {
    loading.value = true
    const response = await axios.get(
      'https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon',
    )
    pokemonData.value = response.data
    filteredPokemon.value = response.data
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch Pokemon data'
    console.error('Error fetching Pokemon data:', err)
  } finally {
    loading.value = false
  }
}

// Handle search filtering
const handleSearch = (filtered: Pokemon[]) => {
  filteredPokemon.value = filtered
}

onMounted(() => {
  fetchPokemonData()
})
</script>

<template>
  <main class="min-h-screen">
    <div class="flex justify-between gap-4">
      <HomeCard title="Mijn team" type="team"> </HomeCard>

      <HomeCard title="Favorieten" type="favourites"> </HomeCard>
    </div>

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
    <div v-else class="py-6">
      <!-- Search Component -->
      <div class="mb-6">
        <SearchComponent :pokemon="pokemonData" @search="handleSearch" />
      </div>

      <!-- Pokemon List -->
      <div class="space-y-3">
        <PokemonListItem v-for="pokemon in filteredPokemon" :key="pokemon.id" :pokemon="pokemon" />
      </div>

      <!-- No Results Message -->
      <div v-if="filteredPokemon.length === 0 && pokemonData.length > 0" class="text-center py-8">
        <div class="text-gray-500">
          <svg class="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.205-2.178C5.205 12.224 5 11.624 5 11V7a7 7 0 1114 0v4c0 .624-.205 1.224-.795 1.822z" />
          </svg>
          <p class="text-lg font-medium text-gray-900">No Pokémon found</p>
          <p class="text-sm text-gray-500 mt-1">Try adjusting your search terms</p>
        </div>
      </div>
    </div>
  </main>
</template>
