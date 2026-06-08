import Link from "next/link";

const navItems = [
  ["Spokane", "/spokane"],
  ["Downtown", "/spokane/downtown"],
  ["Standards", "/community-standards"],
  ["Corrections", "/corrections"]
];

export function Header() {
  return (
    <header className="border-b border-ink bg-paper/95">
      <div className="civic-container py-4">
        <div className="flex items-center justify-between gap-4 border-b border-rule pb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">
          <Link href="/" className="hover:text-ink">Good News Bad News</Link>
          <span>What residents are seeing.</span>
        </div>
        <div className="flex flex-col gap-4 py-5 lg:flex-row lg:items-end lg:justify-between">
          <Link href="/" className="font-serif text-4xl font-black tracking-tight sm:text-6xl">
            Good News Bad News
          </Link>
          <nav aria-label="Primary" className="flex flex-wrap gap-2 text-sm font-bold uppercase tracking-[0.14em]">
            {navItems.map(([label, href]) => (
              <Link key={href} href={href} className="border border-rule px-3 py-2 hover:border-ink hover:bg-ink hover:text-paper">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
