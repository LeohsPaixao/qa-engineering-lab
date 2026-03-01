import {
  FullConfig,
  FullResult,
  Reporter,
  Suite,
  TestCase,
  TestResult,
} from '@playwright/test/reporter';

import { ProjectStats } from '../types';

class CustomReporter implements Reporter {
  private startTime: number = 0;
  private results: Record<string, ProjectStats> = {};

  onBegin(config: FullConfig, suite: Suite) {
    this.startTime = Date.now();
    const isCI = !!process.env.CI;
    const environment = isCI ? 'CI Environment ☁️' : 'Local Development 💻';
    const projects = config.projects.map(p => p.name).filter(Boolean).join(', ');

    console.log('\x1b[1m\x1b[38;5;33m┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\x1b[0m');
    console.log('\x1b[1m\x1b[38;5;33m┃           🚀 QA Engineering Lab - Test Suite             ┃\x1b[0m');
    console.log('\x1b[1m\x1b[38;5;33m┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\x1b[0m\n');

    console.log(`\x1b[1mEnvironment:\x1b[0m \x1b[34m${environment}\x1b[0m`);
    console.log(`\x1b[1mProjects:\x1b[0m \x1b[34m${projects || 'All'}\x1b[0m`);
    console.log(`\x1b[1mWorkers:\x1b[0m \x1b[34m${config.workers}\x1b[0m`);
    console.log('\x1b[38;5;242m───────────────────────────────────────────────────────────\x1b[0m');
    console.log('\x1b[38;5;242mStarting test execution...\x1b[0m\n');
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const project = test.parent.project();
    const projectName = project?.name || 'unknown';

    let projectKey = 'unknown';
    if (projectName.toLowerCase().includes('e2e')) projectKey = 'e2e';
    else if (projectName.toLowerCase().includes('api')) projectKey = 'api';
    else if (projectName.toLowerCase().includes('component') || projectName.toLowerCase().includes('ct')) projectKey = 'component';
    else projectKey = projectName;

    if (!this.results[projectKey]) {
      this.results[projectKey] = { passed: 0, failed: 0, skipped: 0, timedOut: 0, total: 0 };
    }

    this.results[projectKey].total++;
    if (result.status === 'passed') {
      this.results[projectKey].passed++;
    } else if (result.status === 'skipped') {
      this.results[projectKey].skipped++;
    } else if (result.status === 'timedOut') {
      this.results[projectKey].timedOut++;
      this.results[projectKey].failed++;
    } else if (result.status === 'failed' || result.status === 'interrupted') {
      this.results[projectKey].failed++;
    }
  }

  onEnd(result: FullResult) {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    console.log('\n\x1b[1m\x1b[38;5;33m📋 EXECUTION SUMMARY\x1b[0m');
    console.log('\x1b[38;5;242m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');

    const headers = {
      project: 'PROJECT'.padEnd(12),
      total: 'TOTAL'.padStart(6),
      passed: 'PASSED'.padStart(8),
      failed: 'FAILED'.padStart(8),
      skipped: 'SKIPPED'.padStart(9),
      time: 'DURATION'.padStart(10)
    };

    console.log(`\x1b[1m${headers.project} ${headers.total} ${headers.passed} ${headers.failed} ${headers.skipped}\x1b[0m`);
    console.log('\x1b[38;5;242m───────────────────────────────────────────────────────────\x1b[0m');

    for (const [project, data] of Object.entries(this.results)) {
      const name = project.toUpperCase().padEnd(12);
      const total = data.total.toString().padStart(6);
      const passed = `\x1b[32m${data.passed.toString().padStart(8)}\x1b[0m`;
      const failed = `\x1b[31m${data.failed.toString().padStart(8)}\x1b[0m`;
      const skipped = `\x1b[33m${data.skipped.toString().padStart(9)}\x1b[0m`;

      console.log(`${name} ${total} ${passed} ${failed} ${skipped}`);
    }

    console.log('\x1b[38;5;242m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m');
    console.log(`\n\x1b[1mTotal Duration: \x1b[38;5;33m${duration}s\x1b[0m`);

    const statusColor = result.status === 'passed' ? '\x1b[32m' : '\x1b[31m';
    const statusText = result.status.toUpperCase();
    console.log(`\x1b[1mGlobal Status: ${statusColor}${statusText}\x1b[0m\n`);

    if (result.status !== 'passed') {
      console.log('\x1b[31m✘ Some tests failed. Please check the detailed logs above.\x1b[0m\n');
    } else {
      console.log('\x1b[32m✔ All tests passed successfully!\x1b[0m\n');
    }
  }
}

export default CustomReporter;
