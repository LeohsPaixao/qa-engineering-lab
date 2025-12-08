<template>
  <div class="chart-container">
    <h4 v-if="title" class="chart-title">{{ title }}</h4>
    <div v-if="hasData" class="chart-wrapper">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
    <div v-else class="empty-chart">
      <p>Nenhum dado disponível para exibir</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BarChartProps } from '@/types/BarChart.types';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js';
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const props = withDefaults(defineProps<BarChartProps>(), {
  title: '',
});

const hasData = computed(() => {
  return props.frameworks && props.frameworks.length > 0;
});

const chartData = computed(() => {
  if (!hasData.value) {
    return {
      labels: [],
      datasets: [],
    };
  }
  return {
    labels: props.frameworks.map((data) => data.name),
    datasets: [
      {
        label: 'Passed',
        data: props.frameworks.map((data) => data.passed),
        backgroundColor: '#28a745',
        borderWidth: 1,
      },
      {
        label: 'Failed',
        data: props.frameworks.map((data) => data.failed),
        backgroundColor: '#dc3545',
        borderWidth: 1,
      },
      {
        label: 'Skipped',
        data: props.frameworks.map((data) => data.skipped),
        backgroundColor: '#6c757d',
        borderWidth: 1,
      },
    ],
  };
});

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
      labels: {
        usePointStyle: true,
        padding: 15,
      },
    },
    tooltip: {
      mode: 'index' as const,
      intersect: false,
    },
  },
}));
</script>

<style scoped src="./TotalBarChart.css"></style>
