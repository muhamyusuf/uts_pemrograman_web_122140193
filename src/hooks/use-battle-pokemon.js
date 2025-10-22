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

const initialSlots = {
  challenger: null,
  opponent: null,
};

export const useBattlePokemonStore = create(
  persist(
    (set) => ({
      slots: initialSlots,
      setSlot: (slot, pokemon) => {
        if (!pokemon?.id || !(slot in initialSlots)) {
          return;
        }

        set((state) => ({
          slots: {
            ...state.slots,
            [slot]: {
              id: pokemon.id,
              name: pokemon.name,
              image: pokemon.image,
              url: pokemon.url,
            },
          },
        }));
      },
      swapSlots: () =>
        set((state) => {
          const { challenger, opponent } = state.slots;
          return {
            slots: {
              challenger: opponent,
              opponent: challenger,
            },
          };
        }),
      clearSlot: (slot) => {
        if (!(slot in initialSlots)) {
          return;
        }
        set((state) => ({
          slots: {
            ...state.slots,
            [slot]: null,
          },
        }));
      },
      resetSlots: () =>
        set({
          slots: {
            challenger: null,
            opponent: null,
          },
        }),
    }),
    {
      name: "pokemon-battle-slots",
      version: 1,
      storage: createJSONStorage(createStorage),
    },
  ),
);

export const useBattlePokemonSlots = () =>
  useBattlePokemonStore((state) => state.slots);

export const useBattlePokemonActions = () => {
  const setSlot = useBattlePokemonStore((state) => state.setSlot);
  const swapSlots = useBattlePokemonStore((state) => state.swapSlots);
  const clearSlot = useBattlePokemonStore((state) => state.clearSlot);
  const resetSlots = useBattlePokemonStore((state) => state.resetSlots);

  return useMemo(
    () => ({
      setSlot,
      swapSlots,
      clearSlot,
      resetSlots,
    }),
    [setSlot, swapSlots, clearSlot, resetSlots],
  );
};
