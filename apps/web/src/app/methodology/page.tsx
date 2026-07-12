"use client";

import "katex/dist/katex.min.css";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import katex from "katex";
import { useEffect, useState } from "react";
import ESPlayground from "@/components/es-playground";
import QPlayground from "@/components/q-playground";

export default function MethodologyPage() {
	const [activeSection, setActiveSection] = useState("philosophy");

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveSection(entry.target.id);
					}
				});
			},
			{ rootMargin: "-80px 0px -80% 0px" },
		);

		const sections = document.querySelectorAll("section[id]");
		for (const section of sections) {
			observer.observe(section);
		}

		return () => observer.disconnect();
	}, []);

	const sections = [
		["Philosophy", "philosophy"],
		["Tier 1: World Cup & Continental", "tier-1"],
		["Tier 2: Qualifiers", "tier-2"],
		["Score Formula", "formula"],
		["Phase Weights", "phase-weights"],
		["Continental Bonus", "bonus"],
		["Q-Index", "q-index"],
		["Tiebreakers", "tiebreakers"],
		["FIFA Comparison", "fifa"],
	] as const;

	return (
		<div className="container mx-auto max-w-6xl px-4 py-10">
			<header className="mb-12">
				<h1 className="font-black font-heading text-3xl uppercase tracking-tight sm:text-4xl">
					Methodology
				</h1>
				<p className="mt-2 text-muted-foreground">
					How the Epoch 48 ranking system works.
				</p>
			</header>

			<div className="grid gap-8 lg:grid-cols-4">
				{/* Desktop sticky TOC */}
				<nav className="hidden lg:col-span-1 lg:block">
					<div className="sticky top-16 rounded-lg border bg-muted/30 p-4">
						<p className="mb-2 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
							Contents
						</p>
						<ul className="space-y-1 text-sm">
							{sections.map(([label, id]) => (
								<li key={id}>
									<a
										href={`#${id}`}
										className={`block py-0.5 transition-colors ${
											activeSection === id
												? "font-medium text-accent-green"
												: "text-muted-foreground hover:text-foreground"
										}`}
									>
										{label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</nav>

				{/* Mobile inline TOC */}
				<div className="lg:col-span-3">
					<nav className="mb-10 rounded-lg border bg-muted/30 p-4 lg:hidden">
						<p className="mb-2 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
							Contents
						</p>
						<ul className="space-y-1 text-sm">
							{sections.map(([label, href]) => (
								<li key={href}>
									<a
										href={`#${href}`}
										className="text-accent-green hover:underline"
									>
										{label}
									</a>
								</li>
							))}
						</ul>
					</nav>

					<div className="space-y-12">
						<Section title="Philosophy" id="philosophy">
							<blockquote className="border-accent-green border-l-2 pl-4 text-foreground italic">
								Which nations perform best when it matters most?
							</blockquote>
							<p>
								Epoch 48 ranks national football teams based on{" "}
								<em>meaningful</em> competitive performance. Unlike Elo-based
								systems that update after every match, Epoch only counts results
								from official tournaments — World Cup finals, continental
								championships, and their qualifying campaigns.
							</p>
							<p>
								Friendlies, exhibition matches, and low-stakes fixtures are
								excluded by design.
							</p>
						</Section>

						<Section title="Tier 1: World Cup & Continental" id="tier-1">
							<p>
								Tier 1 includes all nations that participate in a World Cup
								final tournament or a continental championship (Euros, Copa
								América, AFCON, Asian Cup, Olympic football). These are the
								highest-stakes competitions in international football.
							</p>
							<p>
								Each nation&apos;s score is computed from their tournament
								performance using a formula that rewards deep runs, goal
								difference, and clean disciplinary records.
							</p>
						</Section>

						<Section title="Tier 2: Qualifiers" id="tier-2">
							<p>
								Tier 2 includes nations that did not reach a final tournament
								but competed in qualifying campaigns. Their performance is
								measured using the Q-Index, which normalizes points earned
								against the maximum possible.
							</p>
						</Section>

						<Section title="Score Formula" id="formula">
							<p>The Epoch Score for Tier 1 nations:</p>
							<Formula tex={"ES = P_f + \\frac{P_d + B_c}{100}"} />
							<p>Where:</p>
							<ul className="list-inside list-disc space-y-1 pl-4">
								<li>
									<span className="font-mono text-sm">
										P<sub>f</sub>
									</span>{" "}
									— Phase weight (integer from phase reached, see table below)
								</li>
								<li>
									<span className="font-mono text-sm">
										P<sub>d</sub>
									</span>{" "}
									— Performance points:{" "}
									<code className="rounded bg-muted px-1 text-xs">
										(PPM × 10) + (GD × 2) + GS − FP
									</code>
								</li>
								<li>
									<span className="font-mono text-sm">
										B<sub>c</sub>
									</span>{" "}
									— Continental bonus (see below)
								</li>
							</ul>
							<p className="mt-2 text-sm">
								The decimal part{" "}
								<code className="rounded bg-muted px-1 text-xs">
									(P_d + B_c) / 100
								</code>{" "}
								is clamped to [0.00, 0.99].
							</p>
							<p className="mt-2 text-muted-foreground text-sm">
								Where PPM = points gained / games played, GD = goal difference,
								GS = goals scored, FP = foul penalty = (Y × 0.2) + (R × 1.0)
							</p>

							<div className="mt-6">
								<h4 className="mb-3 font-medium text-sm">Try it</h4>
								<ESPlayground />
							</div>
						</Section>

						<Section title="Phase Weights" id="phase-weights">
							<p>
								The integer part of the Epoch Score is determined by tournament
								finish:
							</p>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
											Phase
										</TableHead>
										<TableHead className="text-right font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
											Weight
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{[
										["Winner", 100],
										["Runner-up", 95],
										["Third Place", 90],
										["Fourth Place", 85],
										["Quarter-finals", 75],
										["Round of 16", 60],
										["Round of 32", 40],
										["Group Stage", 25],
									].map(([phase, weight]) => (
										<TableRow key={phase}>
											<TableCell>{phase as string}</TableCell>
											<TableCell className="text-right font-medium font-mono">
												{weight}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</Section>

						<Section title="Continental Bonus" id="bonus">
							<p>
								A small bonus is applied to compensate for the relative
								competitive imbalance between confederations. Nations from
								smaller confederations receive a modest multiplier to account
								for the difficulty of their path.
							</p>
							<Formula
								tex={"B_c = \\text{PPM} \\times 5 \\times \\text{GD} \\times C"}
							/>
							<p className="text-muted-foreground text-sm">
								Where C is the confederation-specific factor.
							</p>
						</Section>

						<Section title="Q-Index" id="q-index">
							<p>The Q-Index for Tier 2 (qualifier-only) nations:</p>
							<Formula
								tex={
									"Q = \\left(\\frac{P_{\\text{earned}}}{P_{\\text{max}}} \\times 100\\right) + \\left(\\frac{\\text{GD}}{\\text{matches}} \\times 0.5\\right)"
								}
							/>
							<p>Where:</p>
							<ul className="list-inside list-disc space-y-1 pl-4">
								<li>
									<span className="font-mono text-sm">P_earned</span> — points
									earned in qualifying
								</li>
								<li>
									<span className="font-mono text-sm">P_max</span> — maximum
									possible points
								</li>
								<li>
									<span className="font-mono text-sm">GD</span> — goal
									difference in qualifying
								</li>
								<li>
									<span className="font-mono text-sm">matches</span> — matches
									played
								</li>
							</ul>

							<div className="mt-6">
								<h4 className="mb-3 font-medium text-sm">Try it</h4>
								<QPlayground />
							</div>
						</Section>

						<Section title="Tiebreakers" id="tiebreakers">
							<p>
								When two or more nations share the same Epoch score, the tie is
								broken by FIFA ranking (lower rank wins). If FIFA data is
								unavailable, the tie stands.
							</p>
						</Section>

						<Section title="FIFA Comparison" id="fifa">
							<p>
								Epoch rankings can be compared against the official FIFA/FIGL
								rankings. The delta column shows the difference: a positive
								value means the nation is ranked higher by FIFA than by Epoch,
								and negative means the opposite.
							</p>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
											Delta
										</TableHead>
										<TableHead className="font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest">
											Meaning
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<TableRow>
										<TableCell className="font-mono text-sm">
											<span className="text-red-600 dark:text-red-400">
												negative
											</span>
										</TableCell>
										<TableCell>
											Epoch ranks this nation <em>higher</em> than FIFA
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-mono text-sm">
											<span className="text-green-600 dark:text-green-400">
												positive
											</span>
										</TableCell>
										<TableCell>
											FIFA ranks this nation <em>higher</em> than Epoch
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Section>
					</div>
				</div>
			</div>
		</div>
	);
}

function Formula({ tex }: { tex: string }) {
	const html = katex
		.renderToString(tex, {
			throwOnError: false,
			displayMode: true,
		})
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
	return (
		<div
			className="my-4 overflow-x-auto rounded-md border bg-muted/30 p-4"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

function Section({
	title,
	children,
	id,
}: {
	title: string;
	children: React.ReactNode;
	id: string;
}) {
	return (
		<section id={id} className="scroll-mt-16">
			<h2 className="mb-4 font-heading font-semibold text-2xl tracking-tight">
				{title}
			</h2>
			<div className="max-w-prose space-y-4 text-muted-foreground leading-relaxed">
				{children}
			</div>
		</section>
	);
}
