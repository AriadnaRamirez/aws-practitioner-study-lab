/** Shared contracts for AWS Practitioner Study Lab (scaffold — expand in later tickets). */

export const APP_NAME = "AWS Practitioner Study Lab";
export const API_PREFIX = "api/v1";

export type HealthStatus = "ok" | "degraded";

export interface HealthResponse {
  status: HealthStatus;
  service: "api";
  app: typeof APP_NAME;
  timestamp: string;
}
