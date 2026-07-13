"use client";

import { Badge } from "@epoch-48/ui/components/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@epoch-48/ui/components/card";
import { motion, useScroll, useTransform } from "framer-motion";
import katex from "katex";
import { Calculator, Globe, InfoCircle, Target, Trophy } from "reicon-react";
import { useEffect, useRef, useState } from "react";
import { ESPlayground } from "@/components/es-playground";
import { QPlayground } from "@/components/q-playground";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

// KaTeX rendering helpers
function renderKatex(latex: string) {
	return katex.renderToString(latex, {
		throwOnError: false,
		displayMode: false,
	});
}

function renderKatexDisplay(latex: string) {
	return katex.renderToString(latex, {
		throwOnError: false,
		displayMode: true,
	});
}

const sections = [
	{ id: "overview", label: "Overview", icon: InfoCircle },
	{ id: "tier-system", label: "Tier System", icon: Target },
	{ id: "epoch-score", label: "Epoch Score", icon: Calculator },
	{ id: "q-index", label: "Q-Index", icon: Globe },
	{ id: "playground", label: "Playground", icon: Trophy },
] as const;

function SectionNav() {
	const [active, setActive] = useState("overview");
	const observer = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		const sectionsEl = sections.map((s) =>
			document.getElementById(s.id),
		) as HTMLElement[];

		observer.current = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActive(entry.target.id);
					}
				});
			},
			{ rootMargin: "-20% 0px -60% 0px" },
		);

		sectionsEl.forEach((el) => {
			if (el) observer.current?.observe(el);
		});

		return () => observer.current?.disconnect();
	}, []);

	return (
		<nav className="sticky top-20 hidden lg:block">
			<div className="border border-border/40 bg-card/30 p-3">
				<div className="mb-2 px-2 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
					On this page
				</div>
				<ul className="space-y-0.5">
					{sections.map((section) => (
						<li key={section.id}>
							<a
								href={`#${section.id}`}
								data-cuelume-hover="tick"
								className={`flex items-center gap-2 px-2.5 py-1.5 font-mono text-xs uppercase tracking-widest transition-all duration-200 ${
									active === section.id
										? "bg-brand/10 text-brand"
										: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
								}`}
							>
								<section.icon
									className={`size-3.5 transition-colors ${
										active === section.id
											? "text-brand"
											: "text-muted-foreground/50 group-hover:text-foreground"
									}`}
								/>
								{section.label}
							</a>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}

function FormulaBlock({ latex, label }: { latex: string; label?: string }) {
	return (
		<div className="my-6 overflow-hidden border border-border/40 bg-muted/30 p-5">
			{label && (
				<div className="mb-3 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
					{label}
				</div>
			)}
			<div
				className="overflow-x-auto text-center"
				dangerouslySetInnerHTML={{ __html: renderKatexDisplay(latex) }}
			/>
		</div>
	);
}

export default function MethodologyPage() {
	const reducedMotion = useReducedMotion();
	const containerRef = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
	});
	const opacity = useTransform(scrollYProgress, [0, 0.1], [0.15, 0]);

	return (
		<main ref={containerRef} className="min-h-[100dvh]">
			{/* Hero */}
			<section className="relative overflow-hidden border-border/40 border-b">
				<motion.div
					className="pointer-events-none absolute inset-0"
					style={{ opacity }}
				>
					<div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
				</motion.div>

				<div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
					<motion.div
						initial={reducedMotion ? undefined : { opacity: 0, y: -8 }}
						animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
						}}
						className="mx-auto max-w-3xl text-center"
					>
						<Badge
							variant="outline"
							className="mb-4 gap-1.5 bg-brand/5 text-brand"
						>
							<Calculator size={12} />
							<span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">
								Methodology
							</span>
						</Badge>
						<h1 className="font-black font-mono text-2xl uppercase tracking-tight sm:text-3xl md:text-4xl">
							How the Ranking Works
						</h1>
						<p className="mx-auto mt-4 max-w-xl text-muted-foreground text-sm leading-relaxed">
							A transparent, data-driven ranking system built on tournament
							results alone.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Content */}
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
				<div className="grid gap-8 lg:grid-cols-[1fr_220px]">
					<div className="space-y-16">
						{/* Overview */}
						<section id="overview">
							<motion.div
								initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
								whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
								}}
							>
								<div className="mb-4 flex items-center gap-3">
									<span className="font-mono text-[0.6rem] text-brand uppercase tracking-[0.2em]">
										01
									</span>
									<div className="h-px flex-1 bg-border/40" />
								</div>
								<h2 className="font-bold font-mono text-xl uppercase tracking-tight">
									Overview
								</h2>
								<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
									Epoch 48 ranks national football teams using a rigorous system
									based exclusively on World Cup and continental tournament
									performance. Unlike Elo-based systems, it does not consider
									friendlies or margin of victory beyond goal difference.
								</p>
								<div className="mt-6 grid gap-4 sm:grid-cols-2">
									<div className="border border-border/40 bg-card/30 p-4">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-8 items-center justify-center bg-brand/10 text-brand">
												<Trophy size={14} />
											</div>
											<span className="font-mono font-semibold text-xs uppercase tracking-wide">
												Tournament Focused
											</span>
										</div>
										<p className="text-muted-foreground text-sm leading-relaxed">
											Only competitive matches in World Cups and continental
											championships count toward rankings.
										</p>
									</div>
									<div className="border border-border/40 bg-card/30 p-4">
										<div className="mb-2 flex items-center gap-2">
											<div className="flex size-8 items-center justify-center bg-brand/10 text-brand">
												<InfoCircle size={14} />
											</div>
											<span className="font-mono font-semibold text-xs uppercase tracking-wide">
												Transparent Formulas
											</span>
										</div>
										<p className="text-muted-foreground text-sm leading-relaxed">
											Every calculation is documented and verifiable. No
											black-box algorithms.
										</p>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Tier System */}
						<section id="tier-system">
							<motion.div
								initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
								whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
								}}
							>
								<div className="mb-4 flex items-center gap-3">
									<span className="font-mono text-[0.6rem] text-brand uppercase tracking-[0.2em]">
										02
									</span>
									<div className="h-px flex-1 bg-border/40" />
								</div>
								<h2 className="font-bold font-mono text-xl uppercase tracking-tight">
									Tier System
								</h2>
								<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
									Teams are divided into two tiers based on World Cup
									participation:
								</p>
								<div className="mt-6 grid gap-4 sm:grid-cols-2">
									<div className="border border-border/40 bg-card/30 p-4">
										<div className="mb-2 flex items-center gap-2">
											<Badge className="bg-champion-gold/10 text-champion-gold">
												Tier 1
											</Badge>
										</div>
										<h3 className="font-mono font-semibold text-xs uppercase tracking-wide">
											World Cup Nations
										</h3>
										<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
											Teams that qualified for the World Cup. Ranked by Epoch
											Score (ES).
										</p>
									</div>
									<div className="border border-border/40 bg-card/30 p-4">
										<div className="mb-2 flex items-center gap-2">
											<Badge variant="secondary">Tier 2</Badge>
										</div>
										<h3 className="font-mono font-semibold text-xs uppercase tracking-wide">
											Non-Qualified Nations
										</h3>
										<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
											Teams that did not qualify. Ranked by Q-Index based on
											qualifier performance.
										</p>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Epoch Score */}
						<section id="epoch-score">
							<motion.div
								initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
								whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
								}}
							>
								<div className="mb-4 flex items-center gap-3">
									<span className="font-mono text-[0.6rem] text-brand uppercase tracking-[0.2em]">
										03
									</span>
									<div className="h-px flex-1 bg-border/40" />
								</div>
								<h2 className="font-bold font-mono text-xl uppercase tracking-tight">
									Epoch Score
								</h2>
								<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
									The Epoch Score measures a team&apos;s World Cup performance
									using three components:
								</p>

								<FormulaBlock
									latex="ES = P_f + \\frac{P_d + B_c}{100}"
									label="Epoch Score Formula"
								/>

								<div className="space-y-6">
									<div>
										<h3 className="font-mono font-semibold text-sm uppercase tracking-wide">
											Phase Weight (P<sub>f</sub>)
										</h3>
										<p className="mt-2 text-muted-foreground text-sm">
											Base score based on tournament finish:
										</p>
										<div className="mt-3 grid gap-2 sm:grid-cols-2">
											{[
												{ phase: "Winner", weight: 100 },
												{ phase: "Runner-up", weight: 95 },
												{ phase: "3rd Place", weight: 90 },
												{ phase: "4th Place", weight: 85 },
												{ phase: "Quarter-finals", weight: 75 },
												{ phase: "Round of 16", weight: 60 },
												{ phase: "Group Stage", weight: 25 },
											].map((item) => (
												<div
													key={item.phase}
													className="flex items-center justify-between border border-border/40 bg-card/30 px-3 py-2"
												>
													<span className="font-mono text-xs uppercase tracking-wide">
														{item.phase}
													</span>
													<span className="font-bold font-mono text-sm tabular-nums">
														{item.weight}
													</span>
												</div>
											))}
										</div>
									</div>

									<div>
										<h3 className="font-mono font-semibold text-sm uppercase tracking-wide">
											Performance Tie-breaker (P<sub>d</sub>)
										</h3>
										<p className="mt-2 text-muted-foreground text-sm">
											Refines ranking within the same phase using points per
											match, goal difference, goals scored, and fair play.
										</p>
										<FormulaBlock
											latex="P_d = PPP + GD_{norm} + GS_{norm} + FP_{norm}"
											label="Tie-breaker Formula"
										/>
									</div>

									<div>
										<h3 className="font-mono font-semibold text-sm uppercase tracking-wide">
											Continental Bonus (B<sub>c</sub>)
										</h3>
										<p className="mt-2 text-muted-foreground text-sm">
											Rewards teams that won their continental championship
											during the mid-cycle year, scaled by confederation
											strength (C-Factor).
										</p>
										<FormulaBlock
											latex="B_c = W_{continental} \\times CF \\times 50"
											label="Continental Bonus"
										/>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Q-Index */}
						<section id="q-index">
							<motion.div
								initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
								whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
								}}
							>
								<div className="mb-4 flex items-center gap-3">
									<span className="font-mono text-[0.6rem] text-brand uppercase tracking-[0.2em]">
										04
									</span>
									<div className="h-px flex-1 bg-border/40" />
								</div>
								<h2 className="font-bold font-mono text-xl uppercase tracking-tight">
									Q-Index
								</h2>
								<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
									For teams that did not qualify for the World Cup, the Q-Index
									measures qualifier performance:
								</p>

								<FormulaBlock
									latex="Q = \\frac{P}{P_{max}} \\times 100 + \\frac{GD}{MP} \\times 0.5"
									label="Q-Index Formula"
								/>

								<div className="mt-6 grid gap-4 sm:grid-cols-3">
									<div className="border border-border/40 bg-card/30 p-4 text-center">
										<div className="font-bold font-mono text-2xl">P</div>
										<div className="mt-1 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
											Points earned
										</div>
									</div>
									<div className="border border-border/40 bg-card/30 p-4 text-center">
										<div className="font-bold font-mono text-2xl">
											P<sub>max</sub>
										</div>
										<div className="mt-1 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
											Max possible points
										</div>
									</div>
									<div className="border border-border/40 bg-card/30 p-4 text-center">
										<div className="font-bold font-mono text-2xl">GD/MP</div>
										<div className="mt-1 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
											Goal diff per match
										</div>
									</div>
								</div>
							</motion.div>
						</section>

						{/* Playground */}
						<section id="playground">
							<motion.div
								initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
								whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{
									duration: 0.5,
									ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
								}}
							>
								<div className="mb-4 flex items-center gap-3">
									<span className="font-mono text-[0.6rem] text-brand uppercase tracking-[0.2em]">
										05
									</span>
									<div className="h-px flex-1 bg-border/40" />
								</div>
								<h2 className="font-bold font-mono text-xl uppercase tracking-tight">
									Interactive Playground
								</h2>
								<p className="mt-4 text-muted-foreground text-sm leading-relaxed">
									Experiment with the formulas. Adjust inputs to see how scores
									change in real time.
								</p>

								<div className="mt-6 grid gap-6">
									<div className="border border-border/40 bg-card/30">
										<div className="border-border/40 border-b p-4">
											<div className="flex items-center gap-2">
												<Calculator size={16} className="text-brand" />
												<span className="font-mono font-semibold text-sm uppercase tracking-wide">
													Epoch Score Calculator
												</span>
											</div>
											<p className="mt-1 text-muted-foreground text-sm">
												Adjust phase, performance, and continental bonus to see
												the computed score.
											</p>
										</div>
										<div className="p-4">
											<ESPlayground />
										</div>
									</div>

									<div className="border border-border/40 bg-card/30">
										<div className="border-border/40 border-b p-4">
											<div className="flex items-center gap-2">
												<Globe size={16} className="text-brand" />
												<span className="font-mono font-semibold text-sm uppercase tracking-wide">
													Q-Index Calculator
												</span>
											</div>
											<p className="mt-1 text-muted-foreground text-sm">
												Simulate qualifier performance to calculate the Q-Index.
											</p>
										</div>
										<div className="p-4">
											<QPlayground />
										</div>
									</div>
								</div>
							</motion.div>
						</section>
					</div>

					{/* Sidebar nav */}
					<div className="hidden lg:block">
						<SectionNav />
					</div>
				</div>
			</div>
		</main>
	);
}
