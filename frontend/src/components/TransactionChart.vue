<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { type Transactions } from '@/types/response';

const { data } = defineProps<{
  data: Transactions[]
}>()

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface GroupedTransactions {
  [date: string]: {
    inbound: number;
    outbound: number;
  };
}


// Step 1: Group transactions by date
const grouped: GroupedTransactions = data.reduce((acc: GroupedTransactions, transaction: Transactions) => {
  const date = transaction.createdAt.split('T')[0]; // Extract date part
  if (!acc[date]) {
    acc[date] = { inbound: 0, outbound: 0 };
  }

  if (transaction.status === 'inbound') {
    acc[date].inbound += transaction.usdAmount || 0;
  } else if (transaction.status === 'outbound') {
    acc[date].outbound += transaction.usdAmount || 0;
  }

  return acc;
}, {});

// Step 2: Prepare chart data
const labels: string[] = Object.keys(grouped).sort(); // Sorted dates as labels
const incomingData: number[] = labels.map(date => grouped[date].inbound);
const expenseData: number[] = labels.map(date => grouped[date].outbound);

const chartData = {
  labels, // Dates as labels
  datasets: [
    {
      label: 'Expense',
      data: expenseData,
      borderColor: '#3b82f6',
      backgroundColor: '#3b82f6',
      borderWidth: 1,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3
    },
    {
      label: 'Incoming',
      data: incomingData,
      borderColor: '#22c55e',
      backgroundColor: '#22c55e',
      borderWidth: 1,
      tension: 0.4,
      pointRadius: 6,
      pointBackgroundColor: '#fff',
      pointBorderWidth: 3
    }
  ]
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        padding: 10
      }
    },
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
        display: true
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        padding: 10
      }
    }
  },
  plugins: {
    legend: {
      position: 'bottom',
      align: 'center',
      labels: {
        color: 'rgba(255, 255, 255, 0.7)',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20
      }
    }
  }
}
</script>

<template>
  <div class="backdrop-blur-sm rounded-xl p-2">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-xl font-semibold text-white">Line</h2>
      <button class="text-sm text-gray-400 hover:text-white">MORE</button>
    </div>
    <div class="h-[350px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
</style>
