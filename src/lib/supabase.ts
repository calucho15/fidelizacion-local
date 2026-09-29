import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kddgcferikeaptlcowvz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_SbNKMJaOzx3Sy1u0TNwFMw_vgkOQXaM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
