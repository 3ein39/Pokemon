<template>
  <svg :width="size" :height="size" viewBox="0 0 75 89" fill="none" xmlns="http://www.w3.org/2000/svg"
    :class="className">
    <path
      d="M43.9932 56.8C37.9716 56.8 32.9378 52.6159 31.6089 47H0C1.51596 69.9839 20.6261 88.16 43.9932 88.16C67.3603 88.16 86.4703 69.9839 87.9864 47H56.3814C55.0491 52.6159 50.0152 56.8 43.9932 56.8Z"
      fill="white" fill-opacity="0.1" />
    <path
      d="M43.9932 31.36C50.0148 31.36 55.0486 35.5441 56.3814 41.16H87.9903C86.4705 18.1761 67.3642 0 43.9932 0C20.6261 0 1.51606 18.1761 0 41.16H31.605C32.9372 35.5441 37.9712 31.36 43.9932 31.36Z"
      fill="white" fill-opacity="0.1" />
    <path
      d="M50.8532 44.1C50.8532 47.8898 47.783 50.96 43.9932 50.96C40.2033 50.96 37.1332 47.8898 37.1332 44.1C37.1332 40.3101 40.2033 37.24 43.9932 37.24C47.783 37.24 50.8532 40.3101 50.8532 44.1Z"
      fill="white" fill-opacity="0.1" />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  className?: string
}

withDefaults(defineProps<Props>(), {
  size: 75,
  className: ''
})
</script>
