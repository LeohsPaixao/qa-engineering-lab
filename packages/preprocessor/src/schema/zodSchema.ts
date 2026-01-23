import { z } from 'zod';

const byFrameworkSchema = z.object({
  total: z.number(),
  passed: z.number(),
  failed: z.number(),
  skipped: z.number(),
  duration_s: z.number(),
});

export const summarySchema = z.object({
  timestamp: z.string(),
  generatedAt: z.string(),
  overall: z.object({
    total: z.number(),
    passed: z.number(),
    failed: z.number(),
    skipped: z.number(),
    duration_s: z.number(),
  }),
  byFramework: z.record(z.string(), byFrameworkSchema),
  artifacts: z.object({
    processedFiles: z.array(z.string()),
    rawFiles: z.array(z.string()),
  }),
});

const normalizedSummarySchema = z.object({
  total: z.number(),
  passed: z.number(),
  failed: z.number(),
  skipped: z.number(),
  duration_s: z.number(),
});

const normalizedTestsSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['passed', 'failed', 'skipped']),
  duration_s: z.number(),
  file: z.string(),
  tags: z.array(z.string()).default([]),
  error: z.string().optional().nullable(),
});

const normalizedMetadataSchema = z.object({
  name: z.string().optional(),
  hostname: z.string().optional(),
  timestamp: z.string().optional(),
  generated: z.string().optional(),
  tool: z.string().optional(),
  startTime: z.number().optional(),
  robot: z.string().optional(),
  playwright: z.string().optional(),
  workers: z.number().optional(),
  version: z.string().optional(),
  mochawesomeVersion: z.string().optional(),
  mochawesomeOptions: z.unknown().optional(),
  margeOptions: z.unknown().optional(),
});

export const normalizedFrameworkDataSchema = z.object({
  framework: z.string(),
  timestamp: z.string(),
  type: z.enum(['unit', 'e2e', 'ct', 'api']),
  summary: normalizedSummarySchema,
  tests: z.array(normalizedTestsSchema),
  metadata: normalizedMetadataSchema.default({}),
});
