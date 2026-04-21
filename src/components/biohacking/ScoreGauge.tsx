import { cn } from "@/lib/utils";

interface Props {
  label: string;
  emoji: string;
  score: number | null;
}

export function ScoreGauge({ label, emoji, score }: Props) {
  const value = score ?? 0;
  const color =
    value >= 70 ? "text-primary stroke-primary" :
    value >= 40 ? "text-amber-500 stroke-amber-500" :
    "text-rose-500 stroke-rose-500";
  const radius = 42;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative h-28 w-28">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={radius} className="fill-none stroke-muted" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            className={cn("fill-none transition-all duration-1000", color)}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{emoji}</span>
          <span className={cn("text-xl font-bold", color)}>{value}</span>
        </div>
      </div>
      <span className="text-sm font-medium text-foreground">{label}</span>
    </div>
  );
}
