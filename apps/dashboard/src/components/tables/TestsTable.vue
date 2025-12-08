<template>
  <div class="tests-table-container">
    <div class="table-header">
      <h4 v-if="title" class="table-title">{{ title }}</h4>
      <div class="table-controls">
        <input v-model="searchQuery" type="text" placeholder="Buscar testes..." class="search-input" />
        <select v-model="statusFilter" class="filter-select">
          <option value="">Todos</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
          <option value="skipped">Skipped</option>
        </select>
      </div>
    </div>
    <div class="table-wrapper">
      <table class="tests-table">
        <thead>
          <tr>
            <th @click="sortBy('name')" class="sortable">
              Nome
              <span v-if="sortField === 'name'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('status')" class="sortable">
              Status
              <span v-if="sortField === 'status'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('duration')" class="sortable">
              Duração
              <span v-if="sortField === 'duration'" class="sort-icon">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>Arquivo</th>
            <th v-if="showError">Erro</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredTests.length === 0" class="empty-row">
            <td :colspan="showError ? 5 : 4" class="empty-state">Nenhum teste encontrado</td>
          </tr>
          <tr v-for="test in paginatedTests" :key="test.id" class="test-row" :class="`status-${test.status}`">
            <td class="test-name">
              <span class="name-text">{{ test.name }}</span>
            </td>
            <td>
              <span class="status-badge" :class="`badge-${test.status}`">
                {{ test.status }}
              </span>
            </td>
            <td class="duration-cell">
              {{ formatDuration(test.duration_s) }}
            </td>
            <td class="file-cell">
              <span class="file-name">{{ test.file }}</span>
            </td>
            <td v-if="showError" class="error-cell">
              <button v-if="test.error" @click="toggleError(test.id)" class="error-toggle">
                {{ expandedErrors.has(test.id) ? 'Ocultar' : 'Ver erro' }}
              </button>
              <div v-if="expandedErrors.has(test.id) && test.error" class="error-details">
                <pre>{{ test.error }}</pre>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="table-pagination">
      <button @click="currentPage = Math.max(1, currentPage - 1)" :disabled="currentPage === 1" class="pagination-btn">Anterior</button>
      <span class="pagination-info"> Página {{ currentPage }} de {{ totalPages }} </span>
      <button @click="currentPage = Math.min(totalPages, currentPage + 1)" :disabled="currentPage === totalPages" class="pagination-btn">
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDuration } from '@/services/resultsService';
import type { TestsTableProps } from '@/types/testsTable.types';
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<TestsTableProps>(), {
  title: '',
  showError: true,
  itemsPerPage: 10,
});

const searchQuery = ref('');
const statusFilter = ref('');
const sortField = ref<'name' | 'status' | 'duration'>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const currentPage = ref(1);
const expandedErrors = ref<Set<string>>(new Set());

const filteredTests = computed(() => {
  let result = [...props.tests];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((test) => test.name.toLowerCase().includes(query) || test.file.toLowerCase().includes(query));
  }

  if (statusFilter.value) {
    result = result.filter((test) => test.status === statusFilter.value);
  }

  result.sort((a, b) => {
    let comparison = 0;
    if (sortField.value === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField.value === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortField.value === 'duration') {
      comparison = a.duration_s - b.duration_s;
    }
    return sortOrder.value === 'asc' ? comparison : -comparison;
  });

  return result;
});

const totalPages = computed(() => Math.ceil(filteredTests.value.length / props.itemsPerPage));

const paginatedTests = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return filteredTests.value.slice(start, end);
});

function sortBy(field: 'name' | 'status' | 'duration') {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortField.value = field;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1;
}

function toggleError(testId: string) {
  const newExpandedErrors = new Set(expandedErrors.value);
  if (newExpandedErrors.has(testId)) {
    newExpandedErrors.delete(testId);
  } else {
    newExpandedErrors.add(testId);
  }
  expandedErrors.value = newExpandedErrors;
}
</script>

<style scoped src="./TestsTable.css"></style>
