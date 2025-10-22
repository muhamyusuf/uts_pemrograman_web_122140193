import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Heart, HeartOff, Swords, UserPlus } from "lucide-react";

import "./card-grainny.css";

import { MorphingDialogBasicImage } from "@/components/ui/morphing-dialog-basic-image";
import { usePokemonDetail } from "@/hooks/use-pokemon-detail";
import {
  useFavoritePokemonStore,
  useIsPokemonFavorite,
} from "@/hooks/use-favorite-pokemon";
import { useBattlePokemonStore } from "@/hooks/use-battle-pokemon";

const StatBar = ({ label, value }) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  const percentage = Math.min(100, Math.round((safeValue / 255) * 100));

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs uppercase tracking-wide text-zinc-400">
        <span>{label}</span>
        <span className="text-zinc-200">{safeValue}</span>
      </div>
      <div className="h-2 w-full rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

StatBar.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};

const PokemonDetailContent = ({ pokemon }) => {
  const { detail, status, error, refetch } = usePokemonDetail(pokemon.id, {
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const setSlot = useBattlePokemonStore((state) => state.setSlot);
  const challengerSelected = useBattlePokemonStore(
    useMemo(
      () => (state) => state.slots.challenger?.id === pokemon.id,
      [pokemon.id]
    )
  );
  const opponentSelected = useBattlePokemonStore(
    useMemo(
      () => (state) => state.slots.opponent?.id === pokemon.id,
      [pokemon.id]
    )
  );

  const toggleFavorite = useFavoritePokemonStore(
    (state) => state.toggleFavorite
  );
  const isFavorite = useIsPokemonFavorite(pokemon.id);

  const formattedName = useMemo(
    () => pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    [pokemon.name]
  );

  const formattedDexNumber = useMemo(
    () => `#${String(pokemon.id).padStart(3, "0")}`,
    [pokemon.id]
  );

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(pokemon);
  }, [pokemon, toggleFavorite]);

  const handleAssignBattle = useCallback(
    (slot) => {
      setSlot(slot, pokemon);
    },
    [pokemon, setSlot]
  );

  if (status === "loading" && !detail) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-3 py-6 text-center text-zinc-300">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
        <p className="text-sm text-zinc-400">Loading Pokemon data…</p>
      </div>
    );
  }

  if (error && !detail) {
    return (
      <div className="rounded-lg border border-rose-500/40 bg-rose-900/30 p-4 text-sm text-rose-100">
        Failed to load details.{" "}
        <button
          type="button"
          onClick={() => refetch({ force: true })}
          className="font-medium text-rose-200 underline underline-offset-2"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!detail) {
    return null;
  }

  const heightMeters = (detail.height / 10).toFixed(1);
  const weightKg = (detail.weight / 10).toFixed(1);

  return (
    <div className="flex w-full flex-col gap-6 text-left text-zinc-100">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold capitalize">{formattedName}</h2>
          <p className="text-sm text-zinc-400">{formattedDexNumber}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {detail.types?.map((type) => (
            <span
              key={type}
              className="rounded-full bg-zinc-900/70 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-200"
            >
              {type}
            </span>
          ))}
        </div>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Height
          </p>
          <p className="text-lg font-semibold text-zinc-100">
            {heightMeters} m
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Weight
          </p>
          <p className="text-lg font-semibold text-zinc-100">{weightKg} kg</p>
        </div>
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3">
          <p className="text-xs uppercase tracking-wide text-zinc-400">
            Base EXP
          </p>
          <p className="text-lg font-semibold text-zinc-100">
            {detail.baseExperience}
          </p>
        </div>
      </section>

      <section>
        <h3 className="text-sm uppercase tracking-wide text-zinc-400">
          Base Stats
        </h3>
        <div className="mt-3 grid gap-3">
          {detail.stats?.map((stat) => {
            const statLabel =
              (stat?.name ?? "").replace(/-/g, " ") || "Unknown";
            const statValue = Number(stat?.value ?? 0);
            return (
              <StatBar
                key={`${statLabel}-${statValue}`}
                label={statLabel}
                value={statValue}
              />
            );
          })}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <h3 className="text-sm uppercase tracking-wide text-zinc-400">
            Abilities
          </h3>
          <ul className="mt-2 space-y-2">
            {detail.abilities?.map((ability) => (
              <li
                key={ability.name}
                className="flex items-center justify-between rounded-lg bg-zinc-900/70 px-3 py-2 text-sm text-zinc-200"
              >
                <span className="capitalize">
                  {ability.name.replace(/-/g, " ")}
                </span>
                {ability.isHidden ? (
                  <span className="text-xs uppercase text-emerald-400">
                    Hidden
                  </span>
                ) : null}
              </li>
            ))}
            {!detail.abilities?.length ? (
              <li className="rounded-lg bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500">
                No ability data available.
              </li>
            ) : null}
          </ul>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-wide text-zinc-400">
            Moves
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {detail.moves?.length ? (
              detail.moves.map((move) => (
                <span
                  key={move}
                  className="rounded-full bg-zinc-900/70 px-3 py-1 text-xs capitalize text-zinc-200"
                >
                  {move.replace(/-/g, " ")}
                </span>
              ))
            ) : (
              <p className="text-sm text-zinc-500">
                Move data unavailable for this Pokemon.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleToggleFavorite}
          className="inline-flex items-center gap-2 rounded-full bg-rose-600/80 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-600"
        >
          {isFavorite ? (
            <Heart className="h-4 w-4 fill-current" />
          ) : (
            <HeartOff className="h-4 w-4" />
          )}
          {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
        </button>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleAssignBattle("challenger")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              challengerSelected
                ? "bg-emerald-600/80 text-white"
                : "bg-zinc-800/70 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            <UserPlus className="h-4 w-4" />
            Set Challenger
          </button>
          <button
            type="button"
            onClick={() => handleAssignBattle("opponent")}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              opponentSelected
                ? "bg-blue-600/80 text-white"
                : "bg-zinc-800/70 text-zinc-200 hover:bg-zinc-700"
            }`}
          >
            <Swords className="h-4 w-4" />
            Set Opponent
          </button>
        </div>
      </section>
    </div>
  );
};

PokemonDetailContent.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

const CardGrainyBackground = ({ pokemon }) => {
  const formattedName = useMemo(() => {
    if (!pokemon?.name) {
      return "Unknown Pokemon";
    }
    return pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  }, [pokemon?.name]);

  const formattedDexNumber = useMemo(() => {
    if (!pokemon?.id) {
      return "Missing Pokedex data";
    }
    return `Pokedex #${String(pokemon.id).padStart(3, "0")}`;
  }, [pokemon?.id]);

  const toggleFavorite = useFavoritePokemonStore(
    (state) => state.toggleFavorite
  );
  const favoriteSelector = useMemo(
    () => (state) => Boolean(state.favorites[pokemon.id]),
    [pokemon.id]
  );
  const isFavorite = useFavoritePokemonStore(favoriteSelector);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    setImageLoaded(false);

    if (typeof window === "undefined" || !pokemon?.image) {
      return undefined;
    }

    const image = new window.Image();
    image.src = pokemon.image;

    if (image.complete) {
      setImageLoaded(true);
    } else {
      image.onload = () => {
        if (active) {
          setImageLoaded(true);
        }
      };
      image.onerror = () => {
        if (active) {
          setImageLoaded(true);
        }
      };
    }

    return () => {
      active = false;
    };
  }, [pokemon?.image, pokemon?.id]);

  const handleToggleFavorite = useCallback(() => {
    toggleFavorite(pokemon);
  }, [pokemon, toggleFavorite]);

  return (
    <div className="card">
      <div className="card-content flex flex-col items-center gap-3 text-center">
        {!imageLoaded ? (
          <div className="mx-auto aspect-square h-auto w-full min-w-[328px] rounded-[12px] bg-zinc-900/40" />
        ) : null}
        <MorphingDialogBasicImage
          src={pokemon?.image}
          alt={formattedName}
          onImageLoad={() => setImageLoaded(true)}
          hidden={!imageLoaded}
          previewClassName="mx-auto h-auto w-full rounded-[16px] bg-zinc-900/40 object-contain p-2 shadow-xl"
          dialogClassName="h-auto max-h-[320px] w-full object-contain"
          contentClassName="relative flex max-h-[90vh] w-full flex-col gap-6 overflow-y-auto rounded-[24px] bg-zinc-950/90 p-6 shadow-2xl backdrop-blur"
        >
          <PokemonDetailContent pokemon={pokemon} />
        </MorphingDialogBasicImage>

        <h3 className="title">{formattedName}</h3>

        <p className="description">{formattedDexNumber}</p>

        <div className="mt-3 flex w-full justify-center gap-3">
          <button
            type="button"
            onClick={handleToggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className="relative group rounded-full bg-zinc-800/80 p-2 transition hover:bg-zinc-700"
          >
            {isFavorite ? (
              <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
            ) : (
              <HeartOff className="h-5 w-5 text-zinc-300" />
            )}
            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-xl bg-zinc-700 px-3 py-1.5 text-xs text-white opacity-0 transition-all duration-200 group-hover:scale-100 group-hover:opacity-100">
              {isFavorite ? "Remove favorite" : "Add favorite"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

CardGrainyBackground.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default CardGrainyBackground;
