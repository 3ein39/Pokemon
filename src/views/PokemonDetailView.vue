<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import PokemonDetailLayout from '@/components/pokemon/PokemonDetailLayout.vue'
import PokemonDetailHeader from '@/components/pokemon/PokemonDetailHeader.vue'
import PokemonImageCarousel from '@/components/pokemon/PokemonImageCarousel.vue'
import PokemonDetailInfo from '@/components/pokemon/PokemonDetailInfo.vue'
import PokemonStats from '@/components/pokemon/PokemonStats.vue'
import PokemonMoveset from '@/components/pokemon/PokemonMoveset.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const pokemonStore = usePokemonStore()
const error = ref<string | null>(null)

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

const fetchPokemonDetails = async () => {
  try {
    error.value = null
    const result = await pokemonStore.fetchPokemonDetail(route.params.id as string)
    if (!result) {
      error.value = 'Failed to fetch Pokemon details'
    }
  } catch (err) {
    error.value = 'Failed to fetch Pokemon details'
    console.error('Error fetching Pokemon details:', err)
  }
}

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
</style>
