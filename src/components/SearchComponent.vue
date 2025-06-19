<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import { useDebounce } from '@/composables/useDebounce'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'

const pokemonStore = usePokemonStore()
const isSearchActive = ref(false)

// Local search input value (immediate UI update)
const localSearchQuery = ref(pokemonStore.searchQuery)

// Debounced search value (delayed store update)
const debouncedSearchQuery = useDebounce(localSearchQuery, 300)

// Track if search is pending
const isSearchPending = ref(false)

// Watch the debounced value and update the store
watch(debouncedSearchQuery, (newQuery) => {
  pokemonStore.setSearchQuery(newQuery)
  isSearchPending.value = false
}, { immediate: false })

// Watch local search to detect when debouncing starts
watch(localSearchQuery, () => {
  if (localSearchQuery.value !== pokemonStore.searchQuery) {
    isSearchPending.value = true
  }
})

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
  localSearchQuery.value = ''
  pokemonStore.setSearchQuery('')
}
</script>

<template>
  <div class="relative">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <!-- Search Icon or Loading Spinner -->
        <div v-if="isSearchPending" class="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
        <SearchIcon v-else :size="16" />
      </div>

      <input v-model="localSearchQuery" @focus="handleFocus" @blur="handleBlur" type="text"
        placeholder="Search by name, number, or type..."
        class="block w-full pl-10 pr-10 py-3 border-0 rounded-lg leading-5 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0"
        style="background: rgba(239, 240, 241, 1);" />

      <!-- Clear button -->
      <div v-if="localSearchQuery" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button @click="clearSearch" class="h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none">
          <CloseIcon :size="20" />
        </button>
      </div>
    </div>

    <!-- Search Status -->
    <div v-if="localSearchQuery" class="mt-2 text-sm">
      <span v-if="isSearchPending" class="text-blue-500 flex items-center gap-1">
        <div class="animate-spin rounded-full h-3 w-3 border-b border-blue-500"></div>
        Searching...
      </span>
      <span v-else-if="pokemonStore.searchQuery" class="text-gray-600">
        Search results for: "{{ pokemonStore.searchQuery }}"
      </span>
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
