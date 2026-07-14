import type { Metadata } from "next";
import { RegistrationFlow } from "@/components/registration/RegistrationFlow";

type RegisterPageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const titleSlug = params.slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return {
    title: `Register · ${titleSlug}`,
    description:
      "Complete payment and submit your PBA Royal Ambassadors program registration.",
    robots: { index: false, follow: false },
  };
}

export default function RegisterPage({ params }: RegisterPageProps) {
  return <RegistrationFlow slug={params.slug} />;
}
