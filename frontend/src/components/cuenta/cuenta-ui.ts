export const FIELD_LABEL = "flex flex-col gap-1.5 text-sm font-medium";

export function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}
