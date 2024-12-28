<script lang="ts" setup>
import BaseInput from '@/components/BaseInput.vue';
import BaseButton from '@/components/BaseButton.vue';
import { onMounted, ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useFetch } from '@/composables/useFetch';
import { useRouter } from 'vue-router';
import type { WalletsResponse } from '@/types/response';
import { CURRENCIES } from '@/constants/Currencies';

const authStore = useAuthStore()
const { getLocalStore } = authStore
const router = useRouter()
const errorMessage = ref<string>('');
const selectedWallet = ref<WalletsResponse>()
const isUserValid = ref(false)
const successMessage = ref('')
const error = ref()
const token = getLocalStore('access_token') as string

const form = ref({
  senderWallet: "",
  recipientWallet: "",
  amount: 0,
  currency: 'USD'
})

const fetchWallets = async () => {
  try {
    const response = await useFetch('/wallet/all', token)
    authStore.wallets = response.data
  }
  catch(e) {
    console.log({e})
  }
}

const checkUser = async () => {
  try {
    const response = await useFetch(`/wallet?wallet_id=${form.value.recipientWallet}&amount=${form.value.amount}&currency=${form.value.currency}`, token)
    if (response.status === 200) {
      isUserValid.value = true
      successMessage.value = `Recipient will recieve ${response.data.amount} ${response.data.currency} in thier account`
    }
  } catch (e: any) {
    error.value = e.message
  }
}

const updateCurrency = async() => {
  const wallet = authStore.wallets.find(({ walletId }) => walletId === form.value.senderWallet)
  form.value.currency = wallet.currency
}
const sendMoney = async () => {
  const { senderWallet, recipientWallet, amount } = form.value
  const payload = {
    senderWallet: Number(senderWallet),
    recipientWallet: Number(recipientWallet),
    amount: Number(amount)
  }
  try {
    const response = await useFetch('/transaction', token, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    if (response.status === 201) {
      successMessage.value = `Money Successfully sent`
    }
  } catch (e: any) {
    error.value = e.message
  }
  finally {
    form.value = {
      senderWallet: "",
      recipientWallet: "",
      amount: 0,
      currency: 'USD'
    }
  }
}
onMounted(async () => {
  await fetchWallets()
})

watch(() => form.value.senderWallet, (val) => {
  selectedWallet.value = authStore.wallets.find((wallet) => wallet.walletId === Number(val))
})
</script>

<template>
  <div class="w-full mt-10">
    <h1 class="text-2xl text-center text-white font-semibold mb-8">Send Money</h1>
    <div class="flex justify-center">
      <div class="w-full max-w-96 bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl">
        <form @submit.prevent="isUserValid ? sendMoney() : checkUser()" class="space-y-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Wallet</label>
            <select
              v-model="form.senderWallet"
              name="amount"
              class="w-full rounded-xl px-4 py-3 text-black focus:outline-none"
              placeholder="Enter amount"
              @change="updateCurrency"
            >
            <option value="" selected disabled>Select your wallet</option>
             <option v-for="(wallet, i) of authStore.wallets" :key="i" :value="wallet.walletId">{{ wallet.walletId }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Amount</label>
            <BaseInput
              v-model="form.amount"
              type="number"
              name="amount"
              class="w-full rounded-xl px-4 py-3 focus:outline-none"
              placeholder="Enter amount"
            />
          </div>
  
          <div>
            <label class="block text-sm text-gray-400 mb-2">Currency</label>
            <select
              v-model="form.currency"
              :disabled="true"
              class="w-full rounded-xl text-black px-4 py-3 focus:outline-none"
            >
            <option value="" selected disabled>Select Currency</option>
            <option v-for="(currency, code) in CURRENCIES" :key="code" :value="code">
              {{ code }}: {{ currency.name }}
            </option>
            </select>
          </div>
  
          <div>
            <label for="recipient" class="block text-sm text-gray-400 mb-2">Recipient</label>
            <BaseInput
              v-model="form.recipientWallet"
              type="number"
              name="recipient"
              class="w-full border-gray-700 rounded-xl px-4 py-3 focus:outline-none"
              placeholder="Enter recipient"
            />
          </div>
  
          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>
  
          <BaseButton 
            type="submit"
            class="justify-self-end bg-gradient-to-r font-medium"
            :text="isUserValid ? 'Send Money': 'Check User'"
          />
        </form>
        <p v-if="error" class="mt-6 text-red-700 text-sm">
          {{ error }}
        </p>
        <div v-if="selectedWallet" class="mt-6 text-gray-400 text-sm">
          Current Balance: <span class="text-white font-medium">{{ selectedWallet?.balance }} {{ selectedWallet?.currency }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
