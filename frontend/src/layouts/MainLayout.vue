<template>
  <div class="flex relative bg-black">
    <img class="fixed right-0" src="../assets/BG.svg" alt="B-G" />
    <div class="my-4 pb-2 shadow-md md:hidden">
      <img class="w-8 absolute top-0 z-30 hover:cursor-pointer" src="../assets/menu-icon.svg" alt="menu-icon" @click="toggleMenu">
    </div>
    <div
      class="h-screen fixed md:relative top-0 py-6 pl-6 pr-4 left-0 z-20 bg-black transition-transform duration-300 ease-in-out transform md:block z-50"
      :class="{ '-translate-x-full': !menuOpen, 'translate-x-0': menuOpen, 'md:translate-x-0': true }"
      style="width: 272px;"
    >
      <div class="absolute top-4 right-4 md:hidden">
        <img class="hover:cursor-pointer w-4" src="../assets/xmark.svg" alt="close-icon" @click="toggleMenu()">
      </div>
      <img class="w-[131px]" src="../assets/brand-icon.png" alt="logo" />
      <div class="grid space-y-4 mt-5 pl-2">
        <BaseButton
          v-if="!isAdmin"
          id="home"
          text="Dashboard"
          class="w-[233px] link"
          :class="{ 'bg-gradient-to-r': activeLink === 'home' }"
          @click="navigate('/')"
        >
          <img class="w-6" src="../assets/dasboard.png" alt="dashboard-icon" />
        </BaseButton>
        <BaseButton
          v-if="!isAdmin"
          id="send-money"
          text="Send Money"
          class="w-[233px] link"
          :class="{ 'bg-gradient-to-r': activeLink === 'send-money' }"
          @click="navigate('/send-money')"
        >
          <img class="w-6" src="../assets/donate.svg" alt="donate-icon" />
        </BaseButton>
        <BaseButton
          id="transactions"
          text="Transactions"
          class="w-[233px] link"
          :class="{ 'bg-gradient-to-r': activeLink === 'transactions' }"
          @click="navigate('/transactions')"
        >
          <img class="w-6" src="../assets/protocols.png" alt="transactions-icon" />
        </BaseButton>
      </div>
      <div class="absolute bottom-6 left-6 right-6">
        <button class="w-full flex items-center px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-white/5" @click="logOut()">
          <img class="h-5 w-5 mr-3" src="../assets/logout-icon.svg" alt="logout">
          Log Out
        </button>
      </div>
    </div>
    <main class="w-full h-screen pt-6 z-20 overflow-auto">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed } from 'vue'
import BaseButton from '@/components/BaseButton.vue';
import { useAuthStore } from '@/stores/auth';

const route = useRoute();
const router = useRouter();

const { logOut, isAdmin } = useAuthStore()
const activeLink = ref(route.name as string);
const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const navigate = (path: string) => {
  if (route.path !== path) {
    router.push(path);
  }
  toggleMenu()
};
watch(
  () => route.name,
  (to) => {
    activeLink.value = to as string;
  }
);
</script>