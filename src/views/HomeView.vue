<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonListItem from '@/components/PokemonListItem.vue'
import HomeCard from '@/components/HomeCard.vue'
import SearchComponent from '@/components/SearchComponent.vue'
import FilterSortComponent from '@/components/FilterSortComponent.vue'
import SortModal from '@/components/SortModal.vue'
import FilterModal from '@/components/FilterModal.vue'

const pokemonStore = usePokemonStore()

// Modal state
const showSortModal = ref(false)
const showFilterModal = ref(false)

// Handle filter button click
const handleFilter = () => {
  showFilterModal.value = true
}

// Handle filter modal close
const closeFilterModal = () => {
  showFilterModal.value = false
}

// Handle sort button click
const handleSort = () => {
  showSortModal.value = true
}

// Handle sort modal close
const closeSortModal = () => {
  showSortModal.value = false
}

onMounted(() => {
  pokemonStore.fetchPokemon()
})
</script>

<template>
  <main class="min-h-screen">
    <!-- Header with title and filter/sort buttons -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="pokedex-header">Pokédex</h1>
      <FilterSortComponent @filter="handleFilter" @sort="handleSort" />
    </div> <!-- Search Component -->
    <div class="mb-6">
      <SearchComponent />
    </div>

    <div class="flex justify-between gap-4 my-6">
      <HomeCard title="Mijn team" type="team"> </HomeCard>

      <HomeCard title="Favorieten" type="favourites"> </HomeCard>
    </div>

    <!-- Loading State -->
    <div v-if="pokemonStore.loading" class="flex justify-center items-center py-12">
      <div class="text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 mt-2">Loading Pokémon...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="pokemonStore.error" class="px-4 py-8">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-800">{{ pokemonStore.error }}</p>
      </div>
    </div>

    <!-- Pokemon List -->
    <div v-else>
      <!-- Pokemon List -->
      <div class="space-y-3">
        <PokemonListItem v-for="pokemon in pokemonStore.filteredAndSortedPokemon" :key="pokemon.id"
          :pokemon="pokemon" />
      </div>

      <!-- No Results Message -->
      <div v-if="pokemonStore.filteredAndSortedPokemon.length === 0 && pokemonStore.allPokemon.length > 0"
        class="text-center py-8">
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

    <!-- Sort Modal -->
    <SortModal :is-open="showSortModal" @close="closeSortModal" />

    <!-- Filter Modal -->
    <FilterModal :is-open="showFilterModal" @close="closeFilterModal" />
  </main>
</template>

<style scoped>
.pokedex-header {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 34px;
  line-height: 41px;
  letter-spacing: 0.37px;
  color: #000000;
}
</style>
