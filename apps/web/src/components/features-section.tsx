"use client";

import { motion } from "framer-motion";
import { ChartBar, TrendUp2, Trophy } from "reicon-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function FeaturesSection() {
	const reducedMotion = useReducedMotion();

	const features = [
		{
			icon: Trophy,
			label: "01",
			title: "Tournament Only",
			description:
				"Rankings based purely on World Cup and continental tournament results. No friendlies inflate scores.",
		},
		{
			icon: TrendUp2,
			label: "02",
			title: "Historical Comparison",
			description:
				"Track how teams have evolved across World Cup cycles with detailed delta analysis.",
		},
		{
			icon: ChartBar,
			label: "03",
			title: "Transparent Methodology",
			description:
				"Every formula is open and documented. Explore the math behind the rankings.",
		},
	];

	return (
		<section className="border-border/40 border-b">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
				<div className="grid gap-4 sm:grid-cols-3">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
							whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{
								duration: 0.4,
								delay: index * 0.1,
								ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
							}}
						>
							<div className="group h-full border border-border/40 bg-card/30 p-5 transition-colors duration-300 hover:border-brand/30 hover:bg-card/50">
								<div className="mb-3 flex items-center gap-3">
									<span className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
										{feature.label}
									</span>
									<feature.icon size={16} className="text-brand" />
								</div>
								<h3 className="font-bold font-mono text-sm uppercase tracking-wide">
									{feature.title}
								</h3>
								<p className="mt-2 text-muted-foreground text-sm leading-relaxed">
									{feature.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
