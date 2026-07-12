import { TableCell, TableRow } from "@epoch-48/ui/components/table";

interface TierBoundaryRowProps {
	label: string;
	colSpan: number;
}

export default function TierBoundaryRow({
	label,
	colSpan,
}: TierBoundaryRowProps) {
	return (
		<TableRow className="bg-muted/50 font-medium">
			<TableCell
				colSpan={colSpan}
				className="border-none py-1 text-center text-muted-foreground text-xs"
			>
				{label}
			</TableCell>
		</TableRow>
	);
}
