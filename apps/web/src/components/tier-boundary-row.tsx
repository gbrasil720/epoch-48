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
		<TableRow className="hover:bg-transparent">
			<TableCell colSpan={colSpan} className="px-0 py-0">
				<div className="flex items-center gap-3 px-4 py-2">
					<div className="h-px flex-1 bg-gradient-to-r from-border via-brand/30 to-border" />
					<span className="shrink-0 rounded-full bg-muted px-3 py-0.5 font-mono text-[0.65rem] text-muted-foreground uppercase tracking-widest">
						Tier 2
					</span>
					<div className="h-px flex-1 bg-gradient-to-r from-border via-brand/30 to-border" />
				</div>
			</TableCell>
		</TableRow>
	);
}
