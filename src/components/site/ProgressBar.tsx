export function ProgressBar({ value, label, className = '' }: { value: number; label: string; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-subtle ${className}`}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ${pct === 100 ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-accent'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
