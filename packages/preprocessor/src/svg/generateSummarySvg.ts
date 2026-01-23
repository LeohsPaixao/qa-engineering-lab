import fs from 'fs-extra';
import path from 'node:path';
import { PreprocessorConfig, SummaryData } from '../types';

/**
 * Gera o SVG do summary.json
 * @param summaryData - os dados do summary
 * @param config - a configuração do preprocessador
 * @returns Promise<void>
 */
export async function generateSummarySvg(summaryData: SummaryData, config: PreprocessorConfig): Promise<void> {
  const { processedDir } = config;

  const summary = summaryData;

  const successRate = summary.overall.total > 0 ? Math.round((summary.overall.passed / summary.overall.total) * 100) : 0;
  const passedPercent = summary.overall.total > 0 ? (summary.overall.passed / summary.overall.total) * 100 : 0;
  const failedPercent = summary.overall.total > 0 ? (summary.overall.failed / summary.overall.total) * 100 : 0;
  const skippedPercent = summary.overall.total > 0 ? (summary.overall.skipped / summary.overall.total) * 100 : 0;

  const duration = summary.overall.duration_s;
  const durationFormatted = duration >= 60 ? `${Math.floor(duration / 60)}m ${Math.round(duration % 60)}s` : `${Math.round(duration)}s`;

  const date = new Date(summary.generatedAt);
  const formattedDate = date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const frameworks = Object.keys(summary.byFramework);

  const frameworkColors: Record<string, string> = {
    'cypress-ct': '#58a6ff',
    'cypress-e2e': '#58a6ff',
    'playwright-e2e': '#2ea043',
    'playwright-ct': '#2ea043',
    'robot-e2e': '#f85149',
    'selenium-e2e': '#a5a5a5',
    'rest-assured': '#43A047',
    vitest: '#f1e05a',
    jest: '#c21325',
    appium: '#7c3aed',
    k6: '#7d3c98',
  };

  const formatFrameworkName = (framework: string): string => {
    return framework.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const paddingLeft = 24;
  const paddingRight = 24;
  const badgeWidth = 110;
  const badgeSpacing = 10;
  const badgeTotalWidth = badgeWidth + badgeSpacing;
  const minSvgWidth = 800;
  const badgesWidth = frameworks.length > 0 ? frameworks.length * badgeTotalWidth - badgeSpacing : 0;
  const requiredWidth = paddingLeft + badgesWidth + paddingRight;
  const svgWidth = Math.max(minSvgWidth, requiredWidth);
  const progressBarWidth = svgWidth - paddingLeft - paddingRight;
  const headerHeight = 70;
  const svgHeight = 220;

  const summarySvg = `
<svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#238636;stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:#238636;stop-opacity:0.05" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.1"/>
    </filter>
  </defs>

  <style>
    .bg { fill: #0d1116; }
    .header-bg { fill: url(#headerGradient); }
    .title { fill: #f0f6fc; font-size: 20px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .subtitle { fill: #8b949e; font-size: 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .stat-label { fill: #8b949e; font-size: 11px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .stat-value { fill: #f0f6fc; font-size: 24px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .badge-passed { fill: #238636; }
    .badge-failed { fill: #da3633; }
    .badge-skipped { fill: #9e6a03; }
    .badge-text { fill: #ffffff; font-size: 11px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .framework-badge { fill: #21262d; }
    .framework-text { fill: #f0f6fc; font-size: 10px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .progress-bg { fill: #21262d; }
    .progress-passed { fill: #238636; }
    .progress-failed { fill: #da3633; }
    .progress-skipped { fill: #9e6a03; }
    .time-text { fill: #58a6ff; font-size: 13px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
    .date-text { fill: #6e7681; font-size: 11px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif; }
  </style>

  <!-- Background -->
  <rect width="100%" height="100%" rx="8" class="bg" filter="url(#shadow)"/>
  
  <!-- Header -->
  <rect width="100%" height="${headerHeight}" rx="8" class="header-bg"/>
  <text x="24" y="28" class="title">Frameworks:</text>
  
  <!-- Frameworks Badges -->
  <g transform="translate(24, 42)">
    ${frameworks
      .map((framework, index) => {
        const color = frameworkColors[framework] || '#58a6ff';
        const x = index * 120;
        const frameworkName = formatFrameworkName(framework);
        return `
    <g transform="translate(${x}, 0)">
      <rect x="0" y="0" width="110" height="20" rx="10" class="framework-badge" stroke="${color}" stroke-width="1.5"/>
      <text x="55" y="14" class="framework-text" text-anchor="middle">${frameworkName}</text>
    </g>`;
      })
      .join('')}
  </g>

  <!-- Main Stats Row -->
  <g transform="translate(24, ${headerHeight + 20})">
    <!-- Total Tests -->
    <g>
      <text x="0" y="0" class="stat-label">Total Tests</text>
      <text x="0" y="28" class="stat-value">${summary.overall.total}</text>
    </g>

    <!-- Success Rate -->
    <g transform="translate(140, 0)">
      <text x="0" y="0" class="stat-label">Success Rate</text>
      <text x="0" y="28" class="stat-value" fill="#238636">${successRate}%</text>
    </g>

    <!-- Duration -->
    <g transform="translate(280, 0)">
      <text x="0" y="0" class="stat-label">Duration</text>
      <text x="0" y="28" class="stat-value" fill="#58a6ff">${durationFormatted}</text>
    </g>
  </g>

  <!-- Badges Row -->
  <g transform="translate(24, ${headerHeight + 75})">
    <!-- Passed Badge -->
    <rect x="0" y="0" width="100" height="24" rx="12" class="badge-passed"/>
    <text x="50" y="16" class="badge-text" text-anchor="middle">✓ ${summary.overall.passed}</text>
    
    <!-- Failed Badge -->
    <rect x="120" y="0" width="100" height="24" rx="12" class="badge-failed"/>
    <text x="170" y="16" class="badge-text" text-anchor="middle">✗ ${summary.overall.failed}</text>
    
    <!-- Skipped Badge -->
    <rect x="240" y="0" width="100" height="24" rx="12" class="badge-skipped"/>
    <text x="290" y="16" class="badge-text" text-anchor="middle">⊘ ${summary.overall.skipped}</text>
  </g>

  <!-- Progress Bar -->
  <g transform="translate(24, ${headerHeight + 115})">
    <rect x="0" y="0" width="${progressBarWidth}" height="8" rx="4" class="progress-bg"/>
    ${
      passedPercent > 0
        ? `<rect x="0" y="0" width="${Math.max((passedPercent / 100) * progressBarWidth, 0)}" height="8" rx="4" class="progress-passed"/>`
        : ''
    }
    ${
      failedPercent > 0
        ? `<rect x="${(passedPercent / 100) * progressBarWidth}" y="0" width="${Math.max(
            (failedPercent / 100) * progressBarWidth,
            0,
          )}" height="8" rx="4" class="progress-failed"/>`
        : ''
    }
    ${
      skippedPercent > 0
        ? `<rect x="${((passedPercent + failedPercent) / 100) * progressBarWidth}" y="0" width="${Math.max(
            (skippedPercent / 100) * progressBarWidth,
            0,
          )}" height="8" rx="4" class="progress-skipped"/>`
        : ''
    }
  </g>

  <!-- Footer -->
  <text x="24" y="${svgHeight - 10}" class="date-text">Last updated: ${formattedDate}</text>
</svg>
  `.trim();

  const summarySvgPath = path.join(processedDir, 'summary.svg');
  await fs.mkdir(path.dirname(summarySvgPath), { recursive: true });
  await fs.writeFile(summarySvgPath, summarySvg);
}
