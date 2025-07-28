import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database tables structure (for reference):
// users (created by Supabase Auth)
// - id (uuid, primary key)
// - email (text)
// - name (text)
// - created_at (timestamp)

// tasks (for task breakdown feature)
// - id (uuid, primary key)
// - user_id (uuid, foreign key to users.id)
// - title (text)
// - created_at (timestamp)

// task_steps (for individual steps in tasks)
// - id (uuid, primary key)
// - task_id (uuid, foreign key to tasks.id)
// - step_text (text)
// - is_completed (boolean)
// - created_at (timestamp)

// user_progress (for tracking daily progress)
// - id (uuid, primary key)
// - user_id (uuid, foreign key to users.id)
// - date (date)
// - exercises_completed (integer)
// - minutes_spent (integer)
// - success_rate (float)

// tactile_comfort_items (for tactile comfort checklist)
// - id (uuid, primary key)
// - user_id (uuid, foreign key to users.id)
// - item_text (text)
// - is_completed (boolean)
// - created_at (timestamp) 