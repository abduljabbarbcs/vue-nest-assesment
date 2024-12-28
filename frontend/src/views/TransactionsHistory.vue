<template>
    <div class="p-6">
        <BaseTable :data="data" :columnHeaders="columnHeaders" @scroll="fetchTransactions"/>
    </div>
</template> 

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useFetch } from '@/composables/useFetch';
const authStore = useAuthStore()
const { getLocalStore } = authStore
import { onMounted, ref } from 'vue';
import BaseTable from '@/components/BaseTable.vue';
const token = getLocalStore('access_token') as string
const data = ref([])
let offset = 0;
const limit = 50
const columnHeaders = ref([
        { text: 'Transaction ID', key: 'transactionId' },
        { text: 'Name', key: 'name' },
        { text: 'Balance', key: 'amount' },
        { text: 'Date', key: 'created_at' },
        { text:'walletId', key:'walletId' },
        { text: 'Status', key: 'status' },
])


if(authStore.isAdmin) {
    columnHeaders.value = [
        { text: 'Transaction ID', key: 'transactionId' },
        { text: 'Sender Wallet', key: 'senderwallet' },
        { text: 'Reciever Wallet', key: 'recipientwallet' },
        { text: 'Amount', key: 'amount' },
        { text: 'Date', key: 'created_at' },
];
}

const fetchTransactions = async () => {
  try {
    const url = authStore.isAdmin ? '/transaction/admin' : '/transaction' 
    const response = await useFetch(`${url}/?limit=${limit}&offset=${offset}`, token)
    data.value.push(...response.data)
    if(response.data.length)
        offset = offset + limit
  }
  catch(e) {
    console.log({e})
  }
}
onMounted(() => {
    fetchTransactions()
})
</script>