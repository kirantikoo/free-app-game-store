// React import not required with automatic JSX runtime
import { Users, BarChart2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { routeFooterLinks } from '../data/homeData'
import { BrandLogo, GitHubBadge, LinkedInBadge } from '../ui/Shared'

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr_0.95fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <BrandLogo />
              <div>
                <p className="text-sm font-semibold tracking-[0.28em] text-[color:var(--text-primary)]/90">FREE APP & GAME STORE</p>
                <p className="text-xs text-[color:var(--text-secondary)]">Open-source marketplace</p>
              </div>
            </Link>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--text-secondary)]">
              Discover, install, and publish free apps and games through a premium marketplace built for creators and users who care about speed, design, and openness.
            </p>
            <p className="mt-5 text-sm font-medium text-[color:var(--accent)]">Built by Kiran Tikoo</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Explore</p>
            <div className="mt-4 grid gap-3 text-sm text-[color:var(--text-secondary)]">
              {routeFooterLinks.map((link) => (
                <NavLink key={link.label} to={link.to} end className={({ isActive }) => (isActive ? 'text-[color:var(--accent)]' : 'transition hover:text-[color:var(--text-primary)]')}>
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Community</p>
            <div className="mt-4 grid gap-3 text-sm text-[color:var(--text-secondary)]">
              <a href="https://github.com" className="inline-flex items-center gap-2 transition hover:text-[color:var(--text-primary)]">
                <GitHubBadge className="h-4 w-4" />
                GitHub
              </a>
              <a href="https://discord.com" className="inline-flex items-center gap-2 transition hover:text-[color:var(--text-primary)]">
                <Users className="h-4 w-4" />
                Discord
              </a>
              <a href="https://www.linkedin.com" className="inline-flex items-center gap-2 transition hover:text-[color:var(--text-primary)]">
                <LinkedInBadge className="h-4 w-4" />
                LinkedIn
              </a>
              <a href="https://x.com" className="inline-flex items-center gap-2 transition hover:text-[color:var(--text-primary)]">
                <BarChart2 className="h-4 w-4" />
                Twitter / X
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[color:var(--border-color)] pt-5 text-center text-sm text-[color:var(--text-secondary)]">
          © {new Date().getFullYear()} Free App & Game Store. Built for free distribution and open discovery.
        </div>
      </div>
    </footer>
  )
}
