<template>
  <div class="tests-list-page">
    <div class="page-header">
      <h1>Testes</h1>
      <p class="page-subtitle">Lista completa de todos os testes executados</p>
    </div>

    <div v-if="loading" class="loading">
      <p>Carregando testes...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="loadAllTests" class="retry-btn">Tentar novamente</button>
    </div>

    <div v-else class="tests-content">
      <div class="summary-section">
        <div class="summary-stats">
          <div class="stat-box">
            <span class="stat-label">Total de Testes</span>
            <span class="stat-value">{{ allTests.length }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Passed</span>
            <span class="stat-value text-success">{{ passedCount }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Failed</span>
            <span class="stat-value text-danger">{{ failedCount }}</span>
          </div>
          <div class="stat-box">
            <span class="stat-label">Skipped</span>
            <span class="stat-value text-muted">{{ skippedCount }}</span>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <select v-model="selectedFramework" class="framework-filter">
          <option value="">Todos os Frameworks</option>
          <option v-for="framework in availableFrameworks" :key="framework" :value="framework">
            {{ formatFrameworkName(String(framework)) }}
          </option>
        </select>
      </div>

      <div class="table-section">
        <TestsTable :tests="filteredTests" title="Lista de Testes" :show-error="true" :items-per-page="10" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TestsTable from '@/components/tables/TestsTable.vue';
import { useFrameworkStore } from '@/stores/frameworkStore';
import type { FrameworkName, TestResult } from '@/types/results.types';
import { formatFrameworkName } from '@/utils/formatFrameworkName';
import { computed, onMounted, ref } from 'vue';

const frameworkStore = useFrameworkStore();

const selectedFramework = ref<FrameworkName | ''>('');
const loading = ref(false);
const error = ref<string | null>(null);
const allTests = ref<TestResult[]>([]);

const availableFrameworks = computed(() => {
  const frameworks = new Set<string>();
  frameworkStore.frameworks.forEach((data, framework) => {
    if (data && data.tests && data.tests.length > 0) {
      frameworks.add(framework);
    }
  });
  return Array.from(frameworks);
});

const filteredTests = computed(() => {
  if (!selectedFramework.value) {
    return allTests.value;
  }
  const frameworkData = frameworkStore.frameworks.get(selectedFramework.value);
  if (!frameworkData) {
    return [];
  }

  const frameworkTestIds = new Set(frameworkData.tests.map((t) => t.id));
  return allTests.value.filter((test) => {
    return frameworkTestIds.has(test.id);
  });
});

const passedCount = computed(() => filteredTests.value.filter((t) => t.status === 'passed').length);

const failedCount = computed(() => filteredTests.value.filter((t) => t.status === 'failed').length);

const skippedCount = computed(() => filteredTests.value.filter((t) => t.status === 'skipped').length);

async function loadAllTests() {
  loading.value = true;
  error.value = null;

  try {
    const frameworks: FrameworkName[] = ['cypress-ct', 'cypress-e2e', 'jest', 'playwright-e2e', 'robot-e2e', 'selenium-e2e', 'vitest', 'rest-assured'];

    const tests: TestResult[] = [];

    await Promise.all(
      frameworks.map(async (framework) => {
        await frameworkStore.fetchFramework(framework);
        const data = frameworkStore.frameworks.get(framework);
        if (data && data.tests) {
          tests.push(...data.tests);
        }
      }),
    );

    allTests.value = tests;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro ao carregar testes';
    console.error('Error loading tests:', err);
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadAllTests();
});
</script>

<style scoped src="./TestsListPage.css"></style>
