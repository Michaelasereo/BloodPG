/**
 * Authentication Service
 * Handles Google OAuth sign-in with Supabase
 */

import { getSupabaseClient } from './supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
}

/**
 * Sign in with Google OAuth
 * @param redirectTo - Optional redirect path after authentication (default: '/')
 */
export async function signInWithGoogle(redirectTo: string = '/'): Promise<void> {
  const supabase = getSupabaseClient();
  
  // Get the correct origin - use environment variable if available, otherwise use window.location
  const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL 
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin 
    : window.location.origin;
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteOrigin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = getSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return transformUser(user);
}

/**
 * Get the current session
 */
export async function getSession() {
  const supabase = getSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('Error getting session:', error);
    return null;
  }

  return session;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChange(callback: (user: AuthUser | null) => void) {
  const supabase = getSupabaseClient();
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        callback(transformUser(session.user));
      } else {
        callback(null);
      }
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Transform Supabase user to our AuthUser format
 */
function transformUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name || user.user_metadata?.name,
    avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
  };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

