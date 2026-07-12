"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@epoch-48/ui/components/select";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useMemo } from "react";

interface EpochSelectorProps {
	epochs: number[];
}

export default function EpochSelector({ epochs }: EpochSelectorProps) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const id = useId();

	const currentEpoch = useMemo(() => {
		const param = searchParams.get("epoch");
		if (param && epochs.includes(Number(param))) {
			return Number(param);
		}
		return epochs[0] ?? 2022;
	}, [searchParams, epochs]);

	function handleChange(value: string | null, _eventDetails: unknown) {
		if (value === null) return;
		const params = new URLSearchParams(searchParams.toString());
		params.set("epoch", value);
		router.push(`?${params.toString()}`);
	}

	return (
		<Select value={String(currentEpoch)} onValueChange={handleChange}>
			<SelectTrigger size="sm" aria-label="Select epoch year" id={id}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{epochs.map((year) => (
					<SelectItem key={year} value={String(year)}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}