<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PokemonDetail } from '@/types/pokemon'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

interface Props {
  pokemon: PokemonDetail | null
}

const props = defineProps<Props>()

// Swiper modules
const swiperModules = [Navigation, Pagination]

// Swiper state for navigation arrows
const currentSlideIndex = ref(0)
const isFirstSlide = computed(() => currentSlideIndex.value === 0)
const isLastSlide = computed(() => currentSlideIndex.value === pokemonImages.value.length - 1)

const onSlideChange = (swiper: { activeIndex: number }) => {
  currentSlideIndex.value = swiper.activeIndex
}

// Computed properties for easier access
const pokemonImages = computed(() => {
  if (!props.pokemon) return []

  const sprites = props.pokemon.sprites
  const images = []

  // Official artwork (highest quality)
  if (sprites.other?.['official-artwork']?.front_default) {
    images.push({
      url: sprites.other['official-artwork'].front_default,
      alt: `${props.pokemon.name} official artwork`
    })
  }

  // Dream World artwork
  if (sprites.other?.dream_world?.front_default) {
    images.push({
      url: sprites.other.dream_world.front_default,
      alt: `${props.pokemon.name} dream world artwork`
    })
  }

  // Home artwork
  if (sprites.other?.home?.front_default) {
    images.push({
      url: sprites.other.home.front_default,
      alt: `${props.pokemon.name} home artwork`
    })
  }

  // Regular sprites
  if (sprites.front_default) {
    images.push({
      url: sprites.front_default,
      alt: `${props.pokemon.name} front sprite`
    })
  }

  if (sprites.front_shiny) {
    images.push({
      url: sprites.front_shiny,
      alt: `${props.pokemon.name} shiny front sprite`
    })
  }

  return images.filter(img => img.url) // Remove any null/undefined URLs
})
</script>

<template>
  <div class="px-4 mb-8">
    <div class="relative">
      <Swiper :modules="swiperModules" :slides-per-view="1" :space-between="10" :navigation="{
        nextEl: '.swiper-button-next-custom',
        prevEl: '.swiper-button-prev-custom',
      }" @slideChange="onSlideChange" class="pokemon-carousel">
        <SwiperSlide v-for="(image, index) in pokemonImages" :key="index">
          <div class="flex justify-center items-center rounded-2xl p-8 relative">
            <img :src="image.url" :alt="image.alt" class="w-52 h-52 object-contain relative z-10" loading="lazy" />
            <!-- Shadow effect under the image -->
            <div
              class="absolute bottom-8 left-1/2 transform -translate-x-1/2 h-3 bg-black bg-opacity-30 rounded-full blur-md shadow-effect">
            </div>
          </div>
        </SwiperSlide>

        <!-- Custom Navigation Buttons -->
        <div v-if="pokemonImages.length > 1" :class="[
          'swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 cursor-pointer transition-all duration-200 backdrop-blur-sm',
          isFirstSlide ? 'bg-opacity-10 hover:bg-opacity-15' : 'bg-opacity-20 hover:bg-opacity-30'
        ]">
          <!-- Active left arrow -->
          <svg v-if="!isFirstSlide" width="32" height="32" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.5 7.00024C13.756 7.00024 14.012 7.09824 14.207 7.29324C14.598 7.68424 14.598 8.31624 14.207 8.70724L10.902 12.0122L14.082 15.3052C14.465 15.7032 14.454 16.3362 14.057 16.7192C13.659 17.1022 13.026 17.0912 12.643 16.6952L8.781 12.6952C8.402 12.3022 8.407 11.6792 8.793 11.2932L12.793 7.29324C12.988 7.09824 13.244 7.00024 13.5 7.00024Z"
              fill="currentColor" />
          </svg>
          <!-- Disabled left arrow -->
          <svg v-else width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8">
            <g opacity="0.3">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.875 21.2497C17.195 21.2497 17.515 21.1272 17.7587 20.8835C18.2475 20.3947 18.2475 19.6047 17.7587 19.116L13.6275 14.9847L17.6025 10.8685C18.0812 10.371 18.0675 9.5797 17.5712 9.10095C17.0737 8.6222 16.2825 8.63595 15.8037 9.13095L10.9762 14.131C10.5025 14.6222 10.5087 15.401 10.9912 15.8835L15.9912 20.8835C16.235 21.1272 16.555 21.2497 16.875 21.2497Z"
                fill="#231F20" />
              <mask id="mask0_117_2553" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="8" width="9"
                height="14">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M16.875 21.2497C17.195 21.2497 17.515 21.1272 17.7587 20.8835C18.2475 20.3947 18.2475 19.6047 17.7587 19.116L13.6275 14.9847L17.6025 10.8685C18.0812 10.371 18.0675 9.5797 17.5712 9.10095C17.0737 8.6222 16.2825 8.63595 15.8037 9.13095L10.9762 14.131C10.5025 14.6222 10.5087 15.401 10.9912 15.8835L15.9912 20.8835C16.235 21.1272 16.555 21.2497 16.875 21.2497Z"
                  fill="white" />
              </mask>
              <g mask="url(#mask0_117_2553)">
                <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="white" />
              </g>
            </g>
          </svg>
        </div>

        <div v-if="pokemonImages.length > 1" :class="[
          'swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-3 cursor-pointer transition-all duration-200 backdrop-blur-sm',
          isLastSlide ? 'bg-opacity-10 hover:bg-opacity-15' : 'bg-opacity-20 hover:bg-opacity-30'
        ]">
          <!-- Active right arrow -->
          <svg v-if="!isLastSlide" width="32" height="32" viewBox="0 0 24 24" fill="none"
            xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white rotate-180">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M13.5 7.00024C13.756 7.00024 14.012 7.09824 14.207 7.29324C14.598 7.68424 14.598 8.31624 14.207 8.70724L10.902 12.0122L14.082 15.3052C14.465 15.7032 14.454 16.3362 14.057 16.7192C13.659 17.1022 13.026 17.0912 12.643 16.6952L8.781 12.6952C8.402 12.3022 8.407 11.6792 8.793 11.2932L12.793 7.29324C12.988 7.09824 13.244 7.00024 13.5 7.00024Z"
              fill="currentColor" />
          </svg>
          <!-- Disabled right arrow (flipped) -->
          <svg v-else width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8 rotate-180">
            <g opacity="0.3">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M16.875 21.2497C17.195 21.2497 17.515 21.1272 17.7587 20.8835C18.2475 20.3947 18.2475 19.6047 17.7587 19.116L13.6275 14.9847L17.6025 10.8685C18.0812 10.371 18.0675 9.5797 17.5712 9.10095C17.0737 8.6222 16.2825 8.63595 15.8037 9.13095L10.9762 14.131C10.5025 14.6222 10.5087 15.401 10.9912 15.8835L15.9912 20.8835C16.235 21.1272 16.555 21.2497 16.875 21.2497Z"
                fill="#231F20" />
              <mask id="mask1_117_2553" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="10" y="8" width="9"
                height="14">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M16.875 21.2497C17.195 21.2497 17.515 21.1272 17.7587 20.8835C18.2475 20.3947 18.2475 19.6047 17.7587 19.116L13.6275 14.9847L17.6025 10.8685C18.0812 10.371 18.0675 9.5797 17.5712 9.10095C17.0737 8.6222 16.2825 8.63595 15.8037 9.13095L10.9762 14.131C10.5025 14.6222 10.5087 15.401 10.9912 15.8835L15.9912 20.8835C16.235 21.1272 16.555 21.2497 16.875 21.2497Z"
                  fill="white" />
              </mask>
              <g mask="url(#mask1_117_2553)">
                <rect width="30" height="30" transform="matrix(-1 0 0 1 30 0)" fill="white" />
              </g>
            </g>
          </svg>
        </div>
      </Swiper>
    </div>
  </div>
</template>

<style scoped>
/* Hide default navigation buttons */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  display: none;
}

/* Shadow effect under Pokemon images */
.shadow-effect {
  width: 250px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
}
</style>
