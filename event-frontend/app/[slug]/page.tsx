import { redirect } from "next/navigation";

const routes: Record<string, string> = {
  "shadow-x": "/phase2",
  "fire-777": "/phase3",
};

export default function Page({ params }: any) {
  try {
    const slug = params?.slug?.toLowerCase();

    if (!slug) {
      return <h1>Invalid request</h1>;
    }

    const target = routes[slug];

    if (target) {
      redirect(target);
    }

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>❌ Invalid name</h1>
      </div>
    );
  } catch (error) {
    return <h1>Something went wrong</h1>;
  }
}