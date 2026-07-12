"use client";

import { Button } from "@epoch-48/ui/components/button";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ModeToggle } from "./mode-toggle";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/methodology", label: "Methodology" },
	{ to: "/ranking", label: "Full Ranking" },
] as const;

export default function Header() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const reducedMotion = useReducedMotion();

	return (
		<header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
			<div className="flex h-14 items-center justify-between px-4">
				{/* Branding */}
				<Link
					href="/"
					className="font-black font-heading text-lg uppercase tracking-tight"
				>
					EPOCH <span className="text-accent-green">48</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-1 md:flex">
					{links.map(({ to, label }) => {
						const isActive = pathname === to;
						return (
							<Link
								key={to}
								href={to}
								className={`px-3 py-1.5 text-sm transition-colors ${
									isActive
										? "border-accent-green border-b-2 font-medium text-foreground"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								{label}
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
					>
						{open ? <X className="size-4" /> : <Menu className="size-4" />}
						<span className="sr-only">Toggle menu</span>
					</Button>
				</div>
			</div>

			{/* Mobile nav */}
			<AnimatePresence>
				{open && (
					<motion.nav
						initial={reducedMotion ? undefined : { height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={reducedMotion ? undefined : { height: 0, opacity: 0 }}
						transition={
							reducedMotion
								? undefined
								: { type: "spring", stiffness: 300, damping: 30 }
						}
						className="overflow-hidden border-t md:hidden"
					>
						<div className="px-4 pt-2 pb-3">
							{links.map(({ to, label }) => {
								const isActive = pathname === to;
								return (
									<Link
										key={to}
										href={to}
										onClick={() => setOpen(false)}
										className={`block rounded-none px-3 py-2 text-sm transition-colors ${
											isActive
												? "border-accent-green border-b-2 font-medium text-foreground"
												: "text-muted-foreground hover:bg-muted hover:text-foreground"
										}`}
									>
										{label}
									</Link>
								);
							})}
						</div>
					</motion.nav>
				)}
			</AnimatePresence>
		</header>
	);
}
