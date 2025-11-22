import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@prisma/client';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-min-32-characters-long'
);

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  return token;
}

export async function verifySession(token: string): Promise<SessionUser | null> {
  try {
    const verified = await jwtVerify(token, secret);
    return verified.payload.user as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) return null;

  return verifySession(token);
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.id },
  });

  return user;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<User> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden - insufficient permissions');
  }

  return user;
}

export async function login(email: string, password: string): Promise<SessionUser | null> {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || user.status !== 'ACTIVE') {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return null;
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export function hasPermission(user: User, permission: string): boolean {
  // Superadmin has all permissions
  if (user.role === 'SUPERADMIN') return true;

  // Define role-based permissions
  const rolePermissions: Record<UserRole, string[]> = {
    SUPERADMIN: ['*'],
    ADMIN: [
      'leads.*',
      'quotations.*',
      'projects.*',
      'invoices.*',
      'inventory.*',
      'employees.*',
      'vendors.*',
      'reports.*',
      'settings.*',
    ],
    PROJECT_MANAGER: [
      'leads.read',
      'quotations.read',
      'quotations.create',
      'projects.*',
      'invoices.read',
      'inventory.read',
      'employees.read',
    ],
    SALES: [
      'leads.*',
      'quotations.*',
      'projects.read',
      'invoices.read',
      'inventory.read',
    ],
    TECHNICIAN: [
      'projects.read',
      'projects.update',
      'inventory.read',
      'service_tickets.*',
    ],
    CLIENT: [
      'projects.read',
      'invoices.read',
      'portal.*',
    ],
  };

  const permissions = rolePermissions[user.role] || [];

  // Check wildcard permission
  if (permissions.includes('*')) return true;

  // Check exact permission
  if (permissions.includes(permission)) return true;

  // Check wildcard module permission (e.g., 'leads.*')
  const [module] = permission.split('.');
  if (permissions.includes(`${module}.*`)) return true;

  return false;
}
