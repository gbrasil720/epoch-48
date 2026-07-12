"use client";

import {
	type Cards,
	continentalBonus,
	epochScore,
	PHASE_WEIGHTS,
	performancePoints,
	type TournamentPhase,
	TournamentPhaseName,
} from "@epoch-48/epoch-engine";
import React, { useId, useMemo, useState } from "react";

const PHASE_OPTIONS = Object.entries(PHASE_WEIGHTS).map(([key, weight]) => ({
	value: key as TournamentPhaseName,
	label: `${key} (${weight})`,
}));

function Field({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	const id = useId();
	return (
		<div>
			<label htmlFor={id} className="mb-1 block font-medium text-sm">
				{label}
			</label>
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					return React.cloneElement(
						child as React.ReactElement<{ id?: string }>,
						{
							id,
						},
					);
				}
				return child;
			})}
		</div>
	);
}

export default function ESPlayground() {
	const [phase, setPhase] = useState(TournamentPhaseName.GROUP_STAGE);
	const [pointsGained, setPointsGained] = useState(15);
	const [gamesPlayed, setGamesPlayed] = useState(7);
	const [goalsDiff, setGoalsDiff] = useState(5);
	const [goalsFor, setGoalsFor] = useState(10);
	const [yellowCards, setYellowCards] = useState(3);
	const [redCards, setRedCards] = useState(0);
	const [cFactor, setCFactor] = useState(0.0);

	const tournamentPhase: TournamentPhase = {
		name: phase,
	};

	const cards: Cards[] = useMemo(() => {
		const arr: Cards[] = [];
		if (yellowCards > 0) arr.push({ color: "yellow", count: yellowCards });
		if (redCards > 0) arr.push({ color: "red", count: redCards });
		return arr;
	}, [yellowCards, redCards]);

	const baseProps = {
		tournamentPhase,
		pointsGained,
		gamesPlayed,
		goalsDiff,
		goalsFor,
		cardsReceived: cards.length > 0 ? cards : null,
	};

	const pp = useMemo(() => performancePoints(baseProps), [baseProps]);

	const cb = useMemo(
		() => continentalBonus(baseProps, cFactor),
		[baseProps, cFactor],
	);

	const es = useMemo(
		() => epochScore(baseProps, cb),
		[baseProps, cb],
	);

	return (
		<div className="rounded-lg border bg-card p-4">
			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
				<Field label="Phase">
					<select
						value={phase}
						onChange={(e) => setPhase(e.target.value as TournamentPhaseName)}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					>
						{PHASE_OPTIONS.map((opt) => (
							<option key={opt.value} value={opt.value}>
								{opt.label}
							</option>
						))}
					</select>
				</Field>
				<Field label="Points Gained">
					<input
						type="number"
						value={pointsGained}
						onChange={(e) => setPointsGained(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Games Played">
					<input
						type="number"
						value={gamesPlayed}
						onChange={(e) => setGamesPlayed(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Goal Difference">
					<input
						type="number"
						value={goalsDiff}
						onChange={(e) => setGoalsDiff(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Goals Scored">
					<input
						type="number"
						value={goalsFor}
						onChange={(e) => setGoalsFor(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Yellow Cards">
					<input
						type="number"
						value={yellowCards}
						onChange={(e) => setYellowCards(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Red Cards">
					<input
						type="number"
						value={redCards}
						onChange={(e) => setRedCards(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Continental Bonus Factor">
					<input
						type="number"
						step="0.01"
						value={cFactor}
						onChange={(e) => setCFactor(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
			</div>

			<div className="mt-4 rounded-md bg-muted/50 p-3">
				<div className="grid grid-cols-3 gap-4 text-center">
					<div>
						<p className="text-muted-foreground text-xs">Performance Pts</p>
						<p className="font-bold font-mono text-lg">{pp.toFixed(2)}</p>
					</div>
					<div>
						<p className="text-muted-foreground text-xs">Cont. Bonus</p>
						<p className="font-bold font-mono text-lg">{cb.toFixed(2)}</p>
					</div>
					<div>
						<p className="text-muted-foreground text-xs">Epoch Score</p>
						<p className="font-bold font-mono text-lg">{es.toFixed(4)}</p>
					</div>
				</div>
			</div>
		</div>
	);
}
