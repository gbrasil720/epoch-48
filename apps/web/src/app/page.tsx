import { Badge } from "@epoch-48/ui/components/badge";
import { Button } from "@epoch-48/ui/components/button";
import Link from "next/link";
import RankingPreview from "@/components/ranking-preview";

export const dynamic = "force-dynamic";

export default function Home() {
	return (
		<main className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-4">
			<div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
				<div className="flex flex-col gap-4">
					<Badge
						variant="outline"
						className="mx-auto w-fit border-accent-green/30 font-mono text-accent-green"
					>
						Epoch 2022
					</Badge>
					<h1 className="font-black font-heading text-5xl text-foreground uppercase tracking-tight sm:text-7xl">
						Epoch <span className="text-accent-green">48</span>
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
						<Button
							size="lg"
							className="bg-accent-green text-accent-green-foreground hover:bg-accent-green/90"
						>
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
