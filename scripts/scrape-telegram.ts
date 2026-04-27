import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import input from "input";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

dotenv.config();

const apiId = parseInt(process.env.TELEGRAM_API_ID || "0");
const apiHash = process.env.TELEGRAM_API_HASH || "";
const stringSession = new StringSession(""); // Simpan session di sini jika ingin auto-login kedepannya

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || "",
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY || ""
);

async function scrape() {
  const targetChannel = process.argv[2];
  if (!targetChannel) {
    console.error("❌ Silakan masukkan username channel! Contoh: npx tsx scripts/scrape-telegram.ts @TestimoniBritishPropolis");
    return;
  }

  console.log("🔗 Menghubungkan ke Telegram...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("📱 Masukkan nomor HP (format +62...): "),
    password: async () => await input.text("🔐 Masukkan password 2FA (jika ada): "),
    phoneCode: async () => await input.text("🔢 Masukkan kode verifikasi dari Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Berhasil Login!");
  console.log(`📡 Mengambil data dari channel: ${targetChannel}...`);

  const messages = await client.getMessages(targetChannel, {
    limit: 100, // Ambil 100 pesan terakhir untuk awal
  });

  const toInsert = [];
  for (const msg of messages) {
    if (!msg.message || msg.message.length < 20) continue;

    // Deteksi hashtag sebagai tags
    const tags = msg.message.match(/#\w+/g) || [];
    
    // Logika penentuan kategori
    let category = "Health";
    const textLower = msg.message.toLowerCase();
    if (textLower.includes("bisnis") || textLower.includes("modal") || textLower.includes("untung") || textLower.includes("mitra")) {
      category = "Business";
    } else if (textLower.includes("jerawat") || textLower.includes("muka") || textLower.includes("belgie") || textLower.includes("flek")) {
      category = "Beauty";
    }

    toInsert.push({
      id: crypto.randomUUID(),
      content: msg.message,
      sender: "Telegram User",
      nama_pengirim: "Mitra BP",
      channel_name: targetChannel,
      category,
      tags,
      is_testimoni: true,
      status: "approved",
      created_at: new Date(msg.date * 1000).toISOString(),
    });
  }

  if (toInsert.length > 0) {
    console.log(`📤 Mengirim ${toInsert.length} data ke Supabase...`);
    const { error } = await supabase.from("telegram_messages").insert(toInsert);
    if (error) console.error("❌ Gagal simpan ke database:", error.message);
    else console.log("🎉 Berhasil! Data sudah masuk ke website Anda.");
  } else {
    console.log("ℹ️ Tidak ditemukan pesan yang valid untuk diimpor.");
  }

  await client.disconnect();
  process.exit(0);
}

scrape().catch(console.error);
