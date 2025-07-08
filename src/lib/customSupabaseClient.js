import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://umnwjzynsmporwuwijvh.supabase.co';
const supabaseAnonKey = 'ADD YOUR OWN KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);