<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonDetail } from '@/types/pokemon'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()

// Map stat names to readable labels
const statLabels: { [key: string]: string } = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  'speed': 'Speed'
}

// Get stat color based on value
const getStatColor = (value: number): string => {
  if (value >= 120) return '#10B981' // Green for high stats
  if (value >= 80) return '#F59E0B'  // Yellow/Orange for medium stats
  if (value >= 50) return '#EF4444'  // Red for low stats
  return '#6B7280' // Gray for very low stats
}

// Calculate stat percentage (max 255 is 100%)
const getStatPercentage = (value: number): number => {
  return Math.min((value / 255) * 100, 100)
}

// Format stats for display
const formattedStats = computed(() => {
  if (!props.pokemon) return []

  return props.pokemon.stats.map(stat => ({
    name: stat.stat.name,
    label: statLabels[stat.stat.name] || stat.stat.name,
    value: stat.base_stat,
    percentage: getStatPercentage(stat.base_stat),
    color: getStatColor(stat.base_stat)
  }))
})

// Calculate total stats
const totalStats = computed(() => {
  if (!props.pokemon) return 0
  return props.pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0)
})

// Get stat rank description
const getStatRank = (value: number): string => {
  if (value >= 120) return 'Excellent'
  if (value >= 80) return 'Good'
  if (value >= 50) return 'Average'
  return 'Poor'
}
</script>

<template>
  <div v-if="pokemon" class="px-4 mb-8">
    <div class="bg-white rounded-3xl p-6 shadow-lg">
      <!-- Section Title -->
      <h2 class="text-xl font-bold text-gray-800 mb-6 tracking-wide">STATS</h2>

      <!-- Stats Bars -->
      <div class="space-y-4 mb-6">
        <div v-for="stat in formattedStats" :key="stat.name" class="stat-row">
          <!-- Stat Label and Value -->
          <div class="flex justify-between items-center mb-2">
            <span class="text-gray-700 font-medium text-sm">{{ stat.label }}</span>
            <div class="flex items-center gap-2">
              <span class="text-gray-800 font-bold text-sm">{{ stat.value }}</span>
              <span class="text-xs px-2 py-1 rounded-full"
                :style="{ backgroundColor: stat.color + '20', color: stat.color }">
                {{ getStatRank(stat.value) }}
              </span>
            </div>
          </div>

          <!-- Stat Bar -->
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div class="h-full rounded-full transition-all duration-1000 ease-out stat-bar" :style="{
              width: stat.percentage + '%',
              backgroundColor: stat.color
            }"></div>
          </div>
        </div>
      </div>

      <!-- Total Stats -->
      <div class="border-t pt-4">
        <div class="flex justify-between items-center">
          <span class="text-gray-700 font-medium">Total Base Stats</span>
          <span class="text-gray-800 font-bold text-lg">{{ totalStats }}</span>
        </div>

        <!-- Average indicator -->
        <div class="mt-2 text-sm text-gray-600">
          Average: {{ Math.round(totalStats / 6) }} per stat
        </div>
      </div>

      <!-- Stat Insights -->
      <div class="mt-4 p-4 bg-gray-50 rounded-xl">
        <h3 class="text-sm font-semibold text-gray-800 mb-2">Battle Insights</h3>
        <div class="space-y-1 text-xs text-gray-600">
          <div v-if="formattedStats.find(s => s.name === 'hp' && s.value >= 100)">
            • High HP makes this Pokemon very durable
          </div>
          <div v-if="formattedStats.find(s => s.name === 'attack' && s.value >= 120)">
            • Excellent physical attack power
          </div>
          <div v-if="formattedStats.find(s => s.name === 'special-attack' && s.value >= 120)">
            • Outstanding special attack capabilities
          </div>
          <div v-if="formattedStats.find(s => s.name === 'speed' && s.value >= 100)">
            • High speed allows frequent first strikes
          </div>
          <div v-if="formattedStats.find(s => s.name === 'defense' && s.value >= 100)">
            • Strong physical defense
          </div>
          <div v-if="formattedStats.find(s => s.name === 'special-defense' && s.value >= 100)">
            • Resistant to special attacks
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stat-bar {
  /* Initial width is 0, will animate to actual percentage */
  animation: expandBar 1s ease-out 0.2s both;
}

@keyframes expandBar {
  from {
    width: 0%;
  }

  to {
    width: var(--final-width);
  }
}

.stat-row:nth-child(1) .stat-bar {
  animation-delay: 0.1s;
}

.stat-row:nth-child(2) .stat-bar {
  animation-delay: 0.2s;
}

.stat-row:nth-child(3) .stat-bar {
  animation-delay: 0.3s;
}

.stat-row:nth-child(4) .stat-bar {
  animation-delay: 0.4s;
}

.stat-row:nth-child(5) .stat-bar {
  animation-delay: 0.5s;
}

.stat-row:nth-child(6) .stat-bar {
  animation-delay: 0.6s;
}
</style>
