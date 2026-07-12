"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 1500): number {
	const [count, setCount] = useState(0);

	useEffect(() => {
		const start = performance.now();
		const frame = (now: number) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - (1 - progress) ** 3;
			setCount(Math.round(target * eased * 100) / 100);
			if (progress < 1) requestAnimationFrame(frame);
		};
		requestAnimationFrame(frame);
	}, [target, duration]);

	return count;
}
