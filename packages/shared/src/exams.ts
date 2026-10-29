/** Multi-exam scheduling contracts (APS-21). */

export type ExamLevel = 'Foundational' | 'Associate' | 'Professional' | 'Specialty';

export interface ExamCatalogEntry {
  code: string;
  name: string;
  level: ExamLevel;
  /** Public path served by the frontend (`frontend/public`). */
  badge: string;
}

export const EXAM_CATALOG = [
  {
    code: 'CLF-C02',
    name: 'AWS Certified Cloud Practitioner',
    level: 'Foundational',
    badge: '/badges/clf-c02.png',
  },
  {
    code: 'AIF-C01',
    name: 'AWS Certified AI Practitioner',
    level: 'Foundational',
    badge: '/badges/aif-c01.png',
  },
] as const satisfies readonly ExamCatalogEntry[];

export type ExamCode = (typeof EXAM_CATALOG)[number]['code'];

export const EXAM_CODES = EXAM_CATALOG.map((e) => e.code) as ExamCode[];

/** Exam mirrored into legacy `User.examDate` / `PublicUser.examDate`. */
export const LEGACY_EXAM_CODE: ExamCode = 'CLF-C02';

export function isExamCode(value: unknown): value is ExamCode {
  return (
    typeof value === 'string' &&
    (EXAM_CODES as readonly string[]).includes(value)
  );
}

export function getExamCatalogEntry(code: ExamCode): ExamCatalogEntry {
  return EXAM_CATALOG.find((e) => e.code === code) as ExamCatalogEntry;
}

export interface UserExam {
  id: string;
  examCode: ExamCode;
  /** Civil date YYYY-MM-DD. */
  examDate: string;
}

export type UserExamsResponse = UserExam[];

export interface CreateUserExamRequest {
  examCode: ExamCode;
  /** YYYY-MM-DD */
  examDate: string;
}

export interface UpdateUserExamRequest {
  /** YYYY-MM-DD */
  examDate: string;
}

export interface DeleteUserExamResponse {
  id: string;
  deleted: true;
}
