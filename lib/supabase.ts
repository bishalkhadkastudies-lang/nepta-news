import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcpkknncvrudppocgage.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcGtrbm5jdnJ1ZHBwb2NnYWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTg0MDQsImV4cCI6MjA3NzA3NDQwNH0.egGEsMZ15MRIZL6GhN7Wa-tWpX6RMicabvQrxHUXQC0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey, // Fallback to anon key if service role key is not set
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
