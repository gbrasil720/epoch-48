import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import Header from "@/components/header";
import Providers from "@/components/providers";
import "@epoch-48/ui/globals.css";

const fontHeading = Space_Grotesk({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-heading",
});

const fontMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "700"],
	variable: "--font-mono",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
};

export const metadata: Metadata = {
	title: "Epoch 48",
	description: "A data-driven global football national team ranking system",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html
			lang="en"
			suppressHydrationWarning
			className={`${fontHeading.variable} ${fontMono.variable} cn-smooth-scroll cn-noise`}
		>
			<body className="font-sans antialiased">
				<Providers>
					<div className="relative flex min-h-[100dvh] flex-col">
						<Header />
						{children}
						<footer className="mt-auto border-border/50 border-t py-6 text-center text-muted-foreground text-xs">
							<div className="mx-auto max-w-7xl px-4 sm:px-6">
								<p className="font-mono text-[0.65rem] uppercase tracking-widest">
									EPOCH 48 &middot; DATA-DRIVEN RANKINGS &middot;{" "}
									{new Date().getFullYear()}
								</p>
							</div>
						</footer>
					</div>
				</Providers>
			</body>
		</html>
	);
}
