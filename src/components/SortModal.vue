<script setup lang="ts">
import { ref } from 'vue'
import { usePokemonStore } from '@/stores/pokemon'
import SortIcon from '@/components/icons/SortIcon.vue'

interface Props {
  isOpen: boolean
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const pokemonStore = usePokemonStore()
const isClosing = ref(false)

const handleSort = (sortType: string) => {
  pokemonStore.setSortType(sortType)
}

const applySorting = () => {
  startClosing()
}

const startClosing = () => {
  isClosing.value = true
  setTimeout(() => {
    isClosing.value = false
    emit('close')
  }, 300) // Match animation duration
}

const closeModal = () => {
  startClosing()
}
</script>

<template>
  <!-- Modal Overlay -->
  <div v-if="isOpen" class="fixed inset-0 flex items-end justify-center z-50" style="background: #00000066;"
    @click="closeModal">
    <!-- Modal Content -->
    <div class="bg-white rounded-t-2xl w-full relative container mx-auto max-h-[80vh] flex flex-col"
      :class="isClosing ? 'modal-slide-down' : 'modal-slide-up'" @click.stop>
      <!-- Fixed Header -->
      <div class="p-6 pb-0 flex-shrink-0">
        <!-- Close Button -->
        <button @click="closeModal"
          class="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10 cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Header -->
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Sorteren op</h2>
      </div>

      <!-- Scrollable Sort Options -->
      <div class="flex-1 overflow-y-auto px-6">
        <div class="space-y-2 pb-4">
          <div v-for="option in pokemonStore.sortOptions" :key="option.id" @click="handleSort(option.id)"
            class="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all" :class="pokemonStore.sortType === option.id
              ? 'border-teal-400'
              : 'border-gray-200 hover:border-gray-300'">
            <div class="flex items-center space-x-3">
              <SortIcon :name="option.icon" :size="16" class="flex-shrink-0" />
              <span class="text-gray-900 font-medium">{{ option.label }}</span>
            </div>

            <!-- Checkmark -->
            <div v-if="pokemonStore.sortType === option.id" class="flex-shrink-0">
              <svg class="w-6 h-6 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Fixed Apply Button -->
      <div class="p-6 pt-4 flex-shrink-0">
        <button @click="applySorting"
          class="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer">
          Toepassen
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-slide-up {
  animation: slideUp 0.3s ease-out;
}

.modal-slide-down {
  animation: slideDown 0.3s ease-in;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }

  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
</style>
