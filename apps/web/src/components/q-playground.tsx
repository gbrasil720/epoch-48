"use client";

import { Button } from "@epoch-48/ui/components/button";
import { Input } from "@epoch-48/ui/components/input";
import { Label } from "@epoch-48/ui/components/label";
import { motion } from "framer-motion";
import { Calculator, RotateLeft2 } from "reicon-react";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function QPlayground() {
	const reducedMotion = useReducedMotion();
	const [pointsEarned, setPointsEarned] = useState("15");
	const [maxPoints, setMaxPoints] = useState("21");
	const [goalDiff, setGoalDiff] = useState("8");
	const [matchesPlayed, setMatchesPlayed] = useState("7");

	const pe = Number(pointsEarned);
	const mp = Number(maxPoints);
	const gd = Number(goalDiff);
	const m = Number(matchesPlayed);

	const qIndex = mp > 0 ? (pe / mp) * 100 + (gd / m) * 0.5 : 0;

	const reset = () => {
		setPointsEarned("15");
		setMaxPoints("21");
		setGoalDiff("8");
		setMatchesPlayed("7");
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Points Earned
					</Label>
					<Input
						type="number"
						value={pointsEarned}
						onChange={(e) => setPointsEarned(e.target.value)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Max Possible Points
					</Label>
					<Input
						type="number"
						value={maxPoints}
						onChange={(e) => setMaxPoints(e.target.value)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Goal Difference
					</Label>
					<Input
						type="number"
						value={goalDiff}
						onChange={(e) => setGoalDiff(e.target.value)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Matches Played
					</Label>
					<Input
						type="number"
						value={matchesPlayed}
						onChange={(e) => setMatchesPlayed(e.target.value)}
					/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<Button
					variant="ghost"
					size="sm"
					onClick={reset}
					className="gap-1.5 font-mono text-muted-foreground text-xs uppercase tracking-widest"
					data-cuelume-press="press"
					data-cuelume-release="release"
				>
					<RotateLeft2 size={14} />
					Reset
				</Button>

				<motion.div
					key={qIndex.toFixed(2)}
					initial={reducedMotion ? undefined : { scale: 0.95, opacity: 0 }}
					animate={reducedMotion ? undefined : { scale: 1, opacity: 1 }}
					transition={{
						duration: 0.2,
						ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
					}}
					className="flex items-center gap-2 border border-brand/20 bg-brand/5 px-4 py-2"
				>
					<Calculator size={16} className="text-brand" />
					<div>
						<div className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
							Q-Index
						</div>
						<div className="font-bold font-mono text-brand text-xl tabular-nums">
							{qIndex.toFixed(2)}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
