import { FeaturesSection } from "@/components/features-section";
import { HeroSection } from "@/components/hero-section";
import { PreviewSection } from "@/components/preview-section";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Epoch 48",
	description: "A data-driven global football national team ranking system",
};

export default function HomePage() {
	return (
		<main className="min-h-[100dvh]">
			<HeroSection />
			<FeaturesSection />
			<PreviewSection />
		</main>
	);
}
