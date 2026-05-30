import { type ComponentType } from 'react'
import { Layers3, Bot, GraduationCap, Gamepad2, Puzzle, Code2, Wallet, Music2 } from 'lucide-react'

export type IconType = ComponentType<{ className?: string }>

export interface NavigationLink {
  label: string
  href: string
}

export interface RouteLink {
  label: string
  to: string
}

export interface CategoryCard {
  name: string
  description: string
  icon: IconType
  gradient: string
}

export interface AppCard {
  name: string
  category: string
  description: string
  rating: number
  installs: string
  image: string
  logo: string
}

export interface GameCard {
  title: string
  genre: string
  rating: number
  image: string
}

export interface FeatureCard {
  title: string
  description: string
  icon: IconType
}

export interface Testimonial {
  name: string
  role: string
  avatar: string
  quote: string
}

export interface Statistic {
  label: string
  value: number
  suffix: string
}

export const navLinks: NavigationLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'Apps', href: '#apps' },
  { label: 'Games', href: '#games' },
  { label: 'Categories', href: '#categories' },
  { label: 'Community', href: '#community' },
  { label: 'About', href: '#about' },
]

export const routeNavLinks: RouteLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Apps', to: '/apps' },
  { label: 'Games', to: '/games' },
]

export const routeFooterLinks: RouteLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Apps', to: '/apps' },
  { label: 'Games', to: '/games' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/register' },
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Publish', to: '/publish' },
  { label: 'Admin', to: '/admin' },
]

export const categories: CategoryCard[] = [
  { name: 'Productivity', description: 'Ship faster with modern workflows.', icon: Layers3, gradient: 'from-violet-500/25 via-fuchsia-500/20 to-cyan-400/20' },
  { name: 'AI Tools', description: 'Smart assistants, copilots, and models.', icon: Bot, gradient: 'from-cyan-500/25 via-sky-500/20 to-indigo-400/20' },
  { name: 'Education', description: 'Interactive learning for every level.', icon: GraduationCap, gradient: 'from-emerald-500/25 via-teal-500/20 to-cyan-400/20' },
  { name: 'Arcade Games', description: 'Fast, fun, and instantly playable.', icon: Gamepad2, gradient: 'from-orange-500/25 via-rose-500/20 to-violet-400/20' },
  { name: 'Puzzle Games', description: 'Mind-bending mechanics and strategy.', icon: Puzzle, gradient: 'from-blue-500/25 via-violet-500/20 to-pink-400/20' },
  { name: 'Developer Tools', description: 'Debug, build, and deploy with ease.', icon: Code2, gradient: 'from-fuchsia-500/25 via-purple-500/20 to-blue-400/20' },
  { name: 'Finance', description: 'Track budgets, goals, and markets.', icon: Wallet, gradient: 'from-lime-500/25 via-emerald-500/20 to-cyan-400/20' },
  { name: 'Music', description: 'Creative tools and premium sound utilities.', icon: Music2, gradient: 'from-pink-500/25 via-rose-500/20 to-orange-400/20' },
]

export const apps: AppCard[] = [
  {
    name: 'Pulse Workspace',
    category: 'Productivity',
    description: 'A clean command center for tasks, notes, and cloud sync across every device.',
    rating: 4.9,
    installs: '120K+',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    logo: 'PW',
  },
  {
    name: 'Nova AI Studio',
    category: 'AI Tools',
    description: 'Generate content, automate workflows, and connect your GitHub projects in one place.',
    rating: 4.8,
    installs: '86K+',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    logo: 'AI',
  },
  {
    name: 'LearnLoop',
    category: 'Education',
    description: 'Modern lessons, streak tracking, and offline-first learning for students and teams.',
    rating: 4.9,
    installs: '54K+',
    image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
    logo: 'LL',
  },
  {
    name: 'Forge Metrics',
    category: 'Developer Tools',
    description: 'Ship dashboards, performance traces, and shipping alerts with beautiful clarity.',
    rating: 4.7,
    installs: '42K+',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
    logo: 'FM',
  },
]

export const games: GameCard[] = [
  { title: 'Neon Drift', genre: 'Racing', rating: 4.9, image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'Sky Legends', genre: 'Adventure', rating: 4.8, image: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'Quantum Arena', genre: 'Action', rating: 4.9, image: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=1200' },
  { title: 'Puzzle Rift', genre: 'Puzzle', rating: 4.7, image: 'https://images.pexels.com/photos/163450/board-game-pieces-pieces-figure-163450.jpeg?auto=compress&cs=tinysrgb&w=1200' },
]

export const features: FeatureCard[] = [
  // icons referencing badge components are resolved in UI files
]

export const testimonials: Testimonial[] = [
  {
    name: 'Maya Chen',
    role: 'Indie Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    quote: 'The publishing flow feels like a premium product launch. Our app got discovered in the first week.',
  },
  {
    name: 'Jordan Rivera',
    role: 'Product Designer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    quote: 'It looks and feels like a top-tier startup marketplace. The dark glass UI is genuinely memorable.',
  },
  {
    name: 'Alyssa Noor',
    role: 'Studio Founder',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80',
    quote: 'The install-first experience and community energy make this feel built for the next wave of creators.',
  },
]

export const stats: Statistic[] = [
  { label: 'Developers', value: 1200, suffix: '+' },
  { label: 'Apps', value: 8600, suffix: '+' },
  { label: 'Games', value: 4200, suffix: '+' },
  { label: 'Downloads', value: 12, suffix: 'M+' },
]

export const particlePositions = [
  { top: '12%', left: '14%' },
  { top: '22%', left: '82%' },
  { top: '38%', left: '12%' },
  { top: '48%', left: '72%' },
  { top: '66%', left: '18%' },
  { top: '74%', left: '86%' },
  { top: '84%', left: '34%' },
  { top: '18%', left: '56%' },
]

export const defaultNavLinks = navLinks
