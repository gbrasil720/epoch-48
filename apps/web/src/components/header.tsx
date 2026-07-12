"use client";

import { Button } from "@epoch-48/ui/components/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { ModeToggle } from "./mode-toggle";

const links = [
	{ to: "/", label: "Home" },
	{ to: "/methodology", label: "Methodology" },
	{ to: "/ranking", label: "Full Ranking" },
] as const;

export default function Header() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);

	return (
		<header className="border-b">
			<div className="flex h-14 items-center justify-between px-4">
				{/* Branding */}
				<Link href="/" className="font-bold">
					Epoch 48
				</Link>

				{/* Desktop nav */}
				<nav className="hidden items-center gap-1 md:flex">
					{links.map(({ to, label }) => {
						const isActive = pathname === to;
						return (
							<Link
								key={to}
								href={to}
								className={`rounded-none px-3 py-1.5 text-sm transition-colors ${
									isActive
										? "bg-muted font-medium"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
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
			{open && (
				<nav className="border-t px-4 pt-2 pb-3 md:hidden">
					{links.map(({ to, label }) => {
						const isActive = pathname === to;
						return (
							<Link
								key={to}
								href={to}
								onClick={() => setOpen(false)}
								className={`block rounded-none px-3 py-2 text-sm transition-colors ${
									isActive
										? "bg-muted font-medium"
										: "text-muted-foreground hover:bg-muted hover:text-foreground"
								}`}
							>
								{label}
							</Link>
						);
					})}
				</nav>
			)}
		</header>
	);
}
