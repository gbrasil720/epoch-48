"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { toggleVariants } from "@epoch-48/ui/components/toggle";
import { cn } from "@epoch-48/ui/lib/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";

const ToggleGroupContext = React.createContext<
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
		orientation?: "horizontal" | "vertical";
	}
>({
	size: "default",
	variant: "default",
	spacing: 2,
	orientation: "horizontal",
});

function ToggleGroup<Value extends string = string>({
	className,
	variant,
	size,
	spacing = 2,
	orientation = "horizontal",
	children,
	type,
	...props
}: ToggleGroupPrimitive.Props<Value> &
	VariantProps<typeof toggleVariants> & {
		spacing?: number;
		orientation?: "horizontal" | "vertical";
		type?: "single" | "multiple";
	}) {
	const multiple = type === "multiple";
	return (
		<ToggleGroupPrimitive
			data-slot="toggle-group"
			data-variant={variant}
			data-size={size}
			data-spacing={spacing}
			data-orientation={orientation}
			style={{ "--gap": spacing } as React.CSSProperties}
			className={cn(
				"group/toggle-group inline-flex w-fit items-center gap-[--spacing(var(--gap))] bg-muted/50 p-1 data-vertical:flex-col data-vertical:items-stretch",
				className,
			)}
			multiple={multiple}
			{...(props as Omit<ToggleGroupPrimitive.Props<Value>, "multiple">)}
		>
			<ToggleGroupContext.Provider
				value={{ variant, size, spacing, orientation }}
			>
				{children}
			</ToggleGroupContext.Provider>
		</ToggleGroupPrimitive>
	);
}

function ToggleGroupItem({
	className,
	children,
	variant = "default",
	size = "default",
	...props
}: TogglePrimitive.Props &
	VariantProps<typeof toggleVariants> & {
		children?: React.ReactNode;
	}) {
	const context = React.use(ToggleGroupContext);

	return (
		<TogglePrimitive
			data-slot="toggle-group-item"
			data-variant={context.variant ?? variant}
			data-size={context.size ?? size}
			className={cn(
				toggleVariants({
					variant: context.variant ?? variant,
					size: context.size ?? size,
				}),
				"rounded-lg aria-pressed:bg-transparent data-[state=on]:bg-popover data-[state=on]:shadow-sm",
				className,
			)}
			{...props}
		>
			{children}
		</TogglePrimitive>
	);
}

export { ToggleGroup, ToggleGroupItem };
