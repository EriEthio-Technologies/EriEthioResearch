import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },
    { duration: '1m', target: 200 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  const res = http.get('https://your-production-url.com/api/content');
  check(res, {
    'status was 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
} 