<template>
  <div class="summary-card card">
    <div class="card-header">
      <h3 class="card-title">{{ title }}</h3>
      <div class="card-icon" :class="iconClass">
        <component v-if="icon" :is="icon" width="24" height="24" />
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="card-content">
      <div class="card-value">{{ value }}</div>
      <div class="card-label">{{ label }}</div>
      <div v-if="trend" class="card-trend" :class="trendClass">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path v-if="trend > 0" d="M8 4l4 4H9v4H7V8H4l4-4z" fill="currentColor" />
          <path v-else d="M8 12l-4-4h3V4h2v4h3l-4 4z" fill="currentColor" />
        </svg>
        <span>{{ trendValue }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryCardProps } from '@/types/summaryCard.types';
import { computed } from 'vue';

const props = withDefaults(defineProps<SummaryCardProps>(), {
  label: '',
  trend: undefined,
  icon: undefined,
  variant: 'default',
});

const iconClass = computed(() => `icon-${props.variant}`);

const trendValue = computed(() => {
  if (props.trend === undefined) {
    return 0;
  }
  return Math.abs(props.trend);
});

const trendClass = computed(() => {
  if (props.trend === undefined || props.trend === 0) {
    return '';
  }
  return props.trend > 0 ? 'trend-up' : 'trend-down';
});
</script>

<style scoped src="./SummaryCard.css"></style>
