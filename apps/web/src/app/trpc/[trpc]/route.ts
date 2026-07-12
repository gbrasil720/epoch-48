import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

export const dynamic = "force-dynamic";

const handler = async (req: Request) => {
	const { appRouter } = await import("@epoch-48/api/routers/index");
	return fetchRequestHandler({
		endpoint: "/trpc",
		req,
		router: appRouter,
		createContext: () => ({ auth: null, session: null }),
	});
};

export { handler as GET, handler as POST };
