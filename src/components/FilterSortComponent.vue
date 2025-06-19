<script setup lang="ts">
import FilterIcon from '@/components/icons/FilterIcon.vue'
import SortToggleIcon from '@/components/icons/SortToggleIcon.vue'

interface Emits {
  (e: 'filter'): void
  (e: 'sort'): void
}

const emit = defineEmits<Emits>()

const handleFilter = () => {
  emit('filter')
}

const handleSort = () => {
  emit('sort')
}
</script>

<template>
  <div class="flex items-center">
    <!-- Filter Button -->
    <button @click="handleFilter" class="p-2 cursor-pointer" aria-label="Filter Pokemon">
      <FilterIcon :size="18" />
    </button>

    <!-- Sort Button -->
    <button @click="handleSort" class="p-2 cursor-pointer" aria-label="Sort Pokemon">
      <SortToggleIcon :size="20" />
    </button>
  </div>
</template>
