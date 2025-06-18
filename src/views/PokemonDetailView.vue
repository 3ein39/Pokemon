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
      <PokemonDetailInfo :pokemon="pokemonData" />
      <PokemonImageCarousel :pokemon="pokemonData" />
    </template>
  </PokemonDetailLayout>
</template>
