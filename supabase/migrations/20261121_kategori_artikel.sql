-- ============================================================
-- Kategori artikel "Catatan Tila" (terpisah dari "untuk pembaca")
-- Jalankan di Supabase → SQL Editor. Aman dijalankan ulang.
-- Website tetap berfungsi sebelum SQL ini dijalankan (kategori diturunkan
-- dari kolom "audience"), tetapi kategori baru baru tersimpan setelahnya.
-- ============================================================

alter table public.articles
  add column if not exists category text
  check (category is null or category in ('kisah', 'produk', 'sehat', 'bisnis', 'gaya-hidup'));

-- Petakan tulisan yang sudah ada
update public.articles set category = 'kisah'
  where category is null
    and (title ilike 'Rahasia Ilahi%' or title ilike 'Berubah Lebih Berwarna%'
      or title ilike 'Lelah Karena Lillah%' or title ilike 'Sepasang Bidadari%');

update public.articles set category = 'gaya-hidup'
  where category is null and title ilike 'Goodie Bag%';

-- Sisanya mengikuti "untuk pembaca"
update public.articles set category = case when audience = 'mitra' then 'bisnis' else 'sehat' end
  where category is null;
