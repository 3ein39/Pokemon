<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
    <div class="text-center px-6">
      <!-- Error Message -->
      <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">
        Pokémon Niet Gevonden!
      </h1>
      <p class="text-xl text-white/80 mb-8 max-w-md mx-auto">
        De Pokémon die je zoekt is weggelopen naar een andere route. Laten we je terugbrengen naar de Pokédex!
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/"
          class="px-8 py-3 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
          <HomeIcon :size="20" />
          Terug naar Pokédex
        </router-link>

        <button @click="goBack"
          class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-purple-600 transition-all duration-200 flex items-center justify-center gap-2">
          <BackArrowIcon :size="20" />
          Ga Terug
        </button>
      </div>

      <!-- Fun Pokemon Facts -->
      <div class="mt-12 text-white/60 text-sm">
        <p>Wist je dat er {{ totalPokemon }} Pokémon in de eerste generatie zijn?</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { usePokemonStore } from '@/stores/pokemon'
import { computed } from 'vue'
import BackArrowIcon from '@/components/icons/BackArrowIcon.vue'
import HomeIcon from '@/components/icons/HomeIcon.vue'

const router = useRouter()
const pokemonStore = usePokemonStore()

// Get total Pokemon count for fun fact
const totalPokemon = computed(() => pokemonStore.allPokemon.length || 151)

// Go back function
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>
