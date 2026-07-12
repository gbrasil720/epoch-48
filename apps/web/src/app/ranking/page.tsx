import { RankingTable } from "@/components/ranking-table";

export const metadata = {
	title: "Rankings | Epoch 48",
	description: "Football nation rankings powered by the Epoch scoring system",
};

export default function RankingPage() {
	// Hardcoded epoch years for now — will be fetched from API once data is populated
	const epochs = [2022, 2018, 2014];

	return (
		<div className="container mx-auto py-6">
			<h1 className="mb-6 font-bold text-2xl">Epoch Rankings</h1>
			<RankingTable epochs={epochs} />
		</div>
	);
}
