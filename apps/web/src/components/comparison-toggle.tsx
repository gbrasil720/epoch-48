"use client";

import {
	ToggleGroup,
	ToggleGroupItem,
} from "@epoch-48/ui/components/toggle-group";
import { ChartBar, ArrowSwapHorizontal2, XCircle } from "reicon-react";
import { useRouter, useSearchParams } from "next/navigation";

type ComparisonMode = "none" | "fifa" | "historical";

const MODES: {
	value: ComparisonMode;
	label: string;
	icon: React.ElementType;
}[] = [
	{ value: "none", label: "None", icon: XCircle },
	{ value: "fifa", label: "FIFA", icon: ChartBar },
	{ value: "historical", label: "Historical", icon: ArrowSwapHorizontal2 },
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
			size="sm"
			className="bg-muted/50"
		>
			{MODES.map(({ value, label, icon: Icon }) => (
				<ToggleGroupItem key={value} value={value} className="gap-1.5" data-cuelume-press="press" data-cuelume-release="release">
					<Icon size={14} />
					{label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	);
}
