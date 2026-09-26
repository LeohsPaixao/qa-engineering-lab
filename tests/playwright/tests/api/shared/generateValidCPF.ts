function generateRandomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function calculateVerifierDigit(base: string): number {
  const baseDigits = base.split('').map(Number);
  const length = baseDigits.length;
  const sum = baseDigits.reduce((acc, digit, index) => acc + digit * (length + 1 - index), 0);
  const remainder = sum % 11;
  return remainder < 2 ? 0 : 11 - remainder;
}

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Gera um CPF válido (Cadastro de Pessoas Físicas).
 *
 * @retorna Uma string representando um CPF válido no formato "XXX.XXX.XXX-XX".
 *
 * @observações
 * Esta função utiliza uma combinação de geração aleatória de dígitos, cálculo de dígitos verificadores
 * e formatação para criar um CPF válido. O CPF gerado não está associado a nenhuma pessoa real e
 * deve ser usado apenas para fins de teste ou demonstração.
 *
 * O algoritmo utilizado nesta função segue as regras oficiais de geração de CPF:
 * 1. Gera uma base aleatória de 9 dígitos.
 * 2. Calcula o primeiro dígito verificador usando a base e a fórmula:
 *    (10 * d1 + 9 * d2 + 8 * d3 + 7 * d4 + 6 * d5 + 5 * d6 + 4 * d7 + 3 * d8 + 2 * d9) mod 11
 *    O resultado deve ser 0 ou 11 - resultado.
 * 3. Calcula o segundo dígito verificador usando a base, o primeiro dígito verificador e a fórmula:
 *    (11 * d1 + 10 * d2 + 9 * d3 + 8 * d4 + 7 * d5 + 6 * d6 + 5 * d7 + 4 * d8 + 3 * d9 + 2 * primeiroVerificador) mod 11
 *    O resultado deve ser 0 ou 11 - resultado.
 * 4. Combina a base, o primeiro dígito verificador e o segundo dígito verificador para formar o CPF final.
 * 5. Formata o CPF no padrão brasileiro: "XXX.XXX.XXX-XX".
 */
export function generateValidCPF(): string {
  const baseDigits = generateRandomDigits(9);
  const firstVerifier = calculateVerifierDigit(baseDigits);
  const secondVerifier = calculateVerifierDigit(baseDigits + firstVerifier);
  const cpf = `${baseDigits}${firstVerifier}${secondVerifier}`;
  return formatCPF(cpf);
}
