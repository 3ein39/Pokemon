<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import type { PokemonDetail, ParsedEvolution } from '@/types/pokemon'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()
const router = useRouter()
const pokemonStore = usePokemonStore()

// Computed properties for evolution chain data
const evolutionChain = computed<ParsedEvolution[]>(() => {
  if (!props.pokemon) return []
  return pokemonStore.getEvolutionChain(props.pokemon.id)
})

const loading = computed<boolean>(() => {
  if (!props.pokemon) return false
  return pokemonStore.isEvolutionChainLoading(props.pokemon.id)
})

// Fetch evolution chain data when pokemon changes
const fetchEvolutionChain = async () => {
  if (!props.pokemon) return
  await pokemonStore.fetchEvolutionChain(props.pokemon.id)
}

// Watch for pokemon changes
watch(() => props.pokemon, fetchEvolutionChain, { immediate: true })

// Get type colors from store
const getTypeColor = (typeName: string): string => {
  return pokemonStore.typeColors[typeName] || '#68A090'
}

// Navigate to Pokemon detail
const navigateToPokemon = (pokemonId: number) => {
  router.push(`/pokemon/${pokemonId}`)
}
</script>

<template>
  <div v-if="pokemon" class="px-4">
    <!-- Evolution Section -->
    <div class="px-4 mb-8">
      <!-- Section Title -->
      <h2 class="section-header text-white mb-4">EVOLUTIE</h2>
      <div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p class="text-gray-500 mt-2 text-sm">Loading evolution chain...</p>
        </div>

        <!-- Evolution Chain -->
        <div v-else-if="evolutionChain.length > 1" class="space-y-4">
          <div v-for="evolution in evolutionChain" :key="evolution.id"
            class="flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200 bg-white/50 hover:bg-gray-50"
            :class="{ '!bg-white': evolution.id === pokemon.id }"
            @click="navigateToPokemon(evolution.id)">
            <!-- Pokemon Info -->
            <div class="flex items-center gap-4">
              <!-- Pokemon Image -->
              <div class="w-16 h-16 flex-shrink-0">
                <img :src="evolution.sprite" :alt="evolution.name" class="w-full h-full object-contain" />
              </div>

              <!-- Pokemon Details -->
              <div>
                <h3 class="font-bold text-lg text-gray-900 capitalize">
                  {{ evolution.name }}
                </h3>
                <p class="text-gray-500 text-sm">
                  Nr. {{ evolution.number }}
                </p>
              </div>
            </div>

            <!-- Type Badges and Arrow -->
            <div class="flex items-center gap-3">
              <!-- Type Badges -->
              <div class="flex gap-2">
                <span v-for="type in evolution.types" :key="type.type.name"
                  :style="{ backgroundColor: getTypeColor(type.type.name) }"
                  class="px-3 py-1 rounded-full text-white text-sm font-medium capitalize">
                  {{ type.type.name }}
                </span>
              </div>

              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" class="text-gray-400">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <!-- No Evolution -->
        <div v-else class="text-center py-8">
          <div class="text-gray-400 mb-2">
            <svg class="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
          </div>
          <p class="text-gray-500 text-sm">This Pokemon does not evolve</p>
        </div>
      </div>
    </div>
  </div>
</template>
