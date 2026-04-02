import { redirect } from "next/navigation";

const routes: Record<string, string> = {
  "shadow-x": "/phase2",
  "fire-777": "/phase3",
};

export default function Page({ params }: { params: { slug: string } }) {
  const slug = params?.slug?.toLowerCase();
  let target = null;

  try {
    if (!slug) return <h1>Invalid request</h1>;
    target = routes[slug];
  } catch (error) {
    return <h1>Something went wrong</h1>;
  }

  // Perform redirect OUTSIDE of the try/catch block
  if (target) {
    redirect(target);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>❌ Invalid name</h1>
    </div>
  );
}