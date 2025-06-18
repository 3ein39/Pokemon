import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Pokemon } from '@/types/pokemon'

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const allPokemon = ref<Pokemon[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Search, Filter, Sort state
  const searchQuery = ref('')
  const selectedTypes = ref<string[]>([])
  const sortType = ref('alphabetical-asc')

  // Sort options with icon names (clean approach)
  const sortOptions = [
    {
      id: 'alphabetical-asc',
      label: 'Alfabetisch oplopend',
      icon: 'sort-alpha-asc' as const,
    },
    {
      id: 'alphabetical-desc',
      label: 'Alfabetisch aflopend',
      icon: 'sort-alpha-desc' as const,
    },
    {
      id: 'numerical-asc',
      label: 'Numeriek oplopend',
      icon: 'sort-numeric-asc' as const,
    },
    {
      id: 'numerical-desc',
      label: 'Numeriek aflopend',
      icon: 'sort-numeric-desc' as const,
    },
  ]

  // Type color mapping
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
  }

  // Getters (computed)
  const availableTypes = computed(() => {
    const types = new Set<string>()
    allPokemon.value.forEach((pokemon) => {
      pokemon.types.forEach((type) => {
        types.add(type.type.name)
      })
    })
    return Array.from(types).sort()
  })

  // Main computed property that combines search, filter, and sort
  const filteredAndSortedPokemon = computed(() => {
    let result = [...allPokemon.value]

    // Apply search filter
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      result = result.filter((pokemon) => {
        // Search by name
        const nameMatch = pokemon.name.toLowerCase().includes(query)

        // Search by number/ID
        const numberMatch =
          pokemon.id.toString().includes(query) ||
          pokemon.id.toString().padStart(3, '0').includes(query)

        // Search by type
        const typeMatch = pokemon.types.some((type) => type.type.name.toLowerCase().includes(query))

        return nameMatch || numberMatch || typeMatch
      })
    }

    // Apply type filter
    if (selectedTypes.value.length > 0) {
      result = result.filter((pokemon) =>
        pokemon.types.some((type) => selectedTypes.value.includes(type.type.name)),
      )
    }

    // Apply sorting
    switch (sortType.value) {
      case 'alphabetical-asc':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'alphabetical-desc':
        result.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'numerical-asc':
        result.sort((a, b) => a.id - b.id)
        break
      case 'numerical-desc':
        result.sort((a, b) => b.id - a.id)
        break
    }

    return result
  })

  // Actions
  const fetchPokemon = async () => {
    try {
      loading.value = true
      const response = await axios.get(
        'https://stoplight.io/mocks/appwise-be/pokemon/57519009/pokemon',
      )
      allPokemon.value = response.data
      error.value = null
    } catch (err) {
      error.value = 'Failed to fetch Pokemon data'
      console.error('Error fetching Pokemon data:', err)
    } finally {
      loading.value = false
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  const toggleTypeFilter = (typeName: string) => {
    const index = selectedTypes.value.indexOf(typeName)
    if (index > -1) {
      selectedTypes.value.splice(index, 1)
    } else {
      selectedTypes.value.push(typeName)
    }
  }

  const clearTypeFilters = () => {
    selectedTypes.value = []
  }

  const setSortType = (type: string) => {
    sortType.value = type
  }

  const clearAllFilters = () => {
    searchQuery.value = ''
    selectedTypes.value = []
    sortType.value = 'alphabetical-asc'
  }

  return {
    // State
    allPokemon,
    loading,
    error,
    searchQuery,
    selectedTypes,
    sortType,
    sortOptions,
    typeColors,

    // Getters
    availableTypes,
    filteredAndSortedPokemon,

    // Actions
    fetchPokemon,
    setSearchQuery,
    toggleTypeFilter,
    clearTypeFilters,
    setSortType,
    clearAllFilters,
  }
})
