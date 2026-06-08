export function CivicSignalScore({ score }: { score: number }) {
  return (
    <div className="inline-flex items-center gap-2 border border-rule bg-paper px-3 py-2 text-xs font-bold uppercase tracking-[0.16em]">
      <span>Civic Score</span>
      <span className="font-serif text-2xl text-verified">{score}</span>
    </div>
  );
}
