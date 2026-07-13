import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cn } from "@epoch-48/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
	"group/button inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap font-mono text-xs uppercase tracking-widest outline-none transition-all duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:ring-2 focus-visible:ring-ring active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"border border-transparent bg-primary text-primary-foreground shadow-none hover:bg-primary/90",
				outline:
					"border border-border bg-transparent shadow-none hover:bg-muted/50 hover:text-foreground",
				secondary:
					"border border-border bg-secondary text-secondary-foreground shadow-none hover:bg-secondary/80",
				ghost:
					"border border-transparent bg-transparent hover:bg-muted/50 hover:text-foreground",
				destructive:
					"border border-transparent bg-destructive/10 text-destructive shadow-none hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 dark:hover:bg-destructive/30",
				link: "border border-transparent bg-transparent text-primary underline-offset-4 shadow-none hover:underline",
			},
			size: {
				default:
					"h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				xs: "h-6 gap-1 px-2 text-[0.65rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
				sm: "h-8 gap-1.5 px-3 text-[0.7rem] has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				lg: "h-10 gap-2 px-5 text-sm has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
				icon: "h-9 w-9 p-0",
				"icon-sm": "h-8 w-8 p-0",
				"icon-lg": "h-10 w-10 p-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	render,
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
