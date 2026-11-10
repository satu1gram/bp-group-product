// Parallax ringan untuk semua browser & perangkat.
// - Browser yang mendukung CSS scroll-driven animation (Chrome/Edge/Android):
//   ditangani penuh oleh CSS (tanpa JavaScript, tidak membebani HP).
// - Browser lain (Safari/iOS, Firefox lama): JS kecil menyetel variabel --plx
//   (-1..1) hanya saat bagian terlihat di layar, memakai requestAnimationFrame.
// - Pengguna yang memilih "kurangi gerakan" (prefers-reduced-motion): tanpa parallax.
export function setupParallax(el: HTMLElement | null): () => void {
    if (!el || typeof window === "undefined") return () => {};
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const cssNative = typeof CSS !== "undefined" && CSS.supports?.("animation-timeline: view()");
    if (reduce || cssNative) return () => {};

    el.classList.add("plx-js");
    let visible = false;
    let frame = 0;

    const update = () => {
        frame = 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 saat bagian tepat di tengah layar, -1 saat baru masuk dari bawah, 1 saat keluar ke atas
        const progress = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
        el.style.setProperty("--plx", Math.max(-1, Math.min(1, progress)).toFixed(3));
    };
    const onScroll = () => {
        if (visible && !frame) frame = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
    });
    io.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();

    return () => {
        io.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (frame) cancelAnimationFrame(frame);
        el.classList.remove("plx-js");
    };
}
