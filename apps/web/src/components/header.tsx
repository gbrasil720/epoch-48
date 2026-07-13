"use client";

import { Button } from "@epoch-48/ui/components/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, XCircle } from "reicon-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ModeToggle } from "./mode-toggle";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/methodology", label: "Methodology" },
	{ to: "/ranking", label: "Rankings" },
] as const;

export default function Header() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const reducedMotion = useReducedMotion();

	return (
		<header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
			<div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
				{/* Branding */}
				<Link
					href="/"
					className="font-mono font-black text-lg uppercase tracking-[0.2em] transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
					data-cuelume-hover="tick"
				>
					EPOCH <span className="text-brand">48</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-1 md:flex">
					{links.map(({ to, label }) => {
						const isActive = pathname === to;
						return (
							<Link
								key={to}
								href={to}
								className={`relative px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] rounded ${
									isActive
										? "text-foreground bg-muted/80"
										: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
								}`}
								data-cuelume-hover="tick"
							>
								{label}
								{isActive && (
									<motion.div
										layoutId="nav-active"
										className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-brand"
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
									/>
								)}
							</Link>
						);
					})}
				</nav>

				{/* Right side */}
				<div className="flex items-center gap-2">
					<ModeToggle />

					{/* Mobile menu toggle */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setOpen((v) => !v)}
						data-cuelume-press="press"
						data-cuelume-release="release"
					>
						{open ? <XCircle size={18} /> : <Menu size={18} />}
					</Button>
				</div>
			</div>

			{/* Mobile menu */}
			<AnimatePresence>
				{open && (
					<motion.nav
						initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
						transition={
							reducedMotion
								? undefined
								: { duration: 0.2, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }
						}
						className="overflow-hidden border-t md:hidden"
					>
						<div className="flex flex-col gap-0.5 px-4 py-3">
							{links.map(({ to, label }, index) => {
								const isActive = pathname === to;
								return (
									<motion.div
										key={to}
										initial={reducedMotion ? undefined : { x: -8, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										transition={
											reducedMotion
												? undefined
												: {
														delay: index * 0.05,
														duration: 0.2,
														ease: [0.32, 0.72, 0, 1] as [number, number, number, number],
													}
										}
									>
										<Link
											href={to}
											className={`block px-3 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors ${
												isActive
													? "bg-muted text-foreground"
													: "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
											}`}
											onClick={() => setOpen(false)}
											data-cuelume-hover="tick"
										>
											{label}
										</Link>
									</motion.div>
								);
							})}
						</div>
					</motion.nav>
				)}
			</AnimatePresence>
		</header>
	);
}