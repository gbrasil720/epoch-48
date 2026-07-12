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
import Link from "next/link";
import Flag from "@/components/flag";
import { trpc } from "@/utils/trpc";

export default function RankingPreview() {
	const { data, isLoading } = useQuery(
		trpc.ranking.getTop.queryOptions({ limit: 5 }),
	);

	if (isLoading || !data?.length) {
		return (
			<div className="rounded-lg border bg-card p-6 text-center">
				<p className="text-muted-foreground text-sm">
					{isLoading ? "Loading..." : "No ranking data available yet."}
				</p>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-lg border bg-card">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
							#
						</TableHead>
						<TableHead className="font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
							Nation
						</TableHead>
						<TableHead className="text-right font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
							Score
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow
							key={row.nation.code}
							className={
								row.rank === 1
									? "border-l-3 border-l-champion-gold bg-champion-gold-muted/20"
									: ""
							}
						>
							<TableCell
								className={`font-bold tabular-nums ${
									row.rank === 1 ? "font-black text-champion-gold" : ""
								}`}
							>
								{String(row.rank).padStart(2, "0")}
							</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Flag
										code={row.nation.code}
										emoji={row.nation.flag ?? undefined}
										size="md"
									/>
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
					className="font-medium text-accent-green text-sm hover:underline"
				>
					View full rankings →
				</Link>
			</div>
		</div>
	);
}
