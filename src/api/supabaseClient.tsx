import { createClient } from '@supabase/supabase-js';
export const supabase = createClient('https://ejqywtniepmqubefcabw.supabase.co', `${import.meta.env.VITE_ANON_KEY}`)
