import { useCallback, useEffect, useRef } from "react";
import { create } from "zustand";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

const buildArtworkUrl = (id) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

const parsePokemon = (result) => {
  const segments = result.url.split("/").filter(Boolean);
  const id = Number.parseInt(segments.pop(), 10);

  return {
    id,
    name: result.name,
    image: buildArtworkUrl(id),
    url: result.url,
  };
};

const usePokemonStore = create((set, get) => ({
  pokemons: [],
  page: 1,
  limit: 3,
  total: 0,
  loading: false,
  error: null,
  hasNext: false,
  hasPrev: false,
  requestKey: null,
  setPage: (page) =>
    set((state) => {
      const nextPage = Math.max(1, Number.isFinite(page) ? page : state.page);
      return { page: nextPage };
    }),
  setLimit: (limit) =>
    set((state) => {
      const nextLimit = Math.max(
        1,
        Number.isFinite(limit) ? limit : state.limit
      );
      return { limit: nextLimit, page: 1 };
    }),
  fetchPokemons: async (page = get().page, limit = get().limit) => {
    const offset = (page - 1) * limit;
    const fetchKey = `${page}-${limit}`;
    const state = get();

    if (state.requestKey === fetchKey && state.loading) {
      return;
    }

    set({ loading: true, error: null, requestKey: fetchKey });

    try {
      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`${API_URL}/?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to load Pokemon (status ${response.status}).`);
      }

      const data = await response.json();
      if (get().requestKey !== fetchKey) {
        return;
      }
      const pokemons = data.results.map(parsePokemon);

      set({
        pokemons,
        page,
        limit,
        total: data.count,
        loading: false,
        hasNext: Boolean(data.next),
        hasPrev: Boolean(data.previous),
        error: null,
      });
    } catch (error) {
      if (get().requestKey === fetchKey) {
        set({
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error.",
        });
      }
    }
  },
}));

export const usePokemonPagination = ({ page, limit } = {}) => {
  const pokemons = usePokemonStore((state) => state.pokemons);
  const loading = usePokemonStore((state) => state.loading);
  const error = usePokemonStore((state) => state.error);
  const total = usePokemonStore((state) => state.total);
  const hasNext = usePokemonStore((state) => state.hasNext);
  const hasPrev = usePokemonStore((state) => state.hasPrev);
  const currentPage = usePokemonStore((state) => state.page);
  const currentLimit = usePokemonStore((state) => state.limit);
  const fetchPokemons = usePokemonStore((state) => state.fetchPokemons);
  const setPageStore = usePokemonStore((state) => state.setPage);
  const setLimitStore = usePokemonStore((state) => state.setLimit);

  const initialisedRef = useRef(false);

  useEffect(() => {
    if (!initialisedRef.current) {
      if (Number.isFinite(limit) && limit !== currentLimit) {
        setLimitStore(limit);
      }
      if (Number.isFinite(page) && page !== currentPage) {
        setPageStore(page);
      }
      initialisedRef.current = true;
    }
  }, [limit, page, currentLimit, currentPage, setLimitStore, setPageStore]);

  useEffect(() => {
    fetchPokemons(currentPage, currentLimit);
  }, [fetchPokemons, currentPage, currentLimit]);

  const totalPages =
    currentLimit > 0 ? Math.ceil(total / currentLimit) || 1 : 1;

  const goToPage = useCallback(
    (nextPage) => {
      const safePage = Math.max(1, Math.min(totalPages, nextPage));
      if (safePage === currentPage) {
        return;
      }
      setPageStore(safePage);
    },
    [currentPage, setPageStore, totalPages]
  );

  const nextPageHandler = useCallback(() => {
    if (hasNext) {
      goToPage(currentPage + 1);
    }
  }, [goToPage, hasNext, currentPage]);

  const prevPageHandler = useCallback(() => {
    if (hasPrev) {
      goToPage(currentPage - 1);
    }
  }, [goToPage, hasPrev, currentPage]);

  const updateLimit = useCallback(
    (value) => {
      if (!Number.isFinite(value) || value <= 0) {
        return;
      }
      if (value === currentLimit) {
        return;
      }
      setLimitStore(value);
    },
    [currentLimit, setLimitStore]
  );

  return {
    pokemons,
    loading,
    error,
    page: currentPage,
    limit: currentLimit,
    total,
    totalPages,
    hasNext,
    hasPrev,
    setPage: goToPage,
    setLimit: updateLimit,
    nextPage: nextPageHandler,
    prevPage: prevPageHandler,
  };
};

export const usePokemonById = (id) =>
  usePokemonStore((state) =>
    state.pokemons.find((pokemon) => pokemon.id === id)
  );
