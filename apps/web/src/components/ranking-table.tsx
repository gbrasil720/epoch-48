"use client";

import { Badge } from "@epoch-48/ui/components/badge";
import { Button } from "@epoch-48/ui/components/button";
import { Input } from "@epoch-48/ui/components/input";
import { Skeleton } from "@epoch-48/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import { cn } from "@epoch-48/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { motion } from "framer-motion";
import { SortV, Search, XCircle } from "reicon-react";
import { useSearchParams } from "next/navigation";
import { Fragment, Suspense, useMemo, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import { trpc } from "@/utils/trpc";
import ComparisonToggle from "./comparison-toggle";
import DeltaBadge from "./delta-badge";
import EpochSelector from "./epoch-selector";
import { Flag } from "./flag";
import { type EpochRow, NationDetailDialog } from "./nation-detail-dialog";
import TierBoundaryRow from "./tier-boundary-row";

type ComparisonMode = "none" | "fifa" | "historical";

interface RankingTableProps {
	epochs: number[];
	initialEpoch?: number;
}

function SkeletonRow() {
	return (
		<TableRow>
			{Array.from({ length: 5 }).map((_, i) => (
				<TableCell key={i}>
					<Skeleton className="h-4 w-20" />
				</TableCell>
			))}
		</TableRow>
	);
}

function RankingTableInner({ epochs, initialEpoch }: RankingTableProps) {
	const searchParams = useSearchParams();
	const yearParam = searchParams.get("epoch");
	const year = yearParam
		? Number(yearParam)
		: (initialEpoch ?? epochs[0] ?? 2022);

	const { data: epochData, isLoading } = useQuery(
		trpc.ranking.getEpoch.queryOptions({ year }),
	);

	const [searchText, setSearchText] = useState("");
	const [sorting, setSorting] = useState<SortingState>([]);
	const [selectedRow, setSelectedRow] = useState<EpochRow | null>(null);
	const reducedMotion = useReducedMotion();

	const isSorted = sorting.length > 0;

	const columns = useMemo<ColumnDef<EpochRow>[]>(
		() => [
			{
				id: "rank",
				header: ({ column }) => (
					<Button
						variant="ghost"
						size="sm"
						className="-z-10 -ml-2 h-auto gap-1 p-0 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						data-cuelume-press="press"
						data-cuelume-release="release"
					>
						#
						<SortV size={12} />
					</Button>
				),
				accessorFn: (row) => row.rank,
				size: 56,
				cell: ({ row: cellRow }) => {
					const rank = cellRow.original.rank;
					return (
						<span
							className={cn(
								"font-bold font-mono tabular-nums transition-colors group-hover:text-brand",
								rank === 1 &&
									"font-black text-champion-gold group-hover:text-champion-gold",
							)}
						>
							{String(rank).padStart(2, "0")}
						</span>
					);
				},
				meta: { sticky: true },
			},
			{
				id: "nation",
				header: ({ column }) => (
					<Button
						variant="ghost"
						size="sm"
						className="-z-10 -ml-2 h-auto gap-1 p-0 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						data-cuelume-press="press"
						data-cuelume-release="release"
					>
						Nation
						<SortV size={12} />
					</Button>
				),
				accessorFn: (row) => row.nation.name,
				cell: ({ row: cellRow }) => {
					const nation = cellRow.original.nation;
					return (
						<div className="flex items-center gap-2.5">
							<Flag
								code={nation.code}
								emoji={nation.flag ?? undefined}
								size="sm"
							/>
							<div>
								<p className="font-medium text-sm">{nation.name}</p>
								<p className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-widest">
									{nation.code}
								</p>
							</div>
							{nation.confederation && (
								<Badge variant="outline" className="text-[0.6rem]">
									{nation.confederation}
								</Badge>
							)}
						</div>
					);
				},
			},
			{
				id: "score",
				header: ({ column }) => (
					<Button
						variant="ghost"
						size="sm"
						className="-z-10 -ml-2 h-auto gap-1 p-0 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						data-cuelume-press="press"
						data-cuelume-release="release"
					>
						Score
						<SortV size={12} />
					</Button>
				),
				accessorFn: (row) => row.score,
				size: 100,
				cell: ({ getValue, row: cellRow }) => (
					<span className="font-mono font-semibold text-sm tabular-nums">
						{(getValue() as number).toFixed(
							cellRow.original.tier === 1 ? 4 : 2,
						)}
					</span>
				),
			},
			{
				id: "fifaRank",
				header: ({ column }) => (
					<Button
						variant="ghost"
						size="sm"
						className="-z-10 -ml-2 h-auto gap-1 p-0 font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						data-cuelume-press="press"
						data-cuelume-release="release"
					>
						FIFA
						<SortV size={12} />
					</Button>
				),
				accessorFn: (row) => row.fifaRank,
				size: 72,
				cell: ({ getValue }) => (
					<span className="font-mono text-muted-foreground text-sm tabular-nums">
						{(getValue() as number | null) ?? "—"}
					</span>
				),
				meta: { hiddenByDefault: true },
			},
			{
				id: "fifaDelta",
				header: "FIFA Δ",
				accessorFn: (row) => row.fifaDelta,
				size: 80,
				cell: ({ getValue }) => (
					<DeltaBadge value={getValue() as number | null}>
						FIFA − Epoch
					</DeltaBadge>
				),
				meta: { hiddenByDefault: true },
			},
			{
				id: "historicalDelta",
				header: "Historical Δ",
				accessorFn: (row) => row.historicalDelta,
				size: 100,
				cell: ({ getValue }) => (
					<DeltaBadge value={getValue() as number | null}>
						Prev − Current
					</DeltaBadge>
				),
				meta: { hiddenByDefault: true },
			},
			{
				id: "phase",
				header: "Phase",
				accessorFn: (row) => row.phase,
				size: 120,
				cell: ({ getValue }) => (
					<Badge variant="secondary" className="text-[0.6rem]">
						{getValue() as string}
					</Badge>
				),
			},
		],
		[],
	);

	// Compute column visibility based on URL mode param
	const columnVisibility = useMemo((): Record<string, boolean> => {
		const currentMode = (searchParams.get("mode") as ComparisonMode) || "none";

		const visibility: Record<string, boolean> = {};
		for (const col of columns) {
			const id = col.id ?? "";
			const meta = col.meta as { hiddenByDefault?: boolean } | undefined;
			if (meta?.hiddenByDefault) {
				if (
					currentMode === "fifa" &&
					(id === "fifaRank" || id === "fifaDelta")
				) {
					visibility[id] = true;
				} else if (currentMode === "historical" && id === "historicalDelta") {
					visibility[id] = true;
				} else {
					visibility[id] = false;
				}
			} else {
				visibility[id] = true;
			}
		}
		return visibility;
	}, [columns, searchParams]);

	const table = useReactTable({
		data: epochData ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: (row) => row.nation.code,
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
			globalFilter: searchText,
			columnVisibility,
		},
		globalFilterFn: (row, _columnId, filterValue) => {
			const name = (row.original as EpochRow).nation.name.toLowerCase();
			return name.includes((filterValue as string).toLowerCase());
		},
	});

	const visibleColumnCount = Object.values(columnVisibility).filter(
		(v) => v,
	).length;

	// Find tier boundary index
	const tierBoundaryIndex = useMemo(() => {
		const rows = table.getRowModel().rows;
		for (let i = 0; i < rows.length - 1; i++) {
			if (
				(rows[i].original as EpochRow).tier === 1 &&
				(rows[i + 1].original as EpochRow).tier === 2
			) {
				return i;
			}
		}
		return -1;
	}, [table]);

	if (isLoading) {
		return (
			<div className="overflow-hidden border border-border/40 bg-card/30">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
								#
							</TableHead>
							<TableHead className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
								Nation
							</TableHead>
							<TableHead className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
								Score
							</TableHead>
							<TableHead className="font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]">
								Phase
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 10 }).map((_, i) => (
							<SkeletonRow key={i} />
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (!epochData || epochData.length === 0) {
		return (
			<div className="flex min-h-[200px] items-center justify-center border border-border/40 bg-card/30 p-6 text-center">
				<p className="font-mono text-muted-foreground text-sm">
					No ranking data available for this epoch.
				</p>
			</div>
		);
	}

	return (
		<div className="w-full" data-slot="ranking-table">
			{/* Controls */}
			<div className="mb-4 flex flex-wrap items-center gap-3">
				<div className="relative w-56">
					<Search size={14} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search nations..."
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
						className="pl-9"
						data-cuelume-focus="focus"
						data-cuelume-blur="release"
					/>
					{searchText && (
						<button
							type="button"
							onClick={() => setSearchText("")}
							className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<XCircle size={14} />
						</button>
					)}
				</div>
				<EpochSelector epochs={epochs} />
				<ComparisonToggle />
				{isSorted && (
					<Button variant="outline" size="sm" onClick={() => setSorting([])} data-cuelume-press="press" data-cuelume-release="release">
						Reset
					</Button>
				)}
			</div>

			{/* Table */}
			<div className="overflow-hidden border border-border/40 bg-card/30">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id} className="hover:bg-transparent">
								{headerGroup.headers.map((header) => {
									if (!header.column.getIsVisible()) return null;
									return (
										<TableHead
											key={header.id}
											className={cn(
												"select-none font-mono text-[0.6rem] text-muted-foreground uppercase tracking-[0.15em]",
												(
													header.column.columnDef.meta as
														| { sticky?: string }
														| undefined
												)?.sticky && "sticky left-0 z-20 bg-card/95",
											)}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row, index) => {
							const showTierBoundary =
								!isSorted && tierBoundaryIndex === index - 1;
							const original = row.original as EpochRow;
							const isTier1 = original.tier === 1;
							const isChampion = original.rank === 1;

							return (
								<Fragment key={`${row.id}-${index}`}>
									{showTierBoundary && (
										<TierBoundaryRow
											key={`tier-boundary-${index}`}
											label="--- Tier Boundary --- The Qualifiers Tier"
											colSpan={visibleColumnCount}
										/>
									)}
									{isTier1 && !reducedMotion ? (
										<motion.tr
											key={row.id}
											layout
											initial={{ opacity: 0, x: -8 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{
												delay: Math.min(index * 0.015, 0.4),
												duration: 0.25,
												ease: [0.32, 0.72, 0, 1] as [
													number,
													number,
													number,
													number,
												],
											}}
											className={cn(
												"group cursor-pointer",
												"hover:bg-muted/40",
												isChampion &&
													"border-l-2 border-l-champion-gold bg-champion-gold-muted/20 hover:bg-champion-gold-muted/30",
											)}
											onClick={() => setSelectedRow(original)}
												data-cuelume-press="press"
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell
													key={cell.id}
													className={cn(
														(
															cell.column.columnDef.meta as
																| { sticky?: string }
																| undefined
														)?.sticky &&
															"sticky left-0 z-20 bg-card/95 group-hover:bg-muted/40",
														isChampion && "bg-champion-gold-muted/20",
													)}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</motion.tr>
									) : (
										<TableRow
											key={row.id}
											className={cn(
												"group cursor-pointer transition-colors",
												"hover:bg-muted/40",
												!isTier1 && "text-muted-foreground/80",
												isChampion &&
													"border-l-2 border-l-champion-gold bg-champion-gold-muted/20 hover:bg-champion-gold-muted/30",
											)}
											onClick={() => setSelectedRow(original)}
												data-cuelume-press="press"
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell
													key={cell.id}
													className={cn(
														(
															cell.column.columnDef.meta as
																| { sticky?: string }
																| undefined
														)?.sticky &&
															"sticky left-0 z-20 bg-card/95 group-hover:bg-muted/40",
														isChampion && "bg-champion-gold-muted/20",
													)}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									)}
								</Fragment>
							);
						})}
					</TableBody>
				</Table>
			</div>

			{/* Footer */}
			{!isLoading && epochData && (
				<div className="mt-3 flex items-center justify-between font-mono text-[0.6rem] text-muted-foreground uppercase tracking-widest">
					<span>
						{epochData.length} nations · {year}
					</span>
					{searchParams.get("mode") !== "none" && searchParams.get("mode") && (
						<Badge variant="secondary" className="text-[0.6rem]">
							{searchParams.get("mode") === "fifa"
								? "FIFA comparison"
								: "Historical comparison"}
						</Badge>
					)}
				</div>
			)}

			{/* Nation Detail Dialog */}
			<NationDetailDialog
				open={selectedRow !== null}
				onOpenChange={(open) => !open && setSelectedRow(null)}
				row={selectedRow}
			/>
		</div>
	);
}

export function RankingTable({ epochs, initialEpoch }: RankingTableProps) {
	return (
		<Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
			<RankingTableInner epochs={epochs} initialEpoch={initialEpoch} />
		</Suspense>
	);
}

export type { EpochRow };
