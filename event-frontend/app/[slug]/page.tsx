import { redirect } from "next/navigation";

const routes: Record<string, string> = {
  "shadow-x": "/phase2",
  "fire-777": "/phase3",
};

export default function SlugPage({ params }: { params: { slug: string } }) {
  const slug = params.slug.toLowerCase();

  const target = routes[slug];

  if (target) {
    redirect(target);
  }

  return <h1>❌ Invalid name</h1>;
}