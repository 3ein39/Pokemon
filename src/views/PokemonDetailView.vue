<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonDetailLayout from '@/components/pokemon/PokemonDetailLayout.vue'
import PokemonDetailHeader from '@/components/pokemon/PokemonDetailHeader.vue'
import PokemonImageCarousel from '@/components/pokemon/PokemonImageCarousel.vue'
import PokemonDetailInfo from '@/components/pokemon/PokemonDetailInfo.vue'
import PokemonStats from '@/components/pokemon/PokemonStats.vue'
import PokemonMoveset from '@/components/pokemon/PokemonMoveset.vue'
import PokemonEvolution from '@/components/pokemon/PokemonEvolution.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const pokemonStore = usePokemonStore()
const error = ref<string | null>(null)
const teamActionError = ref<string | null>(null)

// Get Pokemon ID from route params
const pokemonId = computed(() => {
  const id = route.params.id
  return typeof id === 'string' ? parseInt(id) : Array.isArray(id) ? parseInt(id[0]) : 0
})

// Get Pokemon data from store
const pokemonData = computed(() => {
  return pokemonStore.getPokemonDetail(pokemonId.value)
})

// Check if Pokemon is loading
const loading = computed(() => {
  return pokemonStore.isPokemonDetailLoading(pokemonId.value)
})

// Team-related computed properties
const isInTeam = computed(() => {
  if (!pokemonData.value) return false
  return pokemonStore.isInTeam(pokemonData.value.id)
})

const canAddToTeam = computed(() => {
  if (!pokemonData.value) return false
  return pokemonStore.canAddToTeam(pokemonData.value.id)
})

const fetchPokemonDetails = async () => {
  try {
    error.value = null
    const result = await pokemonStore.fetchPokemonDetail(pokemonId.value)
    if (!result) {
      error.value = 'Failed to fetch Pokemon details'
    }
  } catch (err) {
    error.value = 'Failed to fetch Pokemon details'
    console.error('Error fetching Pokemon details:', err)
  }
}

// Handle team toggle
const handleTeamToggle = () => {
  if (!pokemonData.value) return

  try {
    teamActionError.value = null
    pokemonStore.toggleTeamMember(pokemonData.value.id)
  } catch (err) {
    teamActionError.value = err instanceof Error ? err.message : 'Failed to update team'
    // Clear error after 3 seconds
    setTimeout(() => {
      teamActionError.value = null
    }, 3000)
  }
}

// Watch for route changes to fetch new Pokemon data
watch(() => route.params.id, () => {
  fetchPokemonDetails()
}, { immediate: true })

onMounted(() => {
  fetchPokemonDetails()
})
</script>

<template>
  <PokemonDetailLayout :pokemon="pokemonData">
    <PokemonDetailHeader :pokemon="pokemonData" />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" />

    <!-- Error State -->
    <ErrorMessage v-else-if="error" :message="error" />

    <!-- Pokemon Content -->
    <template v-else-if="pokemonData">
      <!-- Pokemon Name Header -->
      <div class="px-4">
        <div class="px-4 mb-6">
          <h1 class="pokedex-header text-white capitalize">
            {{ pokemonData.name }}
          </h1>
        </div>
      </div>

      <PokemonImageCarousel :pokemon="pokemonData" />
      <PokemonDetailInfo :pokemon="pokemonData" />
      <PokemonStats :pokemon="pokemonData" />
      <PokemonMoveset :pokemon="pokemonData" />
      <PokemonEvolution :pokemon="pokemonData" />

      <!-- Floating Team Button -->
      <div
        class="fixed bottom-4 left-4 right-4 z-50 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 sm:bottom-6">
        <!-- Error Message -->
        <div v-if="teamActionError" class="mb-3 bg-red-500 text-white px-4 py-2 rounded-full text-sm text-center">
          {{ teamActionError }}
        </div>

        <!-- Team Button -->
        <button @click="handleTeamToggle" :disabled="!canAddToTeam && !isInTeam"
          class="team-button mx-auto sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white shadow-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 sm:min-w-[280px]"
          :class="{
            'bg-black/80 hover:bg-black/90 active:bg-black': !isInTeam && canAddToTeam,
            'bg-green-600 hover:bg-green-500': isInTeam,
            'bg-gray-500 cursor-not-allowed opacity-60': !canAddToTeam && !isInTeam
          }">

          <span class="text-base sm:text-lg font-medium truncate">
            {{ isInTeam ? 'In team' : (canAddToTeam ? 'Toevoegen aan mijn team' : 'Team vol (6/6)') }}
          </span>
        </button>
      </div>
    </template>
  </PokemonDetailLayout>
</template>

<style scoped>
.pokedex-header {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 700;
  font-size: 34px;
  line-height: 41px;
  letter-spacing: 0.37px;
}

.team-button {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset,
    0 1px 0 rgba(255, 255, 255, 0.2) inset;
}

.team-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.6),
    0 0 0 1px rgba(255, 255, 255, 0.15) inset,
    0 1px 0 rgba(255, 255, 255, 0.25) inset;
}

.team-button:active {
  transform: translateY(-1px);
  box-shadow:
    0 8px 35px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
}
</style>
