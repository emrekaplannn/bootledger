// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qdlxhuphixhmhgttpyne.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbHhodXBoaXhobWhndHRweW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTE4MDM1NDAsImV4cCI6MjAyNzM3OTU0MH0.6aKTA6UYArimDaHm-_GPgNbFISoF_rvKIXstkicQGPg';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


