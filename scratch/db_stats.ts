import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function stats() {
  const { count, error } = await supabase
    .from('telegram_messages')
    .select('*', { count: 'exact', head: true });
  
  console.log('Total messages:', count);

  const { data: categories } = await supabase
    .from('telegram_messages')
    .select('category, is_testimoni')
    .limit(1000);

  const businessTestis = categories?.filter(c => c.category === 'Business' && c.is_testimoni);
  console.log('Business Testimonials count:', businessTestis?.length);
}

stats();
