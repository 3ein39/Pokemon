<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" :class="className">
    <g v-if="filled">
      <path fill="none" d="M0 0H24V24H0z"></path>
      <path
        d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
        fill="#ffffff" stroke="#ffffff" />
    </g>
    <g v-else>
      <path fill="none" d="M0 0H24V24H0z"></path>
      <path
        d="M12.001 4.529c2.349-2.109 5.979-2.039 8.242.228 2.262 2.268 2.34 5.88.236 8.236l-8.48 8.492-8.478-8.492c-2.104-2.356-2.025-5.974.236-8.236 2.265-2.264 5.888-2.34 8.244-.228z"
        fill="none" stroke="#ffffff" stroke-width="2" />
    </g>
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
  className?: string
  filled?: boolean
}

withDefaults(defineProps<Props>(), {
  size: 24,
  className: '',
  filled: false
})
</script>
