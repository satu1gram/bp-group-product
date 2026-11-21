import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Tampilan gambar layar penuh. Ditutup lewat tombol ✕, tombol Esc, atau klik di luar gambar.
 * Pinch-zoom bawaan HP tetap bisa dipakai di dalamnya.
 */
export function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
    const closeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeRef.current?.focus();

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
            previouslyFocused?.focus?.();
        };
    }, [onClose]);

    return createPortal(
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt || "Gambar diperbesar"} onClick={onClose}>
            <button ref={closeRef} type="button" className="lightbox-close" aria-label="Tutup gambar" onClick={onClose}>
                <span className="material-symbols-rounded" aria-hidden="true">close</span>
            </button>
            <img src={src} alt={alt} onClick={(e) => e.stopPropagation()} />
            {alt && <p className="lightbox-caption" onClick={(e) => e.stopPropagation()}>{alt}</p>}
        </div>,
        document.body
    );
}
