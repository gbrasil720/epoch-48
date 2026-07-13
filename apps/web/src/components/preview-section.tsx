"use client";

import { motion } from "framer-motion";
import { Suspense } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { RankingPreview } from "./ranking-preview";

export function PreviewSection() {
	const reducedMotion = useReducedMotion();

	return (
		<section className="border-border/40 border-b">
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
				<motion.div
					initial={reducedMotion ? undefined : { opacity: 0, y: 16 }}
					whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{
						duration: 0.5,
						ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
					}}
					className="mx-auto max-w-3xl"
				>
					<div className="mb-6 flex items-center gap-3">
						<span className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.2em]">
							Live Data
						</span>
						<div className="h-px flex-1 bg-border/40" />
					</div>
					<div className="overflow-hidden border border-border/40 bg-card/30 shadow-sm">
						<Suspense
							fallback={
								<div className="flex items-center justify-center py-16">
									<div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
								</div>
							}
						>
							<RankingPreview />
						</Suspense>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
