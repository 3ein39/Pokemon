<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  message: string
  showBackButton?: boolean
}

withDefaults(defineProps<Props>(), {
  showBackButton: true
})

const router = useRouter()

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="px-4 py-8">
    <div class="bg-white bg-opacity-90 rounded-lg p-4">
      <p class="text-red-800">{{ message }}</p>
      <button v-if="showBackButton" @click="goBack"
        class="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors cursor-pointer">
        Go Back
      </button>
    </div>
  </div>
</template>
