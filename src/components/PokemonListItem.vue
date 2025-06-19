<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Pokemon } from '@/types/pokemon'
import ArrowRightIcon from '@/components/icons/ArrowRightIcon.vue'

interface Props {
  pokemon: Pokemon
}

const props = defineProps<Props>()
const router = useRouter()

const navigateToDetails = () => {
  router.push(`/pokemon/${props.pokemon.id}`)
}

// Type color mapping for Pokemon types
const getTypeColorClass = (type: string): string => {
  const typeColors: { [key: string]: string } = {
    normal: 'bg-gray-500',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-500',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-amber-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-stone-500',
    ghost: 'bg-violet-500',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-700',
    steel: 'bg-slate-500',
    fairy: 'bg-rose-400',
  }

  return typeColors[type] || 'bg-gray-500'
}
</script>

<template>
  <div
    class="bg-white rounded-lg px-2 py-4 flex flex-row-reverse items-center transition-shadow cursor-pointer card-shadow gap-2"
    @click="navigateToDetails">
    <!-- Pokemon Info -->
    <div class="flex-1">
      <div class="flex justify-between items-center">
        <div class="flex justify-between w-full">
          <!-- Name -->
          <h3 class="text-lg font-bold text-gray-900 capitalize mb-1 leading-none tracking-wide">
            {{ pokemon.name }}
          </h3>
          <!-- Types -->
          <div class="flex flex-wrap gap-2">
            <span v-for="type in pokemon.types" :key="type.slot"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal text-white leading-none tracking-wide capitalize"
              :class="getTypeColorClass(type.type.name)">
              {{ type.type.name }}
            </span>
          </div>
        </div>
        <div class="flex-shrink-0">
          <!-- Right Arrow -->
          <ArrowRightIcon :size="24" className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <!-- ID -->
      <p class="text-sm font-normal text-gray-500 mb-2 leading-none tracking-wide">
        Nr. {{ pokemon.id.toString().padStart(3, '0') }}
      </p>
    </div>

    <!-- Pokemon Image -->
    <div class="flex-shrink-0">
      <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="w-14 h-14 object-cover" loading="lazy" />
    </div>
  </div>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0px 15px 15px 0px rgba(0, 0, 0, 0.1);
}
</style>
