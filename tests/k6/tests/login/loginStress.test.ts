import { check } from 'k6';
import http from "k6/http";

export const options = {
  scenarios: {
    stress: {
      executor: 'ramping-arrival-rate',
      startRate: 1,
      timeUnit: '30s',
      preAllocatedVUs: 50,
      maxVUs: 100,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0 },
      ],
      tags: { test_type: 'stress' },
    }
  },
  discardResponseBodies: true,
  thresholds: {
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    http_req_failed: ['rate<0.10'],
    iterations: ['rate>0.99'],
    vus: ['value>0'],
  }
};

export function setup(): void {

}

export default function login(): void {
  const url = 'http://localhost:3001/auth/login';

  const payload = JSON.stringify({
    email: "generic@example.com",
    password: "123456"
  });

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  const params = {
    headers: headers,
    responseType: "text" as const
  }

  const res = http.post(url, payload, params);

  const body = JSON.parse(res.body);

  check(res, {
    'Status é 200': () => res.status === 200,
    'Duração da requisição é menor que 2s': () => res.timings.duration < 2000,
    'A mensagem de sucesso está correta': () => {
      return body.message === "Login realizado com sucesso!"
    },
    'Token de acesso está presente': () => {
      return body.token !== undefined && body.token.length > 0;
    }
  });
}

export function handleSummary(data: unknown): { [key: string]: string } {
  return {
    "reports/performance-result.json": JSON.stringify(data, null, 2),
  };
}