export type Role = 'RT' | 'RW';

export interface UserSession {
  id: number;
  username: string;
  role: Role;
  rt_dikelola: string | null;
}

export interface AkunRow {
  id: number;
  username: string;
  password: string;
  role: Role;

  nama: string;
  rt_dikelola: string | null;
}

export type LoginState = { error: string } | null;

// ── Tahap 2 ──────────────────────────
export interface DashboardStats {
  totalWarga: number;
  totalRT: number;
  totalLaki: number;
  totalPerempuan: number;
}