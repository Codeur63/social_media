import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = 'https://ufagfhgupbikbyjuyzit.supabase.co'
export const supabasePublishableKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmYWdmaGd1cGJpa2J5anV5eml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxODMyOTUsImV4cCI6MjA3Mzc1OTI5NX0.Vr7OBnRE11hbNr7F1ohvievOUMXdoIRjF6iBQ818iUE'

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})