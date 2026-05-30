import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Hero from '../components/sections/Hero'
import FeaturedApps from '../components/sections/FeaturedApps'
import FeaturedGames from '../components/sections/FeaturedGames'
import Categories from '../components/sections/Categories'
import Stats from '../components/sections/Stats'
import Testimonials from '../components/sections/Testimonials'
import Footer from '../components/layout/Footer'
import { particlePositions } from '../components/data/homeData'

type ThemeMode = 'dark' | 'light'

function Home() {
	const [theme, setTheme] = useState<ThemeMode>(() => {
		if (typeof window === 'undefined') return 'dark'
		const storedTheme = window.localStorage.getItem('fas-theme')
		return storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'
	})

	useEffect(() => {
		window.localStorage.setItem('fas-theme', theme)
		document.documentElement.dataset.theme = theme
		document.documentElement.classList.toggle('dark', theme === 'dark')
	}, [theme])

	const prefersReducedMotion = useReducedMotion()

	return (
		<main id="home" className="relative overflow-hidden text-(--text-primary)">
			{/* This page keeps the original homepage design intact; only the file location changed. */}
			<div className="noise-grid absolute inset-0 opacity-25" />
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="glow-orb -left-32 -top-24 h-72 w-72 bg-violet-600/40" />
				<div className="glow-orb -right-16 top-32 h-64 w-64 bg-cyan-400/25" />
				<div className="glow-orb bottom-[10%] left-[18%] h-80 w-80 bg-fuchsia-500/18" />
				<div className="glow-orb right-[14%] bottom-[16%] h-72 w-72 bg-blue-500/18" />
				{particlePositions.map((position, index) => (
					<motion.span
						key={index}
						className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/70 shadow-[0_0_18px_rgba(103,232,249,0.95)]"
						style={position}
						animate={prefersReducedMotion ? undefined : { y: [0, -14, 0], opacity: [0.25, 1, 0.25] }}
						transition={{ duration: 5 + index * 0.6, repeat: Infinity, ease: 'easeInOut' }}
					/>
				))}
			</div>

			<Navbar theme={theme} onToggle={setTheme} />

			<Hero />
			<Categories />
			<FeaturedApps />
			<FeaturedGames />
			<Stats />
			<Testimonials />

			<section id="features" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
				<div className="glass-panel-strong relative overflow-hidden rounded-4xl p-6 sm:p-8 lg:p-10">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.18),transparent_32%)]" />
					<div className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-900 dark:text-cyan-100">
								<svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M17.6 8.6 12 13.2 6.4 8.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
								Install as an app
							</div>
							<h2 className="theme-heading mt-5 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">Turn the store into a native, always-ready experience.</h2>
							<p className="theme-text-muted mt-4 max-w-2xl text-base leading-7 sm:text-lg">Save the marketplace to your home screen, browse offline-friendly listings, and stay connected with instant updates, deep links, and push-ready infrastructure.</p>
							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<button className="inline-flex items-center justify-center gap-2 rounded-full bg-[color:var(--card-bg)] px-6 py-3.5 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]">Install the PWA</button>
								<button className="inline-flex items-center justify-center gap-2 rounded-full border border-(--border-color) bg-(--card-bg) px-6 py-3.5 text-sm font-semibold text-(--text-primary) transition hover:bg-(--accent-soft)">Learn More</button>
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="theme-card rounded-[1.4rem] p-5 text-center backdrop-blur-md"><div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/20 to-cyan-400/20 text-[color:var(--accent)]">☁️</div><p className="mt-4 text-sm font-medium text-[color:var(--text-primary)]">Sync across devices</p></div>
							<div className="theme-card rounded-[1.4rem] p-5 text-center backdrop-blur-md"><div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-violet-500/20 to-cyan-400/20 text-[color:var(--accent)]">🔒</div><p className="mt-4 text-sm font-medium text-[color:var(--text-primary)]">Secure publishing</p></div>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</main>
	)
}

export default Home
