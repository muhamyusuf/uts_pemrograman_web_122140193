import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";

import { usePokemonSearch } from "@/hooks/use-pokemon-search";
import { cn } from "@/lib/utils";

export function PokemonSearchBar({
  onResult,
  onClear,
  onError,
  placeholder = "Search Pokémon by name or Pokédex number…",
  className,
  autoFocus = false,
}) {
  const { query, setQuery, status, error, result, search, clear } =
    usePokemonSearch();

  useEffect(() => {
    if (result && onResult) {
      onResult(result);
    }
  }, [result, onResult]);

  useEffect(() => {
    if (status === "idle" && !query && !result && onClear) {
      onClear();
    }
  }, [status, query, result, onClear]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const isLoading = status === "loading";
  const showClearButton = useMemo(
    () => Boolean(query || result),
    [query, result]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query) {
      return;
    }
    search(query);
  };

  const handleClear = () => {
    setQuery("");
    clear();
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className="group relative flex w-full items-center gap-2 rounded-full border border-zinc-800/80 bg-zinc-900/60 px-4 py-2 ring-1 ring-transparent transition focus-within:border-emerald-400/70 focus-within:ring-emerald-500/30"
      >
        <Search className="h-5 w-5 shrink-0 text-zinc-500 group-focus-within:text-emerald-300" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
          autoComplete="off"
          spellCheck="false"
          autoFocus={autoFocus}
        />
        {showClearButton ? (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1 text-zinc-500 transition hover:text-zinc-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40 disabled:text-emerald-900/70"
        >
          {isLoading ? "Searching…" : "Search"}
        </button>
      </form>
      {error ? (
        <p className="mt-2 text-xs text-rose-300" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}

PokemonSearchBar.propTypes = {
  onResult: PropTypes.func,
  onClear: PropTypes.func,
  onError: PropTypes.func,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
};
