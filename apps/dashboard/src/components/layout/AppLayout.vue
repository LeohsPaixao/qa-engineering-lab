<template>
  <div class="app-layout">
    <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
      <div class="sidebar-header">
        <h1 class="logo">QA Solar</h1>
        <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/" class="nav-item" active-class="active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 10l7-7 7 7M5 10v6a1 1 0 001 1h8a1 1 0 001-1v-6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Overview</span>
        </router-link>
        <router-link to="/frameworks" class="nav-item" active-class="active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 7h12M4 12h12M4 17h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Frameworks</span>
        </router-link>
        <router-link to="/tests" class="nav-item" active-class="active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9 2L2 7v11h6v-6h2v6h6V7l-7-5z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span>Tests</span>
        </router-link>
      </nav>
    </aside>
    <main class="main-content" :class="{ 'main-expanded': isCollapsed }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const isCollapsed = ref(false);

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value;
}

function handleResize() {
  if (window.innerWidth < 768) {
    isCollapsed.value = true;
  }
}

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped src="./AppLayout.css"></style>
