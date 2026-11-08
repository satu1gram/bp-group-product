// Data awal (artikel & promo) yang diambil saat build lalu ikut di HTML,
// supaya halaman langsung tampil lengkap dan terbaca Google.
// Di browser data diperbarui lagi dari Supabase setelah halaman tampil.
import { createContext, useContext, useEffect, useState } from "react";
import {
    type Article,
    type Promo,
    fetchActivePromos,
    fetchArticleBySlug,
    fetchPublishedArticles,
    isPromoRunning,
    sortPromos,
} from "./content";
import { todayJakarta } from "./site";

export interface InitialData {
    articles?: Article[];
    promos?: Promo[];
    /** Tanggal build (YYYY-MM-DD, Asia/Jakarta) untuk menyaring promo saat render awal */
    builtOn?: string;
}

declare global {
    interface Window {
        __INITIAL_DATA__?: InitialData;
    }
}

export const InitialDataContext = createContext<InitialData>({});

export function useInitialData(): InitialData {
    return useContext(InitialDataContext);
}

type LoadState<T> = { data: T; loading: boolean; error: boolean };

export function useArticles(): LoadState<Article[]> {
    const initial = useInitialData().articles;
    const [state, setState] = useState<LoadState<Article[]>>({
        data: initial ?? [],
        loading: !initial,
        error: false,
    });

    useEffect(() => {
        let alive = true;
        fetchPublishedArticles()
            .then((data) => alive && setState({ data, loading: false, error: false }))
            .catch(() => alive && setState((s) => ({ ...s, loading: false, error: !initial })));
        return () => {
            alive = false;
        };
    }, [initial]);

    return state;
}

export function useArticle(slug: string): LoadState<Article | null> {
    const initial = useInitialData().articles?.find((a) => a.slug === slug) ?? null;
    const [state, setState] = useState<LoadState<Article | null>>({
        data: initial,
        loading: !initial,
        error: false,
    });

    useEffect(() => {
        let alive = true;
        fetchArticleBySlug(slug)
            .then((data) => alive && setState({ data: data ?? initial, loading: false, error: false }))
            .catch(() => alive && setState((s) => ({ ...s, loading: false, error: !s.data })));
        return () => {
            alive = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    return state;
}

export function usePromos(): LoadState<Promo[]> {
    const { promos: initial, builtOn } = useInitialData();
    const [state, setState] = useState<LoadState<Promo[]>>({
        data: initial ? sortPromos(initial.filter((p) => isPromoRunning(p, builtOn ?? todayJakarta()))) : [],
        loading: !initial,
        error: false,
    });

    useEffect(() => {
        let alive = true;
        fetchActivePromos()
            .then((data) => alive && setState({ data, loading: false, error: false }))
            .catch(() =>
                alive &&
                setState((s) => ({
                    // Gagal ambil data terbaru → tetap tampilkan data build yang masih berlaku hari ini
                    data: s.data.filter((p) => isPromoRunning(p)),
                    loading: false,
                    error: !initial,
                }))
            );
        return () => {
            alive = false;
        };
    }, [initial]);

    return state;
}
