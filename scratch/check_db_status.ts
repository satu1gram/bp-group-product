import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
  const { data, error } = await supabase
    .from('telegram_messages')
    .select('id, content, status, is_testimoni, category')
    .eq('category', 'Business')
    .limit(10);

  if (error) {
    console.error(error);
    return;
  }

  console.log('--- Data Bisnis (Top 10) ---');
  data.forEach(item => {
    console.log(`ID: ${item.id} | Status: ${item.status} | IsTesti: ${item.is_testimoni} | Content: ${item.content.substring(0, 50)}...`);
  });
}

checkStatus();
