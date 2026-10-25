/** Guest marketing + owner usage analytics (APS-13). */

export const GUEST_PROBE_STORAGE_KEY = 'aps_guest_probe_id';

/** Max recorded guest sessions per probe (limited marketing trial). */
export const GUEST_MAX_SESSIONS = 3;

/** Sample questions shown in the /guest limited session. */
export const GUEST_SAMPLE_SIZE = 3;

export interface GuestProbe {
  id: string;
  createdAt: string;
  sessionsCount: number;
  convertedUserId: string | null;
  /** Sessions still available before the soft cap. */
  sessionsRemaining: number;
}

export interface UsageSummary {
  usersTotal: number;
  usersStudents: number;
  usersAdmins: number;
  guestsTotal: number;
  guestsConverted: number;
  /** guest→registro, 0–1 */
  conversionRate: number;
  /** Sum of GuestProbe.sessionsCount */
  guestSessionsTotal: number;
  /** Distinct users with ≥1 StudySession in last 24h */
  dau: number;
  /** Distinct users with ≥1 StudySession in last 7×24h */
  wau: number;
  /** StudySession rows started in last 7×24h */
  sessionsLast7d: number;
  /** Among sessionsLast7d, how many have endedAt */
  sessionsCompletedLast7d: number;
  /** 0–1 finish rate over last 7d */
  finishRateLast7d: number;
}

export interface AdminUserRow {
  id: string;
  email: string;
  username: string;
  role: 'STUDENT' | 'ADMIN';
  timezone: string;
  podiumHidden: boolean;
  bannedAt: string | null;
  createdAt: string;
}

export interface AdminUpdateUserRequest {
  podiumHidden?: boolean;
  /** true = soft-ban now; false = clear ban */
  banned?: boolean;
}

export interface AdminResetPasswordResponse {
  userId: string;
  username: string;
  temporaryPassword: string;
}

export interface AdminGuestRow {
  id: string;
  createdAt: string;
  sessionsCount: number;
  convertedUserId: string | null;
  converted: boolean;
}
