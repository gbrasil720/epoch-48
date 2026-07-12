import type { AppRouter } from "@epoch-48/api/routers/index";
import { env } from "@epoch-48/env/web";
import { QueryClient } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

export const queryClient = new QueryClient();

// Client-side tRPC: uses relative path, served by Next.js route handler at /trpc
const trpcClient = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: "/trpc",
		}),
	],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
	client: trpcClient,
	queryClient,
});

// Server-side client for RSC: calls the local Next.js route handler
const serverUrl = env.NEXT_PUBLIC_SERVER_URL.replace(/\/$/, "");

export const trpcServer = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${serverUrl}/trpc`,
		}),
	],
});
