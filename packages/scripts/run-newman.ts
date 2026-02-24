import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { timestamp } from './timestamp';

const QA_RESULTS_DIR = path.resolve(process.cwd(), './qa-results/raw/newman');

function run() {
  const ts = timestamp();
  const reportDir = path.join(QA_RESULTS_DIR, ts);

  fs.mkdirSync(reportDir, { recursive: true });

  const collectionPath = './postman/collections/postman_collection.json';
  const reportPath = path.join(reportDir, 'results.xml');
  
  const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001';
  const cmd = `newman run ${collectionPath} -r cli,junit --reporter-junit-export ${reportPath} --env-var "baseUrl=${baseUrl}"`;

  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    process.exit(1);
  }
}

run();
