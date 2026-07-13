import { cn } from "@epoch-48/ui/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn("animate-pulse bg-muted/60", className)}
			{...props}
		/>
	);
}

export { Skeleton };
