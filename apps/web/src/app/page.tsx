"use client";

import { Button } from "@epoch-48/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@epoch-48/ui/components/card";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { trpc } from "@/utils/trpc";

export default function Home() {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());

	return (
		<main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-4">
			<div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
				<div className="flex flex-col gap-2">
					<h1 className="font-bold text-4xl tracking-tight sm:text-5xl">
						Epoch 48
					</h1>
					<p className="text-muted-foreground text-xl">
						The Absolute Global Football Hierarchy
					</p>
					<p className="max-w-lg text-muted-foreground">
						A data-driven ranking system based on World Cup performance. No
						friendlies, no Elo manipulation — just the results that matter.
					</p>
				</div>

				<div className="flex gap-4">
					<Link href="/ranking">
						<Button size="lg">View Rankings</Button>
					</Link>
					<Link href="/methodology">
						<Button variant="outline" size="lg">
							Methodology
						</Button>
					</Link>
				</div>

				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle className="text-base">System Status</CardTitle>
						<CardDescription>API connectivity</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-2">
							<div
								className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
							/>
							<span className="text-muted-foreground text-sm">
								{healthCheck.isLoading
									? "Checking..."
									: healthCheck.data
										? "Connected"
										: "Disconnected"}
							</span>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
