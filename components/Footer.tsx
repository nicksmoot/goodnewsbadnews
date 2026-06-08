import Link from "next/link";

const links = [
  ["Terms", "/terms"],
  ["Privacy", "/privacy"],
  ["Community Standards", "/community-standards"],
  ["Corrections", "/corrections"],
  ["Right of Reply", "/right-of-reply"]
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-ink bg-ink text-paper">
      <div className="civic-container grid gap-8 py-10 md:grid-cols-[1.5fr_1fr]">
        <div>
          <p className="font-serif text-3xl font-black">Good News Bad News</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-paper/75">
            We do not publish rumors. We publish verified community signals that help a city see itself clearly and act faster.
          </p>
        </div>
        <nav className="grid gap-2 text-sm uppercase tracking-[0.14em] text-paper/80">
          {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-white">{label}</Link>)}
        </nav>
      </div>
    </footer>
  );
}
