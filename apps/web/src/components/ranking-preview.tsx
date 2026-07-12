import { trpcServer } from "@/utils/trpc";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import Link from "next/link";

export default async function RankingPreview() {
	const data = await trpcServer.ranking.getTop.query({ limit: 5 });

	if (!data.length) {
		return (
			<div className="rounded-lg border bg-card p-6 text-center">
				<p className="text-muted-foreground text-sm">No ranking data available yet.</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">#</TableHead>
						<TableHead>Nation</TableHead>
						<TableHead className="text-right">Score</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.nation.code}>
							<TableCell className="font-bold tabular-nums">
								{row.rank}
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<span className="text-lg">{row.nation.flag}</span>
									<span>{row.nation.name}</span>
								</div>
							</TableCell>
							<TableCell className="text-right tabular-nums">
								{row.score.toFixed(1)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="bg-muted/50 px-4 py-2 text-center">
				<Link
					href="/ranking"
					className="text-accent-green hover:underline text-sm font-medium"
				>
					View full rankings →
				</Link>
			</div>
		</div>
	);
}