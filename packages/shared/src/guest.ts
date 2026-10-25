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
}

export interface AdminUserRow {
  id: string;
  email: string;
  username: string;
  role: 'STUDENT' | 'ADMIN';
  timezone: string;
  podiumHidden: boolean;
  createdAt: string;
}

export interface AdminGuestRow {
  id: string;
  createdAt: string;
  sessionsCount: number;
  convertedUserId: string | null;
  converted: boolean;
}
