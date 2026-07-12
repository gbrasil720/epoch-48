import { Button } from "@epoch-48/ui/components/button";
import Link from "next/link";
import RankingPreview from "@/components/ranking-preview";

export default function Home() {
	return (
		<main className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-4">
			<div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
				<div className="flex flex-col gap-2">
					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
						Epoch 48
					</h1>
					<p className="text-muted-foreground text-xl">
						The Absolute Global Football Hierarchy
					</p>
					<p className="max-w-lg text-muted-foreground">
						A data-driven ranking system based on World Cup performance. No
						friendlies, no Elo manipulation — just the results that matter.
					</p>
				</div>

				<div className="flex gap-4">
					<Link href="/ranking">
						<Button size="lg" className="bg-accent-green text-accent-green-foreground hover:bg-accent-green/90">
							View Rankings
						</Button>
					</Link>
					<Link href="/methodology">
						<Button variant="outline" size="lg">
							Methodology
						</Button>
					</Link>
				</div>

				<div className="w-full max-w-md">
					<RankingPreview />
				</div>
			</div>
		</main>
	);
}