<template>
  <div class="auth-layout">
    <main>
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const auth = useAuthStore()
onMounted(() => {
  if(auth.profile) {
    router.push('/')
  }
})
</script>
  