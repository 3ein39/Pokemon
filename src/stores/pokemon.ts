import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type { Pokemon, PokemonSpecies } from '@/types/pokemon'

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const allPokemon = ref<Pokemon[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Species data cache
  const speciesCache = ref<Map<number, PokemonSpecies>>(new Map())
  const speciesLoading = ref<Set<number>>(new Set())

  // Search, Filter, Sort state
  const searchQuery = ref('')
  const selectedTypes = ref<string[]>([])
  const sortType = ref('alphabetical-asc')

  // Favorites state
  const favoriteIds = ref<number[]>([])

  // Load favorites from localStorage on initialization
  const loadFavorites = () => {
    try {
      const saved = localStorage.getItem('pokemon-favorites')
      if (saved) {
        favoriteIds.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
      favoriteIds.value = []
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    try {
      localStorage.setItem('pokemon-favorites', JSON.stringify(favoriteIds.value))
    } catch (error) {
      console.error('Failed to save favorites:', error)
    }
  }

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

  // Favorites computed properties
  const favoritePokemon = computed(() => {
    return allPokemon.value.filter((pokemon) => favoriteIds.value.includes(pokemon.id))
  })

  const isFavorite = computed(() => (pokemonId: number) => {
    return favoriteIds.value.includes(pokemonId)
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

  // Species data actions
  const fetchSpeciesData = async (
    pokemonId: number,
    speciesUrl: string,
  ): Promise<PokemonSpecies | null> => {
    // Return cached data if available
    if (speciesCache.value.has(pokemonId)) {
      return speciesCache.value.get(pokemonId)!
    }

    // Check if already loading
    if (speciesLoading.value.has(pokemonId)) {
      // Wait for the existing request to complete
      while (speciesLoading.value.has(pokemonId)) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return speciesCache.value.get(pokemonId) || null
    }

    try {
      speciesLoading.value.add(pokemonId)
      const response = await axios.get<PokemonSpecies>(speciesUrl)
      const speciesData = response.data

      // Cache the data
      speciesCache.value.set(pokemonId, speciesData)

      return speciesData
    } catch (error) {
      console.error(`Error fetching species data for Pokemon ${pokemonId}:`, error)
      return null
    } finally {
      speciesLoading.value.delete(pokemonId)
    }
  }

  const getSpeciesData = (pokemonId: number): PokemonSpecies | null => {
    return speciesCache.value.get(pokemonId) || null
  }

  const isSpeciesLoading = (pokemonId: number): boolean => {
    return speciesLoading.value.has(pokemonId)
  }

  // Favorites actions
  const toggleFavorite = (pokemonId: number) => {
    const index = favoriteIds.value.indexOf(pokemonId)
    if (index > -1) {
      // Remove from favorites
      favoriteIds.value.splice(index, 1)
    } else {
      // Add to favorites
      favoriteIds.value.push(pokemonId)
    }
    saveFavorites()
  }

  const addToFavorites = (pokemonId: number) => {
    if (!favoriteIds.value.includes(pokemonId)) {
      favoriteIds.value.push(pokemonId)
      saveFavorites()
    }
  }

  const removeFromFavorites = (pokemonId: number) => {
    const index = favoriteIds.value.indexOf(pokemonId)
    if (index > -1) {
      favoriteIds.value.splice(index, 1)
      saveFavorites()
    }
  }

  // Initialize favorites on store creation
  loadFavorites()

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
    favoriteIds,
    speciesCache,
    speciesLoading,

    // Getters
    availableTypes,
    filteredAndSortedPokemon,
    favoritePokemon,
    isFavorite,

    // Actions
    fetchPokemon,
    setSearchQuery,
    toggleTypeFilter,
    clearTypeFilters,
    setSortType,
    clearAllFilters,
    fetchSpeciesData,
    getSpeciesData,
    isSpeciesLoading,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
  }
})
