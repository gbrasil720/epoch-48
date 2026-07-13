"use client";

import { Button } from "@epoch-48/ui/components/button";
import { motion } from "framer-motion";
import { ArrowRight } from "reicon-react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
			delayChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 16 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
		},
	},
};

export function HeroSection() {
	const reducedMotion = useReducedMotion();

	return (
		<section className="relative overflow-hidden border-b border-border/40">
			{/* Background grid pattern */}
			<div className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)/0.3_1px,transparent_1px),linear-gradient(to_bottom,var(--border)/0.3_1px,transparent_1px)] bg-[size:64px_64px]" />
				<div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
				<div className="mx-auto max-w-3xl text-center">
					<motion.div
						variants={containerVariants}
						initial="hidden"
						animate="visible"
					>
						<motion.div variants={itemVariants}>
							<div className="mb-6 inline-flex items-center gap-2 border border-border/50 bg-muted/50 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
								<span className="inline-block size-2 rounded-full bg-brand animate-pulse" />
								World Cup 2026
							</div>
						</motion.div>

						<motion.h1
							variants={itemVariants}
							className="font-mono font-black text-4xl leading-[0.95] tracking-tighter uppercase sm:text-6xl md:text-7xl lg:text-8xl"
						>
							National
							<br />
							<span className="text-brand">Teams</span>
							<br />
							Ranked
						</motion.h1>

						<motion.p
							variants={itemVariants}
							className="mx-auto mt-6 max-w-lg text-sm text-muted-foreground leading-relaxed"
						>
							An objective ranking system built exclusively from World Cup
							and continental tournament results. No friendlies. No noise.
						</motion.p>

						<motion.div
							variants={itemVariants}
							className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
						>
							<Link href="/ranking">
								<Button
									size="lg"
									className="group h-11 gap-2 bg-brand px-8 font-mono text-sm uppercase tracking-widest text-brand-foreground shadow-none transition-all duration-200 hover:bg-brand/90 active:scale-[0.97]"
									data-cuelume-press="press"
									data-cuelume-release="release"
								>
									View Rankings
									<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
								</Button>
							</Link>
							<Link href="/methodology">
								<Button
									variant="outline"
									size="lg"
									className="h-11 gap-2 border-border/60 px-8 font-mono text-sm uppercase tracking-widest shadow-none transition-all duration-200 hover:bg-muted/50"
									data-cuelume-hover="tick"
								>
									Methodology
								</Button>
							</Link>
						</motion.div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}