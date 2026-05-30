import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Search, Star, LayoutGrid, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appCollections, appFilters, type MarketApp } from '../components/data/marketplaceData'
import { Badge, EmptyState, GlowButton, PageShell, SectionHeader, SecondaryButton, SkeletonGrid, TextInput } from '../components/ui/StoreUI'
import { GitHubBadge } from '../components/ui/Shared'
import { useStoreTheme } from '../hooks/useStoreTheme'

function Apps() {
	const { theme, setTheme } = useStoreTheme()
	const [search, setSearch] = useState('')
	const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'installs' | 'name'>('featured')
	const [selectedFilter, setSelectedFilter] = useState('Featured')
	const [loading, setLoading] = useState(true)
	const [visibleCount, setVisibleCount] = useState(8)
	const sentinelRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const timer = window.setTimeout(() => setLoading(false), 900)
		return () => window.clearTimeout(timer)
	}, [])

	const allApps = appCollections.all

	const filteredApps = useMemo(() => {
		const query = search.trim().toLowerCase()
		const matched = allApps.filter((app) => {
			const matchesFilter =
				selectedFilter === 'Featured'
					? app.featured
					: selectedFilter === 'Trending'
						? app.badge === 'Trending'
						: selectedFilter === 'New Releases'
							? app.badge === 'New' || app.badge === 'Fresh' || app.badge === 'Launch'
							: app.category === selectedFilter || app.badge === selectedFilter

			const matchesQuery = !query || [app.name, app.category, app.description, app.developer, app.badge].some((value) => value?.toLowerCase().includes(query))
			return matchesFilter && matchesQuery
		})

		const sorted = [...matched].sort((left, right) => {
			if (sortBy === 'rating') return right.rating - left.rating
			if (sortBy === 'name') return left.name.localeCompare(right.name)
			if (sortBy === 'installs') return Number(right.installs.replace(/[^0-9]/g, '')) - Number(left.installs.replace(/[^0-9]/g, ''))
			if (left.featured !== right.featured) return left.featured ? -1 : 1
			return right.rating - left.rating
		})

		return sorted
	}, [allApps, search, selectedFilter, sortBy])

	useEffect(() => {
		setVisibleCount(8)
	}, [search, selectedFilter, sortBy])

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting) {
					setVisibleCount((current) => Math.min(current + 4, filteredApps.length))
				}
			},
			{ rootMargin: '180px' },
		)

		const sentinel = sentinelRef.current
		if (sentinel) observer.observe(sentinel)
		return () => observer.disconnect()
	}, [filteredApps.length])

	const visibleApps = filteredApps.slice(0, visibleCount)
	const sectionGroups: Array<[string, MarketApp[]]> = [
		['Featured Apps', appCollections.featured],
		['Trending Apps', appCollections.trending],
		['New Releases', appCollections.newReleases],
		['AI Apps', appCollections.ai],
		['Productivity', appCollections.productivity],
		['Developer Tools', appCollections.developerTools],
	]

	return (
		<PageShell
			theme={theme}
			onToggleTheme={setTheme}
			eyebrow="Apps marketplace"
			title="Discover premium free apps"
			description="Search, sort, and explore a futuristic marketplace with glowing hover states, install actions, badges, and scalable loading behavior."
			action={<Badge tone="info">Infinite scroll enabled</Badge>}
		>
			<div className="space-y-8">
				<div className="glass-panel-strong overflow-hidden rounded-[2.4rem] p-6 sm:p-8">
					<div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
						<div>
							<Badge tone="success">Trending for creators and teams</Badge>
							<h2 className="theme-heading mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Find apps that feel built for the next generation.</h2>
							<p className="theme-text-muted mt-4 max-w-2xl text-base leading-7 sm:text-lg">Every card carries the same premium product language as the homepage: dark glass panels, neon glow, polished cards, and deliberate motion.</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<GlowButton type="button"><Search className="h-4 w-4" /> Start exploring</GlowButton>
								<SecondaryButton type="button"><LayoutGrid className="h-4 w-4" /> Browse categories</SecondaryButton>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							{[
								{ value: '8.6K', label: 'Apps available' },
								{ value: '120K+', label: 'Installs today' },
								{ value: '4.9', label: 'Average rating' },
								{ value: 'PWA', label: 'Install ready' },
							].map((stat) => (
								<div key={stat.label} className="theme-card rounded-[1.6rem] p-4">
									<p className="text-2xl font-semibold tracking-[-0.04em] text-[color:var(--text-primary)]">{stat.value}</p>
									<p className="mt-2 text-sm text-[color:var(--text-secondary)]">{stat.label}</p>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className="glass-panel-strong rounded-[2rem] p-5 sm:p-6">
					<div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr_0.65fr]">
						<label className="relative block">
							<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Search</span>
							<TextInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search apps, devs, badges, categories..." className="pl-11" />
							<Search className="pointer-events-none absolute left-4 top-[2.55rem] h-4 w-4 text-[color:var(--text-secondary)]" />
						</label>
						<label className="block">
							<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Sort</span>
							<select value={sortBy} onChange={(event) => setSortBy(event.target.value as typeof sortBy)} className="w-full rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-4 py-3.5 text-sm text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent)]">
								<option value="featured">Featured first</option>
								<option value="rating">Top rated</option>
								<option value="installs">Most installed</option>
								<option value="name">Alphabetical</option>
							</select>
						</label>
						<div>
							<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Filter</span>
							<div className="flex flex-wrap gap-2">
								{appFilters.map((filter) => (
									<button key={filter} type="button" onClick={() => setSelectedFilter(filter)} className={['rounded-full border px-4 py-2 text-sm font-medium transition', selectedFilter === filter ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]' : 'border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-secondary)] hover:text-[color:var(--text-primary)]'].join(' ')}>
										{filter}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{loading ? <SkeletonGrid count={4} /> : null}

				{!loading ? (
					<>
						{sectionGroups.map(([title, apps]) => (
							<section key={title} className="space-y-5">
								<SectionHeader eyebrow={title} title={title} description="A curated collection of premium cards rendered with the same luminous depth as the homepage." />
								<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
									{apps.map((app) => <AppCard key={app.id} app={app} />)}
								</div>
							</section>
						))}

						<section className="space-y-5">
							<SectionHeader eyebrow="Marketplace feed" title="All apps" description="The feed grows as you scroll. It respects search, sort, and category filters." />
							{visibleApps.length ? (
								<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
									{visibleApps.map((app) => <AppCard key={app.id} app={app} compact />)}
								</div>
							) : (
								<EmptyState
									title="No apps match this search"
									description="Try a different query or switch the category filter. The marketplace feed will populate once the filters match an item."
									action={<Link to="/publish" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_35px_rgba(139,92,246,0.45)] transition hover:scale-[1.02]"><span>Publish the first match</span><ArrowRight className="h-4 w-4" /></Link>}
								/>
							)}
							<div ref={sentinelRef} className="h-12" />
						</section>
					</>
				) : null}
			</div>
		</PageShell>
	)
}

function AppCard({ app, compact = false }: { app: MarketApp; compact?: boolean }) {
	return (
		<motion.article whileHover={{ y: -6 }} transition={{ duration: 0.25 }} className={['theme-card group overflow-hidden rounded-[1.9rem]', compact ? 'p-4' : 'p-5'].join(' ')}>
			<div className="relative overflow-hidden rounded-[1.5rem] border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]">
				<img src={app.screenshot} alt={`${app.name} screenshot`} className={compact ? 'h-40 w-full object-cover transition duration-500 group-hover:scale-105' : 'h-56 w-full object-cover transition duration-500 group-hover:scale-105'} />
				<div className="absolute inset-0 bg-gradient-to-t from-[color:var(--bg-primary)]/80 via-transparent to-transparent" />
				<div className="absolute left-4 top-4 flex gap-2">
					{app.badge ? <Badge tone="info">{app.badge}</Badge> : null}
					{app.pwa ? <Badge tone="success">PWA</Badge> : null}
					{app.github ? <Badge tone="default"><GitHubBadge className="mr-1 h-3.5 w-3.5" /> GitHub</Badge> : null}
				</div>
			</div>

			<div className="pt-4">
				<div className="flex items-start justify-between gap-3">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-400 text-sm font-bold text-white shadow-[0_0_24px_rgba(45,212,255,0.24)]">{app.icon}</div>
						<div>
							<h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{app.name}</h3>
							<p className="text-sm text-[color:var(--text-secondary)]">{app.category} · {app.developer}</p>
						</div>
					</div>
					<div className="inline-flex items-center gap-1 rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-1 text-sm font-medium text-[color:var(--text-primary)]"><Star className="h-4 w-4 text-amber-300" /> {app.rating}</div>
				</div>
				<p className="mt-3 text-sm leading-7 text-[color:var(--text-secondary)]">{app.description}</p>
				<div className="mt-4 flex flex-wrap items-center justify-between gap-3">
					<div className="text-sm text-[color:var(--text-secondary)]">{app.installs} installs</div>
					<SecondaryButton type="button" className="px-4 py-2.5 text-sm"><Download className="h-4 w-4" /> Install</SecondaryButton>
				</div>
			</div>
		</motion.article>
	)
}

export default Apps
