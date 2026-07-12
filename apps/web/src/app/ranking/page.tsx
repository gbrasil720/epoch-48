import { RankingTable } from "@/components/ranking-table";
import { trpcServer } from "@/utils/trpc";

export const dynamic = "force-dynamic";

export const metadata = {
	title: "Rankings | Epoch",
	description: "Football nation rankings powered by the Epoch scoring system",
};

export default async function RankingPage({
	searchParams,
}: {
	searchParams?: Promise<{ epoch?: string }>;
}) {
	const epochs = await trpcServer.ranking.listEpochs.query();

	// Validate epoch param: clamp to available range
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
		<div className="container mx-auto py-6">
			<h1 className="mb-6 font-bold text-2xl">Epoch Rankings</h1>
			<RankingTable epochs={epochs} initialEpoch={initialEpoch} />
		</div>
	);
}
