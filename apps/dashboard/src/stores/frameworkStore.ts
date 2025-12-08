import { calculateSuccessRate, formatDuration, loadAllFrameworkResults, loadFrameworkResults } from '@/services/resultsService';
import type { FrameworkName, FrameworkResult } from '@/types/results.types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * @description Store para gerenciar os dados dos frameworks
 */
export const useFrameworkStore = defineStore('framework', () => {
  const frameworks = ref<Map<FrameworkName, FrameworkResult>>(new Map());
  const currentFramework = ref<FrameworkName | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const currentData = computed(() => {
    if (!currentFramework.value) {
      return null;
    }

    const data = frameworks.value.get(currentFramework.value);

    return data;
  });

  const currentSummary = computed(() => {
    if (!currentData.value) {
      return null;
    }
    const data = currentData.value;
    return data?.summary ?? null;
  });

  const currentSuccessRate = computed(() => {
    if (!currentSummary.value) {
      return 0;
    }
    return calculateSuccessRate(currentSummary.value.passed, currentSummary.value.total);
  });

  const currentFormattedDuration = computed(() => {
    if (!currentSummary.value) {
      return '0s';
    }
    return formatDuration(currentSummary.value.duration_s);
  });

  const currentTests = computed(() => currentData.value?.tests ?? []);

  const passedTests = computed(() => currentTests.value.filter((test) => test.status === 'passed'));

  const failedTests = computed(() => currentTests.value.filter((test) => test.status === 'failed'));

  const skippedTests = computed(() => currentTests.value.filter((test) => test.status === 'skipped'));

  /**
   * Carrega os resultados de um framework específico e atualiza o estado da store.
   *
   * Atualiza o cache de frameworks, o indicador de framework atual, o estado de carregamento e a mensagem de erro conforme o resultado da operação.
   *
   * @param name - Nome do framework cujos resultados devem ser carregados
   */
  async function fetchFramework(name: FrameworkName) {
    if (frameworks.value.has(name) && !loading.value) {
      currentFramework.value = name;
      return;
    }

    if (loading.value && currentFramework.value === name) {
      return;
    }

    loading.value = true;
    error.value = null;

    const previousFramework = currentFramework.value;
    if (previousFramework && previousFramework !== name) {
      currentFramework.value = null;
    }

    try {
      const data = await loadFrameworkResults(name);
      if (data) {
        if (data.framework !== name) {
          console.warn(`Framework mismatch: expected ${name}, got ${data.framework}`);
        }

        const newMap = new Map(frameworks.value);
        newMap.set(name, data);
        frameworks.value = newMap;
        currentFramework.value = name;
      } else {
        error.value = `Failed to load ${name} data`;
        currentFramework.value = null;
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Error fetching ${name}:`, err);
      currentFramework.value = null;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Carrega resultados de todos os frameworks e atualiza o estado da store.
   *
   * Define o indicador de carregamento, limpa erros anteriores, substitui o `frameworks` pelo
   * mapa carregado e, em caso de falha, grava a mensagem em `error` e registra o erro no console.
   */
  async function fetchAllFrameworks() {
    loading.value = true;
    error.value = null;

    try {
      const data = await loadAllFrameworkResults();
      frameworks.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching all frameworks:', err);
    } finally {
      loading.value = false;
    }
  }

  /**
   * Atualiza a framework atualmente selecionada na store.
   *
   * @param name - Nome da framework a definir como selecionada; use `null` para limpar a seleção
   */
  function setCurrentFramework(name: FrameworkName | null) {
    currentFramework.value = name;
  }

  return {
    frameworks,
    currentFramework,
    currentData,
    currentSummary,
    currentSuccessRate,
    currentFormattedDuration,
    currentTests,
    passedTests,
    failedTests,
    skippedTests,
    loading,
    error,
    fetchFramework,
    fetchAllFrameworks,
    setCurrentFramework,
  };
});
