<script setup lang="ts">
import { computed } from 'vue'
import type { PokemonDetail } from '@/types/pokemon'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()

// Get level-up moves (learned by leveling up)
const levelUpMoves = computed(() => {
  if (!props.pokemon) return []

  return props.pokemon.moves
    .filter(move =>
      move.version_group_details.some(detail =>
        detail.move_learn_method.name === 'level-up'
      )
    )
    .map(move => {
      // Get the level learned at from the latest version group
      const levelDetail = move.version_group_details
        .filter(detail => detail.move_learn_method.name === 'level-up')
        .sort((a, b) => b.level_learned_at - a.level_learned_at)[0]

      return {
        name: move.move.name,
        level: levelDetail?.level_learned_at || 1
      }
    })
    .sort((a, b) => a.level - b.level)
    .slice(0, 4) // Show only first 4 moves to match the design
})

// Format move name for display
const formatMoveName = (moveName: string): string => {
  return moveName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get level badge color based on level
const getLevelColor = (level: number): string => {
  if (level <= 5) return '#8B5CF6' // Purple for low levels
  if (level <= 15) return '#06B6D4' // Cyan for medium levels
  if (level <= 30) return '#F59E0B' // Orange for high levels
  return '#EF4444' // Red for very high levels
}

// Get level badge background color (lighter version)
const getLevelBgColor = (level: number): string => {
  if (level <= 5) return '#EDE9FE' // Light purple
  if (level <= 15) return '#CFFAFE' // Light cyan
  if (level <= 30) return '#FEF3C7' // Light orange
  return '#FEE2E2' // Light red
}
</script>

<template>
  <div v-if="pokemon" class="px-4">
    <!-- Moveset Section -->
    <div class="px-4 mb-8">
      <!-- Section Title -->
      <h2 class="section-header text-white mb-4">MOVESET</h2>
      <div class="bg-white rounded-3xl p-6 shadow-lg">

        <!-- Moves List -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Individual Moves -->
          <div v-for="move in levelUpMoves" :key="move.name" class="flex items-center gap-3">
            <!-- Level Badge -->
            <span class="px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0" :style="{
              backgroundColor: getLevelBgColor(move.level),
              color: getLevelColor(move.level)
            }">
              Level {{ move.level }}
            </span>

            <!-- Move Name -->
            <span class="font-semibold text-gray-800 text-sm">
              {{ formatMoveName(move.name) }}
            </span>
          </div>

          <!-- No moves message -->
          <div v-if="levelUpMoves.length === 0" class="col-span-full text-center py-4">
            <span class="text-gray-500 text-sm">No level-up moves available</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
