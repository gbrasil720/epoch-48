import { Badge } from "@epoch-48/ui/components/badge";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import type { ReactNode } from "react";

interface DeltaBadgeProps {
	value: number | null;
	children?: ReactNode;
}

export default function DeltaBadge({ value, children }: DeltaBadgeProps) {
	if (value === null || value === undefined) return null;
	const formatted = value >= 0 ? `+${value}` : `${value}`;
	const Icon = value >= 0 ? ArrowUpIcon : ArrowDownIcon;
	const variant =
		value > 0 ? "default" : value < 0 ? "destructive" : ("secondary" as const);

	return (
		<Badge variant={variant}>
			<Icon className="size-3" />
			{formatted}
			{children && <span className="text-muted-foreground">{children}</span>}
		</Badge>
	);
}
