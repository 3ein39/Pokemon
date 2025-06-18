<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import type { PokemonDetail } from '@/types/pokemon'
import PokemonDetailLayout from '@/components/pokemon/PokemonDetailLayout.vue'
import PokemonDetailHeader from '@/components/pokemon/PokemonDetailHeader.vue'
import PokemonImageCarousel from '@/components/pokemon/PokemonImageCarousel.vue'
import PokemonDetailInfo from '@/components/pokemon/PokemonDetailInfo.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import ErrorMessage from '@/components/common/ErrorMessage.vue'

const route = useRoute()
const pokemonData = ref<PokemonDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchPokemonDetails = async () => {
  try {
    loading.value = true
    const pokemonId = route.params.id
    const response = await axios.get<PokemonDetail>(
      `https://pokeapi.co/api/v2/pokemon/${pokemonId}`,
    )
    pokemonData.value = response.data
    error.value = null
  } catch (err) {
    error.value = 'Failed to fetch Pokemon details'
    console.error('Error fetching Pokemon details:', err)
  } finally {
    loading.value = false
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
