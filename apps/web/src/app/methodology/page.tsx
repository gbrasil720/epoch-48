import "katex/dist/katex.min.css";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@epoch-48/ui/components/table";
import katex from "katex";

export const metadata = {
	title: "Methodology | Epoch 48",
	description: "How the Epoch 48 ranking system works",
};

function Formula({ tex }: { tex: string }) {
	const html = katex.renderToString(tex, {
		throwOnError: false,
		displayMode: true,
	});
	return (
		<div
			className="overflow-x-auto my-4 rounded-md border bg-muted/30 p-4"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

function Section({
	title,
	children,
	id,
}: {
	title: string;
	children: React.ReactNode;
	id?: string;
}) {
	return (
		<section id={id} className="scroll-mt-16 mb-12">
			<h2 className="mb-4 font-heading font-semibold text-2xl tracking-tight">
				{title}
			</h2>
			<div className="max-w-prose space-y-4 text-muted-foreground leading-relaxed">
				{children}
			</div>
		</section>
	);
}

function SubSection({
	title,
	children,
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<section className="scroll-mt-16 mb-8">
			<h3 className="mb-3 font-heading font-semibold text-xl tracking-tight">
				{title}
			</h3>
			<div className="space-y-3 text-muted-foreground leading-relaxed">
				{children}
			</div>
		</section>
	);
}

export default function MethodologyPage() {
	return (
		<div className="container mx-auto max-w-3xl py-10 px-4">
			<header className="mb-12">
				<h1 className="font-heading font-bold text-3xl tracking-tight sm:text-4xl">
					Methodology
				</h1>
				<p className="mt-2 text-muted-foreground">
					How the Epoch 48 ranking system works.
				</p>
			</header>

			<nav className="mb-10 rounded-lg border bg-muted/30 p-4">
				<p className="mb-2 font-medium text-sm">Contents</p>
				<ul className="space-y-1 text-sm">
					{[
						["Philosophy", "#philosophy"],
						["Tier 1: World Cup & Continental", "#tier-1"],
						["Tier 2: Qualifiers", "#tier-2"],
						["Score Formula", "#formula"],
						["Continental Bonus", "#bonus"],
						["Q-Index", "#q-index"],
						["Tiebreakers", "#tiebreakers"],
						["FIFA Comparison", "#fifa"],
					].map(([label, href]) => (
						<li key={href}>
							<a
								href={href}
								className="text-accent-green hover:underline"
							>
								{label}
							</a>
						</li>
					))}
				</ul>
			</nav>

			<Section title="Philosophy" id="philosophy">
				<p>
					Epoch 48 ranks national football teams based on <em>meaningful</em>{" "}
					competitive performance. Unlike Elo-based systems that update after
					every match, Epoch only counts results from official tournaments —
					World Cup finals, continental championships, and their qualifying
					campaigns.
				</p>
				<p>
					The system is designed to answer a simple question: <em>
						which nations perform best when it matters most?
					</em>{" "}
					Friendlies, exhibition matches, and low-stakes fixtures are excluded
					by design.
				</p>
			</Section>

			<Section title="Tier 1: World Cup & Continental" id="tier-1">
				<p>
					Tier 1 includes all nations that participate in a World Cup final
					tournament or a continental championship (Euros, Copa América, AFCON,
					Asian Cup, Olympic football). These are the highest-stakes
					competitions in international football.
				</p>
				<p>
					Each nation's score is computed from their tournament performance
					using a formula that rewards deep runs, goal difference, and clean
					disciplinary records.
				</p>
			</Section>

			<Section title="Tier 2: Qualifiers" id="tier-2">
				<p>
					Tier 2 includes nations that did not reach a final tournament but
					competed in qualifying campaigns. Their performance is measured using
					the Q-Index, which normalizes points earned against the maximum
					possible.
				</p>
			</Section>

			<Section title="Score Formula" id="formula">
				<p>The core scoring formula for Tier 1 nations:</p>
				<Formula tex={`S = P \\times \\frac{G_{\\text{diff}} + 15}{15} \\times \\left(1 + 0.01 \\cdot G_{\\text{for}}\\right) \\times \\left(1 - 0.01 \\cdot (Y + 2R)\\right)`} />
				<p>Where:</p>
				<ul className="list-inside list-disc space-y-1 pl-4">
					<li>
						<span className="font-mono text-sm">P</span> — points gained in the
						tournament
					</li>
					<li>
						<span className="font-mono text-sm">G_diff</span> — goal difference
						(clamped to a minimum of -15)
					</li>
					<li>
						<span className="font-mono text-sm">G_for</span> — goals scored
					</li>
					<li>
						<span className="font-mono text-sm">Y</span> — yellow cards received
					</li>
					<li>
						<span className="font-mono text-sm">R</span> — red cards received
					</li>
				</ul>
			</Section>

			<Section title="Continental Bonus" id="bonus">
				<p>
					A small bonus is applied to compensate for the relative competitive
					imbalance between confederations. Nations from smaller confederations
					receive a modest multiplier to account for the difficulty of their
					path.
				</p>
			</Section>

			<Section title="Q-Index" id="q-index">
				<p>The Q-Index for Tier 2 (qualifier-only) nations:</p>
				<Formula tex={`Q = \\frac{P_{\\text{earned}}}{P_{\\text{max}}} \\times \\frac{G_{\\text{diff}} + 10}{10}`} />
				<p>Where:</p>
				<ul className="list-inside list-disc space-y-1 pl-4">
					<li>
						<span className="font-mono text-sm">P_earned</span> — points earned
						in qualifying
					</li>
					<li>
						<span className="font-mono text-sm">P_max</span> — maximum possible
						points
					</li>
					<li>
						<span className="font-mono text-sm">G_diff</span> — goal difference
						in qualifying
					</li>
				</ul>
			</Section>

			<Section title="Tiebreakers" id="tiebreakers">
				<p>
					When two or more nations share the same Epoch score, the tie is
					broken by FIFA ranking (lower rank wins). If FIFA data is unavailable,
					the tie stands.
				</p>
			</Section>

			<Section title="FIFA Comparison" id="fifa">
				<p>
					Epoch rankings can be compared against the official FIFA/FIGL
					rankings. The delta column shows the difference: a positive value
					means the nation is ranked higher by FIFA than by Epoch, and
					negative means the opposite.
				</p>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Delta</TableHead>
							<TableHead>Meaning</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell className="font-mono text-sm">
								<span className="text-destructive">negative</span>
							</TableCell>
							<TableCell>
								Epoch ranks this nation <em>higher</em> than FIFA
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell className="font-mono text-sm">
								<span className="text-green-600">positive</span>
							</TableCell>
							<TableCell>
								FIFA ranks this nation <em>higher</em> than Epoch
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</Section>
		</div>
	);
}