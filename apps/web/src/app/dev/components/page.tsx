import { Badge } from "@epoch-48/ui/components/badge";
import { Button } from "@epoch-48/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@epoch-48/ui/components/card";
import { Checkbox } from "@epoch-48/ui/components/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@epoch-48/ui/components/dropdown-menu";
import { Input } from "@epoch-48/ui/components/input";
import { Label } from "@epoch-48/ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@epoch-48/ui/components/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import { Textarea } from "@epoch-48/ui/components/textarea";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@epoch-48/ui/components/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@epoch-48/ui/components/tooltip";

import { Suspense } from "react";

import ComparisonToggle from "@/components/comparison-toggle";
import DeltaBadge from "@/components/delta-badge";
import TierBoundaryRow from "@/components/tier-boundary-row";

export default function ComponentsShowcase() {
	return (
		<div className="space-y-8 p-4">
			<h1 className="font-bold text-2xl">Component Showcase</h1>

			{/* Buttons */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Buttons</h2>
				<div className="flex flex-wrap gap-2">
					<Button>Default</Button>
					<Button variant="outline">Outline</Button>
					<Button variant="secondary">Secondary</Button>
					<Button variant="ghost">Ghost</Button>
					<Button variant="destructive">Destructive</Button>
					<Button variant="link">Link</Button>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button size="xs">XS</Button>
					<Button size="sm">SM</Button>
					<Button size="default">Default</Button>
					<Button size="lg">LG</Button>
					<Button size="icon">
						<span className="sr-only">Icon</span>⚡
					</Button>
				</div>
			</section>

			{/* Badges */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Badges</h2>
				<div className="flex flex-wrap gap-2">
					<Badge>Default</Badge>
					<Badge variant="secondary">Secondary</Badge>
					<Badge variant="destructive">Destructive</Badge>
					<Badge variant="outline">Outline</Badge>
					<Badge variant="ghost">Ghost</Badge>
					<Badge variant="link">Link</Badge>
				</div>
			</section>

			{/* Delta Badges */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Delta Badges</h2>
				<div className="flex flex-wrap gap-2">
					<DeltaBadge value={5} />
					<DeltaBadge value={-3} />
					<DeltaBadge value={0} />
				</div>
			</section>

			{/* Toggle Group */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Toggle Group</h2>
				<div className="flex flex-col gap-2">
					<ToggleGroup type="single">
						<ToggleGroupItem value="a">A</ToggleGroupItem>
						<ToggleGroupItem value="b">B</ToggleGroupItem>
						<ToggleGroupItem value="c">C</ToggleGroupItem>
					</ToggleGroup>
					<ToggleGroup type="multiple">
						<ToggleGroupItem value="a">A</ToggleGroupItem>
						<ToggleGroupItem value="b">B</ToggleGroupItem>
						<ToggleGroupItem value="c">C</ToggleGroupItem>
					</ToggleGroup>
				</div>
			</section>

			{/* Comparison Toggle */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Comparison Toggle</h2>
				<Suspense fallback={<div>Loading...</div>}>
					<ComparisonToggle />
				</Suspense>
			</section>

			{/* Inputs */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Inputs</h2>
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Label htmlFor="demo-input">Text input</Label>
						<Input id="demo-input" placeholder="Type here..." />
					</div>
					<Textarea placeholder="Type a message..." />
					<div className="flex items-center gap-2">
						<Checkbox id="demo-checkbox" />
						<Label htmlFor="demo-checkbox">Checkbox</Label>
					</div>
				</div>
			</section>

			{/* Select */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Select</h2>
				<Select>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select an option" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="1">Option 1</SelectItem>
						<SelectItem value="2">Option 2</SelectItem>
						<SelectItem value="3">Option 3</SelectItem>
					</SelectContent>
				</Select>
			</section>

			{/* Dropdown Menu */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Dropdown Menu</h2>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={<Button variant="outline">Open</Button>}
					/>
					<DropdownMenuContent>
						<DropdownMenuItem>Action</DropdownMenuItem>
						<DropdownMenuItem>Another action</DropdownMenuItem>
						<DropdownMenuItem>Something else</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</section>

			{/* Tooltip */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Tooltip</h2>
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger
							render={<Button variant="outline">Hover me</Button>}
						/>
						<TooltipContent>
							<p>This is a tooltip</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</section>

			{/* Card */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Card</h2>
				<Card className="w-full max-w-sm">
					<CardHeader>
						<CardTitle>Card Title</CardTitle>
						<CardDescription>Card description goes here.</CardDescription>
					</CardHeader>
					<CardContent>
						<p>Some card content.</p>
					</CardContent>
				</Card>
			</section>

			{/* Table */}
			<section className="space-y-2">
				<h2 className="font-semibold text-lg">Table</h2>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Rank</TableHead>
							<TableHead>Team</TableHead>
							<TableHead>Score</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>1</TableCell>
							<TableCell>Argentina</TableCell>
							<TableCell>98.50</TableCell>
						</TableRow>
						<TierBoundaryRow label="Tier 1 / Tier 2 Boundary" />
						<TableRow>
							<TableCell>49</TableCell>
							<TableCell>Team 49</TableCell>
							<TableCell>45.20</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</section>
		</div>
	);
}
