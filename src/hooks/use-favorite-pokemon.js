import { useMemo } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const createStorage = () => {
  if (typeof window === "undefined") {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }

  return window.localStorage;
};

const initialState = {
  favorites: {},
};

export const useFavoritePokemonStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      toggleFavorite: (pokemon) => {
        if (!pokemon?.id) {
          return;
        }

        set((state) => {
          const nextFavorites = { ...state.favorites };
          if (nextFavorites[pokemon.id]) {
            delete nextFavorites[pokemon.id];
          } else {
            nextFavorites[pokemon.id] = {
              id: pokemon.id,
              name: pokemon.name,
              image: pokemon.image,
              url: pokemon.url,
            };
          }

          return { favorites: nextFavorites };
        });
      },
      removeFavorite: (pokemonId) => {
        if (!pokemonId) {
          return;
        }
        set((state) => {
          const nextFavorites = { ...state.favorites };
          delete nextFavorites[pokemonId];
          return { favorites: nextFavorites };
        });
      },
      clearFavorites: () => set(initialState),
      isFavorite: (pokemonId) => Boolean(get().favorites[pokemonId]),
    }),
    {
      name: "pokemon-favorites",
      version: 1,
      storage: createJSONStorage(createStorage),
      partialize: (state) => ({
        favorites: state.favorites,
      }),
    },
  ),
);

export const useFavoritePokemonList = () => {
  const favoritesMap = useFavoritePokemonStore((state) => state.favorites);
  return useMemo(() => Object.values(favoritesMap), [favoritesMap]);
};

export const useFavoritePokemonActions = () => {
  const toggleFavorite = useFavoritePokemonStore((state) => state.toggleFavorite);
  const removeFavorite = useFavoritePokemonStore((state) => state.removeFavorite);
  const clearFavorites = useFavoritePokemonStore((state) => state.clearFavorites);

  return useMemo(
    () => ({
      toggleFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [toggleFavorite, removeFavorite, clearFavorites],
  );
};

export const useIsPokemonFavorite = (id) =>
  useFavoritePokemonStore(
    useMemo(
      () => (state) => Boolean(id ? state.favorites[id] : false),
      [id],
    ),
  );
