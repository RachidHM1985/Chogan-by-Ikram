import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzwzqcwzbprelibrlinq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6d3pxY3d6YnByZWxpYnJsaW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUzMDMwOTYsImV4cCI6MjA1MDg3OTA5Nn0.smyNc9XjdbhZUAZhQTnUME1-Qgc-yM9K8y3GuDKlIc8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('supabaseUrl and supabaseAnonKey are required');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;