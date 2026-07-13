import { Badge } from "@epoch-48/ui/components/badge";
import { ArrowDown, ArrowUp } from "reicon-react";
import type { ReactNode } from "react";

interface DeltaBadgeProps {
	value: number | null;
	children?: ReactNode;
}

export default function DeltaBadge({ value, children }: DeltaBadgeProps) {
	if (value === null || value === undefined) return null;
	const formatted = value >= 0 ? `+${value}` : `${value}`;
	const Icon = value >= 0 ? ArrowUp : ArrowDown;

	return (
		<Badge
			variant="outline"
			className={`gap-1 ${
				value > 0
					? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
					: value < 0
						? "bg-red-500/10 text-red-600 dark:text-red-400"
						: "bg-muted text-muted-foreground"
			}`}
		>
			<Icon size={12} />
			{formatted}
			{children && <span className="text-muted-foreground">{children}</span>}
		</Badge>
	);
}
