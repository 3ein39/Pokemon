<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title: string
  type: 'team' | 'favourites'
}

const props = defineProps<Props>()
const router = useRouter()

const handleCardClick = () => {
  if (props.type === 'team') {
    router.push('/team')
  } else if (props.type === 'favourites') {
    router.push('/favourites')
  }
}
</script>

<template>
  <div
    class="rounded-lg p-4 card-shadow flex-1 relative h-32 flex flex-col justify-end cursor-pointer "
    :class="{
      'team-gradient': type === 'team',
      'favourites-gradient': type === 'favourites',
    }" @click="handleCardClick">
    <svg class="absolute right-0 top-1/2 transform -translate-y-1/2 pokeball-bg" width="75" height="89"
      viewBox="0 0 75 89" fill="none" xmlns="http://www.w3.org/2000/svg">
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

    <!-- Content positioned at bottom -->
    <div class="relative z-10">
      <!-- Header -->
      <div class="mb-2">
        <h2 class="text-lg font-bold text-white card-title">
          {{ title }}
        </h2>
      </div>

      <!-- Content Slot -->
      <div>
        <slot>
          <!-- Default empty state -->
          <div>
            <p class="text-white card-content opacity-80">
              <span v-if="type === 'team'">No team members yet</span>
              <span v-else>No favourites yet</span>
            </p>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-shadow {
  box-shadow: 0px 15px 15px 0px rgba(0, 0, 0, 0.1);
}

.team-gradient {
  background: linear-gradient(109.73deg, #46469c 0%, #7e32e0 100%);
}

.favourites-gradient {
  background: linear-gradient(109.73deg, #65cb9a 0%, #15d0dc 100%);
}

.pokeball-bg {
  height: 90%;
  width: auto;
}

.card-title {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.41px;
}

.card-content {
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif;
  font-weight: 400;
  font-size: 15px;
  line-height: 22px;
  letter-spacing: -0.41px;
}
</style>
