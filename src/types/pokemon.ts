// Pokemon list interface (for the list view)
export interface Pokemon {
  id: number
  name: string
  sprites: {
    front_default: string
  }
  types: Array<{
    slot: number
    type: {
      name: string
    }
  }>
}

// Focused Pokemon detail interface (only fields we actually use)
export interface PokemonDetail {
  id: number
  name: string
  height: number // in decimeters
  weight: number // in hectograms
  base_experience: number

  abilities: Array<{
    ability: {
      name: string
      url: string
    }
    is_hidden: boolean
    slot: number
  }>

  sprites: {
    front_default: string | null
    front_shiny?: string | null
    back_default?: string | null
    back_shiny?: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
      dream_world?: {
        front_default: string | null
      }
      home?: {
        front_default: string | null
      }
    }
  }

  stats: Array<{
    base_stat: number
    stat: {
      name: string
      url: string
    }
  }>

  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>

  moves: Array<{
    move: {
      name: string
      url: string
    }
    version_group_details: Array<{
      level_learned_at: number
      move_learn_method: {
        name: string
        url: string
      }
    }>
  }>

  species: {
    name: string
    url: string
  }
}

// Additional interfaces for species data (for description and evolution)
export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
  }>
  evolution_chain: {
    url: string
  }
  genera: Array<{
    genus: string
    language: {
      name: string
    }
  }>
  gender_rate: number
}

// Stat names for easier reference
export type PokemonStatName =
  | 'hp'
  | 'attack'
  | 'defense'
  | 'special-attack'
  | 'special-defense'
  | 'speed'

// Pokemon type names
export type PokemonTypeName =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy'

export interface ChainSpecies {
  name: string
  url: string
}

export interface EvolutionChainLink {
  evolves_to: EvolutionChainLink[]
  species: ChainSpecies
}

export interface EvolutionChainResponse {
  chain: EvolutionChainLink
}

// Final simplified evolution data for UI display
export interface ParsedEvolution {
  id: number
  name: string
  types: Array<{
    slot: number
    type: {
      name: string
      url: string
    }
  }>
  sprite: string
  number: string
}
