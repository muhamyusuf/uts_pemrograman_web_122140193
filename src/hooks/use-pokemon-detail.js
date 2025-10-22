import { useCallback, useEffect } from "react";
import { create } from "zustand";

const API_URL = "https://pokeapi.co/api/v2/pokemon";

const initialState = {
  details: {},
  status: {},
  errors: {},
};

const normaliseDetail = (data) => {
  const officialArtwork =
    data.sprites?.other?.["official-artwork"]?.front_default ??
    data.sprites?.front_default ??
    "";

  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience,
    abilities: data.abilities?.map((entry) => ({
      name: entry.ability?.name ?? "",
      isHidden: entry.is_hidden ?? false,
    })),
    types: data.types?.map((entry) => entry.type?.name ?? ""),
    stats: data.stats?.map((stat) => ({
      name: stat.stat?.name ?? "",
      value: stat.base_stat ?? 0,
    })),
    moves: data.moves?.slice(0, 8)?.map((entry) => entry.move?.name ?? ""),
    cries: {
      latest: data.cries?.latest ?? "",
      legacy: data.cries?.legacy ?? "",
    },
    sprite: officialArtwork,
    raw: data,
  };
};

const usePokemonDetailStore = create((set, get) => ({
  ...initialState,
  reset: () => set(initialState),
  fetchDetail: async (id, { force = false } = {}) => {
    if (!id) {
      return null;
    }

    const { status, details } = get();

    if (!force) {
      if (status[id] === "loading") {
        return null;
      }
      if (details[id]) {
        return details[id];
      }
    }

    set((state) => ({
      status: { ...state.status, [id]: "loading" },
      errors: { ...state.errors, [id]: undefined },
    }));

    try {
      const response = await fetch(`${API_URL}/${id}`);

      if (!response.ok) {
        throw new Error(
          `Failed to load Pokemon detail (status ${response.status}).`
        );
      }

      const data = await response.json();
      const detail = normaliseDetail(data);

      set((state) => ({
        details: { ...state.details, [id]: detail },
        status: { ...state.status, [id]: "success" },
        errors: { ...state.errors, [id]: undefined },
      }));

      return detail;
    } catch (error) {
      set((state) => ({
        status: { ...state.status, [id]: "error" },
        errors: {
          ...state.errors,
          [id]: error instanceof Error ? error.message : "Unknown error.",
        },
      }));
      return null;
    }
  },
}));

export const usePokemonDetail = (id, options = {}) => {
  const enabled = options.enabled ?? true;
  const detail = usePokemonDetailStore(
    useCallback((state) => (id ? state.details[id] : undefined), [id])
  );
  const status = usePokemonDetailStore(
    useCallback((state) => state.status[id] ?? "idle", [id])
  );
  const error = usePokemonDetailStore(
    useCallback((state) => state.errors[id], [id])
  );

  const fetchDetail = usePokemonDetailStore((state) => state.fetchDetail);

  const refetch = useCallback(
    (params) => fetchDetail(id, params),
    [fetchDetail, id]
  );

  useEffect(() => {
    if (!enabled || !id) {
      return;
    }

    if (!detail && status !== "loading") {
      refetch();
    }
  }, [detail, enabled, id, refetch, status]);

  return {
    detail,
    status,
    error,
    refetch,
  };
};

export const usePokemonDetailStoreApi = usePokemonDetailStore;
