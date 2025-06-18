import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import type {
  Pokemon,
  PokemonSpecies,
  PokemonDetail,
  EvolutionChainResponse,
  EvolutionChainLink,
  ParsedEvolution,
} from '@/types/pokemon'

export const usePokemonStore = defineStore('pokemon', () => {
  // State
  const allPokemon = ref<Pokemon[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Pokemon detail cache
  const pokemonDetailCache = ref<Map<number, PokemonDetail>>(new Map())
  const pokemonDetailLoading = ref<Set<number>>(new Set())

  // Species data cache
  const speciesCache = ref<Map<number, PokemonSpecies>>(new Map())
  const speciesLoading = ref<Set<number>>(new Set())

  // Evolution chain cache
  const evolutionChainCache = ref<Map<number, ParsedEvolution[]>>(new Map())
  const evolutionChainLoading = ref<Set<number>>(new Set())

  // Search, Filter, Sort state
  const searchQuery = ref('')
  const selectedTypes = ref<string[]>([])
  const sortType = ref('alphabetical-asc')

  // Favorites state
  const favoriteIds = ref<number[]>([])

  // Team state (max 6 Pokemon)
  const teamIds = ref<number[]>([])

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

  // Load team from localStorage on initialization
  const loadTeam = () => {
    try {
      const saved = localStorage.getItem('pokemon-team')
      if (saved) {
        teamIds.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load team:', error)
      teamIds.value = []
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

  // Save team to localStorage
  const saveTeam = () => {
    try {
      localStorage.setItem('pokemon-team', JSON.stringify(teamIds.value))
    } catch (error) {
      console.error('Failed to save team:', error)
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

  // Team computed properties
  const teamPokemon = computed(() => {
    return allPokemon.value.filter((pokemon) => teamIds.value.includes(pokemon.id))
  })

  const isInTeam = computed(() => (pokemonId: number) => {
    return teamIds.value.includes(pokemonId)
  })

  const canAddToTeam = computed(() => (pokemonId: number) => {
    return teamIds.value.length < 6 && !teamIds.value.includes(pokemonId)
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

  // Pokemon detail actions
  const fetchPokemonDetail = async (pokemonId: string | number): Promise<PokemonDetail | null> => {
    const id = typeof pokemonId === 'string' ? parseInt(pokemonId) : pokemonId

    // Return cached data if available
    if (pokemonDetailCache.value.has(id)) {
      return pokemonDetailCache.value.get(id)!
    }

    // Check if already loading
    if (pokemonDetailLoading.value.has(id)) {
      // Wait for the existing request to complete
      while (pokemonDetailLoading.value.has(id)) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return pokemonDetailCache.value.get(id) || null
    }

    try {
      pokemonDetailLoading.value.add(id)
      const response = await axios.get<PokemonDetail>(`https://pokeapi.co/api/v2/pokemon/${id}`)
      const pokemonDetail = response.data

      // Cache the data
      pokemonDetailCache.value.set(id, pokemonDetail)

      return pokemonDetail
    } catch (error) {
      console.error(`Error fetching Pokemon detail for ID ${id}:`, error)
      return null
    } finally {
      pokemonDetailLoading.value.delete(id)
    }
  }

  const getPokemonDetail = (pokemonId: number): PokemonDetail | null => {
    return pokemonDetailCache.value.get(pokemonId) || null
  }

  const isPokemonDetailLoading = (pokemonId: number): boolean => {
    return pokemonDetailLoading.value.has(pokemonId)
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

  // Evolution chain actions
  const fetchEvolutionChain = async (pokemonId: number): Promise<ParsedEvolution[]> => {
    // Return cached data if available
    if (evolutionChainCache.value.has(pokemonId)) {
      return evolutionChainCache.value.get(pokemonId)!
    }

    // Check if already loading
    if (evolutionChainLoading.value.has(pokemonId)) {
      // Wait for the existing request to complete
      while (evolutionChainLoading.value.has(pokemonId)) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      return evolutionChainCache.value.get(pokemonId) || []
    }

    try {
      evolutionChainLoading.value.add(pokemonId)

      // Get species data first to get evolution chain URL
      let speciesData = getSpeciesData(pokemonId)
      if (!speciesData) {
        const pokemonDetail = getPokemonDetail(pokemonId)
        if (pokemonDetail) {
          await fetchSpeciesData(pokemonId, pokemonDetail.species.url)
          speciesData = getSpeciesData(pokemonId)
        }
      }

      if (!speciesData?.evolution_chain?.url) {
        evolutionChainCache.value.set(pokemonId, [])
        return []
      }

      // Fetch evolution chain
      const evolutionResponse = await axios.get<EvolutionChainResponse>(
        speciesData.evolution_chain.url,
      )
      const chain = evolutionResponse.data.chain

      // Parse evolution chain into flat array
      const evolutions: ParsedEvolution[] = []

      const parseChain = async (chainLink: EvolutionChainLink): Promise<void> => {
        try {
          // Get Pokemon details for this evolution
          const pokemonResponse = await axios.get<PokemonDetail>(
            `https://pokeapi.co/api/v2/pokemon/${chainLink.species.name}`,
          )
          const pokemonData = pokemonResponse.data

          evolutions.push({
            id: pokemonData.id,
            name: pokemonData.name,
            types: pokemonData.types,
            sprite:
              pokemonData.sprites.other?.['official-artwork']?.front_default ||
              pokemonData.sprites.front_default ||
              '',
            number: pokemonData.id.toString().padStart(3, '0'),
          })

          // Process evolves_to recursively
          for (const evolution of chainLink.evolves_to) {
            await parseChain(evolution)
          }
        } catch (error) {
          console.error(`Error fetching Pokemon data for ${chainLink.species.name}:`, error)
        }
      }

      await parseChain(chain)

      // Cache the evolution chain for all Pokemon in the chain
      evolutions.forEach((evolution) => {
        evolutionChainCache.value.set(evolution.id, evolutions)
      })

      return evolutions
    } catch (error) {
      console.error(`Error fetching evolution chain for Pokemon ${pokemonId}:`, error)
      evolutionChainCache.value.set(pokemonId, [])
      return []
    } finally {
      evolutionChainLoading.value.delete(pokemonId)
    }
  }

  const getEvolutionChain = (pokemonId: number): ParsedEvolution[] => {
    return evolutionChainCache.value.get(pokemonId) || []
  }

  const isEvolutionChainLoading = (pokemonId: number): boolean => {
    return evolutionChainLoading.value.has(pokemonId)
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

  // Team actions
  const addToTeam = (pokemonId: number) => {
    if (teamIds.value.length >= 6) {
      throw new Error('Team is full! You can only have 6 Pokemon in your team.')
    }
    if (!teamIds.value.includes(pokemonId)) {
      teamIds.value.push(pokemonId)
      saveTeam()
    }
  }

  const removeFromTeam = (pokemonId: number) => {
    const index = teamIds.value.indexOf(pokemonId)
    if (index > -1) {
      teamIds.value.splice(index, 1)
      saveTeam()
    }
  }

  const toggleTeamMember = (pokemonId: number) => {
    if (teamIds.value.includes(pokemonId)) {
      removeFromTeam(pokemonId)
    } else {
      if (teamIds.value.length >= 6) {
        throw new Error('Team is full! You can only have 6 Pokemon in your team.')
      }
      addToTeam(pokemonId)
    }
  }

  // Initialize favorites and team on store creation
  loadFavorites()
  loadTeam()

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
    teamIds,
    pokemonDetailCache,
    pokemonDetailLoading,
    speciesCache,
    speciesLoading,
    evolutionChainCache,
    evolutionChainLoading,

    // Getters
    availableTypes,
    filteredAndSortedPokemon,
    favoritePokemon,
    isFavorite,
    teamPokemon,
    isInTeam,
    canAddToTeam,

    // Actions
    fetchPokemon,
    setSearchQuery,
    toggleTypeFilter,
    clearTypeFilters,
    setSortType,
    clearAllFilters,
    fetchPokemonDetail,
    getPokemonDetail,
    isPokemonDetailLoading,
    fetchSpeciesData,
    getSpeciesData,
    isSpeciesLoading,
    toggleFavorite,
    addToFavorites,
    removeFromFavorites,
    addToTeam,
    removeFromTeam,
    toggleTeamMember,
    fetchEvolutionChain,
    getEvolutionChain,
    isEvolutionChainLoading,
  }
})
