<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import type { PokemonDetail } from '@/types/pokemon'

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.5 7.00024C13.756 7.00024 14.012 7.09824 14.207 7.29324C14.598 7.68424 14.598 8.31624 14.207 8.70724L10.902 12.0122L14.082 15.3052C14.465 15.7032 14.454 16.3362 14.057 16.7192C13.659 17.1022 13.026 17.0912 12.643 16.6952L8.781 12.6952C8.402 12.3022 8.407 11.6792 8.793 11.2932L12.793 7.29324C12.988 7.09824 13.244 7.00024 13.5 7.00024Z"
              fill="currentColor" />
          </svg>
          <span class="text-lg font-medium">Terug</span>
        </button>

        <!-- Favorite Heart Button -->
        <button @click="toggleFavorite"
          class="p-2 rounded-full bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 cursor-pointer backdrop-blur-sm">
          <!-- Heart Icon - Filled when favorited, outline when not -->
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6">
            <g v-if="isFavorited">
              <path fill="none" d="M0 0H24V24H0z"></path>
              <path
                d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
                fill="#ffffff" stroke="#ffffff"></path>
            </g>
            <g v-else>
              <path fill="none" d="M0 0H24V24H0z"></path>
              <path
                d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
                fill="none" stroke="#ffffff" stroke-width="2"></path>
            </g>
          </svg>
        </button>
      </div>
    </div>
  </header>
</template>
