<template>
  <footer class="app-footer">
    <p class="message-footer">© {{ currentYear }} QA Engineering Lab - Todos os direitos reservados</p>
    <a
      href="https://github.com/LeohsPaixao/qa-engineering-lab"
      target="_blank"
      rel="noopener noreferrer"
      class="github-link"
      aria-label="Visitar repositório no GitHub"
    >
      <img src="@/assets/images/github-mark-white.svg" alt="GitHub" class="github-icon" />
    </a>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style scoped>
.app-footer {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  justify-content: space-between;
  background-color: #333;
  align-items: center;
  padding: 0.1rem 0;
  display: flex;
  z-index: 1000;
  width: 100%;
}

.github-link {
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  left: 0;
  position: relative;
  transition: opacity 0.2s ease;
}

.github-link:hover {
  opacity: 0.8;
}

.github-icon {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.message-footer {
  color: #fff;
  font-size: 0.8rem;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  right: 0;
  left: 0;
  position: relative;
  transition: opacity 0.2s ease;
}

@media (max-width: 768px) {
  .app-footer {
    padding: 0 1rem;
    height: 50px;
  }

  .message-footer {
    font-size: 0.8rem;
  }

  .github-icon {
    width: 20px;
    height: 20px;
  }
}
</style>
