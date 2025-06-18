<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonDetail } from '@/types/pokemon'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()

// Get stat color based on value (matching the image design)
const getStatColor = (value: number): string => {
  if (value >= 80) return '#4CAF50' // Green for high stats
  if (value >= 50) return '#FF9800' // Orange for medium stats
  return '#F44336' // Red for low stats
}

// Calculate stat percentage for progress bar (max 255 for Pokemon stats)
const getStatPercentage = (value: number): number => {
  return Math.min((value / 255) * 100, 100)
}

// Calculate total stats
const totalStats = computed(() => {
  if (!props.pokemon) return 0
  return props.pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
})

// Format stat names to match the image
const formatStatName = (statName: string): string => {
  const statNames: { [key: string]: string } = {
    'hp': 'HP',
    'attack': 'Attack',
    'defense': 'Defense',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    'speed': 'Speed'
  }
  return statNames[statName] || statName
}
</script>

<template>
  <div v-if="pokemon" class="px-4">
    <!-- Stats Section -->
    <div class="px-4 mb-8">
      <!-- Section Title -->
      <h2 class="section-header text-white mb-4">STATISTIEKEN</h2>
      <div class="bg-white rounded-3xl p-6 shadow-lg">

        <!-- Stats List -->
        <div class="space-y-4">
          <!-- Individual Stats -->
          <div v-for="stat in pokemon.stats" :key="stat.stat.name" class="flex items-center">
            <!-- Stat Name -->
            <span class="w-20 font-normal text-sm leading-none tracking-tight flex-shrink-0" style="color: #ACB2C1;">
              {{ formatStatName(stat.stat.name) }}
            </span>

            <!-- Stat Value -->
            <span class="w-8 font-semibold text-sm text-gray-800 text-right mr-4">
              {{ stat.base_stat }}
            </span>

            <!-- Progress Bar -->
            <div class="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div class="h-full rounded-full transition-all duration-300 ease-out" :style="{
                width: `${getStatPercentage(stat.base_stat)}%`,
                backgroundColor: getStatColor(stat.base_stat)
              }"></div>
            </div>
          </div>

          <!-- Total Stats -->
          <div class="flex items-center pt-2 border-t border-gray-100">
            <!-- Total Label -->
            <span class="w-20 font-normal text-sm leading-none tracking-tight flex-shrink-0" style="color: #ACB2C1;">
              Total
            </span>

            <!-- Total Value -->
            <span class="w-8 font-semibold text-sm text-gray-800 text-right mr-4">
              {{ totalStats }}
            </span>

            <!-- Total Progress Bar -->
            <div class="flex-1 bg-gray-200 rounded-full h-2 relative overflow-hidden">
              <div class="h-full rounded-full transition-all duration-300 ease-out" :style="{
                width: `${Math.min((totalStats / 600) * 100, 100)}%`,
                backgroundColor: getStatColor(totalStats / 6)
              }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
