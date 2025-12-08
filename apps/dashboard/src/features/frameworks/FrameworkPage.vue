<template>
  <div class="framework-page">
    <div v-if="route.params.name" class="framework-detail">
      <div class="page-header">
        <ButtonBack />
        <div>
          <h1>{{ displayName }}</h1>
          <p class="page-subtitle">Detalhes do framework {{ displayName }}</p>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <p>Carregando dados...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <button @click="retry" class="retry-btn">Tentar novamente</button>
      </div>

      <div v-else-if="currentSummary" class="framework-content">
        <div class="summary-cards grid grid-cols-4">
          <SummaryCard v-if="currentSummary" title="Total" :value="String(currentSummary.total)" variant="default" />
          <SummaryCard
            v-if="currentSummary"
            title="Passed"
            :value="String(currentSummary.passed)"
            :label="`${currentSuccessRate}%`"
            variant="success"
          />
          <SummaryCard v-if="currentSummary" title="Failed" :value="String(currentSummary.failed)" variant="danger" />
          <SummaryCard title="Duração" :value="currentFormattedDuration" variant="info" />
        </div>

        <div v-if="currentSummary" class="charts-row grid grid-cols-2">
          <div class="chart-card card">
            <PassFailDonut
              :passed="currentSummary.passed"
              :failed="currentSummary.failed"
              :skipped="currentSummary.skipped"
              title="Distribuição de Resultados"
            />
          </div>
          <div class="chart-card card">
            <div class="chart-placeholder">
              <h4>Estatísticas Adicionais</h4>
              <div class="stats-list">
                <div class="stat-item">
                  <span class="stat-label">Taxa de Sucesso:</span>
                  <span class="stat-value">{{ currentSuccessRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Tempo Médio:</span>
                  <span class="stat-value">
                    {{ averageDuration }}
                  </span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Última Execução:</span>
                  <span class="stat-value">
                    {{ formattedTimestamp }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentTests && currentTests.length > 0" class="tests-section">
          <h2>Testes</h2>
          <TestsTable :tests="currentTests" :show-error="true" />
        </div>
      </div>
    </div>

    <div v-else class="frameworks-list">
      <div class="page-header">
        <h1>Frameworks</h1>
        <p class="page-subtitle">Selecione um framework para ver detalhes</p>
      </div>

      <div v-if="summaryLoading" class="loading">
        <p>Carregando frameworks...</p>
      </div>

      <div v-else-if="summaryError" class="error">
        <p>{{ summaryError }}</p>
        <button @click="fetchSummary" class="retry-btn">Tentar novamente</button>
      </div>

      <div v-else class="frameworks-grid grid grid-cols-3">
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
</template>

<script setup lang="ts">
import ButtonBack from '@/components/buttonBack.vue';
import FrameworkCard from '@/components/cards/FrameworkCard.vue';
import SummaryCard from '@/components/cards/SummaryCard.vue';
import PassFailDonut from '@/components/charts/PassFailDonut.vue';
import TestsTable from '@/components/tables/TestsTable.vue';
import { formatDuration, formatTimestamp } from '@/services/resultsService';
import { useFrameworkStore } from '@/stores/frameworkStore';
import { useSummaryStore } from '@/stores/summaryStore';
import type { FrameworkName } from '@/types/results.types';
import { formatFrameworkName } from '@/utils/formatFrameworkName';
import { getFrameworkType } from '@/utils/getFrameworkType';
import { storeToRefs } from 'pinia';
import { computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const summaryStore = useSummaryStore();
const frameworkStore = useFrameworkStore();

const { byFramework, loading: summaryLoading, error: summaryError } = storeToRefs(summaryStore);
const { fetchSummary } = summaryStore;

const { currentSummary, currentSuccessRate, currentFormattedDuration, currentTests, currentData, loading, error } = storeToRefs(frameworkStore);
const { fetchFramework } = frameworkStore;

const displayName = computed(() => {
  return formatFrameworkName(route.params.name as string);
});

const retry = () => {
  if (route.params.name) {
    fetchFramework(route.params.name as FrameworkName);
  }
};

const formattedTimestamp = computed(() => {
  const data = currentData.value;
  if (!data) {
    return 'N/A';
  }
  return formatTimestamp(data.timestamp);
});

const averageDuration = computed(() => {
  const summary = currentSummary.value;
  const tests = currentTests.value;
  if (!summary || !tests || tests.length === 0) {
    return '0s';
  }
  const total = tests.reduce((sum: number, test) => sum + test.duration_s, 0);
  const avg = total / tests.length;
  return formatDuration(avg);
});

watch(
  () => route.params.name,
  async (frameworkName) => {
    if (frameworkName && typeof frameworkName === 'string') {
      await fetchFramework(frameworkName as FrameworkName);
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (!route.params.name) {
    fetchSummary();
  }
});
</script>

<style scoped src="./FrameworkPage.css"></style>
