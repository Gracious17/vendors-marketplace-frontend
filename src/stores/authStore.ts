import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, type AuthUser, type Profile } from '../lib/supabase';
import type { User, AuthError } from '@supabase/supabase-js';

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
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: userData.name,
                phone: userData.phone || '',
                role: userData.role,
                profile_image: userData.profileImage || '',
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            // Profile will be created automatically by the trigger
            // Wait a moment for the trigger to complete
            await new Promise(resolve => setTimeout(resolve, 1500));
            await get().fetchProfile(data.user.id);
            
            // If vendor with profile image, update the profile
            if (userData.role === 'vendor' && userData.profileImage) {
              await supabase
                .from('profiles')
                .update({ profile_image: userData.profileImage })
                .eq('id', data.user.id);
            }
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message || 'Registration failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            await get().fetchProfile(data.user.id);
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message || 'Sign in failed' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          set({ user: null, profile: null });
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message || 'Sign out failed' });
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
          const { data, error } = await supabase
            .from('profiles')
            .select('*, is_admin')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
            throw error;
          }

          if (data) {
            const profile = data as Profile;
            set({ 
              profile,
              user: { id: userId, email: profile.email, profile }
            });
          }
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
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

          if (error) throw error;

          if (data) {
            const updatedProfile = data as Profile;
            set({ 
              profile: updatedProfile,
              user: { ...user, profile: updatedProfile }
            });
          }
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message || 'Profile update failed' });
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
          const { data: { session }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
          }
          
          if (session?.user) {
            await get().fetchProfile(session.user.id);
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
              await get().fetchProfile(session.user.id);
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, profile: null });
            }
          });

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