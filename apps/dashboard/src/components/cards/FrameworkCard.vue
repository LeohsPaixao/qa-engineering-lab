<template>
  <router-link :to="`/frameworks/${framework}`" class="framework-card card" @click="handleClick">
    <div class="card-header">
      <h3 class="framework-name">{{ displayName }}</h3>
      <div class="framework-badge" :class="badgeClass">
        {{ type }}
      </div>
    </div>
    <div class="card-content">
      <div class="stats-grid">
        <div class="stat">
          <span class="stat-label">Total</span>
          <span class="stat-value">{{ summary.total }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Passed</span>
          <span class="stat-value text-success">{{ summary.passed }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Failed</span>
          <span class="stat-value text-danger">{{ summary.failed }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Skipped</span>
          <span class="stat-value text-muted">{{ summary.skipped }}</span>
        </div>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${successRate}%` }" :class="progressClass" />
      </div>
      <div class="card-footer">
        <span class="duration">{{ formattedDuration }}</span>
        <span class="success-rate">{{ successRate }}% success</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { calculateSuccessRate, formatDuration } from '@/services/resultsService';
import type { CardProps } from '@/types/card.types';
import { formatFrameworkName } from '@/utils/formatFrameworkName';
import { computed } from 'vue';

const props = defineProps<CardProps>();

const displayName = computed(() => {
  return formatFrameworkName(props.framework);
});

const successRate = computed(() => calculateSuccessRate(props.summary.passed, props.summary.total));

const formattedDuration = computed(() => formatDuration(props.summary.duration_s));

const badgeClass = computed(() => {
  const classes: Record<string, string> = {
    ct: 'badge-ct',
    e2e: 'badge-e2e',
    unit: 'badge-unit',
  };
  return classes[props.type] || 'badge-default';
});

const progressClass = computed(() => {
  if (successRate.value >= 90) {
    return 'progress-success';
  }
  if (successRate.value >= 70) {
    return 'progress-warning';
  }
  return 'progress-danger';
});

function handleClick() {}
</script>

<style scoped src="./FrameworkCard.css"></style>
