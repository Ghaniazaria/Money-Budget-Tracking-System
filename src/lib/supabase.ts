import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

/**
 * Validates and normalizes candidate URL string to ensure it is a valid HTTP/HTTPS URL
 */
const parseValidHttpUrl = (urlCandidate?: string): string | null => {
  if (!urlCandidate || typeof urlCandidate !== 'string') return null;
  let trimmed = urlCandidate.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return null;

  // Prepend https:// if user entered domain without protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    trimmed = `https://${trimmed}`;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    // Hostname must be a real domain with at least one dot and a 2+ letter TLD (e.g. xyz.supabase.co), not numbers like '123'
    if (!parsed.hostname || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(parsed.hostname)) {
      return null;
    }
    return parsed.origin;
  } catch {
    return null;
  }
};

const parsedUrl = parseValidHttpUrl(rawUrl);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    parsedUrl &&
    !parsedUrl.includes('placeholder') &&
    rawAnonKey &&
    !rawAnonKey.includes('placeholder') &&
    rawAnonKey.length >= 20
  );
};

// Safe fallback constants guaranteed to be valid HTTP URLs so createClient never throws on startup
const SAFE_DEFAULT_URL = 'https://placeholder-project.supabase.co';
const SAFE_DEFAULT_KEY = 'placeholder-anon-key';

// Initialize Supabase safely with valid URL fallback
export const supabase = createClient(
  isSupabaseConfigured() && parsedUrl ? parsedUrl : SAFE_DEFAULT_URL,
  isSupabaseConfigured() && rawAnonKey ? rawAnonKey : SAFE_DEFAULT_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    }
  }
);

