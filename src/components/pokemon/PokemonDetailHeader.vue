<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import type { PokemonDetail } from '@/types/pokemon'
import BackArrowIcon from '@/components/icons/BackArrowIcon.vue'
import HeartIcon from '@/components/icons/HeartIcon.vue'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()
const router = useRouter()
const pokemonStore = usePokemonStore()

// Check if current Pokemon is in favorites
const isFavorited = computed(() => {
  if (!props.pokemon) return false
  return pokemonStore.isFavorite(props.pokemon.id)
})

const goBack = () => {
  router.back()
}

const toggleFavorite = () => {
  if (!props.pokemon) return
  pokemonStore.toggleFavorite(props.pokemon.id)
}
</script>

<template>
  <header class="relative z-10">
    <div class="px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Back Button with Text -->
        <button @click="goBack"
          class="flex items-center gap-2 text-white hover:text-gray-200 transition-colors cursor-pointer">
          <!-- Back Arrow -->
          <BackArrowIcon :size="24" className="w-6 h-6" />
          <span class="text-lg font-medium">Terug</span>
        </button>

        <!-- Favorite Heart Button -->
        <button @click="toggleFavorite"
          class="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
          <!-- Heart Icon - Filled when favorited, outline when not -->
          <HeartIcon :size="24" className="w-6 h-6" :filled="isFavorited" />
        </button>
      </div>
    </div>
  </header>
</template>
