"use client";

import { Badge } from "@epoch-48/ui/components/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@epoch-48/ui/components/dialog";
import DeltaBadge from "./delta-badge";

export interface EpochRow {
	rank: number;
	nation: {
		name: string;
		code: string;
		flag: string | null;
		confederation: string;
	};
	tier: 1 | 2;
	phase: string;
	score: number;
	fifaRank: number | null;
	fifaDelta: number | null;
	previousEpochRank: number | null;
	historicalDelta: number | null;
	stats: {
		matchesPlayed: number;
		pointsGained: number;
		goalsFor: number;
		goalsDiff: number;
		yellowCards: number;
		redCards: number;
		continentalBonus: number | null;
		qualifier: {
			pointsEarned: number;
			maxPossiblePoints: number;
		} | null;
	};
}

interface NationDetailDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	row: EpochRow | null;
}

export function NationDetailDialog({
	open,
	onOpenChange,
	row,
}: NationDetailDialogProps) {
	if (!row) return null;

	const { nation, stats } = row;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<span className="text-2xl">{nation.flag}</span>
						<span>{nation.name}</span>
						<span className="font-normal text-muted-foreground text-sm">
							{nation.code}
						</span>
					</DialogTitle>
				</DialogHeader>

				<div className="flex flex-wrap gap-2 pt-2">
					<Badge variant={row.tier === 1 ? "default" : "secondary"}>
						Tier {row.tier}
					</Badge>
					{row.nation.confederation && (
						<Badge variant="outline">{row.nation.confederation}</Badge>
					)}
					<Badge variant="secondary">{row.phase}</Badge>
				</div>

				<div className="grid grid-cols-2 gap-4 py-4">
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs">Rank</p>
						<p className="font-bold text-lg">#{row.rank}</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs">
							{row.tier === 1 ? "Epoch Score" : "Q-Index"}
						</p>
						<p className="font-bold text-lg tabular-nums">
							{row.score.toFixed(row.tier === 1 ? 4 : 2)}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs">FIFA Rank</p>
						<p className="font-bold text-lg tabular-nums">
							{row.fifaRank ?? "—"}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs">FIFA Delta</p>
						<DeltaBadge value={row.fifaDelta ?? 0}>FIFA − Epoch</DeltaBadge>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs">Previous Rank</p>
						<p className="font-bold text-lg tabular-nums">
							{row.previousEpochRank ?? "—"}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs">Historical Delta</p>
						<DeltaBadge value={row.historicalDelta ?? 0}>
							Prev − Current
						</DeltaBadge>
					</div>
				</div>

				<div className="border-border/50 border-t pt-4">
					<h4 className="mb-2 font-medium text-sm">Match Stats</h4>
					<div className="grid grid-cols-3 gap-3 text-sm">
						<div>
							<p className="text-muted-foreground text-xs">Matches</p>
							<p className="font-medium tabular-nums">{stats.matchesPlayed}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Points</p>
							<p className="font-medium tabular-nums">{stats.pointsGained}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Goals For</p>
							<p className="font-medium tabular-nums">{stats.goalsFor}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Goal Diff</p>
							<p className="font-medium tabular-nums">{stats.goalsDiff}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Yellow Cards</p>
							<p className="font-medium tabular-nums">{stats.yellowCards}</p>
						</div>
						<div>
							<p className="text-muted-foreground text-xs">Red Cards</p>
							<p className="font-medium tabular-nums">{stats.redCards}</p>
						</div>
					</div>
				</div>

				{stats.continentalBonus !== null && stats.continentalBonus !== 0 && (
					<div className="border-border/50 border-t pt-4">
						<h4 className="mb-1 font-medium text-sm">Continental Bonus</h4>
						<p className="text-sm tabular-nums">
							{stats.continentalBonus.toFixed(2)}
						</p>
					</div>
				)}

				{stats.qualifier && (
					<div className="border-border/50 border-t pt-4">
						<h4 className="mb-1 font-medium text-sm">Qualifier Progress</h4>
						<p className="text-sm tabular-nums">
							{stats.qualifier.pointsEarned} /{" "}
							{stats.qualifier.maxPossiblePoints} pts
						</p>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
