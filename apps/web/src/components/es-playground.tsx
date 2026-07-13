"use client";

import { Badge } from "@epoch-48/ui/components/badge";
import { Button } from "@epoch-48/ui/components/button";
import { Input } from "@epoch-48/ui/components/input";
import { Label } from "@epoch-48/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@epoch-48/ui/components/select";
import { motion } from "framer-motion";
import { Calculator, RotateLeft2 } from "reicon-react";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const phases = [
	{ label: "Winner", value: "100" },
	{ label: "Runner-up", value: "95" },
	{ label: "3rd Place", value: "90" },
	{ label: "4th Place", value: "85" },
	{ label: "Quarter-final", value: "75" },
	{ label: "Round of 16", value: "60" },
	{ label: "Group Stage", value: "25" },
];

export function ESPlayground() {
	const reducedMotion = useReducedMotion();
	const [phase, setPhase] = useState("100");
	const [pointsPerMatch, setPointsPerMatch] = useState("2.0");
	const [goalDiff, setGoalDiff] = useState("10");
	const [goalsScored, setGoalsScored] = useState("15");
	const [fairPlay, setFairPlay] = useState("0");
	const [continentalBonus, setContinentalBonus] = useState("5");

	const pf = Number(phase);
	const ppm = Number(pointsPerMatch);
	const gd = Number(goalDiff);
	const gs = Number(goalsScored);
	const fp = Number(fairPlay);
	const bc = Number(continentalBonus);

	const pd = ppm * 10 + gd * 0.5 + gs * 0.1 - fp * 0.1;
	const es = pf + (pd + bc) / 100;

	const reset = () => {
		setPhase("100");
		setPointsPerMatch("2.0");
		setGoalDiff("10");
		setGoalsScored("15");
		setFairPlay("0");
		setContinentalBonus("5");
	};

	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Tournament Phase
					</Label>
					<Select value={phase} onValueChange={(v) => setPhase(v ?? "100")}>
						<SelectTrigger data-cuelume-press="press" data-cuelume-release="release">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{phases.map((p) => (
								<SelectItem key={p.value} value={p.value}>
									{p.label} ({p.value})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Continental Bonus
					</Label>
					<Input
						type="number"
						value={continentalBonus}
						onChange={(e) => setContinentalBonus(e.target.value)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Points Per Match
					</Label>
					<Input
						type="number"
						step="0.1"
						value={pointsPerMatch}
						onChange={(e) => setPointsPerMatch(e.target.value)}
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
						Goals Scored
					</Label>
					<Input
						type="number"
						value={goalsScored}
						onChange={(e) => setGoalsScored(e.target.value)}
					/>
				</div>

				<div className="space-y-1.5">
					<Label className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Fair Play Deduction
					</Label>
					<Input
						type="number"
						value={fairPlay}
						onChange={(e) => setFairPlay(e.target.value)}
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
					key={es.toFixed(2)}
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
							Epoch Score
						</div>
						<div className="font-bold font-mono text-brand text-xl tabular-nums">
							{es.toFixed(2)}
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
