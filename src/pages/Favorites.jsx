import { useCallback, useMemo, useState } from "react";

import { AppleStyleDock } from "@/components/ui/dock";
import CardGrainyBackground from "@/components/ui/card-grainny";
import { PokemonSearchBar } from "@/components/ui/pokemon-search-bar";
import {
  useFavoritePokemonActions,
  useFavoritePokemonList,
} from "@/hooks/use-favorite-pokemon";

export default function Favorites() {
  const favorites = useFavoritePokemonList();
  const { clearFavorites } = useFavoritePokemonActions();
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");

  const filteredFavorites = useMemo(() => {
    if (!searchResult) {
      return favorites;
    }
    return favorites.filter((pokemon) => pokemon.id === searchResult.id);
  }, [favorites, searchResult]);

  const handleSearchResult = useCallback((pokemon) => {
    setSearchResult(pokemon);
    setSearchError("");
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchResult(null);
    setSearchError("");
  }, []);

  const handleSearchError = useCallback((message) => {
    setSearchError(message);
    setSearchResult(null);
  }, []);

  const hasFavorites = favorites.length > 0;
  const displayFavorites = filteredFavorites.length > 0;

  return (
    <div className="relative min-h-screen pb-32">
      <div className="mx-auto flex w-full flex-col gap-1 space-y-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-100">
              Favorite Pokémon
            </h1>
            <p className="text-sm text-zinc-400">
              All Pokémon you have marked as favorites are listed here.
            </p>
          </div>

          {hasFavorites ? (
            <button
              type="button"
              onClick={clearFavorites}
              className="self-start rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/70"
            >
              Clear favorites
            </button>
          ) : null}
        </header>

        <PokemonSearchBar
          onResult={handleSearchResult}
          onClear={handleSearchClear}
          onError={handleSearchError}
          className="sm:max-w-md"
          placeholder="Find a Pokémon by name or number…"
        />

        {searchError ? (
          <p className="rounded-md border border-rose-600/60 bg-rose-900/30 px-3 py-2 text-sm text-rose-100">
            {searchError}
          </p>
        ) : null}

        {searchResult ? (
          <section className="space-y-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-4">
            <div className="flex items-center justify-between text-sm text-zinc-300">
              <span>
                Search result for{" "}
                <span className="font-semibold capitalize text-zinc-100">
                  {searchResult.name}
                </span>
              </span>
              {favorites.some((fav) => fav.id === searchResult.id) ? (
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                  In Favorites
                </span>
              ) : (
                <span className="rounded-full bg-zinc-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                  Not in Favorites
                </span>
              )}
            </div>
            <CardGrainyBackground pokemon={searchResult} />
          </section>
        ) : null}

        {!hasFavorites ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-6 py-16 text-center text-zinc-400">
            <p className="text-lg font-medium text-zinc-200">
              No favorite Pokémon yet
            </p>
            <p className="text-sm text-zinc-400">
              Browse the Pokedex and tap the heart icon to save Pokémon here.
            </p>
          </div>
        ) : displayFavorites ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredFavorites.map((pokemon) => (
              <CardGrainyBackground key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 px-6 py-10 text-center text-sm text-zinc-400">
            That Pokémon is not in your favorites yet. Open its card to add it.
          </div>
        )}
      </div>

      <AppleStyleDock />
    </div>
  );
}
