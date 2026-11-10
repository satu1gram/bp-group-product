// Animasi "muncul saat digulir" untuk elemen .fade-in.
// Elemen yang sudah terlihat saat halaman dibuka TIDAK pernah disembunyikan
// (konten hasil prerender langsung tampil); hanya elemen di bawah layar yang
// disiapkan tersembunyi lalu dimunculkan saat digulir.
export function setupReveal(root: ParentNode = document): () => void {
    const els = Array.from(root.querySelectorAll<HTMLElement>(".fade-in:not(.in-view):not(.reveal-pending)"));
    if (typeof IntersectionObserver === "undefined") {
        els.forEach((el) => el.classList.add("in-view"));
        return () => {};
    }
    const observer = new IntersectionObserver(
        (entries) =>
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    e.target.classList.add("in-view");
                    observer.unobserve(e.target);
                }
            }),
        { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );
    const vh = window.innerHeight;
    els.forEach((el) => {
        if (el.getBoundingClientRect().top < vh) {
            el.classList.add("in-view");
        } else {
            el.classList.add("reveal-pending");
            observer.observe(el);
        }
    });
    return () => observer.disconnect();
}
