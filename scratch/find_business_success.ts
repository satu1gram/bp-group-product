import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findBusinessSuccess() {
  console.log('🔍 Mencari testimoni sukses bisnis...');
  
  const keywords = ['lunas hutang', 'umroh', 'mobil', 'motor', 'rumah', 'penghasilan', 'cuan', 'untung', 'reward', 'hasil jualan', 'alhamdulillah tembus', 'bonus', 'profit'];
  
  const orConditions = keywords.map(k => `content.ilike.%${k}%`).join(',');

  const { data, error } = await supabase
    .from('telegram_messages')
    .select('content, nama_pengirim, channel_name, created_at')
    .or(orConditions)
    .limit(20);

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('❌ Tidak ditemukan testimoni bisnis.');
    return;
  }

  console.log(`✅ Ditemukan ${data.length} testimoni potensial:\n`);
  data.forEach((item, index) => {
    console.log(`--- [${index + 1}] ---`);
    console.log(`Pengirim: ${item.nama_pengirim || 'Anonim'}`);
    console.log(`Channel: ${item.channel_name}`);
    console.log(`Content: ${item.content.substring(0, 300)}...`);
    console.log('\n');
  });
}

findBusinessSuccess();
