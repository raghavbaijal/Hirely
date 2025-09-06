import config from './config.js';
import { createClient } from 'https://esm.sh/@supabase/supabase-js';

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;

// Add error handling for the client initialization
let supabase;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  
  // Check if connection is successful
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
      console.warn('Database connection lost. Attempting to reconnect...');
      // Attempt to reconnect
      supabase = createClient(supabaseUrl, supabaseKey);
    }
  });
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Fallback to null client that will handle operations gracefully
  supabase = {
    from: () => ({
      insert: async () => ({ error: new Error('Database connection failed') }),
      select: async () => ({ error: new Error('Database connection failed') })
    })
  };
}

export default supabase;
