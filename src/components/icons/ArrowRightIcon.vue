<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
    :class="className">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M10.5 16.9998C10.244 16.9998 9.98801 16.9018 9.79301 16.7068C9.40201 16.3158 9.40201 15.6838 9.79301 15.2928L13.098 11.9878L9.91801 8.69476C9.53501 8.29676 9.54601 7.66376 9.94301 7.28076C10.341 6.89776 10.974 6.90876 11.357 7.30476L15.219 11.3048C15.598 11.6978 15.593 12.3208 15.207 12.7068L11.207 16.7068C11.012 16.9018 10.756 16.9998 10.5 16.9998Z"
      fill="currentColor" />
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
