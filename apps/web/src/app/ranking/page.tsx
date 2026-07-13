import { RankingTable } from "@/components/ranking-table";
import { trpcServer } from "@/utils/trpc";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Rankings | Epoch 48",
	description: "Football nation rankings powered by the Epoch scoring system",
};

export default async function RankingPage({
	searchParams,
}: {
	searchParams?: Promise<{ epoch?: string }>;
}) {
	const epochs = await trpcServer.ranking.listEpochs.query();

	const resolvedSearchParams = await searchParams;
	const paramEpoch = resolvedSearchParams?.epoch;
	let validatedEpoch: number | undefined;
	if (paramEpoch) {
		const parsed = Number(paramEpoch);
		if (!isNaN(parsed) && epochs.includes(parsed)) {
			validatedEpoch = parsed;
		} else if (epochs.length > 0) {
			validatedEpoch = epochs[0];
		}
	}

	const initialEpoch = validatedEpoch ?? epochs[0] ?? 2022;

	return (
		<main className="min-h-[100dvh]">
			<div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
				<div className="mb-8 flex items-end justify-between">
					<div>
						<div className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
							Standings
						</div>
						<h1 className="mt-1 font-black font-mono text-2xl uppercase tracking-tight sm:text-3xl">
							Rankings
						</h1>
					</div>
				</div>

				<RankingTable epochs={epochs} initialEpoch={initialEpoch} />
			</div>
		</main>
	);
}
