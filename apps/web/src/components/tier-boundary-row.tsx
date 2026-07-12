import { TableCell, TableRow } from "@epoch-48/ui/components/table";

interface TierBoundaryRowProps {
	label: string;
}

export default function TierBoundaryRow({ label }: TierBoundaryRowProps) {
	return (
		<TableRow className="bg-muted/50 font-medium">
			<TableCell
				colSpan={6}
				className="border-none py-1 text-center text-muted-foreground text-xs"
			>
				{label}
			</TableCell>
		</TableRow>
	);
}
