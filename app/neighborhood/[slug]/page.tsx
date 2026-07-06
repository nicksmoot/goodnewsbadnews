import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Feed from "@/components/Feed";
import { hoodFromSlug, allHoodSlugs } from "@/lib/slug";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return allHoodSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const hood = hoodFromSlug(params.slug);
  if (!hood) return { title: "Neighborhood" };
  return {
    title: `${hood} signals`,
    description: `What residents are reporting in ${hood} — the good, the bad, and the complicated, on ${SITE.name}.`,
    alternates: { canonical: `/neighborhood/${params.slug}` },
  };
}

export default function NeighborhoodPage({ params }: { params: { slug: string } }) {
  const hood = hoodFromSlug(params.slug);
  if (!hood) notFound();
  return (
    <Feed
      routeCat={null}
      fixedHood={hood}
      heading={{
        kicker: `Neighborhood · ${hood}`,
        title: `What ${hood} is seeing.`,
        desc: `Signals residents have reported in ${hood} — reviewed before publication and labeled with verification status.`,
      }}
    />
  );
}
