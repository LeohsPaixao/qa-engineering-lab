import { check } from 'k6';
import http from "k6/http";
import { Counter, Trend } from 'k6/metrics';

const TrendDuration = new Trend('duration');
const CounterErrors = new Counter('error_counter');
const BASE_URL = 'http://localhost:3001';

export const options = {
  scenarios: {
    smoke: {
      executor: 'constant-vus',
      vus: 1,
      duration: '30s',
      tags: { test_type: 'smoke' },
    }
  },
  discardResponseBodies: true,
  thresholds: {
    http_req_duration: ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    http_req_failed: ['rate<0.10'],
    iterations: ['rate>0.99'],
    'duration': ['p(90) < 400', 'p(95) < 800', 'p(99.9) < 2000'],
    'error_counter': ['count < 10'],
  }
};

export function setup(): void {

}

export default function login(): void {
  const url = `${BASE_URL}/auth/login`;

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

  TrendDuration.add(res.timings.duration);

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

  CounterErrors.add(res.status !== 200 ? 1 : 0);
}

export function teardown(): void {
  const url = `${BASE_URL}/auth/logout`;

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
  };

  const params = {
    headers: headers,
    responseType: "text" as const
  }

  http.post(url, '', params);
}

export function handleSummary(data: unknown): { [key: string]: string } | void {
  return {
    "reports/performance-result.json": JSON.stringify(data, null, 2),
  };
}