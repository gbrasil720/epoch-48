"use client";

import { type QualifierStats, qIndex } from "@epoch-48/epoch-engine";
import React, { useId, useMemo, useState } from "react";

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

export default function QPlayground() {
	const [pointsEarned, setPointsEarned] = useState(18);
	const [maxPossiblePoints, setMaxPossiblePoints] = useState(30);
	const [goalsDiff, setGoalsDiff] = useState(5);
	const [matchesPlayed, setMatchesPlayed] = useState(10);

	const stats: QualifierStats = useMemo(
		() => ({ pointsEarned, maxPossiblePoints, goalsDiff, matchesPlayed }),
		[pointsEarned, maxPossiblePoints, goalsDiff, matchesPlayed],
	);

	const q = useMemo(() => qIndex(stats), [stats]);

	return (
		<div className="rounded-lg border bg-card p-4">
			<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				<Field label="Points Earned">
					<input
						type="number"
						value={pointsEarned}
						onChange={(e) => setPointsEarned(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
				<Field label="Max Possible">
					<input
						type="number"
						value={maxPossiblePoints}
						onChange={(e) => setMaxPossiblePoints(Number(e.target.value))}
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
				<Field label="Matches Played">
					<input
						type="number"
						value={matchesPlayed}
						onChange={(e) => setMatchesPlayed(Number(e.target.value))}
						className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
					/>
				</Field>
			</div>

			<div className="mt-4 rounded-md bg-muted/50 p-3 text-center">
				<p className="text-muted-foreground text-xs">Q-Index</p>
				<p className="font-bold font-mono text-2xl">{q.toFixed(2)}</p>
			</div>
		</div>
	);
}
