"use client";

import Image from "next/image";
import { flagUrl } from "@/lib/flag-url";

interface FlagProps {
	code: string;
	emoji?: string | null;
	size?: "sm" | "md" | "lg";
	className?: string;
}

const SIZE_MAP = {
	sm: { w: 20, h: 20 },
	md: { w: 24, h: 24 },
	lg: { w: 48, h: 48 },
} as const;

export default function Flag({
	code,
	emoji,
	size = "sm",
	className = "",
}: FlagProps) {
	const { w, h } = SIZE_MAP[size];
	const url = flagUrl(code ?? null);

	if (!url || !code) {
		return <span className="text-lg">{emoji ?? "?"}</span>;
	}

	return (
		<Image
			src={url}
			alt={`${code} flag`}
			width={w}
			height={h}
			className={`inline-block ${size === "lg" ? "rounded-full" : ""} ${className}`}
			loading="lazy"
			unoptimized
			onError={(e) => {
				const target = e.currentTarget.parentElement;
				if (target && emoji) {
					target.innerHTML = `<span class="text-lg">${emoji}</span>`;
				}
			}}
		/>
	);
}
