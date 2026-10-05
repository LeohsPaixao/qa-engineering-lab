<template>
  <main data-testid="main" class="main-container">
    <div data-testid="content-wrapper" class="content-wrapper">
      <div class="logo-wrapper">
        <img src="@/assets/images/qa-test-lab.png" alt="Logo QA E2E" data-testid="home-logo" class="logo" />
      </div>

      <section data-testid="project-description" class="project-description" aria-label="Descrição do Projeto">
        <p>
          Este é um <strong>Laboratório de QA</strong> criado para quem acredita que qualidade não é apenas uma etapa do processo, mas uma
          mentalidade.
        </p>

        <p>
          Aqui, exploramos a <strong>Qualidade de Software</strong> de forma ampla e estratégica, aplicando diferentes níveis e tipos de testes dentro
          de uma visão moderna de engenharia: <strong>Unit Tests</strong>, <strong>Integration Tests</strong>, <strong>API Tests</strong>,
          <strong>UI Tests</strong>, <strong>Testes Não Funcionais</strong> (performance, carga, resiliência), entre muitas outras abordagens.
        </p>

        <p>
          O projeto promove a experimentação prática de conceitos como <strong>pirâmide de testes</strong>, <strong>shift-left testing</strong>,
          <strong>automação em CI/CD</strong> e boas práticas de arquitetura de testes. É um ambiente seguro para errar, aprender, comparar
          ferramentas e evoluir tecnicamente.
        </p>

        <p>
          Sendo <strong>Open Source</strong>, este laboratório é um convite constante ao desafio: testar novas estratégias, validar hipóteses,
          aprimorar habilidades e construir uma visão sólida e moderna sobre qualidade.
        </p>
      </section>
    </div>

    <RouterView />
  </main>
</template>

<script setup lang="ts"></script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem 1rem;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 800px;
  width: 100%;
  gap: 2rem;
}

.logo-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

.logo {
  max-width: 200px;
  width: 100%;
  height: auto;
}

.project-description {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #000000;
}

.project-description p {
  margin: 0;
}

.project-description strong {
  color: inherit;
  font-weight: 600;
}

/* Layout Responsivo para Telas Maiores (Desktop) */
@media (min-width: 768px) {
  .content-wrapper {
    flex-direction: row;
    align-items: flex-start;
  }

  .logo-wrapper {
    width: auto;
  }

  .project-description {
    text-align: left;
  }
}
</style>
