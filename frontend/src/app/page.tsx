import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LandingHero } from "@/components/marketing/landing-hero";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const signedIn = (await cookies()).has("aps_access_token");
  if (signedIn && !params.bye && !params.deleted) redirect("/dashboard");

  return (
    <main>
      <LandingHero />
    </main>
  );
}
