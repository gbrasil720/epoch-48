"use client";

import { Badge } from "@epoch-48/ui/components/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@epoch-48/ui/components/dialog";
import { cn } from "@epoch-48/ui/lib/utils";
import { motion } from "framer-motion";
import { Ban, ChartBar, Shield, Trophy } from "reicon-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import DeltaBadge from "./delta-badge";
import { Flag } from "./flag";

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

function StatItem({
	label,
	value,
	icon: Icon,
}: {
	label: string;
	value: React.ReactNode;
	icon: React.ElementType;
}) {
	return (
		<div className="flex items-center gap-3 border border-border/30 bg-card/50 p-3">
			<div className="flex size-7 shrink-0 items-center justify-center bg-muted/60 text-muted-foreground">
				<Icon size={14} />
			</div>
			<div>
				<div className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
					{label}
				</div>
				<div className="font-mono font-semibold text-sm tabular-nums">
					{value}
				</div>
			</div>
		</div>
	);
}

export function NationDetailDialog({
	open,
	onOpenChange,
	row,
}: NationDetailDialogProps) {
	const reducedMotion = useReducedMotion();

	if (!row) return null;

	const { nation, stats } = row;
	const isChampion = row.rank === 1;
	const paddedRank = String(row.rank).padStart(2, "0");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<motion.div
					initial={reducedMotion ? undefined : { scale: 0.95, opacity: 0 }}
					animate={reducedMotion ? undefined : { scale: 1, opacity: 1 }}
					transition={
						reducedMotion
							? undefined
							: { type: "spring", stiffness: 300, damping: 25 }
					}
				>
					<DialogHeader>
						<div className="flex items-center gap-3">
							<Flag
								code={nation.code}
								emoji={nation.flag ?? undefined}
								size="lg"
								className="rounded"
							/>
							<div>
								<DialogTitle className="font-bold font-mono text-lg uppercase tracking-tight">
									{nation.name}
									<span className="ml-2 font-normal text-muted-foreground text-sm">
										{nation.code}
									</span>
								</DialogTitle>
							</div>
						</div>
					</DialogHeader>

					{/* Badges */}
					<div className="flex flex-wrap gap-2 pt-2">
						<Badge
							variant={row.tier === 1 ? "default" : "secondary"}
							className={cn(
								"font-mono text-[0.6rem] uppercase tracking-widest",
								row.tier === 1 && "bg-brand/10 text-brand",
							)}
						>
							Tier {row.tier}
						</Badge>
						{nation.confederation && (
							<Badge
								variant="outline"
								className="font-mono text-[0.6rem] uppercase tracking-widest"
							>
								{nation.confederation}
							</Badge>
						)}
						<Badge
							variant="secondary"
							className="font-mono text-[0.6rem] uppercase tracking-widest"
						>
							{row.phase}
						</Badge>
					</div>

					{/* Rank + Score */}
					<div className="mt-4 grid grid-cols-2 gap-3">
						<StatItem
							icon={Trophy}
							label="Rank"
							value={
								<span
									className={cn(
										"tabular-nums",
										isChampion && "text-champion-gold",
									)}
								>
									#{paddedRank}
								</span>
							}
						/>
						<StatItem
							icon={ChartBar}
							label={row.tier === 1 ? "Epoch Score" : "Q-Index"}
							value={row.score.toFixed(row.tier === 1 ? 4 : 2)}
						/>
					</div>

					{/* Deltas */}
					<div className="mt-4 border-border/40 border-t pt-4">
						<div className="mb-3 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
							Comparison
						</div>
						<div className="grid grid-cols-2 gap-3">
							<StatItem
								icon={Shield}
								label="FIFA Rank"
								value={row.fifaRank ?? "—"}
							/>
							<div className="flex items-center gap-3 border border-border/30 bg-card/50 p-3">
								<div className="flex size-7 shrink-0 items-center justify-center bg-muted/60 text-muted-foreground">
									<ChartBar size={14} />
								</div>
								<div>
									<div className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
										FIFA Δ
									</div>
									<DeltaBadge value={row.fifaDelta ?? null}>
										FIFA − Epoch
									</DeltaBadge>
								</div>
							</div>
							<StatItem
								icon={Shield}
								label="Previous Rank"
								value={row.previousEpochRank ?? "—"}
							/>
							<div className="flex items-center gap-3 border border-border/30 bg-card/50 p-3">
								<div className="flex size-7 shrink-0 items-center justify-center bg-muted/60 text-muted-foreground">
									<Ban size={14} />
								</div>
								<div>
									<div className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
										Historical Δ
									</div>
									<DeltaBadge value={row.historicalDelta ?? null}>
										Prev − Current
									</DeltaBadge>
								</div>
							</div>
						</div>
					</div>

					{/* Match Stats */}
					<div className="mt-4 border-border/40 border-t pt-4">
						<div className="mb-3 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
							Match Stats
						</div>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
							<StatItem
								icon={Shield}
								label="Matches"
								value={stats.matchesPlayed}
							/>
							<StatItem
								icon={Trophy}
								label="Points"
								value={stats.pointsGained}
							/>
							<StatItem
								icon={Trophy}
								label="Goals For"
								value={stats.goalsFor}
							/>
							<StatItem icon={Ban} label="Goal Diff" value={stats.goalsDiff} />
							<StatItem
								icon={Ban}
								label="Yellow Cards"
								value={stats.yellowCards}
							/>
							<StatItem icon={Ban} label="Red Cards" value={stats.redCards} />
						</div>
					</div>

					{stats.continentalBonus !== null && stats.continentalBonus !== 0 && (
						<div className="mt-4 border-border/40 border-t pt-4">
							<div className="mb-2 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
								Continental Bonus
							</div>
							<p className="font-mono text-sm tabular-nums">
								{stats.continentalBonus.toFixed(2)}
							</p>
						</div>
					)}

					{stats.qualifier && (
						<div className="mt-4 border-border/40 border-t pt-4">
							<div className="mb-2 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
								Qualifier Progress
							</div>
							<p className="font-mono text-sm tabular-nums">
								{stats.qualifier.pointsEarned} /{" "}
								{stats.qualifier.maxPossiblePoints} pts
							</p>
						</div>
					)}
				</motion.div>
			</DialogContent>
		</Dialog>
	);
}
