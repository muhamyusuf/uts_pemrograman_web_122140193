import "./Home.css";
import { useCallback, useState } from "react";

import { AppleStyleDock } from "@/components/ui/dock";
import CardGrainyBackground from "@/components/ui/card-grainny";
import { PokemonSearchBar } from "@/components/ui/pokemon-search-bar";
import { usePokemonPagination } from "@/hooks/use-pokemon-pagination";

function Home() {
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const {
    pokemons,
    loading,
    error,
    page,
    totalPages,
    hasNext,
    hasPrev,
    nextPage,
    prevPage,
  } = usePokemonPagination({ limit: 3 });

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

  const showSearchResult = Boolean(searchResult);

  return (
    <>
      <div className="relative min-h-screen pb-32">
        <section className="mx-auto flex w-full flex-col gap-1 space-y-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-zinc-100">
                Pokédex Preview
              </h1>
              <p className="text-sm text-zinc-400">
                Explore Pokémon with official artwork and quick details.
              </p>
            </div>
            <p className="self-start rounded-2xl bg-rose-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white md:self-auto">
              Tap a Pokémon image to see details!
            </p>
          </header>

          <PokemonSearchBar
            onResult={handleSearchResult}
            onClear={handleSearchClear}
            onError={handleSearchError}
            className="sm:max-w-md"
          />

          {searchError ? (
            <p className="rounded-md border border-rose-600/60 bg-rose-900/30 px-3 py-2 text-sm text-rose-100">
              {searchError}
            </p>
          ) : null}

          {error && !showSearchResult ? (
            <p className="rounded-md bg-rose-900/50 px-3 py-2 text-sm text-rose-100">
              {error}
            </p>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {showSearchResult ? (
              <CardGrainyBackground pokemon={searchResult} />
            ) : loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`skeleton-${idx}`} className="card animate-pulse">
                  <div className="card-content flex flex-col items-center gap-3 text-center">
                    <div className="mx-auto aspect-square h-auto w-full min-w-[328px] rounded-[12px] bg-zinc-900/40" />
                    <div className="h-5 w-32 rounded bg-zinc-700/60" />
                    <div className="h-4 w-24 rounded bg-zinc-700/40" />
                    <div className="mt-3 flex w-full justify-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-zinc-800/60" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              pokemons.map((pokemon) => (
                <CardGrainyBackground key={pokemon.id} pokemon={pokemon} />
              ))
            )}
          </div>
        </section>

        {!showSearchResult ? (
          <nav className="flex items-center justify-center gap-4 mt-5">
            <button
              type="button"
              onClick={prevPage}
              disabled={!hasPrev || loading}
              className="rounded-full bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:bg-zinc-900/40"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-300">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={nextPage}
              disabled={!hasNext || loading}
              className="rounded-full bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:bg-zinc-900/40"
            >
              Next
            </button>
          </nav>
        ) : null}
      </div>

      <AppleStyleDock />
    </>
  );
}

export default Home;
