<script setup lang="ts">
import type { PokemonDetail } from '@/types/pokemon'

interface Props {
  pokemon: PokemonDetail | null
}

defineProps<Props>()

// Get dominant background gradient based on Pokemon's primary type
const getDominantBackgroundStyle = (pokemon: PokemonDetail | null): string => {
  if (!pokemon || !pokemon.types.length) return 'background: linear-gradient(180deg, #9CA3AF 0%, #D1D5DB 100%);'

  const primaryType = pokemon.types[0].type.name
  const typeGradients: { [key: string]: string } = {
    normal: 'background: linear-gradient(180deg, #A8A878 0%, #C5C29E 100%);',
    fire: 'background: linear-gradient(180deg, #F08030 0%, #F5A65B 100%);',
    water: 'background: linear-gradient(180deg, #6890F0 0%, #8FB4F5 100%);',
    electric: 'background: linear-gradient(180deg, #F8D030 0%, #FBE273 100%);',
    grass: 'background: linear-gradient(180deg, #7ECD8B 0%, #89E2B3 100%);',
    ice: 'background: linear-gradient(180deg, #98D8D8 0%, #B8E8E8 100%);',
    fighting: 'background: linear-gradient(180deg, #C03028 0%, #D85A52 100%);',
    poison: 'background: linear-gradient(180deg, #A040A0 0%, #C666C6 100%);',
    ground: 'background: linear-gradient(180deg, #E0C068 0%, #EDD494 100%);',
    flying: 'background: linear-gradient(180deg, #A890F0 0%, #C4B3F5 100%);',
    psychic: 'background: linear-gradient(180deg, #F85888 0%, #FB94B8 100%);',
    bug: 'background: linear-gradient(180deg, #A8B820 0%, #C5D24A 100%);',
    rock: 'background: linear-gradient(180deg, #B8A038 0%, #D4C466 100%);',
    ghost: 'background: linear-gradient(180deg, #705898 0%, #9A82C4 100%);',
    dragon: 'background: linear-gradient(180deg, #7038F8 0%, #9A6BFB 100%);',
    dark: 'background: linear-gradient(180deg, #705848 0%, #9A826B 100%);',
    steel: 'background: linear-gradient(180deg, #B8B8D0 0%, #D1D1E0 100%);',
    fairy: 'background: linear-gradient(180deg, #EE99AC 0%, #F4B8C7 100%);',
  }

  return typeGradients[primaryType] || 'background: linear-gradient(180deg, #9CA3AF 0%, #D1D5DB 100%);'
}
</script>

<template>
  <main class="min-h-screen transition-colors duration-300 pb-8" :style="getDominantBackgroundStyle(pokemon)">
    <div class="container mx-auto">
      <slot />
    </div>
  </main>
</template>
