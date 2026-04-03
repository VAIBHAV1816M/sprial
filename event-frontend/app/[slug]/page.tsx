import { redirect } from "next/navigation";

const routes: Record<string, string> = {
  "startbeyondlogic": "/phase2",
  "fire-777": "/phase3",
};

// 1. Make the function async
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Await the params to get the slug
  const { slug } = await params;
  const lowerSlug = slug?.toLowerCase();

  if (!lowerSlug) {
    return <h1>Invalid request</h1>;
  }

  const target = routes[lowerSlug];

  // 3. Keep redirect OUTSIDE of try/catch
  if (target) {
    redirect(target);
  }

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>❌ Invalid name</h1>
    </div>
  );
}
