import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CONTENT_STATUSES,
  FLASH_VARIANTS,
  TOPIC_TYPES,
  type ContentExportBundle,
  type ContentStatus,
  type ExamChoices,
  type FlashVariant,
  type ImportFormat,
  type ImportJob,
  type ImportJobSummary,
  type ImportKnowledgeInput,
  type ImportQuestionInput,
  type ImportRowResult,
  type ImportTopicInput,
  type TopicType,
} from '@aps/shared';
import { ContentService } from './content.service';

type ParsedBundle = {
  topics: ImportTopicInput[];
  knowledgeItems: ImportKnowledgeInput[];
  examQuestions: ImportQuestionInput[];
};

const MAX_JOBS = 50;

function emptySummary(): ImportJobSummary {
  return { created: 0, updated: 0, skipped: 0, errors: 0 };
}

function tally(summary: ImportJobSummary, action: ImportRowResult['action']) {
  if (action === 'create') summary.created += 1;
  else if (action === 'update') summary.updated += 1;
  else if (action === 'skip') summary.skipped += 1;
  else summary.errors += 1;
}

function splitPipe(value: string | undefined): string[] {
  if (!value || !value.trim()) return [];
  return value
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseCsvLine(line: string): string[] {
  const cells: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      cells.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells.map((c) => c.trim());
}

function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? '' : String(value);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

@Injectable()
export class ImportExportService {
  private readonly jobs: ImportJob[] = [];

  constructor(private readonly content: ContentService) {}

  listJobs(): ImportJob[] {
    return [...this.jobs];
  }

  getJob(id: string): ImportJob {
    const job = this.jobs.find((j) => j.id === id);
    if (!job) throw new NotFoundException(`Import job ${id} not found`);
    return job;
  }

  async exportBundle(opts?: {
    entities?: string[];
  }): Promise<ContentExportBundle> {
    const wanted = new Set(
      (
        opts?.entities?.length
          ? opts.entities
          : ['topics', 'knowledge', 'questions']
      ).map((e) => e.trim().toLowerCase()),
    );
    return {
      exportedAt: new Date().toISOString(),
      topics: wanted.has('topics') ? await this.content.listTopics() : [],
      knowledgeItems: wanted.has('knowledge')
        ? await this.content.listKnowledge()
        : [],
      examQuestions: wanted.has('questions')
        ? await this.content.listQuestions()
        : [],
    };
  }

  async exportCsv(opts?: { entities?: string[] }): Promise<string> {
    const bundle = await this.exportBundle(opts);
    const header = [
      'kind',
      'id',
      'externalKey',
      'trackId',
      'topicId',
      'type',
      'name',
      'parentId',
      'sortOrder',
      'definition',
      'distractors',
      'explanation',
      'allowedVariants',
      'status',
      'stem',
      'choices',
      'correctIndex',
    ];
    const rows: string[][] = [header];

    for (const t of bundle.topics) {
      rows.push([
        'topic',
        t.id,
        '',
        t.trackId,
        '',
        t.type,
        t.name,
        t.parentId ?? '',
        String(t.sortOrder),
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
      ]);
    }
    for (const k of bundle.knowledgeItems) {
      rows.push([
        'knowledge',
        k.id,
        k.externalKey ?? '',
        k.trackId,
        k.topicId,
        '',
        k.name,
        '',
        '',
        k.definition,
        k.distractors.join('|'),
        k.explanation,
        k.allowedVariants.join('|'),
        k.status,
        '',
        '',
        '',
      ]);
    }
    for (const q of bundle.examQuestions) {
      rows.push([
        'question',
        q.id,
        q.externalKey ?? '',
        q.trackId,
        q.topicId,
        '',
        '',
        '',
        '',
        '',
        '',
        q.explanation,
        '',
        q.status,
        q.stem,
        q.choices.join('|'),
        String(q.correctIndex),
      ]);
    }

    return rows.map((r) => r.map(csvEscape).join(',')).join('\n') + '\n';
  }

  async runImport(input: {
    format: ImportFormat;
    content: string;
    dryRun?: boolean;
    filename?: string;
  }): Promise<ImportJob> {
    const dryRun = input.dryRun !== false;
    const createdAt = new Date().toISOString();
    const id = `import-${crypto.randomUUID()}`;
    const results: ImportRowResult[] = [];
    const summary = emptySummary();

    try {
      const bundle = this.parseContent(input.format, input.content);
      await this.applyBundle(bundle, dryRun, results, summary);

      const job: ImportJob = {
        id,
        filename: input.filename ?? null,
        format: input.format,
        dryRun,
        status: dryRun ? 'dry_run' : 'completed',
        summary,
        results,
        createdAt,
      };
      this.pushJob(job);
      return job;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown import failure';
      const job: ImportJob = {
        id,
        filename: input.filename ?? null,
        format: input.format,
        dryRun,
        status: 'failed',
        summary: { ...summary, errors: summary.errors + 1 },
        results: [...results, { kind: 'topic', action: 'error', message }],
        createdAt,
      };
      this.pushJob(job);
      return job;
    }
  }

  private pushJob(job: ImportJob) {
    this.jobs.unshift(job);
    if (this.jobs.length > MAX_JOBS) {
      this.jobs.length = MAX_JOBS;
    }
  }

  private parseContent(format: ImportFormat, raw: string): ParsedBundle {
    const trimmed = raw?.trim();
    if (!trimmed) throw new BadRequestException('content is empty');
    if (format === 'json') return this.parseJson(trimmed);
    if (format === 'csv') return this.parseCsv(trimmed);
    throw new BadRequestException(`Unsupported format: ${format}`);
  }

  private parseJson(raw: string): ParsedBundle {
    let data: unknown;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new BadRequestException('Invalid JSON');
    }

    if (Array.isArray(data)) {
      const topics: ImportTopicInput[] = [];
      const knowledgeItems: ImportKnowledgeInput[] = [];
      const examQuestions: ImportQuestionInput[] = [];
      for (const row of data) {
        if (!row || typeof row !== 'object') continue;
        const kind = (row as { kind?: string }).kind;
        if (kind === 'topic') topics.push(row as ImportTopicInput);
        else if (kind === 'knowledge')
          knowledgeItems.push(row as ImportKnowledgeInput);
        else if (kind === 'question')
          examQuestions.push(row as ImportQuestionInput);
        else {
          throw new BadRequestException(
            'Array rows require kind: topic | knowledge | question',
          );
        }
      }
      return { topics, knowledgeItems, examQuestions };
    }

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      return {
        topics: Array.isArray(obj.topics)
          ? (obj.topics as ImportTopicInput[])
          : [],
        knowledgeItems: Array.isArray(obj.knowledgeItems)
          ? (obj.knowledgeItems as ImportKnowledgeInput[])
          : Array.isArray(obj.knowledge)
            ? (obj.knowledge as ImportKnowledgeInput[])
            : [],
        examQuestions: Array.isArray(obj.examQuestions)
          ? (obj.examQuestions as ImportQuestionInput[])
          : Array.isArray(obj.questions)
            ? (obj.questions as ImportQuestionInput[])
            : [],
      };
    }

    throw new BadRequestException(
      'JSON must be a bundle object or an array of keyed rows',
    );
  }

  private parseCsv(raw: string): ParsedBundle {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('#'));
    if (lines.length < 2) {
      throw new BadRequestException('CSV needs a header and at least one row');
    }

    const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
    const idx = (name: string) => headers.indexOf(name);
    const kindIdx = idx('kind');
    if (kindIdx < 0) {
      throw new BadRequestException('CSV requires a kind column');
    }

    const cell = (cols: string[], name: string) => {
      const i = idx(name);
      return i >= 0 ? (cols[i] ?? '') : '';
    };

    const topics: ImportTopicInput[] = [];
    const knowledgeItems: ImportKnowledgeInput[] = [];
    const examQuestions: ImportQuestionInput[] = [];

    for (let n = 1; n < lines.length; n++) {
      const cols = parseCsvLine(lines[n]);
      const kind = (cols[kindIdx] ?? '').toLowerCase();
      const id = cell(cols, 'id') || undefined;
      const externalKey = cell(cols, 'externalkey') || null;
      const trackId = cell(cols, 'trackid');
      const topicId = cell(cols, 'topicid');

      if (kind === 'topic') {
        topics.push({
          kind: 'topic',
          id,
          trackId,
          type: cell(cols, 'type') as TopicType,
          name: cell(cols, 'name'),
          parentId: cell(cols, 'parentid') || null,
          sortOrder: cell(cols, 'sortorder')
            ? Number(cell(cols, 'sortorder'))
            : 0,
          externalKey,
        });
      } else if (kind === 'knowledge') {
        knowledgeItems.push({
          kind: 'knowledge',
          id,
          topicId,
          trackId,
          name: cell(cols, 'name'),
          definition: cell(cols, 'definition'),
          distractors: splitPipe(cell(cols, 'distractors')),
          explanation: cell(cols, 'explanation'),
          allowedVariants: splitPipe(
            cell(cols, 'allowedvariants'),
          ) as FlashVariant[],
          status: cell(cols, 'status') as ContentStatus,
          externalKey,
        });
      } else if (kind === 'question') {
        const choices = splitPipe(cell(cols, 'choices'));
        examQuestions.push({
          kind: 'question',
          id,
          topicId,
          trackId,
          stem: cell(cols, 'stem'),
          choices: choices as ExamChoices,
          correctIndex: Number(cell(cols, 'correctindex')) as 0 | 1 | 2 | 3,
          explanation: cell(cols, 'explanation'),
          status: cell(cols, 'status') as ContentStatus,
          externalKey,
        });
      } else {
        throw new BadRequestException(
          `Unknown CSV kind "${kind}" on line ${n + 1}`,
        );
      }
    }

    return { topics, knowledgeItems, examQuestions };
  }

  private async applyBundle(
    bundle: ParsedBundle,
    dryRun: boolean,
    results: ImportRowResult[],
    summary: ImportJobSummary,
  ) {
    for (const row of bundle.topics) {
      const result = await this.upsertTopic(row, dryRun);
      results.push(result);
      tally(summary, result.action);
    }
    for (const row of bundle.knowledgeItems) {
      const result = await this.upsertKnowledge(row, dryRun);
      results.push(result);
      tally(summary, result.action);
    }
    for (const row of bundle.examQuestions) {
      const result = await this.upsertQuestion(row, dryRun);
      results.push(result);
      tally(summary, result.action);
    }
  }

  private async upsertTopic(
    row: ImportTopicInput,
    dryRun: boolean,
  ): Promise<ImportRowResult> {
    const externalKey = row.externalKey?.trim() || null;
    try {
      this.assertTopicInput(row);
      const existing = row.id ? await this.safeGetTopic(row.id) : undefined;

      if (existing) {
        if (!dryRun) {
          await this.content.updateTopic(existing.id, {
            trackId: row.trackId,
            type: row.type,
            name: row.name,
            parentId: row.parentId ?? null,
            sortOrder: row.sortOrder ?? existing.sortOrder,
          });
        }
        return {
          kind: 'topic',
          id: existing.id,
          externalKey,
          action: 'update',
          message: dryRun ? 'would update' : 'updated',
        };
      }

      if (!dryRun) {
        const created = await this.content.createTopic({
          trackId: row.trackId,
          type: row.type,
          name: row.name,
          parentId: row.parentId ?? null,
          sortOrder: row.sortOrder ?? 0,
        });
        return {
          kind: 'topic',
          id: created.id,
          externalKey,
          action: 'create',
          message: 'created',
        };
      }
      return {
        kind: 'topic',
        id: row.id ?? null,
        externalKey,
        action: 'create',
        message: 'would create',
      };
    } catch (err) {
      return {
        kind: 'topic',
        id: row.id ?? null,
        externalKey,
        action: 'error',
        message: err instanceof Error ? err.message : 'topic error',
      };
    }
  }

  private async upsertKnowledge(
    row: ImportKnowledgeInput,
    dryRun: boolean,
  ): Promise<ImportRowResult> {
    const externalKey = row.externalKey?.trim() || null;
    try {
      this.assertKnowledgeInput(row);
      const byKey = externalKey
        ? await this.content.findKnowledgeByExternalKey(externalKey)
        : null;
      const existing =
        byKey ?? (row.id ? await this.safeGetKnowledge(row.id) : undefined);

      if (existing) {
        if (!dryRun) {
          await this.content.updateKnowledge(existing.id, {
            topicId: row.topicId,
            trackId: row.trackId,
            name: row.name,
            definition: row.definition,
            distractors: row.distractors,
            explanation: row.explanation,
            allowedVariants: row.allowedVariants,
            status: row.status,
            externalKey: externalKey ?? existing.externalKey,
          });
        }
        return {
          kind: 'knowledge',
          id: existing.id,
          externalKey,
          action: 'update',
          message: dryRun ? 'would update' : 'updated',
        };
      }

      if (!externalKey) {
        return {
          kind: 'knowledge',
          id: row.id ?? null,
          externalKey,
          action: 'skip',
          message: 'missing externalKey (required for idempotent create)',
        };
      }

      if (!dryRun) {
        const created = await this.content.createKnowledge({
          topicId: row.topicId,
          trackId: row.trackId,
          name: row.name,
          definition: row.definition,
          distractors: row.distractors,
          explanation: row.explanation,
          allowedVariants: row.allowedVariants,
          status: row.status,
          externalKey,
        });
        return {
          kind: 'knowledge',
          id: created.id,
          externalKey,
          action: 'create',
          message: 'created',
        };
      }
      return {
        kind: 'knowledge',
        id: row.id ?? null,
        externalKey,
        action: 'create',
        message: 'would create',
      };
    } catch (err) {
      return {
        kind: 'knowledge',
        id: row.id ?? null,
        externalKey,
        action: 'error',
        message: err instanceof Error ? err.message : 'knowledge error',
      };
    }
  }

  private async upsertQuestion(
    row: ImportQuestionInput,
    dryRun: boolean,
  ): Promise<ImportRowResult> {
    const externalKey = row.externalKey?.trim() || null;
    try {
      this.assertQuestionInput(row);
      const byKey = externalKey
        ? await this.content.findQuestionByExternalKey(externalKey)
        : null;
      const existing =
        byKey ?? (row.id ? await this.safeGetQuestion(row.id) : undefined);

      if (existing) {
        if (!dryRun) {
          await this.content.updateQuestion(existing.id, {
            topicId: row.topicId,
            trackId: row.trackId,
            stem: row.stem,
            choices: row.choices,
            correctIndex: row.correctIndex,
            explanation: row.explanation,
            status: row.status,
            externalKey: externalKey ?? existing.externalKey,
          });
        }
        return {
          kind: 'question',
          id: existing.id,
          externalKey,
          action: 'update',
          message: dryRun ? 'would update' : 'updated',
        };
      }

      if (!externalKey) {
        return {
          kind: 'question',
          id: row.id ?? null,
          externalKey,
          action: 'skip',
          message: 'missing externalKey (required for idempotent create)',
        };
      }

      if (!dryRun) {
        const created = await this.content.createQuestion({
          topicId: row.topicId,
          trackId: row.trackId,
          stem: row.stem,
          choices: row.choices,
          correctIndex: row.correctIndex,
          explanation: row.explanation,
          status: row.status,
          externalKey,
        });
        return {
          kind: 'question',
          id: created.id,
          externalKey,
          action: 'create',
          message: 'created',
        };
      }
      return {
        kind: 'question',
        id: row.id ?? null,
        externalKey,
        action: 'create',
        message: 'would create',
      };
    } catch (err) {
      return {
        kind: 'question',
        id: row.id ?? null,
        externalKey,
        action: 'error',
        message: err instanceof Error ? err.message : 'question error',
      };
    }
  }

  private async safeGetTopic(id: string) {
    try {
      return await this.content.getTopic(id);
    } catch {
      return undefined;
    }
  }

  private async safeGetKnowledge(id: string) {
    try {
      return await this.content.getKnowledge(id);
    } catch {
      return undefined;
    }
  }

  private async safeGetQuestion(id: string) {
    try {
      return await this.content.getQuestion(id);
    } catch {
      return undefined;
    }
  }

  private assertTopicInput(row: ImportTopicInput) {
    if (!row.trackId?.trim()) throw new Error('topic.trackId required');
    if (!row.name?.trim()) throw new Error('topic.name required');
    if (!TOPIC_TYPES.includes(row.type)) {
      throw new Error(`topic.type must be one of ${TOPIC_TYPES.join(', ')}`);
    }
  }

  private assertKnowledgeInput(row: ImportKnowledgeInput) {
    if (!row.topicId?.trim()) throw new Error('knowledge.topicId required');
    if (!row.trackId?.trim()) throw new Error('knowledge.trackId required');
    if (!row.name?.trim()) throw new Error('knowledge.name required');
    if (!row.definition?.trim())
      throw new Error('knowledge.definition required');
    if (!row.explanation?.trim())
      throw new Error('knowledge.explanation required');
    if (!Array.isArray(row.distractors) || row.distractors.length < 3) {
      throw new Error('knowledge.distractors needs ≥3 entries');
    }
    if (
      !Array.isArray(row.allowedVariants) ||
      row.allowedVariants.length < 1 ||
      row.allowedVariants.some(
        (v: FlashVariant) => !FLASH_VARIANTS.includes(v),
      )
    ) {
      throw new Error('knowledge.allowedVariants invalid');
    }
    if (!CONTENT_STATUSES.includes(row.status)) {
      throw new Error('knowledge.status invalid');
    }
  }

  private assertQuestionInput(row: ImportQuestionInput) {
    if (!row.topicId?.trim()) throw new Error('question.topicId required');
    if (!row.trackId?.trim()) throw new Error('question.trackId required');
    if (!row.stem?.trim()) throw new Error('question.stem required');
    if (!row.explanation?.trim())
      throw new Error('question.explanation required');
    if (!Array.isArray(row.choices) || row.choices.length !== 4) {
      throw new Error('question.choices must have exactly 4 entries');
    }
    if (
      row.correctIndex === undefined ||
      row.correctIndex < 0 ||
      row.correctIndex > 3
    ) {
      throw new Error('question.correctIndex must be 0..3');
    }
    if (!CONTENT_STATUSES.includes(row.status)) {
      throw new Error('question.status invalid');
    }
  }
}
