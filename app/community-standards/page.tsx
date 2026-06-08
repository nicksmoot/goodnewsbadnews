const never = ["Doxxing", "Minor names", "Private medical information", "Unverified allegations", "Threats", "Harassment"];
export default function CommunityStandardsPage() {
  return <div className="civic-container max-w-5xl py-12"><p className="kicker">Moderation Rules</p><h1 className="mt-3 font-serif text-6xl font-black">Community Standards</h1><p className="mt-6 text-xl leading-8 text-ink/75">The platform follows Signal → Verification → Pattern → Response Requested → Community Action → Resolution.</p><div className="mt-8 grid gap-4 md:grid-cols-3">{never.map((item) => <div key={item} className="border border-warning bg-warning/5 p-5"><p className="font-serif text-2xl font-black text-warning">Never allow</p><p className="mt-2 font-bold">{item}</p></div>)}</div></div>;
}
