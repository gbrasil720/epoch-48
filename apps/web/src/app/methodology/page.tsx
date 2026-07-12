import "katex/dist/katex.min.css";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@epoch-48/ui/components/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import katex from "katex";

export const metadata = {
	title: "Methodology | Epoch 48",
	description:
		"The mathematical architecture behind the Epoch 48 ranking system",
};

function Formula({ tex }: { tex: string }) {
	return (
		<div className="my-4 overflow-x-auto rounded-lg bg-muted/50 p-4">
			<div
				// eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
				dangerouslySetInnerHTML={{
					__html: katex.renderToString(tex, { displayMode: true }),
				}}
			/>
		</div>
	);
}

function Section({
	title,
	description,
	children,
}: {
	title: string;
	description?: string;
	children: React.ReactNode;
}) {
	return (
		<Card className="mb-6">
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

export default function MethodologyPage() {
	return (
		<main className="container mx-auto px-4 py-6">
			<div className="mb-8">
				<h1 className="font-bold text-2xl tracking-tight">Methodology</h1>
				<p className="mt-2 text-muted-foreground">
					The mathematical architecture behind the Epoch 48 ranking system.
				</p>
			</div>

			{/* Executive Summary */}
			<Section
				title="Executive Summary"
				description="The core problem and Epoch 48 premise"
			>
				<p className="mb-4 text-muted-foreground text-sm leading-relaxed">
					The official FIFA world ranking relies on a customized variant of the
					Elo rating system. While elegant for high-frequency, closed-ecosystem
					environments like chess or eSports, Elo fails critically when applied
					to international football due to two systemic flaws:{" "}
					<strong>extreme match scarcity</strong> and{" "}
					<strong>calendar manipulation ("farming")</strong>.
				</p>
				<p className="mb-4 text-muted-foreground text-sm leading-relaxed">
					National teams play an average of only 10–15 matches per year, a
					sample size mathematically insufficient for an Elo-based probability
					algorithm to converge on a true skill representation. Furthermore,
					member associations can actively exploit the algorithm by scheduling
					low-risk friendly matches against severely weaker opponents to inflate
					their point totals while avoiding high-risk encounters.
				</p>
				<p className="text-muted-foreground text-sm leading-relaxed">
					<strong>Epoch 48</strong> operates on an unassailable premise:{" "}
					<strong>
						The FIFA World Cup is the only absolute gauge of global football
						strength.
					</strong>{" "}
					Performance under the absolute pressure of the world&apos;s biggest
					stage dictates historical standing. Friendly matches carry zero
					weight. The global hierarchy is frozen and sustained over fixed 4-year
					cycles, eliminating short-term volatility and artificial point
					inflation.
				</p>
			</Section>

			{/* Two-Tier System */}
			<Section
				title="Two-Tier System"
				description="A segregated ranking ecosystem"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="rounded-lg bg-muted/50 p-4">
						<h4 className="mb-2 font-semibold">Tier 1 — Global Stage</h4>
						<p className="text-muted-foreground text-sm">
							Ranks 1–48. Exclusive to the 48 nations that qualified for the
							World Cup final tournament. Ranked by Epoch Score (ES). Upon
							qualification, a Tier 1 nation is mathematically guaranteed not to
							drop below rank 48 for the duration of that cycle.
						</p>
					</div>
					<div className="rounded-lg bg-muted/50 p-4">
						<h4 className="mb-2 font-semibold">Tier 2 — Qualifiers Tier</h4>
						<p className="text-muted-foreground text-sm">
							Ranks 49–211. All member associations that failed to qualify for
							the final stage. Ranked by Q-Index from their qualification
							campaign. Ensures competitive gamification and developmental
							tracking for emerging nations.
						</p>
					</div>
				</div>
				<p className="mt-4 text-muted-foreground text-sm">
					An impassable logical boundary separates the two tiers, rendered as a
					visual barrier row in the ranking table.
				</p>
			</Section>

			{/* Epoch Concept */}
			<Section
				title="The Epoch Concept"
				description="Fixed 4-year cycles anchored to World Cups"
			>
				<ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm">
					<li>
						<strong>Elite Standings Freeze:</strong> Tier 1 rankings are updated
						exactly <strong>once every four years</strong>, precisely 24 hours
						following the conclusion of the World Cup Final match.
					</li>
					<li>
						<strong>Cycle Stability:</strong> If a nation finishes as World Cup
						Runner-up, it remains the absolute No. 2 team in the world for the
						next four years, entirely independent of subsequent friendly matches
						or regional qualifiers.
					</li>
					<li>
						<strong>Tier 2 Dynamics:</strong> Standings within the Qualifiers
						Tier fluctuate periodically throughout the cycle as continental
						qualifiers progress, serving as a live indicator of qualification
						trajectory.
					</li>
				</ul>
			</Section>

			{/* Epoch Score */}
			<Section
				title="Epoch Score (ES)"
				description="The master formula for Tier 1 rankings"
			>
				<p className="mb-2 text-muted-foreground text-sm">
					Every nation&apos;s performance is translated into a standardized
					metric capped at <strong>100.00</strong>. The final position of any
					elite team is determined by the Epoch Score.
				</p>
				<Formula tex={"ES = P_f + \\frac{P_d}{100}"} />
				<ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
					<li>
						<strong>P_f</strong> — Phase Base Weight: The absolute macro-integer
						designated by the tournament round achieved.
					</li>
					<li>
						<strong>P_d</strong> — Performance Tie-Breaker: The micro-decimal
						component calculated from technical statistics to differentiate
						teams eliminated in the same phase.
					</li>
				</ul>
			</Section>

			{/* Phase Base Weight */}
			<Section
				title="Phase Base Weight (P_f)"
				description="Structural gatekeeper — a later-phase team can never be passed by an earlier-phase team"
			>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Final Tournament Phase Achieved</TableHead>
							<TableHead className="text-right">Base Value (P_f)</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[
							["World Cup Champion (1st)", 100],
							["World Cup Runner-up (2nd)", 95],
							["Third Place Playoff Winner (3rd)", 90],
							["Third Place Playoff Loser (4th)", 85],
							["Quarter-Finals (5th–8th)", 75],
							["Round of 16 (9th–16th)", 60],
							["Round of 32 (17th–32nd)", 40],
							["Group Stage (33rd–48th)", 25],
						].map(([phase, value]) => (
							<TableRow key={phase as string}>
								<TableCell>{phase as string}</TableCell>
								<TableCell className="text-right font-medium font-mono">
									{value as number}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<p className="mt-4 text-muted-foreground text-sm">
					The World Cup Champion automatically receives an absolute ES of
					100.00, rendering fractional calculations unnecessary.
				</p>
			</Section>

			{/* Performance Tie-Breaker */}
			<Section
				title="Performance Tie-Breaker (P_d)"
				description="Cascade tie-breaker for teams eliminated in the same phase"
			>
				<Formula tex={"P_d = (PPM \\times 10) + (GD \\times 2) + GS + FP"} />
				<ul className="mt-4 list-inside list-disc space-y-1 text-muted-foreground text-sm">
					<li>
						<strong>PPM (Points Per Match):</strong> Total tournament points
						earned divided by total matches played. A standard win yields 3
						points, a draw yields 1 point, and a loss yields 0 points.
						Multiplied by 10 to establish points-earning efficiency as the
						primary tie-breaker.
					</li>
					<li>
						<strong>GD (Goal Difference):</strong> Total goals scored minus
						total goals conceded across the whole tournament. Multiplied by 2.
					</li>
					<li>
						<strong>GS (Goals Scored):</strong> Brute offensive output.
						Recompenses pro-active, attacking football without dynamic
						multipliers.
					</li>
					<li>
						<strong>FP (Fair Play Modifier):</strong> A strict disciplinary
						deduction.
					</li>
				</ul>

				<p className="mt-4 font-medium text-sm">Fair Play Modifier:</p>
				<Formula tex={"FP = -((C_y \\times 0.2) + (C_r \\times 1.0))"} />
				<p className="mt-2 text-muted-foreground text-sm">
					Where <em>C_y</em> = total Yellow Cards and <em>C_r</em> = total Red
					Cards received during the final tournament. Matches decided via
					penalty shootouts are recorded as draws for the calculation of PPM,
					GD, and GS.
				</p>
			</Section>

			{/* Continental Bonus */}
			<Section
				title="Continental Bonus (B_c)"
				description="Mid-Cycle Modifier with safeguards"
			>
				<p className="mb-4 text-muted-foreground text-sm">
					Major regional championships (UEFA Euro, CONMEBOL Copa América, CAF
					AFCON, AFC Asian Cup, CONCACAF Gold Cup, OFC Nations Cup) are
					integrated into the system using a highly calibrated Mid-Cycle
					Modifier. Two computational safeguards prevent regional inflation.
				</p>

				<h4 className="mt-4 mb-2 font-semibold">
					Safeguard A: Glass Ceiling Constraint
				</h4>
				<p className="mb-2 text-muted-foreground text-sm">
					The Continental Bonus can{" "}
					<strong>
						only be injected into the fractional decimal portion (P_d)
					</strong>{" "}
					of the master formula.
				</p>
				<Formula tex={"ES = P_f + \\frac{P_d + B_c}{100}"} />
				<p className="mt-2 text-muted-foreground text-sm">
					If the combined sum of (P_d + B_c) equals or exceeds 100.00, the
					system enforces a strict cap, clamping the decimal output to a maximum
					of <strong>0.99</strong>. A nation eliminated in the Round of 16 (P_f
					= 60) can win their regional tournament and reach{" "}
					<strong>60.99</strong>, but can <strong>never</strong> breach the next
					phase threshold (P_f = 75).
				</p>

				<h4 className="mt-6 mb-2 font-semibold">
					Safeguard B: Confederation Factor (C_f)
				</h4>
				<p className="mb-2 text-muted-foreground text-sm">
					Winning a regional cup in a highly competitive continent is
					mathematically harder than doing so in a weaker region. The C-Factor
					is a dynamic multiplier computed entirely from data from the preceding
					World Cup:
				</p>
				<Formula
					tex={
						"C_f = \\frac{\\text{Nations from confederation advancing past Group Stage}}{\\text{Total nations from confederation at World Cup}}"
					}
				/>
				<p className="mt-4 text-muted-foreground text-sm">
					The final Continental Bonus is calculated as:
				</p>
				<Formula
					tex={
						"B_c = \\bigl[(PPM_{\\text{continental}} \\times 5) + (GD_{\\text{continental}} \\times 1)\\bigr] \\times C_f"
					}
				/>
			</Section>

			{/* Q-Index */}
			<Section
				title="Q-Index"
				description="Tier 2 metric for nations that did not qualify"
			>
				<p className="mb-2 text-muted-foreground text-sm">
					For the lower tier (ranks 49–211), the formula shifts away from
					tournament brackets to accommodate the wildly divergent qualification
					formats across confederations (e.g. CONMEBOL&apos;s 18-match single
					group vs. UEFA&apos;s shorter multi-group stages).
				</p>
				<Formula
					tex={
						"QIndex = \\left(\\frac{P_{earned}}{P_{max}} \\times 100\\right) + (GD_{avg} \\times 0.5)"
					}
				/>
				<ul className="mt-4 list-inside list-disc space-y-1 text-muted-foreground text-sm">
					<li>
						<strong>P_earned:</strong> Total points accumulated during the
						active qualification cycle.
					</li>
					<li>
						<strong>P_max:</strong> Maximum possible points the nation could
						have mathematically achieved given the number of fixtures in their
						specific group layout. Normalizes the percentage to treat varying
						match quantities equitably.
					</li>
					<li>
						<strong>GD_avg:</strong> Total qualification Goal Difference divided
						by matches played. Kept at a low weight multiplier (0.5) to prevent
						disproportionate inflation from blowout matches against
						micro-nations.
					</li>
				</ul>
			</Section>

			{/* Comparison Metrics */}
			<Section
				title="Comparison Metrics"
				description="Validation and historical tracking"
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="rounded-lg bg-muted/50 p-4">
						<h4 className="mb-2 font-semibold">Reality Check (vs FIFA)</h4>
						<p className="text-muted-foreground text-sm">
							Computes a dynamic differential (Δ) mapping the variance between
							the Epoch Score ranking and the standard FIFA ranking,
							highlighting the artificial noise embedded in the Elo-based
							official system.
						</p>
					</div>
					<div className="rounded-lg bg-muted/50 p-4">
						<h4 className="mb-2 font-semibold">
							Historical Evolution (vs Historical)
						</h4>
						<p className="text-muted-foreground text-sm">
							Queries previous frozen Epoch datasets to provide a generational
							trajectory visualization, tracking exactly how many positions a
							squad advanced or declined across discrete four-year eras.
						</p>
					</div>
				</div>
			</Section>
		</main>
	);
}
