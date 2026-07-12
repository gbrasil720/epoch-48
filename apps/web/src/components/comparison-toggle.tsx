"use client";

import {
	ToggleGroup,
	ToggleGroupItem,
} from "@epoch-48/ui/components/toggle-group";
import { useRouter, useSearchParams } from "next/navigation";

type ComparisonMode = "none" | "fifa" | "historical";

const MODES: { value: ComparisonMode; label: string }[] = [
	{ value: "none", label: "None" },
	{ value: "fifa", label: "FIFA" },
	{ value: "historical", label: "Historical" },
];

export default function ComparisonToggle() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const currentMode = (searchParams.get("mode") || "none") as ComparisonMode;

	function handleValueChange(value: string[]) {
		const mode = value[0] ?? "none";
		const params = new URLSearchParams(searchParams);
		if (mode === "none") {
			params.delete("mode");
		} else {
			params.set("mode", mode);
		}
		router.replace(`?${params.toString()}`);
	}

	return (
		<ToggleGroup
			type="single"
			value={[currentMode]}
			onValueChange={handleValueChange}
			aria-label="Comparison mode"
		>
			{MODES.map(({ value, label }) => (
				<ToggleGroupItem key={value} value={value}>
					{label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
