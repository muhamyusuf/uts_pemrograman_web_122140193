import { Link } from "react-router";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[oklch(0.14_0_286)] px-6 py-16 text-center text-zinc-100">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-zinc-800/50 bg-[oklch(0.21_0.006_285.885)]/60 px-10 py-12 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center gap-4">
          <SearchX className="h-12 w-12 text-rose-400" />
          <span className="text-sm uppercase tracking-tight text-zinc-500">
            Error 404
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-semibold text-zinc-50">
            Lost in the Pokéverse
          </h1>
          <p className="max-w-lg text-base text-zinc-300">
            The page you’re looking for hasn’t been discovered yet. Return to
            the Pokédex or explore another region to keep your journey going.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pokedex
          </Link>
          <Link
            to="/battle-pokemon"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2 text-sm font-semibold text-zinc-200 transition hover:bg-zinc-800/60"
          >
            Battle Arena
          </Link>
        </div>
      </div>
    </div>
  );
}
