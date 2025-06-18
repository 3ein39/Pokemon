<script setup lang="ts">
import { computed, watch } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import type { PokemonDetail } from '@/types/pokemon'
import MaleIcon from '@/components/icons/MaleIcon.vue'
import FemaleIcon from '@/components/icons/FemaleIcon.vue'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()
const pokemonStore = usePokemonStore()

// Watch for pokemon changes and fetch species data
watch(() => props.pokemon, async (newPokemon) => {
  if (newPokemon) {
    await pokemonStore.fetchSpeciesData(newPokemon.id, newPokemon.species.url)
  }
}, { immediate: true })

// Get species data from store
const speciesData = computed(() => {
  return props.pokemon ? pokemonStore.getSpeciesData(props.pokemon.id) : null
})

// Check if species is loading
const loadingSpecies = computed(() => {
  return props.pokemon ? pokemonStore.isSpeciesLoading(props.pokemon.id) : false
})

// Get Pokemon description in English
const pokemonDescription = computed(() => {
  if (!speciesData.value) return ''

  // Get English description
  const englishEntry = speciesData.value.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  )

  return englishEntry ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : ''
})

// Get category (genus) in English
const pokemonCategory = computed(() => {
  if (!speciesData.value) return 'Unknown'

  // Get English genus
  const englishGenus = speciesData.value.genera.find(
    genus => genus.language.name === 'en'
  )

  return englishGenus ? englishGenus.genus.replace(' Pokémon', '') : 'Unknown'
})

// Gender information
const genderInfo = computed(() => {
  if (!speciesData.value) return { type: 'both', display: 'Both' }

  const genderRate = speciesData.value.gender_rate

  if (genderRate === -1) return { type: 'genderless', display: 'Genderless' } // Genderless
  if (genderRate === 0) return { type: 'male', display: 'Male only' } // Male only
  if (genderRate === 8) return { type: 'female', display: 'Female only' } // Female only

  return { type: 'both', display: 'Both' } // Both genders
})

// Convert height from decimeters to meters
const heightInMeters = computed(() => {
  if (!props.pokemon) return '0m'
  return `${(props.pokemon.height / 10).toFixed(1)}m`
})

// Convert weight from hectograms to kilograms
const weightInKg = computed(() => {
  if (!props.pokemon) return '0kg'
  return `${(props.pokemon.weight / 10).toFixed(1)} kg`
})

// Format Pokemon number with leading zeros
const pokemonNumber = computed(() => {
  if (!props.pokemon) return '000'
  return props.pokemon.id.toString().padStart(3, '0')
})

// Get type colors for badges
const getTypeColor = (typeName: string): string => {
  const typeColors: { [key: string]: string } = {
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
  return typeColors[typeName] || '#68A090'
}

// Format abilities with proper capitalization
const formattedAbilities = computed(() => {
  if (!props.pokemon) return ''

  const abilities = props.pokemon.abilities
    .filter(ability => !ability.is_hidden) // Exclude hidden abilities for now
    .map(ability => ability.ability.name.charAt(0).toUpperCase() + ability.ability.name.slice(1))

  return abilities.join(', ') || 'Unknown'
})
</script>

<template>
  <div v-if="pokemon" class="px-4">
    <!-- About Section -->
    <div class="px-4 mb-8">
      <!-- Section Title -->
      <h2 class="section-header text-white mb-4">ABOUT</h2>
      <div class="bg-white rounded-3xl p-6 shadow-lg">

        <!-- Description -->
        <div class="mb-6">
          <p v-if="pokemonDescription" class="text-gray-700 font-normal text-sm tracking-tight">
            {{ pokemonDescription }}
          </p>
          <p v-else-if="loadingSpecies" class="text-gray-500 italic font-normal text-sm  tracking-tight">
            Loading description...
          </p>
          <p v-else class="text-gray-500 italic font-normal text-sm  tracking-tight">
            No description available.
          </p>
        </div>

        <!-- Pokemon Details Grid -->
        <div class="space-y-3">
          <!-- Type -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight" style="color: #ACB2C1;">Type</span>
            <div class="flex gap-2">
              <span v-for="type in pokemon.types" :key="type.type.name"
                :style="{ backgroundColor: getTypeColor(type.type.name) }"
                class="px-3 py-1 rounded-full text-white text-sm font-medium capitalize">
                {{ type.type.name }}
              </span>
            </div>
          </div>

          <!-- Number -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight" style="color: #ACB2C1;">Nummer</span>
            <span class="text-gray-800 font-semibold">{{ pokemonNumber }}</span>
          </div>

          <!-- Height -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight" style="color: #ACB2C1;">Hoogte</span>
            <span class="text-gray-800 font-semibold">{{ heightInMeters }}</span>
          </div>

          <!-- Weight -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight" style="color: #ACB2C1;">Gewicht</span>
            <span class="text-gray-800 font-semibold">{{ weightInKg }}</span>
          </div>

          <!-- Category -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight" style="color: #ACB2C1;">Categorie</span>
            <span class="text-gray-800 font-semibold">{{ pokemonCategory }}</span>
          </div>

          <!-- Gender -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight" style="color: #ACB2C1;">Geslacht</span>
            <div class="flex items-center gap-2">
              <template v-if="genderInfo.type === 'male'">
                <MaleIcon />
              </template>
              <template v-else-if="genderInfo.type === 'female'">
                <FemaleIcon />
              </template>
              <template v-else-if="genderInfo.type === 'both'">
                <MaleIcon />
                <FemaleIcon />
              </template>
              <template v-else>
                <span class="text-gray-800 font-semibold text-sm">{{ genderInfo.display }}</span>
              </template>
            </div>
          </div>

          <!-- Abilities -->
          <div class="flex items-center py-1">
            <span class="w-28 font-normal text-sm leading-none tracking-tight"
              style="color: #ACB2C1;">Vaardigheden</span>
            <span class="text-gray-800 font-semibold">{{ formattedAbilities }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
