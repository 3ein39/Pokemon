<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading Pokemon details...'
})
</script>

<template>
  <div class="flex justify-center items-center py-12">
    <div class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
      <p class="text-white mt-2">{{ message }}</p>
    </div>
  </div>
</template>
