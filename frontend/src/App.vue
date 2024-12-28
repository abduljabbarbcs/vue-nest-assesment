<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/MainLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

const route = useRoute();

// Map meta.layout to the corresponding layout component
const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'default';
  return layout === 'auth' ? AuthLayout : DefaultLayout;
});
</script>

<template>
  <component :is="layoutComponent">
    <router-view />
  </component>
</template>
