<template>
  <div class="chart-container">
    <h4 v-if="title" class="chart-title">{{ title }}</h4>
    <div class="chart-wrapper">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>
    <div class="chart-legend">
      <div class="legend-item">
        <span class="legend-color" style="background: #28a745" />
        <span>Passed: {{ passed }}</span>
      </div>
      <div class="legend-item">
        <span class="legend-color" style="background: #dc3545" />
        <span>Failed: {{ failed }}</span>
      </div>
      <div v-if="skipped > 0" class="legend-item">
        <span class="legend-color" style="background: #6c757d" />
        <span>Skipped: {{ skipped }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DonutProps } from '@/types/Donut.types';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { computed } from 'vue';
import { Doughnut } from 'vue-chartjs';

ChartJS.register(ArcElement, Tooltip, Legend);

const props = withDefaults(defineProps<DonutProps>(), {
  skipped: 0,
  title: '',
});

const chartData = computed(() => ({
  labels: ['Passed', 'Failed', ...(props.skipped > 0 ? ['Skipped'] : [])],
  datasets: [
    {
      data: [props.passed, props.failed, ...(props.skipped > 0 ? [props.skipped] : [])],
      backgroundColor: ['#28a745', '#dc3545', ...(props.skipped > 0 ? ['#6c757d'] : [])],
      borderWidth: 0,
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          const total = props.passed + props.failed + props.skipped;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${label}: ${value} (${percentage}%)`;
        },
      },
    },
  },
};
</script>

<style scoped src="./PassFailDonut.css"></style>
