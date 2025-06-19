<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    :class="className">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"
      stroke="currentColor" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 24,
  className: ''
})
</script>
