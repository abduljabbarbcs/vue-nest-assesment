<template>
  <div class="max-w-[413px] flex flex-col justify-center p-4 mx-auto mt-32 bg-[#1C1C1C] bg-opacity-70 backdrop-blur text-white md:p-8 rounded-lg">
    <div class="justify-items-end  mb-4">
      <img src="../assets/xmark.svg" alt="close" class="hover:cursor-pointer w-6" @click="$emit('close')">
    </div>
    <h1 class="text-[40px] font-bold mb-5">Add New Wallet</h1>
    <BaseForm @submit="handleSubmit">
      <div class="mb-8">
        <label for="name" class="block mb-2">Name</label>
        <BaseInput
          v-model="form.walletId"
          type="number"
          name="id"
          placeholder="Enter Wallet id"
          required
        />
      </div>
      <div class="mb-8">
        <label for="currency" class="block mb-2">Currency</label>
        <select v-model="form.currency" name="currency" id="curreny" class="text-black w-full px-1 py-3 rounded-md">
          <option value="" selected disabled>Select Currency</option>
          <option v-for="(currency, code) in currencies" :key="code" :value="code">
            {{ code }}: {{ currency.name }}
          </option>
        </select>
      </div>
      <div class="mb-4">
        <label for="balnce" class="block mb-2">Add Balance</label>
        <BaseInput
          v-model="form.balance"
          type="number"
          name="balance"
          placeholder="Enter Amount"
          required
        />
      </div>
      <p v-if="error" class="text-red-500 text-center my-6">{{ error }}</p>
      <div class="text-right">
        <BaseButton text="Add Wallet" class="mt-8 px-10 bg-gradient-to-l" />
      </div>
    </BaseForm>
  </div>
</template>

<script lang="ts" setup>
  import BaseButton from "../components/BaseButton.vue";
  import BaseInput from '../components/BaseInput.vue';
  import BaseForm from '../components/BaseForm.vue'
  import { useFetch } from '@/composables/useFetch';
  import { ref } from "vue";
  import { useAuthStore } from "@/stores/auth";
  import { CURRENCIES } from "@/constants/Currencies";

  const emit = defineEmits(['created']);
  const { getLocalStore } = useAuthStore()
  const error = ref('')
  const form = ref({
      currency: '',
      balance: 0,
      walletId: 0
  })
  const currencies = CURRENCIES;
  const handleSubmit = async () => {
      try {
        const token = getLocalStore('access_token') || ''
        form.value = { ...form.value, balance: Number(form.value.balance), walletId: Number(form.value.walletId) }
        const response = await useFetch('/wallet', token, {
          method: 'POST',
          body: JSON.stringify(form.value),
        })
        if (response.status === 201) {
          emit('created')
          error.value = ''
        }
      } catch(e: any) {
        error.value = e.message
      }
  }
</script>

<style scoped>

</style>