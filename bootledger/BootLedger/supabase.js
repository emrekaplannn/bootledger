// supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bootledger.ceng.metu.edu.tr';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ewogICJyb2xlIjogImFub24iLAogICJpc3MiOiAic3VwYWJhc2UiLAogICJpYXQiOiAxNzAwMTY4NDAwLAogICJleHAiOiAxODU4MDIxMjAwCn0.1aWaKiZYm3_Bm5Z0xSHtkPt1cHyu7W37UZOdBIuKyZg' ;
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;


