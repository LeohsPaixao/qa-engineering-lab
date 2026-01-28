import http from "k6/http";
import { LoginResult } from '../types/types';

export default function doLogin(): LoginResult {
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

  if (res.status !== 200) {
    throw new Error(`Failed to login: ${res.status}`);
  }

  const body = JSON.parse(res.body);

  if (!body.token) {
    throw new Error('Token not found');
  }

  return { token: body.token };
}