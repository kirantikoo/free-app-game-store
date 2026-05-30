import { motion } from 'framer-motion'
import { ArrowRight, Bot, Gamepad2, LayoutDashboard, Rocket, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageShell, Badge, SecondaryButton, GlowButton, SectionHeader } from '../components/ui/StoreUI'
import { useStoreTheme } from '../hooks/useStoreTheme'

function Dashboard() {
	const { theme, setTheme } = useStoreTheme()

	return (
		<PageShell
			theme={theme}
			onToggleTheme={setTheme}
			eyebrow="Workspace"
			title="Your premium dashboard"
			description="A logged-in home for creators and users. Admin users can jump into the protected control center from here."
			action={<Badge tone="success">Protected access</Badge>}
		>
			<div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
				<div className="glass-panel-strong rounded-[2.25rem] p-6 sm:p-8">
					<Badge tone="info">Live workspace</Badge>
					<h2 className="theme-heading mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Welcome back. Your store tools are ready.</h2>
					<p className="theme-text-muted mt-4 max-w-2xl text-base leading-7">This page gives logged-in users a premium overview instead of an empty route. It keeps the same futuristic glass and glow style as the homepage.</p>

					<div className="mt-6 grid gap-4 sm:grid-cols-2">
						{[
							{ icon: LayoutDashboard, label: 'Personal overview', value: '12 widgets' },
							{ icon: Rocket, label: 'Publish queue', value: '3 drafts' },
							{ icon: Bot, label: 'AI assists', value: 'Enabled' },
							{ icon: Gamepad2, label: 'Store access', value: 'Apps + Games' },
						].map((item) => {
							const Icon = item.icon
							return (
								<div key={item.label} className="theme-card rounded-[1.6rem] p-4">
									<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]"><Icon className="h-5 w-5" /></div>
									<p className="mt-4 text-sm text-[color:var(--text-secondary)]">{item.label}</p>
									<p className="mt-1 text-lg font-semibold text-[color:var(--text-primary)]">{item.value}</p>
								</div>
							)
						})}
					</div>

					<div className="mt-6 flex flex-col gap-3 sm:flex-row">
						<GlowButton type="button"><Sparkles className="h-4 w-4" /> Continue exploring</GlowButton>
						<Link to="/publish"><SecondaryButton type="button"><ArrowRight className="h-4 w-4" /> Publish new release</SecondaryButton></Link>
					</div>
				</div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }} className="glass-panel-strong rounded-[2.25rem] p-6 sm:p-8">
					<SectionHeader eyebrow="Quick insights" title="What you can do next" description="Browse the marketplace, check submissions, or jump into the admin control center if your role allows it." />

					<div className="space-y-3">
						{[
							'Browse the latest apps and games in the marketplace.',
							'Publish a new release from the creator dashboard.',
							'Check submission and analytics history in the admin area.',
						].map((item) => (
							<div key={item} className="theme-card rounded-2xl px-4 py-4 text-sm text-[color:var(--text-secondary)]">{item}</div>
						))}
					</div>

					<div className="mt-6 rounded-[1.6rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)]/80 p-5">
						<p className="text-xs uppercase tracking-[0.32em] text-[color:var(--text-secondary)]">Performance snapshot</p>
						<div className="mt-4 grid gap-3 sm:grid-cols-3">
							<div className="theme-card rounded-2xl p-4"><p className="text-2xl font-semibold text-[color:var(--text-primary)]">84%</p><p className="mt-1 text-xs uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">Engagement</p></div>
							<div className="theme-card rounded-2xl p-4"><p className="text-2xl font-semibold text-[color:var(--text-primary)]">2.4K</p><p className="mt-1 text-xs uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">Daily actions</p></div>
							<div className="theme-card rounded-2xl p-4"><p className="text-2xl font-semibold text-[color:var(--text-primary)]">96%</p><p className="mt-1 text-xs uppercase tracking-[0.25em] text-[color:var(--text-secondary)]">Uptime</p></div>
						</div>
					</div>
				</motion.div>
			</div>
		</PageShell>
	)
}

export default Dashboard
