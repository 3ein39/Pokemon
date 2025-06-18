<script setup lang="ts">
import type { PokemonDetail } from '@/types/pokemon'

interface Props {
  pokemon: PokemonDetail | null
}

defineProps<Props>()
</script>

<template>
  <div v-if="pokemon" class="px-4">
    <!-- Pokemon Name -->
    <div class="px-4 mb-6">
      <h1 class="pokedex-header text-white capitalize">
        {{ pokemon.name }}
      </h1>
    </div>

    <!-- Additional Pokemon info will go here in future updates -->
    <!-- Stats, abilities, evolution chain, etc. -->
  </div>
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
