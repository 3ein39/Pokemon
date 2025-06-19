<script setup lang="ts">
import { useRouter } from 'vue-router'
import PokeballIcon from '@/components/icons/PokeballIcon.vue'

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
  <div class="rounded-lg p-4 card-shadow flex-1 relative h-32 flex flex-col justify-end cursor-pointer " :class="{
    'team-gradient': type === 'team',
    'favourites-gradient': type === 'favourites',
  }" @click="handleCardClick">
    <PokeballIcon :size="75" className="absolute right-0 top-1/2 transform -translate-y-1/2 pokeball-bg" />

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
