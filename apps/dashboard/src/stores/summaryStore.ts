import { calculateSuccessRate, formatDuration, loadSummary } from '@/services/resultsService';
import type { SummaryData } from '@/types/results.types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

/**
 * @description Store para gerenciar os dados do resumo
 */
export const useSummaryStore = defineStore('summary', () => {
  const summary = ref<SummaryData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const overall = computed(() => summary.value?.overall ?? null);

  const successRate = computed(() => {
    if (!overall.value) {
      return 0;
    }
    return calculateSuccessRate(overall.value.passed, overall.value.total);
  });

  const formattedDuration = computed(() => {
    if (!overall.value) {
      return '0s';
    }
    return formatDuration(overall.value.duration_s);
  });

  const byFramework = computed(() => summary.value?.byFramework ?? {});

  const frameworks = computed(() => {
    return Object.keys(byFramework.value);
  });

  /**
   * Carrega o resumo usando `loadSummary` e atualiza o estado reativo do store.
   *
   * Define `loading` como `true` enquanto a operação ocorre, limpa erros prévios, atribui os dados retornados a `summary` quando presentes, define uma mensagem em `error` se o carregamento falhar e garante que `loading` seja revertido para `false` ao final.
   */
  async function fetchSummary() {
    loading.value = true;
    error.value = null;
    try {
      const data = await loadSummary();
      if (data) {
        summary.value = data;
      } else {
        error.value = 'Failed to load summary data';
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error fetching summary:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    summary,
    loading,
    error,
    overall,
    successRate,
    formattedDuration,
    byFramework,
    frameworks,
    fetchSummary,
  };
});
