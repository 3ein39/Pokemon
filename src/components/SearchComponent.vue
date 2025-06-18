<script setup lang="ts">
import { ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'

const pokemonStore = usePokemonStore()
const isSearchActive = ref(false)

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
  pokemonStore.setSearchQuery('')
}

// Handle input changes
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  pokemonStore.setSearchQuery(target.value)
}
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

      <input :value="pokemonStore.searchQuery" @input="handleInput" @focus="handleFocus" @blur="handleBlur" type="text"
        placeholder="Search by name, number, or type..."
        class="block w-full pl-10 pr-10 py-3 border-0 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0"
        style="background: rgba(239, 240, 241, 1);" />

      <!-- Clear button -->
      <div v-if="pokemonStore.searchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button @click="clearSearch" class="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Search Results Count -->
    <div v-if="pokemonStore.searchQuery" class="mt-2 text-sm text-gray-600">
      Search active for: "{{ pokemonStore.searchQuery }}"
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
