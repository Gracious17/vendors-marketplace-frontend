// Local, browser-only auth simulation to replace Supabase Auth.
// Passwords are stored in plain text in localStorage -- this is a throwaway
// dev-only mock with no real backend behind it, and is meant to be replaced
// wholesale once a custom backend exists.

import { profilesTable, Profile, ADMIN_SEED_ID, DEMO_VENDOR_SEED_ID, DEMO_CLIENT_SEED_ID } from './localDb';

interface AuthUserRecord {
  id: string;
  email: string;
  password: string;
}

const AUTH_USERS_KEY = 'local_db_auth_users';
const SESSION_KEY = 'local_auth_session';

function readAuthUsers(): AuthUserRecord[] {
  const raw = localStorage.getItem(AUTH_USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AuthUserRecord[];
  } catch {
    return [];
  }
}

function writeAuthUsers(users: AuthUserRecord[]): void {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function seedAuthUsers(): void {
  if (readAuthUsers().length > 0) return;

  writeAuthUsers([
    { id: ADMIN_SEED_ID, email: 'admin@example.com', password: 'admin123' },
    { id: DEMO_VENDOR_SEED_ID, email: 'vendor@example.com', password: 'vendor123' },
    { id: DEMO_CLIENT_SEED_ID, email: 'client@example.com', password: 'client123' },
  ]);
}

seedAuthUsers();

export interface SignUpData {
  name: string;
  phone?: string;
  role: 'client' | 'vendor';
  profileImage?: string | null;
}

export function getSession(): { userId: string } | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as { userId: string };
  } catch {
    return null;
  }
}

function setSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId }));
}

function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function signUp(email: string, password: string, userData: SignUpData): Promise<Profile> {
  const normalizedEmail = email.trim().toLowerCase();
  const authUsers = readAuthUsers();

  if (authUsers.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email already exists');
  }

  const now = new Date().toISOString();
  const profile = profilesTable.insert({
    name: userData.name,
    email: normalizedEmail,
    phone: userData.phone || '',
    role: userData.role,
    profile_image: userData.profileImage || undefined,
    currency: 'USD',
    is_admin: false,
    created_at: now,
    updated_at: now,
  });

  authUsers.push({ id: profile.id, email: normalizedEmail, password });
  writeAuthUsers(authUsers);

  setSession(profile.id);
  return profile;
}

export async function signIn(email: string, password: string): Promise<Profile> {
  const normalizedEmail = email.trim().toLowerCase();
  const authUser = readAuthUsers().find(u => u.email.toLowerCase() === normalizedEmail);

  if (!authUser || authUser.password !== password) {
    throw new Error('Invalid email or password');
  }

  const profile = profilesTable.findOne(p => p.id === authUser.id);
  if (!profile) {
    throw new Error('Account profile not found');
  }

  setSession(profile.id);
  return profile;
}

export async function signOut(): Promise<void> {
  clearSession();
}

export function getProfile(userId: string): Profile | undefined {
  return profilesTable.findOne(p => p.id === userId);
}

export function updateProfile(userId: string, updates: Partial<Profile>): Profile {
  const updated = profilesTable.update(userId, updates);
  if (!updated) {
    throw new Error('No user logged in');
  }
  return updated;
}
