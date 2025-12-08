<template>
  <div class="overview-page">
    <div class="page-header">
      <h1>Overview</h1>
      <p class="page-subtitle">Visão geral dos resultados de testes</p>
    </div>

    <div v-if="loading" class="loading">
      <p>Carregando dados...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchSummary" class="retry-btn">Tentar novamente</button>
    </div>

    <div v-else-if="overall" class="overview-content">
      <div class="summary-cards grid grid-cols-4">
        <SummaryCard v-if="overall" title="Total de Testes" :value="String(overall.total)" variant="default" />
        <SummaryCard v-if="overall" title="Passed" :value="String(overall.passed)" :label="`${successRate}% de sucesso`" variant="success" />
        <SummaryCard v-if="overall" title="Failed" :value="String(overall.failed)" :label="`${failedRate}% de falhas`" variant="danger" />
        <SummaryCard title="Duração Total" :value="formattedDuration" variant="info" />
      </div>

      <div v-if="overall && frameworkData.length > 0" class="charts-row grid grid-cols-2">
        <div class="chart-card card">
          <PassFailDonut :passed="overall.passed" :failed="overall.failed" :skipped="overall.skipped" title="Distribuição de Resultados" />
        </div>
        <div class="chart-card card">
          <div class="chart-header">
            <h4 class="chart-title">Testes por Framework</h4>
            <div class="chart-controls">
              <label class="view-mode-label">
                <input type="radio" :value="'consolidated'" v-model="viewMode" class="view-mode-radio" />
                <span>Consolidado</span>
              </label>
              <label class="view-mode-label">
                <input type="radio" :value="'individual'" v-model="viewMode" class="view-mode-radio" />
                <span>Individual</span>
              </label>
            </div>
            <select v-if="viewMode === 'individual'" v-model="selectedFrameworks" multiple class="framework-select" size="4">
              <option v-for="framework in allFrameworks" :key="framework" :value="framework">
                {{ formatFrameworkName(framework) }}
              </option>
            </select>
          </div>
          <TotalBarChart :frameworks="displayedFrameworkData" title="" />
        </div>
      </div>

      <div v-if="byFramework && Object.keys(byFramework).length > 0" class="frameworks-section">
        <h2>Frameworks</h2>
        <div class="frameworks-grid grid grid-cols-3">
          <FrameworkCard
            v-for="(summary, framework) in byFramework"
            :key="framework"
            :framework="String(framework)"
            :summary="summary"
            :type="getFrameworkType(String(framework))"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import FrameworkCard from '@/components/cards/FrameworkCard.vue';
import SummaryCard from '@/components/cards/SummaryCard.vue';
import PassFailDonut from '@/components/charts/PassFailDonut.vue';
import TotalBarChart from '@/components/charts/TotalBarChart.vue';
import { useSummaryStore } from '@/stores/summaryStore';
import { formatFrameworkName } from '@/utils/formatFrameworkName';
import { getFrameworkType } from '@/utils/getFrameworkType';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';

const summaryStore = useSummaryStore();

const { overall, successRate, formattedDuration, byFramework, loading, error } = storeToRefs(summaryStore);
const { fetchSummary } = summaryStore;

const viewMode = ref<'consolidated' | 'individual'>('consolidated');
const selectedFrameworks = ref<string[]>([]);

const failedRate = computed(() => {
  if (!overall.value) {
    return 0;
  }

  if (overall.value.total === 0) {
    return 0;
  }

  const rate = (overall.value.failed / overall.value.total) * 100;
  return Math.round(rate);
});

const allFrameworks = computed(() => {
  const frameworks = byFramework.value;
  if (!frameworks) {
    return [];
  }
  return Object.keys(frameworks);
});

const frameworkData = computed(() => {
  const frameworks = byFramework.value;
  if (!frameworks || Object.keys(frameworks).length === 0) {
    return [];
  }
  return Object.entries(frameworks).map(([name, summary]) => ({
    name: formatFrameworkName(name),
    originalName: name,
    total: summary.total,
    passed: summary.passed,
    failed: summary.failed,
    skipped: summary.skipped,
  }));
});

const displayedFrameworkData = computed(() => {
  if (viewMode.value === 'consolidated') {
    return frameworkData.value;
  } else {
    if (selectedFrameworks.value.length === 0) {
      return [];
    }
    return frameworkData.value.filter((f) => selectedFrameworks.value.includes(f.originalName));
  }
});

watch(viewMode, (mode) => {
  if (mode === 'individual' && selectedFrameworks.value.length === 0 && allFrameworks.value.length > 0) {
    selectedFrameworks.value = [...allFrameworks.value];
  }
});

watch(
  allFrameworks,
  (frameworks) => {
    if (frameworks.length > 0 && viewMode.value === 'individual' && selectedFrameworks.value.length === 0) {
      selectedFrameworks.value = [...frameworks];
    }
  },
  { immediate: true },
);

onMounted(() => {
  fetchSummary();
});
</script>

<style src="./OverviewPage.css"></style>
