/** Feature flag contracts — maestro §3 / APS-16. */

export const FEATURE_FLAG_EXAM_TRACK_AI = 'exam_track_ai' as const;
/** Estudio (EXAM_STUDY) y Examen (EXAM_TIMED). Off = solo Cartas. */
export const FEATURE_FLAG_EXAM_MODES = 'exam_modes' as const;

/** Known flag keys (seed + UI). More flags may exist in DB later. */
export const KNOWN_FEATURE_FLAGS = [
  FEATURE_FLAG_EXAM_TRACK_AI,
  FEATURE_FLAG_EXAM_MODES,
] as const satisfies readonly string[];

export type KnownFeatureFlagKey = (typeof KNOWN_FEATURE_FLAGS)[number];

export interface FeatureFlagDto {
  key: string;
  enabled: boolean;
  updatedBy?: string | null;
  updatedAt: string;
  createdAt: string;
}
