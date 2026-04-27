import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeTags() {
  const { data, error } = await supabase
    .from('telegram_messages')
    .select('tags')
    .eq('is_testimoni', true)
    .eq('status', 'approved');

  if (error) {
    console.error(error);
    return;
  }

  const tagCounts: Record<string, number> = {};
  data.forEach(item => {
    if (item.tags && Array.isArray(item.tags)) {
      item.tags.forEach((tag: string) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  console.log('--- Distribusi Tag Testimoni Riil ---');
  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);
  sortedTags.forEach(([tag, count]) => {
    console.log(`${tag}: ${count} testimoni`);
  });
}

analyzeTags();
