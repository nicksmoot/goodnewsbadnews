const filters = ["All Signals", "Good Only", "Warning Only", "Opportunity Only", "Resolved", "Response Requested"];
export function SignalFilters() {
  return <div className="flex flex-wrap gap-2">{filters.map((filter) => <button key={filter} className="border border-rule bg-paper px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] hover:border-ink">{filter}</button>)}</div>;
}
