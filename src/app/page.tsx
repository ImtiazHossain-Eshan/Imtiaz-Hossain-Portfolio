import { Hero } from "@/components/home/hero";
import { SelectedWork } from "@/components/home/selected-work";
import { PlaygroundTeaser } from "@/components/home/playground-teaser";
import { ResearchHighlight } from "@/components/home/research-highlight";
import { GithubPanel } from "@/components/home/github-panel";
import { ContactCta } from "@/components/home/contact-cta";

// Revalidate GitHub data periodically without blocking the static shell.
export const revalidate = 21600;

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <PlaygroundTeaser />
      <ResearchHighlight />
      <GithubPanel />
      <ContactCta />
    </>
  );
}
