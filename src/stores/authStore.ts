import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as localAuth from '../lib/localAuth';
import { type AuthUser, type Profile } from '../lib/localDb';

interface AuthState {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface AuthActions {
  signUp: (email: string, password: string, userData: {
    name: string;
    phone?: string;
    role: 'client' | 'vendor';
    profileImage?: string | null;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchProfile: (userId: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearError: () => void;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      loading: false,
      error: null,
      initialized: false,

      // Actions
      signUp: async (email: string, password: string, userData) => {
        set({ loading: true, error: null });

        try {
          const profile = await localAuth.signUp(email, password, userData);
          set({ profile, user: { id: profile.id, email: profile.email, profile } });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message || 'Registration failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });

        try {
          const profile = await localAuth.signIn(email, password);
          set({ profile, user: { id: profile.id, email: profile.email, profile } });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message || 'Sign in failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });

        try {
          await localAuth.signOut();
          set({ user: null, profile: null });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message || 'Sign out failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async (userId: string) => {
        if (!userId) {
          set({ error: 'No user ID provided' });
          return;
        }

        try {
          const profile = localAuth.getProfile(userId);
          if (!profile) {
            throw new Error('Profile not found');
          }
          set({
            profile,
            user: { id: userId, email: profile.email, profile }
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
          set({ error: 'Failed to fetch user profile' });
        }
      },

      updateProfile: async (updates: Partial<Profile>) => {
        const { user } = get();
        if (!user) throw new Error('No user logged in');

        set({ loading: true, error: null });

        try {
          const updatedProfile = localAuth.updateProfile(user.id, updates);
          set({
            profile: updatedProfile,
            user: { ...user, profile: updatedProfile }
          });
        } catch (error) {
          const err = error as Error;
          set({ error: err.message || 'Profile update failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      clearError: () => set({ error: null }),

      initialize: async () => {
        if (get().initialized) return;

        set({ loading: true });

        try {
          const session = localAuth.getSession();

          if (session?.userId) {
            await get().fetchProfile(session.userId);
          }

          set({ initialized: true });
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ error: 'Failed to initialize authentication', initialized: true });
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
);
