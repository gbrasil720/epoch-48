"use client";

import { Toaster } from "@epoch-48/ui/components/sonner";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { bind } from "cuelume";
import { useEffect } from "react";

import { queryClient } from "@/utils/trpc";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		bind();
	}, []);

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				{children}
				<ReactQueryDevtools />
				<Toaster richColors />
			</QueryClientProvider>
		</ThemeProvider>
	);
}