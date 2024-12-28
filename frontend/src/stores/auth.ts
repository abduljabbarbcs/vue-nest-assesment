import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { useFetch } from '@/composables/useFetch'
import type { WalletsResponse } from '@/types/response'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const profile = ref(JSON.parse(getLocalStore('profile') || '{}'))

  function setLocalStore (key: string, value: string) {
    localStorage.setItem(key, value)
  }

  const wallets = ref<WalletsResponse[]>([])
  
  const logOut = (navigate = true) => {
    useFetch('/auth/logout')
    removeLocalStore('profile')
    removeLocalStore('access_token')
    profile.value = ''
    if (navigate) {
      router.push('/sign-in')
    }
  }

  const isAdmin = computed(() => profile.value.role === 'admin')
  function getLocalStore(key: string) { return localStorage.getItem(key) }

  function removeLocalStore(key: string) { return localStorage.removeItem(key) }

  return {
    profile,
    setLocalStore,
    getLocalStore,
    removeLocalStore,
    logOut,
    isAdmin,
    wallets
  }
})
