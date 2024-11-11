import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = 'https://zsikfegsnnaanenorepn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzaWtmZWdzbm5hYW5lbm9yZXBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExMjUxOTksImV4cCI6MjA0NjcwMTE5OX0.6KxpUqpDDgDybWnQ9w_6kp0ai4LLJp9jup1Jb0z1NBI';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});