"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cn } from "@epoch-48/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const toggleVariants = cva(
	"group/toggle inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-mono text-xs uppercase tracking-widest outline-none transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 aria-pressed:shadow-sm aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[state=on]:bg-muted data-[state=on]:shadow-sm dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				outline: "border border-input bg-transparent shadow-sm hover:bg-muted",
			},
			size: {
				default:
					"h-9 min-w-9 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
				sm: "h-8 min-w-8 rounded-md px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				lg: "h-10 min-w-10 rounded-lg px-3.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Toggle({
	className,
	variant = "default",
	size = "default",
	...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
	return (
		<TogglePrimitive
			data-slot="toggle"
			className={cn(toggleVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Toggle, toggleVariants };
