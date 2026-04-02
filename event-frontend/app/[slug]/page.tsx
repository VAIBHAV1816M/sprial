import { redirect } from "next/navigation";

type Props = {
  params?: {
    slug?: string;
  };
};

const routes: Record<string, string> = {
  "shadow-x": "/phase2",
  "fire-777": "/phase3",
};

export default function SlugPage({ params }: Props) {
  const slug = params?.slug?.toLowerCase();

  if (!slug) {
    return <h1>Loading...</h1>;
  }

  const target = routes[slug];

  if (target) {
    redirect(target);
  }

  return <h1>❌ Invalid name</h1>;
}