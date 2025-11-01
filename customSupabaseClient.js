import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qizaczuwsvwaszerimif.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpemFjenV3c3Z3YXN6ZXJpbWlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MDAzMTAsImV4cCI6MjA3MzE3NjMxMH0.4bR_JCVJdw7gXqoY061zibjZUUrfx6cwr8pdP4oWsEU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);