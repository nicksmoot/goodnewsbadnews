import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Feed from "@/components/Feed";
import { topicFromSlug, allTopicSlugs } from "@/lib/slug";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return allTopicSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = topicFromSlug(params.slug);
  if (!topic) return { title: "Topic" };
  return {
    title: `${topic} signals`,
    description: `Local ${topic.toLowerCase()} signals from residents across ${SITE.cities} — reviewed and organized on Good News Bad News.`,
    alternates: { canonical: `/topic/${params.slug}` },
  };
}

export default function TopicPage({ params }: { params: { slug: string } }) {
  const topic = topicFromSlug(params.slug);
  if (!topic) notFound();
  return (
    <Feed
      routeCat={null}
      fixedTopic={topic}
      heading={{
        kicker: `Topic · ${topic}`,
        title: `${topic} across the city.`,
        desc: `Every ${topic.toLowerCase()} signal residents have surfaced — wins, concerns, and opportunities, reviewed before publication.`,
      }}
    />
  );
}
