<template>
  <div class="mx-4 sm:mx-6 mt-6 sm:mt-10">
    <div class="flex flex-wrap justify-between items-center text-white">
      <p class="text-lg sm:text-2xl">Welcome back, {{ authStore.profile?.name }}</p>
      <p class="flex gap-x-2 items-center mt-4 sm:mt-0">
        {{ authStore.profile?.name }}
        <img
          class="w-5 sm:w-[18px] h-5 sm:h-[18px] hover:cursor-pointer"
          src="../assets/user.png"
          alt="user-icon"
        >
      </p>
    </div>
    <div class="flex flex-wrap lg:flex-nowrap w-full mt-6 gap-4">
      <div class="w-full">
        <div class="bg-[#1C1C1C] bg-opacity-70 rounded-2xl backdrop-blur p-4 sm:p-6 mb-6">
          <!-- Stats Section -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6 text-white">
            <div class="flex space-x-2 items-center">
              <div class="flex p-2 xl:p-4 rounded-xl xl:rounded-2xl bg-[#B0B0B01A] items-center justify-center">
                <img src="../assets/balance-icon.svg" alt="balance-icon" class="w-12">
              </div>
              <div>
                <p class="text-xs xl:text-sm text-white">Available Balance</p>
                <p class="text-base xl:text-lg font-bold">$ {{ data?.availableBalance.toFixed(2) }}</p>
              </div>
            </div>
            <div class="flex space-x-2 items-center">
              <div class="flex p-2 xl:p-4 rounded-xl xl:rounded-2xl bg-[#B0B0B01A] items-center justify-center">
                <img src="../assets/donate.svg" alt="balance-icon" class="w-12">
              </div>
              <div>
                <p class="text-xs xl:text-sm text-white">Incoming This Month</p>
                <p class="text-base xl:text-lg font-bold">$ {{ data?.incoming.toFixed(2) }}</p>
              </div>
            </div>
            <div class="flex space-x-2 items-center">
              <div class="flex p-2 xl:p-4 rounded-xl xl:rounded-2xl bg-[#B0B0B01A] items-center justify-center">
                <img src="../assets/balance-icon.svg" alt="balance-icon" class="lg:w-12">
              </div>
              <div>
                <p class="text-xs xl:text-sm text-white">Expense This Month</p>
                <p class="text-base xl:text-lg font-bold">$ {{ data?.expenses.toFixed(2) }}</p>
              </div>
            </div>
          </div>  
          <!-- Chart Section -->
          <div class="rounded-xl mb-6">
            <div class="rounded-xl">
              <!-- Add Chart Library here -->
              <TransactionChart v-if="data?.transactions?.length" :data="data?.transactions || []" />
              <p v-else class="text-center text-2xl font-bold mt-20">No Transactions Yet</p>
            </div>
          </div>
        </div>

        <!-- Recent Transactions -->
        <div class="w-full">
          <div class="bg-[#1C1C1C] bg-opacity-70 backdrop-blur rounded-xl p-4 text-white">
            <p class="text-base sm:text-lg font-semibold mb-4">Recent Transactions</p>
            <template v-for="(transaction, i) of recentTransactions" :key="i">
              <div class="flex flex-wrap justify-between items-center text-xs sm:text-sm mb-2">
                <p class="md:w-20">{{ transaction.name }}</p>
                <p class="text-gray-400">{{transaction.currency}} {{ transaction.amount.toFixed(2) }}</p>
                <p class="text-gray-400">{{ transaction.createdAt }}</p>
                <p v-if="transaction.status === 'inbound'" class="bg-green-500 rounded-lg py-1 px-2 capitalize">{{ transaction.status }}</p>
                <p v-if="transaction.status === 'outbound'" class="bg-red-500 rounded-lg py-1 px-2 capitalize">{{ transaction.status }}</p>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="bg-[#1C1C1C] bg-opacity-70 backdrop-blur w-full lg:max-w-48 h-96 lg:h-[620px] mb-10 text-white p-3 rounded-2xl overflow-y-auto">
        <h2 class="text-base sm:text-lg font-semibold mb-4">My Wallets</h2>
        <div class="space-y-4">
          <div v-for="(wallet, i) in authStore.wallets" :key="i"
              class="flex items-center justify-between rounded-xl hover:bg-white/5">
            <div class="flex items-center space-x-3">
              <img
                class="rounded-full p-2"
                :class="{
                  'bg-[#2D5E9B]': (i + 1) % 3 === 0,
                  'bg-[#8C8C8C]': (i + 1) % 3 === 2,
                  'bg-[#F7931A]': (i + 1) % 3 === 1,
                }"
                src="../assets/balance-icon.svg"
                alt="balance-icon"
              >
              <span class="text-xs sm:text-sm">Wallet: {{ wallet.walletId }}</span>
            </div>
            <span class="text-xs lg:text-sm">{{CURRENCIES[wallet.currency?.toUpperCase() as CurrencyCode]?.symbol}} {{ wallet.balance }}</span>
          </div>
          <button class="w-full py-2 sm:py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-xs sm:text-sm" @click="showWalletForm = !showWalletForm">
            Add New Wallet
          </button>
        </div>
      </div>
    </div>
  </div>
  <DialogModel v-if="showWalletForm">
    <AddWallet class="z-20" @close="showWalletForm = false" @created="fetchWallets" />
  </DialogModel>
</template>


<script setup lang="ts">
import TransactionChart from '@/components/TransactionChart.vue';
import DialogModel from '@/components/DialogModel.vue';
import AddWallet from '@/components/AddWallet.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { onMounted, ref, onBeforeMount } from 'vue';
import { useFetch } from '@/composables/useFetch';
import { CURRENCIES } from '@/constants/Currencies';
import type { CurrencyCode, OverviewResponse, Transactions } from '@/types/response';

const router = useRouter()
const authStore = useAuthStore()
const { getLocalStore } = authStore
const showWalletForm = ref(false)

const token = getLocalStore('access_token') as string

const data = ref<OverviewResponse>()
const recentTransactions = ref<Transactions[]>()
const fetchWallets = async () => {
  showWalletForm.value = false
  try {
    const response = await useFetch('/wallet/all', token)
    authStore.wallets = response.data
    getAllDetails()
  }
  catch(e) {
    console.log({e})
  }
}

const getAllDetails = async () => {
  try {
    const response = await useFetch('/wallet/overview', token)
    data.value = response.data
    recentTransactions.value = response.data?.transactions?.slice(-2)
  }
  catch(e) {
    console.log({e})
  }
}
onBeforeMount(() => {
  authStore.isAdmin && router.push('/transactions') 
})

onMounted(() => {
  !authStore.isAdmin && fetchWallets()
})
</script>
