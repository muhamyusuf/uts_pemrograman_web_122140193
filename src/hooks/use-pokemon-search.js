import { useCallback, useMemo, useState } from "react";

import { usePokemonDetailStoreApi } from "@/hooks/use-pokemon-detail";

const normaliseTerm = (term) =>
  term?.toString().trim().toLowerCase().replace(/\s+/g, "-") ?? "";

export const usePokemonSearch = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const clear = useCallback(() => {
    setResult(null);
    setStatus("idle");
    setError(null);
  }, []);

  const search = useCallback(
    async (term) => {
      const value = normaliseTerm(term ?? query);

      setQuery(value);
      if (!value) {
        setError("Please enter a Pokémon name or Pokédex number.");
        setResult(null);
        setStatus("idle");
        return null;
      }

      setStatus("loading");
      setError(null);

      try {
        const detail = await usePokemonDetailStoreApi
          .getState()
          .fetchDetail(value, { force: true });

        if (!detail) {
          throw new Error("Pokémon not found. Try a different name or number.");
        }

        const parsedResult = {
          id: detail.id,
          name: detail.name,
          image: detail.sprite,
          url:
            detail.raw?.url ??
            `https://pokeapi.co/api/v2/pokemon/${detail.id}/`,
          detail,
        };

        setResult(parsedResult);
        setStatus("success");
        return parsedResult;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to find that Pokémon. Please double check the spelling.";
        setError(message);
        setStatus("error");
        setResult(null);
        return null;
      }
    },
    [query]
  );

  return useMemo(
    () => ({
      query,
      setQuery,
      status,
      error,
      result,
      search,
      clear,
    }),
    [query, status, error, result, search, clear]
  );
};
