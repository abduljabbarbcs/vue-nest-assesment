<template>
    <div class="relative overflow-auto shadow-md mt-5 h-[calc(100vh-100px)]" @scroll="handleChildScroll">
        <table class="w-full text-xs text-center">
        <thead class="text-xs rounded-lg text-white bg-[#1C1C1C] bg-opacity-70">
            <tr>
            <th 
                v-for="header in columnHeaders" 
                :key="header.key" 
                class="px-2 py-3 text-center font-bold cursor-pointer"
            >
                {{ header.text }} 
            </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item, i) in data" :key="i" class="bg-white border-solid border-1 border-gray-200">
                <td v-for="header in columnHeaders" :key="header.key" class="px-2 py-3 text-center hover:cursor-pointer">
                    {{ item[header.key] }}
                    <span v-if="header.key === 'amount'">{{ item['currency'] }}</span>
                </td>
            </tr>
        </tbody>
        </table>
    </div>
    </template>
    
    <script setup lang="ts">
    import type { Transactions } from '@/types/response';
    const emit = defineEmits(['scroll']);
    defineProps<{
        data: Transactions[],
        columnHeaders: any[]
    }>();

    const handleChildScroll = (event) => {
      const target = event.target;
      const scrollTop = target.scrollTop;
      const scrollHeight = target.scrollHeight;
      const clientHeight = target.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - 1) {
        emit('scroll')
      }
    }
    </script>
    <style>
    thead {
      position: sticky; 
      top: 0; 
      z-index: 1;
      background-color: #f1f1f1; 
    }
  </style>
      