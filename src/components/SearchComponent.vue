<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Pokemon } from '@/types/pokemon'

interface Props {
  pokemon: Pokemon[]
}

interface Emits {
  (e: 'search', filteredPokemon: Pokemon[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const searchQuery = ref('')
const isSearchActive = ref(false)

// Computed property for filtered Pokemon
const filteredPokemon = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.pokemon
  }

  const query = searchQuery.value.toLowerCase().trim()

  return props.pokemon.filter((pokemon) => {
    // Search by name
    const nameMatch = pokemon.name.toLowerCase().includes(query)

    // Search by number/ID
    const numberMatch = pokemon.id.toString().includes(query) ||
      pokemon.id.toString().padStart(3, '0').includes(query)

    // Search by type
    const typeMatch = pokemon.types.some(type =>
      type.type.name.toLowerCase().includes(query)
    )

    return nameMatch || numberMatch || typeMatch
  })
})

// Watch for changes and emit filtered results
const handleSearch = () => {
  emit('search', filteredPokemon.value)
}

// Handle input focus/blur
const handleFocus = () => {
  isSearchActive.value = true
}

const handleBlur = () => {
  // Small delay to allow for potential clicks on search results
  setTimeout(() => {
    isSearchActive.value = false
  }, 200)
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  emit('search', props.pokemon)
}

// Watch for search query changes
import { watch } from 'vue'
watch(searchQuery, () => {
  handleSearch()
})
</script>

<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <!-- Search Icon -->
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.3833 12.8767C7.76953 12.8767 9.04785 12.4285 10.0938 11.6814L14.0283 15.616C14.2109 15.7986 14.4517 15.8899 14.709 15.8899C15.2485 15.8899 15.6304 15.4749 15.6304 14.9436C15.6304 14.6946 15.5474 14.4539 15.3647 14.2795L11.4551 10.3616C12.2769 9.28247 12.7666 7.94604 12.7666 6.49341C12.7666 2.98218 9.89453 0.110107 6.3833 0.110107C2.88037 0.110107 0 2.97388 0 6.49341C0 10.0046 2.87207 12.8767 6.3833 12.8767ZM6.3833 11.4988C3.64404 11.4988 1.37793 9.23267 1.37793 6.49341C1.37793 3.75415 3.64404 1.48804 6.3833 1.48804C9.12256 1.48804 11.3887 3.75415 11.3887 6.49341C11.3887 9.23267 9.12256 11.4988 6.3833 11.4988Z"
            fill="#3C3C43" fill-opacity="0.6" />
        </svg>
      </div>

      <input v-model="searchQuery" @focus="handleFocus" @blur="handleBlur" type="text"
        placeholder="Pokemon zoeken"
        class="block w-full pl-10 pr-10 py-3 border-0 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0"
        style="background: rgba(239, 240, 241, 1);" />

      <!-- Clear button -->
      <div v-if="searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button @click="clearSearch" class="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Results Count -->
    <div v-if="searchQuery" class="mt-2 text-sm text-gray-600">
      {{ filteredPokemon.length }} {{ filteredPokemon.length === 1 ? 'result' : 'results' }} found
    </div>
  </div>
</template>

<style scoped>
/* Add subtle animation for search input */
input {
  transition: all 0.2s ease-in-out;
}

input:focus {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
