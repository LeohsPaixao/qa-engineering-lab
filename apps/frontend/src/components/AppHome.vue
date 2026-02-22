<template>
  <div class="main-container">
    <div class="logo-container">
      <img src="@/assets/images/qa-test-lab.png" alt="Logo QA E2E" class="logo" />
      <div class="project-description">
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
      </div>
    </div>
    <RouterView />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  max-width: 200px;
  height: auto;
  margin-bottom: 1rem;
}

.project-description {
  max-width: 600px;
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: #000000;
}

.project-description p {
  font-family: 'Roboto', sans-serif;
  margin: 0;
}

.project-description strong {
  color: #000000;
  font-weight: 600;
}
</style>
