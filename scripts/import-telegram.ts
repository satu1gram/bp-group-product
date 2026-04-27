import dotenv from 'dotenv';
import fs from 'fs';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ''
);

async function importData() {
  const manualChannelName = process.argv[2]; // Ambil nama dari command line
  console.log('🚀 Memulai proses impor data Telegram...');

  if (!fs.existsSync('telegram_export.json')) {
    console.error('❌ Error: File telegram_export.json tidak ditemukan!');
    console.info('💡 Tips: Export chat dari Telegram Desktop (JSON format) dan simpan sebagai telegram_export.json');
    return;
  }

  const rawData = fs.readFileSync('telegram_export.json', 'utf8');
  const chatData = JSON.parse(rawData);
  const messages = chatData.messages || [];

  const channelName = manualChannelName || chatData.name || 'Telegram Channel';
  console.log(`📦 Mengimpor data untuk channel: "${channelName}"`);
  const toInsert = [];

  for (const msg of messages) {
    if (msg.type !== 'message' || !msg.text) continue;

    const content = Array.isArray(msg.text) 
      ? msg.text.map((t: any) => typeof t === 'string' ? t : t.text).join('')
      : msg.text;

    if (content.length < 20) continue; // Skip pesan terlalu pendek

    // Deteksi hashtag sebagai tags
    const tags = content.match(/#\w+/g) || [];
    
    // Logika penentuan kategori sederhana
    let category = 'Health';
    if (content.toLowerCase().includes('bisnis') || content.toLowerCase().includes('modal') || content.toLowerCase().includes('untung')) {
      category = 'Business';
    } else if (content.toLowerCase().includes('jerawat') || content.toLowerCase().includes('muka') || content.toLowerCase().includes('belgie')) {
      category = 'Beauty';
    }

    toInsert.push({
      id: crypto.randomUUID(),
      content,
      sender: msg.from || 'Anonymous',
      nama_pengirim: msg.from || 'Mitra BP',
      channel_name: channelName,
      category,
      tags,
      is_testimoni: true,
      status: 'approved',
      created_at: new Date(msg.date).toISOString(),
    });

    if (toInsert.length >= 50) {
      const { error } = await supabase.from('telegram_messages').insert(toInsert);
      if (error) console.error('❌ Gagal insert batch:', error.message);
      else console.log(`✅ Berhasil mengimpor ${toInsert.length} pesan...`);
      toInsert.length = 0;
    }
  }

  if (toInsert.length > 0) {
    const { error } = await supabase.from('telegram_messages').insert(toInsert);
    if (error) console.error('❌ Gagal insert sisa batch:', error.message);
    else console.log(`✅ Berhasil mengimpor ${toInsert.length} pesan terakhir.`);
  }

  console.log('🏁 Selesai! Data Telegram Anda kini sudah sinkron dengan Supabase.');
}

importData().catch(console.error);
