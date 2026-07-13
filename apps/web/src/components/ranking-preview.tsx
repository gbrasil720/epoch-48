"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Flag } from "./flag";

export function RankingPreview() {
	const { data: top5, isLoading } = useQuery(
		trpc.ranking.getTop.queryOptions({ limit: 5 }),
	);

	if (isLoading || !top5) {
		return (
			<div className="space-y-3 p-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="flex items-center gap-3 rounded-lg p-3">
						<div className="h-5 w-8 animate-pulse rounded bg-muted/60" />
						<div className="h-5 w-5 animate-pulse rounded bg-muted/60" />
						<div className="h-5 flex-1 animate-pulse rounded bg-muted/60" />
						<div className="h-5 w-16 animate-pulse rounded bg-muted/60" />
					</div>
				))}
			</div>
		);
	}

	return (
		<Table>
			<TableHeader>
				<TableRow className="hover:bg-transparent">
					<TableHead className="w-12">#</TableHead>
					<TableHead className="w-10" />
					<TableHead>Nation</TableHead>
					<TableHead className="text-right">Score</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{top5.map((entry, index) => (
					<TableRow
						key={entry.nation.code}
						className={index === 0 ? "bg-champion-gold-muted/30" : ""}
					>
						<TableCell className="font-bold font-mono text-sm">
							<span
								className={
									index === 0 ? "text-champion-gold" : "text-muted-foreground"
								}
							>
								{entry.rank}
							</span>
						</TableCell>
						<TableCell>
							<Flag
								code={entry.nation.code}
								emoji={entry.nation.flag ?? undefined}
								size="sm"
							/>
						</TableCell>
						<TableCell className="font-medium">{entry.nation.name}</TableCell>
						<TableCell className="text-right font-mono font-semibold tabular-nums">
							{entry.score.toFixed(2)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
