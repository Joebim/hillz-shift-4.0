import { Registration } from "./Registration";
import { Invitation } from "./Invitation";

export interface Admin {
  id: string;
  email: string;
  role: "superadmin" | "admin";
}

export interface DashboardStats {
  totalRegistrations: number;
  totalInvitations: number;
  topInviters: { name: string; count: number }[];
  registrations: Registration[];
  invitations: Invitation[];
}
