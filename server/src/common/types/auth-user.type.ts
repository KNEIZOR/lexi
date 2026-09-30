import { UserRole } from '../../generated/prisma/client.js';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  learningLevel: string;
};