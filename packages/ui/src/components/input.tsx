import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@epoch-48/ui/lib/utils";
import type * as React from "react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(
				"h-9 w-full min-w-0 border border-input bg-transparent px-3 py-2 font-mono text-xs tabular-nums outline-none transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:disabled:bg-input/80 dark:hover:bg-input/50",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
