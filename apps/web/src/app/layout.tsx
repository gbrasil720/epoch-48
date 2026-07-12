import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../index.css";
import Header from "@/components/header";
import Providers from "@/components/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Epoch — Global Football Rankings",
	description:
		"An objective, Elo-based ranking of national football teams. Updated every FIFA international window with transparent methodology and open-source code.",
	metadataBase: new URL("https://epoch.gg"),
	openGraph: {
		title: "Epoch — Global Football Rankings",
		description:
			"An objective, Elo-based ranking of national football teams. Updated every FIFA international window.",
		url: "https://epoch.gg",
		siteName: "Epoch",
		locale: "en_US",
		type: "website",
	},
	verification: {
		google: "",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
