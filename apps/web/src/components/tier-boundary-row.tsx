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
		<TableRow className="border-border border-t-2 border-double bg-muted/30">
			<TableCell
				colSpan={colSpan}
				className="border-none py-2 text-center font-mono text-[0.7rem] text-muted-foreground uppercase tracking-widest"
			>
				{label}
			</TableCell>
		</TableRow>
	);
}
