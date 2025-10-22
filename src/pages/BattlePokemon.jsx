import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Flame, Shield, Sparkles, Trophy } from "lucide-react";
import { AppleStyleDock } from "@/components/ui/dock";
import { PokemonSearchBar } from "@/components/ui/pokemon-search-bar";
import {
  useBattlePokemonActions,
  useBattlePokemonSlots,
} from "@/hooks/use-battle-pokemon";
import { usePokemonDetail } from "@/hooks/use-pokemon-detail";
import { usePokemonPagination } from "@/hooks/use-pokemon-pagination";
import { cn } from "@/lib/utils";
const StatMeter = ({ label, value }) => {
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
StatMeter.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
};
const BattleSlot = ({ label, pokemon, detailState, onClear, highlight }) => {
  const { detail, status, error } = detailState;
  const height = detail ? (detail.height / 10).toFixed(1) : null;
  const weight = detail ? (detail.weight / 10).toFixed(1) : null;
  return (
    <div
      className={cn(
        "flex flex-col gap-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-lg backdrop-blur transition-all",
        highlight && "border-emerald-500/60 shadow-emerald-500/20"
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-100">{label}</h2>
        {pokemon ? (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-rose-300 transition hover:text-rose-200"
          >
            Remove
          </button>
        ) : null}
      </div>
      {!pokemon ? (
        <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-zinc-700/60 bg-zinc-900/40 text-center text-zinc-400">
          <p className="text-base text-zinc-300">No Pokemon assigned</p>
          <p className="text-sm text-zinc-500">
            Use the roster on the right or open a detail card to assign a
            challenger and opponent.
          </p>
        </div>
      ) : status === "loading" && !detail ? (
        <div className="flex h-52 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-400" />
        </div>
      ) : error && !detail ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-900/40 p-4 text-sm text-rose-100">
          Failed to load Pokemon detail. Reopen the detail dialog to try again.
        </div>
      ) : (
        detail && (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-950/80 p-3 shadow-inner">
                <img
                  src={pokemon.image}
                  alt={detail.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div>
                  <h3 className="text-2xl font-semibold capitalize text-zinc-100">
                    {detail.name}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    #{String(detail.id).padStart(3, "0")}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {detail.types?.map((type) => (
                    <span
                      key={type}
                      className="rounded-full bg-zinc-900/70 px-3 py-1 text-xs uppercase tracking-wide text-emerald-200"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-zinc-300">
                  <div>
                    Height:{" "}
                    <span className="font-semibold text-zinc-100">
                      {height} m
                    </span>
                  </div>
                  <div>
                    Weight:{" "}
                    <span className="font-semibold text-zinc-100">
                      {weight} kg
                    </span>
                  </div>
                  <div>
                    Base EXP:{" "}
                    <span className="font-semibold text-zinc-100">
                      {detail.baseExperience}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3">
              {detail.stats?.map((stat) => {
                const statLabel =
                  (stat?.name ?? "").replace(/-/g, " ") || "Unknown";
                const statValue = Number(stat?.value ?? 0);
                return (
                  <StatMeter
                    key={`${statLabel}-${statValue}`}
                    label={statLabel}
                    value={statValue}
                  />
                );
              })}
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-wide text-zinc-400">
                Abilities
              </h4>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-zinc-200">
                {detail.abilities?.map((ability) => (
                  <span
                    key={ability.name}
                    className="rounded-full bg-zinc-900/70 px-3 py-1 capitalize"
                  >
                    {ability.name.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
};
BattleSlot.propTypes = {
  label: PropTypes.string.isRequired,
  pokemon: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }),
  detailState: PropTypes.shape({
    detail: PropTypes.object,
    status: PropTypes.string,
    error: PropTypes.string,
  }).isRequired,
  onClear: PropTypes.func.isRequired,
  highlight: PropTypes.bool,
};
BattleSlot.defaultProps = {
  pokemon: null,
  highlight: false,
};
const BattlePreviewImages = ({
  challenger,
  opponent,
  animate = false,
  highlightWinner,
}) => {
  if (!challenger && !opponent) {
    return null;
  }
  const renderPreview = (pokemon, label, accent) => {
    if (!pokemon) {
      return (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-zinc-700/60 px-4 py-5 text-center text-xs uppercase tracking-wide text-zinc-500">
          <Shield className="h-5 w-5" />
          <span>{`No ${label}`}</span>
        </div>
      );
    }
    return (
      <div
        className={cn(
          "flex flex-col items-center gap-2 rounded-xl border border-zinc-800/80 px-4 py-5 shadow-inner transition",
          highlightWinner === pokemon.name &&
            "border-emerald-400/80 shadow-emerald-400/30"
        )}
      >
        <div
          className={cn(
            "flex h-24 w-24 items-center justify-center rounded-full p-3",
            accent
          )}
        >
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className={cn(
              "h-full w-full object-contain",
              animate && "animate-bounce"
            )}
          />
        </div>
        <span className="text-[10px] uppercase tracking-wide text-zinc-500">
          {label}
        </span>
        <p className="text-sm font-semibold capitalize text-zinc-100">
          {pokemon.name}
        </p>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-center gap-4">
        {renderPreview(challenger, "Challenger", "ring-2 ring-emerald-500/40")}
        <div className="rounded-full border border-zinc-700/80 px-4 py-2 text-sm font-semibold uppercase tracking-wide text-zinc-300">
          VS
        </div>
        {renderPreview(opponent, "Opponent", "ring-2 ring-sky-500/40")}
      </div>
    </div>
  );
};

BattlePreviewImages.propTypes = {
  challenger: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
  opponent: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
  animate: PropTypes.bool,
  highlightWinner: PropTypes.string,
};

BattlePreviewImages.defaultProps = {
  challenger: null,
  opponent: null,
  animate: false,
  highlightWinner: undefined,
};

const BattlePhaseDisplay = ({
  phase,
  countdown,
  log,
  winner,
  challengerPokemon,
  opponentPokemon,
}) => {
  if (phase === "idle") {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 px-6 py-10 text-center text-zinc-300">
        <Sparkles className="h-10 w-10 text-emerald-400" />
        <p className="text-lg text-zinc-100">
          Select a challenger and an opponent to begin the battle!
        </p>
        <p className="text-sm text-zinc-400">
          Stats, abilities, and a little luck decide the victor.
        </p>
      </div>
    );
  }
  if (phase === "countdown") {
    return (
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl border border-emerald-500/60 bg-emerald-500/10 px-6 py-10 text-center shadow-inner shadow-emerald-500/40">
        <div className="text-xs uppercase tracking-[0.4em] text-emerald-200">
          Battle starts in
        </div>
        <div className="text-7xl font-bold text-emerald-300 drop-shadow animate-pulse">
          {countdown}
        </div>
        <div className="flex w-full flex-col items-center justify-center gap-4">
          <p className="text-sm text-emerald-100">
            Trainers are issuing final commands...
          </p>
          <BattlePreviewImages
            challenger={challengerPokemon}
            opponent={opponentPokemon}
          />
        </div>
      </div>
    );
  }
  if (phase === "engaged") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-amber-500/60 bg-amber-500/10 px-6 py-10 text-center shadow-inner shadow-amber-500/40">
        <div className="flex items-center gap-3 text-2xl font-semibold text-amber-100">
          <Flame className="h-8 w-8 animate-bounce text-amber-300" />
          Clash!
          <Flame className="h-8 w-8 animate-bounce text-amber-300" />
        </div>
        <p className="text-sm text-amber-50">
          The arena trembles as both Pokemon unleash their attacks...
        </p>
        <BattlePreviewImages
          challenger={challengerPokemon}
          opponent={opponentPokemon}
          animate
        />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-emerald-500/60 bg-emerald-500/10 px-6 py-8 text-zinc-100 shadow-inner shadow-emerald-500/40">
      {winner ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <Trophy className="h-10 w-10 text-emerald-300 animate-bounce" />
          <p className="text-xl font-semibold uppercase tracking-wide text-emerald-200">
            {winner.outcome === "win" ? `${winner.name} Wins!` : "It’s a Draw!"}
          </p>
          <p className="text-sm text-emerald-100">{winner.summary}</p>
        </div>
      ) : null}
      <BattlePreviewImages
        challenger={challengerPokemon}
        opponent={opponentPokemon}
        highlightWinner={winner?.outcome === "win" ? winner.name : undefined}
      />
      {log.length > 0 ? (
        <ul className="space-y-1 text-sm text-zinc-200 grid grid-cols-3 gap-2">
          {log.map((entry, idx) => (
            <li
              key={`log-${idx}`}
              className="flex items-center text-start bg-zinc-950/30 px-4 py-2 rounded-2xl gap-2"
            >
              <span className="bg-emerald-300 text-zinc-950 rounded-full px-1.5">
                {idx + 1}
              </span>
              <span>{entry}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

BattlePhaseDisplay.propTypes = {
  phase: PropTypes.oneOf(["idle", "countdown", "engaged", "completed"])
    .isRequired,
  countdown: PropTypes.number.isRequired,
  log: PropTypes.arrayOf(PropTypes.string).isRequired,
  winner: PropTypes.shape({
    outcome: PropTypes.oneOf(["win", "draw"]).isRequired,
    name: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
  }),
  challengerPokemon: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
  opponentPokemon: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    image: PropTypes.string,
  }),
};

BattlePhaseDisplay.defaultProps = {
  winner: null,
  challengerPokemon: null,
  opponentPokemon: null,
};

const PokemonRoster = ({ selected, onAssign }) => {
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
  } = usePokemonPagination({ limit: 9 });
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/30 p-5 shadow-lg backdrop-blur">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-zinc-100">Pokemon Roster</h2>
        <p className="text-sm text-zinc-400">
          Quick assign any Pokemon as the challenger or opponent.
        </p>
      </header>
      {error ? (
        <p className="rounded-md bg-rose-900/40 px-3 py-2 text-sm text-rose-100">
          {error}
        </p>
      ) : null}
      <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`roster-skeleton-${idx}`}
                className="flex flex-col gap-3 rounded-xl border border-zinc-800/40 bg-zinc-900/40 p-4"
              >
                <div className="h-20 w-full rounded-lg bg-zinc-800/60" />
                <div className="h-5 w-3/4 rounded bg-zinc-800/40" />
                <div className="flex gap-2">
                  <div className="h-8 flex-1 rounded-full bg-zinc-800/40" />
                  <div className="h-8 flex-1 rounded-full bg-zinc-800/30" />
                </div>
              </div>
            ))
          : pokemons.map((pokemon) => {
              const isChallenger = selected.challengerId === pokemon.id;
              const isOpponent = selected.opponentId === pokemon.id;
              return (
                <div
                  key={pokemon.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40 p-4 transition hover:border-emerald-400/50 hover:bg-zinc-900/60",
                    (isChallenger || isOpponent) &&
                      "border-emerald-400/70 bg-zinc-900/70"
                  )}
                >
                  <div className="flex items-center justify-center rounded-lg bg-zinc-950/70 p-3">
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className="h-20 w-20 object-contain"
                    />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-wide text-zinc-500">
                      #{String(pokemon.id).padStart(3, "0")}
                    </p>
                    <p className="text-lg font-semibold capitalize text-zinc-100">
                      {pokemon.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onAssign("challenger", pokemon)}
                      className={cn(
                        "flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition",
                        isChallenger
                          ? "bg-emerald-500 text-emerald-950"
                          : "bg-zinc-800/70 text-zinc-200 hover:bg-zinc-700"
                      )}
                    >
                      Set Challenger
                    </button>
                    <button
                      type="button"
                      onClick={() => onAssign("opponent", pokemon)}
                      className={cn(
                        "flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition",
                        isOpponent
                          ? "bg-sky-500 text-sky-950"
                          : "bg-zinc-800/70 text-zinc-200 hover:bg-zinc-700"
                      )}
                    >
                      Set Opponent
                    </button>
                  </div>
                </div>
              );
            })}
      </div>
      <div className="flex items-center justify-between rounded-full border border-zinc-800/60 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-300">
        <button
          type="button"
          onClick={prevPage}
          disabled={!hasPrev || loading}
          className="rounded-full px-3 py-1 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-600"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          onClick={nextPage}
          disabled={!hasNext || loading}
          className="rounded-full px-3 py-1 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-600"
        >
          Next
        </button>
      </div>
    </div>
  );
};

PokemonRoster.propTypes = {
  selected: PropTypes.shape({
    challengerId: PropTypes.number,
    opponentId: PropTypes.number,
  }).isRequired,
  onAssign: PropTypes.func.isRequired,
};

const getStatValue = (detail, statName, fallback = 50) => {
  const stat = detail.stats?.find((entry) => entry.stat?.name === statName);
  return Number.isFinite(stat?.value) ? stat.value : fallback;
};

const prepareParticipant = (slot, detail) => {
  const hpStat = getStatValue(detail, "hp", 55);
  const attackStat = Math.max(
    getStatValue(detail, "attack", 50),
    getStatValue(detail, "special-attack", 50)
  );

  const defenseStat = Math.max(
    getStatValue(detail, "defense", 50),
    getStatValue(detail, "special-defense", 50)
  );

  const speedStat = getStatValue(detail, "speed", 50);
  const moves =
    detail.moves
      ?.slice(0, 6)
      .map((entry) => entry.move?.name?.replace(/-/g, " ") ?? "")
      .filter(Boolean) ?? [];

  return {
    id: detail.id,
    name: slot.name,
    image: slot.image,
    hp: Math.max(80, hpStat * 4),
    attack: attackStat,
    defense: defenseStat,
    speed: speedStat,
    moves: moves.length > 0 ? moves : ["tackle"],
  };
};

const simulatePokemonBattle = ({ challenger, opponent }) => {
  const battleLog = [];
  const firstMover =
    challenger.speed === opponent.speed
      ? Math.random() < 0.5
        ? challenger
        : opponent
      : challenger.speed > opponent.speed
      ? challenger
      : opponent;
  const secondMover = firstMover === challenger ? opponent : challenger;
  battleLog.push(
    `${firstMover.name} strikes first thanks to their speed advantage.`
  );
  const participants = [
    {
      ...firstMover,
      role: firstMover === challenger ? "challenger" : "opponent",
    },
    {
      ...secondMover,
      role: secondMover === challenger ? "challenger" : "opponent",
    },
  ];
  let attackerIndex = 0;
  let defenderIndex = 1;
  let winningMove = "";
  for (let turn = 1; turn <= 20; turn += 1) {
    const attacker = participants[attackerIndex];
    const defender = participants[defenderIndex];
    const move =
      attacker.moves[Math.floor(Math.random() * attacker.moves.length)];
    const dodgeChance = Math.min(
      0.35,
      0.12 + Math.max(0, (defender.speed - attacker.speed) / 900)
    );
    const dodged = Math.random() < dodgeChance;
    battleLog.push(`${attacker.name} uses ${move}!`);
    if (dodged) {
      battleLog.push(`${defender.name} deftly dodges the attack!`);
    } else {
      const baseDamage =
        attacker.attack * (0.65 + Math.random() * 0.45) -
        defender.defense * 0.3;
      let damage = Math.max(10, Math.round(baseDamage + Math.random() * 20));
      const critical = Math.random() < 0.1;
      if (critical) {
        damage = Math.round(damage * 1.5);
        battleLog.push("Critical hit!");
      }
      defender.hp = Math.max(0, defender.hp - damage);
      winningMove = move;
      battleLog.push(
        `${move} hits for ${damage} damage. ${defender.name} has ${defender.hp} HP remaining.`
      );
      if (defender.hp === 0) {
        battleLog.push(`${defender.name} collapses and can no longer fight!`);
        const victor =
          attacker.role === "challenger" ? challenger.name : opponent.name;
        const defeated =
          defender.role === "challenger" ? challenger.name : opponent.name;
        return {
          log: battleLog,
          outcome: {
            outcome: "win",
            name: victor,
            summary: `${victor} overpowers ${defeated} with ${winningMove}!`,
          },
        };
      }
    }
    [attackerIndex, defenderIndex] = [defenderIndex, attackerIndex];
  }
  if (participants[0].hp === participants[1].hp) {
    battleLog.push(
      "After an exhausting clash, neither Pokémon can secure the win."
    );
    return {
      log: battleLog,
      outcome: {
        outcome: "draw",
        name: "Stalemate",
        summary:
          "Both Pokémon withstand every assault and the match ends in a draw.",
      },
    };
  }
  const winnerParticipant =
    participants[0].hp > participants[1].hp ? participants[0] : participants[1];
  const loserParticipant =
    winnerParticipant === participants[0] ? participants[1] : participants[0];
  battleLog.push(
    `${winnerParticipant.name} still stands while ${loserParticipant.name} is too exhausted to continue.`
  );
  return {
    log: battleLog,
    outcome: {
      outcome: "win",
      name:
        winnerParticipant.role === "challenger"
          ? challenger.name
          : opponent.name,
      summary: `${winnerParticipant.name} emerges victorious after a fierce exchange!`,
    },
  };
};
export default function BattlePokemon() {
  const slots = useBattlePokemonSlots();
  const { setSlot, swapSlots, resetSlots, clearSlot } =
    useBattlePokemonActions();
  const challengerDetail = usePokemonDetail(slots.challenger?.id, {
    enabled: Boolean(slots.challenger?.id),
  });
  const opponentDetail = usePokemonDetail(slots.opponent?.id, {
    enabled: Boolean(slots.opponent?.id),
  });
  const [battlePhase, setBattlePhase] = useState("idle");
  const [countdown, setCountdown] = useState(3);
  const [battleLog, setBattleLog] = useState([]);
  const [winner, setWinner] = useState(null);
  const [battleError, setBattleError] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const countdownTimerRef = useRef(null);
  const battleTimerRef = useRef(null);
  const resetTimers = useCallback(() => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (battleTimerRef.current) {
      clearTimeout(battleTimerRef.current);
      battleTimerRef.current = null;
    }
  }, []);
  useEffect(
    () => () => {
      resetTimers();
    },
    [resetTimers]
  );
  const startBattle = useCallback(() => {
    if (!slots.challenger || !slots.opponent) {
      setBattleError("Select both a challenger and an opponent to battle.");
      return;
    }
    if (
      challengerDetail.status === "loading" ||
      opponentDetail.status === "loading"
    ) {
      setBattleError("Please wait for both Pokemon details to finish loading.");
      return;
    }
    if (!challengerDetail.detail || !opponentDetail.detail) {
      setBattleError(
        "Unable to start battle. Try re-opening each Pokemon detail."
      );
      return;
    }
    setBattleError(null);
    setWinner(null);
    setBattleLog([
      "Battle preparations complete. Trainers take their positions.",
    ]);
    setBattlePhase("countdown");
    setCountdown(3);
    resetTimers();
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
          }
          setBattlePhase("engaged");
          setBattleLog((log) => [...log, "The battle bell rings!"]);
          battleTimerRef.current = setTimeout(() => {
            const challengerParticipant = prepareParticipant(
              slots.challenger,
              challengerDetail.detail
            );
            const opponentParticipant = prepareParticipant(
              slots.opponent,
              opponentDetail.detail
            );
            const { log: simulationLog, outcome } = simulatePokemonBattle({
              challenger: challengerParticipant,
              opponent: opponentParticipant,
            });
            setBattleLog((log) => [...log, ...simulationLog]);
            setWinner(outcome);
            setBattlePhase("completed");
          }, 1700);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [
    challengerDetail.detail,
    challengerDetail.status,
    opponentDetail.detail,
    opponentDetail.status,
    resetTimers,
    slots.challenger,
    slots.opponent,
  ]);
  const resetBattle = useCallback(() => {
    resetTimers();
    setBattlePhase("idle");
    setBattleLog([]);
    setWinner(null);
    setCountdown(3);
    setBattleError(null);
  }, [resetTimers]);
  useEffect(() => {
    if (!slots.challenger && !slots.opponent) {
      resetBattle();
    }
  }, [resetBattle, slots.challenger, slots.opponent]);
  const handleAssign = useCallback(
    (slot, pokemon) => {
      setSlot(slot, pokemon);
    },
    [setSlot]
  );
  const selectedIds = useMemo(
    () => ({
      challengerId: slots.challenger?.id ?? null,
      opponentId: slots.opponent?.id ?? null,
    }),
    [slots.challenger, slots.opponent]
  );
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
  return (
    <div className="relative min-h-screen pb-32">
      <div className="mx-auto flex w-full flex-col gap-1 space-y-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-zinc-100">
              Pokédex Battle Arena
            </h1>
            <p className="text-sm text-zinc-400">
              Assign two Pokemon, watch the cinematic battle, and celebrate the
              winner.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={swapSlots}
              disabled={!slots.challenger || !slots.opponent}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/70 disabled:cursor-not-allowed disabled:border-zinc-800 disabled:text-zinc-600"
            >
              Swap opponents
            </button>
            <button
              type="button"
              onClick={resetSlots}
              className="rounded-full border border-rose-500/60 px-4 py-2 text-sm font-medium text-rose-200 transition hover:bg-rose-600/20"
            >
              Reset slots
            </button>
            <button
              type="button"
              onClick={resetBattle}
              className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/80"
            >
              Reset battle
            </button>
          </div>
        </header>
        <PokemonSearchBar
          onResult={handleSearchResult}
          onClear={handleSearchClear}
          onError={handleSearchError}
          className="sm:max-w-lg"
          placeholder="Search Pokémon to assign into battle…"
        />
        {searchError ? (
          <p className="rounded-md border border-rose-600/60 bg-rose-900/30 px-3 py-2 text-sm text-rose-100">
            {searchError}
          </p>
        ) : null}
        {searchResult ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-5 shadow-lg backdrop-blur">
            <div className="flex flex-col gap-2 text-sm text-zinc-300 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Search result:{" "}
                <span className="font-semibold capitalize text-zinc-100">
                  {searchResult.name}
                </span>{" "}
                (#{String(searchResult.id).padStart(3, "0")})
              </span>
              <span className="text-xs uppercase tracking-wide text-zinc-500">
                Assign this Pokémon to a battle slot
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAssign("challenger", searchResult)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/80 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
              >
                Set as Challenger
              </button>
              <button
                type="button"
                onClick={() => handleAssign("opponent", searchResult)}
                className="inline-flex items-center gap-2 rounded-full bg-sky-500/80 px-4 py-2 text-sm font-semibold text-sky-950 transition hover:bg-sky-400"
              >
                Set as Opponent
              </button>
              <button
                type="button"
                onClick={handleSearchClear}
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800/60"
              >
                Clear
              </button>
            </div>
          </div>
        ) : null}
        {battleError ? (
          <div className="rounded-xl border border-rose-500/40 bg-rose-900/30 px-4 py-3 text-sm text-rose-100">
            {battleError}
          </div>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2">
              <BattleSlot
                label="Challenger"
                pokemon={slots.challenger}
                detailState={challengerDetail}
                onClear={() => clearSlot("challenger")}
                highlight={
                  winner?.outcome === "win" &&
                  winner?.name === slots.challenger?.name
                }
              />
              <BattleSlot
                label="Opponent"
                pokemon={slots.opponent}
                detailState={opponentDetail}
                onClear={() => clearSlot("opponent")}
                highlight={
                  winner?.outcome === "win" &&
                  winner?.name === slots.opponent?.name
                }
              />
            </div>
            <div className="flex flex-col gap-4 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 p-6 shadow-lg backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-zinc-100">
                  <Flame className="h-5 w-5 text-emerald-400" />
                  <span className="text-lg font-semibold">Battle Control</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={startBattle}
                    disabled={
                      battlePhase === "countdown" || battlePhase === "engaged"
                    }
                    className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-emerald-500/40 disabled:text-emerald-800/80"
                  >
                    Start Battle
                  </button>
                  <button
                    type="button"
                    onClick={resetBattle}
                    className="rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-800/60"
                  >
                    Clear Result
                  </button>
                </div>
              </div>
              <BattlePhaseDisplay
                phase={battlePhase}
                countdown={countdown}
                log={battleLog}
                winner={winner}
                challengerPokemon={slots.challenger}
                opponentPokemon={slots.opponent}
              />
            </div>
          </div>
          <PokemonRoster selected={selectedIds} onAssign={handleAssign} />
        </div>
      </div>
      <AppleStyleDock />
    </div>
  );
}
