import { Rocket, ShieldCheck, Sparkles } from 'lucide-react'
import type { IconType } from './homeData'

export interface AuthFeature {
  title: string
  description: string
  icon: IconType
}

export interface OnboardingStep {
  title: string
  description: string
}

export interface MarketApp {
  id: string
  name: string
  category: string
  description: string
  developer: string
  rating: number
  installs: string
  pwa: boolean
  github: boolean
  screenshot: string
  icon: string
  badge?: string
  featured?: boolean
}

export interface MarketGame {
  id: string
  title: string
  genre: string
  description: string
  studio: string
  rating: number
  players: string
  banner: string
  screenshot: string
  featured?: boolean
}

export interface PublishStep {
  label: string
  value: number
}

export const authFeatures: AuthFeature[] = [
  { title: 'Fast account access', description: 'Email, Google, and GitHub auth stitched into a glassmorphism flow.', icon: Sparkles },
  { title: 'Trust at a glance', description: 'Readable state, loading feedback, and subtle success animations.', icon: ShieldCheck },
  { title: 'Creator onboarding', description: 'Designed to feel like a premium product launch from the first screen.', icon: Rocket },
]

export const onboardingSteps: OnboardingStep[] = [
  { title: 'Create your identity', description: 'Choose a username, profile avatar, and your preferred account provider.' },
  { title: 'Connect your workspace', description: 'Link a GitHub repo, demo URL, and distribution preferences.' },
  { title: 'Ship with confidence', description: 'Publish into a store UI built like a premium SaaS dashboard.' },
]

export const loginTrustBullets = ['Remember me support', 'Forgot password recovery', 'Instant Google/GitHub auth', 'Accessible keyboard navigation']

export const registerTrustBullets = ['Password strength meter', 'Avatar upload preview', 'Terms checkbox', 'Social onboarding shortcuts']

export const publishSections = ['App Details', 'Screenshots', 'GitHub Integration', 'Deployment Settings', 'SEO Metadata']

export const publishProgress: PublishStep[] = [
  { label: 'Metadata complete', value: 82 },
  { label: 'Assets uploaded', value: 64 },
  { label: 'SEO ready', value: 71 },
  { label: 'Review queue', value: 36 },
]

export const fireStoreSchemaPreview = {
  userProfiles: ['uid', 'displayName', 'username', 'photoURL', 'providerId', 'createdAt'],
  appSubmissions: ['id', 'ownerId', 'name', 'slug', 'category', 'tags', 'pricingModel', 'status', 'githubUrl', 'demoUrl', 'screenshots', 'createdAt'],
  marketplaceApps: ['id', 'name', 'category', 'rating', 'installCount', 'githubUrl', 'pwaEnabled'],
  marketplaceGames: ['id', 'title', 'genre', 'rating', 'playerCount', 'bannerUrl'],
}

export const publishSidebarItems = [
  { label: 'App Details', value: 'Step 01' },
  { label: 'Assets', value: 'Step 02' },
  { label: 'Distribution', value: 'Step 03' },
  { label: 'Publish', value: 'Step 04' },
]

export const appFilters = ['Featured', 'Trending', 'New Releases', 'AI Apps', 'Productivity', 'Developer Tools']

export const appCollections = {
  featured: [
    {
      id: 'pulse-workspace',
      name: 'Pulse Workspace',
      category: 'Productivity',
      description: 'A calm command center for tasks, notes, and cloud sync across every device.',
      developer: 'Pulse Labs',
      rating: 4.9,
      installs: '120K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      icon: 'PW',
      badge: 'Featured',
      featured: true,
    },
    {
      id: 'nova-ai-studio',
      name: 'Nova AI Studio',
      category: 'AI Apps',
      description: 'Generate content, automate workflows, and connect your GitHub projects in one place.',
      developer: 'Nova Forge',
      rating: 4.8,
      installs: '86K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      icon: 'AI',
      badge: 'AI',
      featured: true,
    },
  ] satisfies MarketApp[],
  trending: [
    {
      id: 'forge-metrics',
      name: 'Forge Metrics',
      category: 'Developer Tools',
      description: 'Ship dashboards, traces, and release alerts with beautiful clarity.',
      developer: 'Forge Studio',
      rating: 4.7,
      installs: '42K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
      icon: 'FM',
      badge: 'Trending',
    },
    {
      id: 'learnloop',
      name: 'LearnLoop',
      category: 'Productivity',
      description: 'Modern lessons, streak tracking, and offline-first learning for teams.',
      developer: 'Loop Labs',
      rating: 4.9,
      installs: '54K+',
      pwa: true,
      github: false,
      screenshot: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
      icon: 'LL',
      badge: 'New',
    },
  ] satisfies MarketApp[],
  newReleases: [
    {
      id: 'orbit-mail',
      name: 'Orbit Mail',
      category: 'Productivity',
      description: 'A distraction-free inbox with smart filters and AI-assisted replies.',
      developer: 'Orbit Systems',
      rating: 4.8,
      installs: '18K+',
      pwa: true,
      github: false,
      screenshot: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      icon: 'OM',
      badge: 'Fresh',
    },
    {
      id: 'vector-note',
      name: 'Vector Note',
      category: 'AI Apps',
      description: 'A beautiful notebook with semantic search and instant summarization.',
      developer: 'Vector Works',
      rating: 4.7,
      installs: '24K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1518933165971-611dbc9c412d?auto=format&fit=crop&w=1200&q=80',
      icon: 'VN',
      badge: 'Launch',
    },
  ] satisfies MarketApp[],
  ai: [
    {
      id: 'prompt-fabric',
      name: 'Prompt Fabric',
      category: 'AI Apps',
      description: 'Build prompt libraries, share templates, and ship collaborative AI workflows.',
      developer: 'Fabric Labs',
      rating: 4.8,
      installs: '36K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
      icon: 'PF',
      badge: 'AI',
    },
    {
      id: 'atlas-build',
      name: 'Atlas Build',
      category: 'Developer Tools',
      description: 'Deploy app previews, monitor CI, and surface AI-generated summaries.',
      developer: 'Atlas Studio',
      rating: 4.9,
      installs: '29K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?auto=format&fit=crop&w=1200&q=80',
      icon: 'AB',
      badge: 'AI',
    },
  ] satisfies MarketApp[],
  productivity: [
    {
      id: 'flow-sync',
      name: 'Flow Sync',
      category: 'Productivity',
      description: 'Smart task planning and cross-device sync for teams and solo builders.',
      developer: 'Flow Studio',
      rating: 4.9,
      installs: '76K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      icon: 'FS',
      badge: 'Popular',
    },
    {
      id: 'pulse-brief',
      name: 'Pulse Brief',
      category: 'Productivity',
      description: 'Daily planning, team notes, and release checklists in a single workspace.',
      developer: 'Pulse Labs',
      rating: 4.8,
      installs: '34K+',
      pwa: true,
      github: false,
      screenshot: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
      icon: 'PB',
      badge: 'Team',
    },
  ] satisfies MarketApp[],
  developerTools: [
    {
      id: 'forge-scope',
      name: 'Forge Scope',
      category: 'Developer Tools',
      description: 'Visualize release health, logs, and deploy metrics with cinematic clarity.',
      developer: 'Forge Studio',
      rating: 4.7,
      installs: '28K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
      icon: 'FS',
      badge: 'Dev',
    },
    {
      id: 'shipboard',
      name: 'Shipboard',
      category: 'Developer Tools',
      description: 'A minimal release dashboard for publishing, approvals, and changelog notes.',
      developer: 'Shipboard Inc.',
      rating: 4.8,
      installs: '19K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      icon: 'SB',
      badge: 'Dev',
    },
  ] satisfies MarketApp[],
  all: [
    {
      id: 'pulse-workspace',
      name: 'Pulse Workspace',
      category: 'Productivity',
      description: 'A clean command center for tasks, notes, and cloud sync across every device.',
      developer: 'Pulse Labs',
      rating: 4.9,
      installs: '120K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      icon: 'PW',
      badge: 'Featured',
      featured: true,
    },
    {
      id: 'nova-ai-studio',
      name: 'Nova AI Studio',
      category: 'AI Apps',
      description: 'Generate content, automate workflows, and connect your GitHub projects in one place.',
      developer: 'Nova Forge',
      rating: 4.8,
      installs: '86K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      icon: 'AI',
      badge: 'AI',
      featured: true,
    },
    {
      id: 'forge-metrics',
      name: 'Forge Metrics',
      category: 'Developer Tools',
      description: 'Ship dashboards, traces, and release alerts with beautiful clarity.',
      developer: 'Forge Studio',
      rating: 4.7,
      installs: '42K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
      icon: 'FM',
      badge: 'Trending',
    },
    {
      id: 'learnloop',
      name: 'LearnLoop',
      category: 'Education',
      description: 'Modern lessons, streak tracking, and offline-first learning for teams.',
      developer: 'Loop Labs',
      rating: 4.9,
      installs: '54K+',
      pwa: true,
      github: false,
      screenshot: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
      icon: 'LL',
      badge: 'New',
    },
    {
      id: 'orbit-mail',
      name: 'Orbit Mail',
      category: 'Productivity',
      description: 'A distraction-free inbox with smart filters and AI-assisted replies.',
      developer: 'Orbit Systems',
      rating: 4.8,
      installs: '18K+',
      pwa: true,
      github: false,
      screenshot: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      icon: 'OM',
      badge: 'Fresh',
    },
    {
      id: 'vector-note',
      name: 'Vector Note',
      category: 'AI Apps',
      description: 'A beautiful notebook with semantic search and instant summarization.',
      developer: 'Vector Works',
      rating: 4.7,
      installs: '24K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1518933165971-611dbc9c412d?auto=format&fit=crop&w=1200&q=80',
      icon: 'VN',
      badge: 'Launch',
    },
    {
      id: 'flow-sync',
      name: 'Flow Sync',
      category: 'Productivity',
      description: 'Smart task planning and cross-device sync for teams and solo builders.',
      developer: 'Flow Studio',
      rating: 4.9,
      installs: '76K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      icon: 'FS',
      badge: 'Popular',
    },
    {
      id: 'prompt-fabric',
      name: 'Prompt Fabric',
      category: 'AI Apps',
      description: 'Build prompt libraries, share templates, and ship collaborative AI workflows.',
      developer: 'Fabric Labs',
      rating: 4.8,
      installs: '36K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80',
      icon: 'PF',
      badge: 'AI',
    },
    {
      id: 'atlas-build',
      name: 'Atlas Build',
      category: 'Developer Tools',
      description: 'Deploy app previews, monitor CI, and surface AI-generated summaries.',
      developer: 'Atlas Studio',
      rating: 4.9,
      installs: '29K+',
      pwa: true,
      github: true,
      screenshot: 'https://images.unsplash.com/photo-1526374965328-8b27d8c4d2f4?auto=format&fit=crop&w=1200&q=80',
      icon: 'AB',
      badge: 'AI',
    },
  ] satisfies MarketApp[],
}

export const gameFilters = ['Featured Games', 'Action', 'Puzzle', 'Racing', 'Indie', 'Multiplayer', 'Trending Now']

export const gameCollections = {
  featured: [
    {
      id: 'neon-drift',
      title: 'Neon Drift',
      genre: 'Racing',
      description: 'A cinematic anti-gravity racer with synthwave tracks and explosive drift trails.',
      studio: 'Arc Pulse',
      rating: 4.9,
      players: '1.2M players',
      banner: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/163077/game-gamepad-video-game-xbox-163077.jpeg?auto=compress&cs=tinysrgb&w=1200',
      featured: true,
    },
    {
      id: 'quantum-arena',
      title: 'Quantum Arena',
      genre: 'Action',
      description: 'Fast-paced combat in a neon battleground built for competitive squads.',
      studio: 'Nova Games',
      rating: 4.9,
      players: '890K players',
      banner: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=1200',
      featured: true,
    },
  ] satisfies MarketGame[],
  action: [
    {
      id: 'sky-legends',
      title: 'Sky Legends',
      genre: 'Adventure',
      description: 'Explore floating islands, unlock ancient relics, and lead a skyborne crew.',
      studio: 'Cloud Atlas',
      rating: 4.8,
      players: '740K players',
      banner: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      id: 'rift-runners',
      title: 'Rift Runners',
      genre: 'Action',
      description: 'A roguelike arena shooter with reactive lighting and adaptive enemy waves.',
      studio: 'Signal Nine',
      rating: 4.7,
      players: '520K players',
      banner: 'https://images.pexels.com/photos/160598/game-controller-video-game-play-160598.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/907221/pexels-photo-907221.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ] satisfies MarketGame[],
  puzzle: [
    {
      id: 'puzzle-rift',
      title: 'Puzzle Rift',
      genre: 'Puzzle',
      description: 'Mind-bending architecture puzzles with elegant neon feedback.',
      studio: 'Lattice Works',
      rating: 4.7,
      players: '310K players',
      banner: 'https://images.pexels.com/photos/163450/board-game-pieces-pieces-figure-163450.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/163450/board-game-pieces-pieces-figure-163450.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      id: 'signal-tiles',
      title: 'Signal Tiles',
      genre: 'Puzzle',
      description: 'Minimalist logic loops with a premium editorial presentation.',
      studio: 'North Star',
      rating: 4.8,
      players: '160K players',
      banner: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ] satisfies MarketGame[],
  racing: [
    {
      id: 'night-circuit',
      title: 'Night Circuit',
      genre: 'Racing',
      description: 'Hyper-speed city tracks with vibrant reflections and cinematic speed lines.',
      studio: 'Velocity Lab',
      rating: 4.8,
      players: '640K players',
      banner: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      id: 'drift-division',
      title: 'Drift Division',
      genre: 'Racing',
      description: 'Compete in online drift leagues with neon underglow and precision handling.',
      studio: 'Torque Forge',
      rating: 4.7,
      players: '430K players',
      banner: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ] satisfies MarketGame[],
  indie: [
    {
      id: 'moon-arcade',
      title: 'Moon Arcade',
      genre: 'Indie',
      description: 'A tiny but unforgettable story platformer with a handcrafted neon aesthetic.',
      studio: 'Tiny Orbit',
      rating: 4.9,
      players: '190K players',
      banner: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/1144176/pexels-photo-1144176.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      id: 'star-vault',
      title: 'Star Vault',
      genre: 'Indie',
      description: 'Discover secrets through exploration, crafting, and delicate ambient design.',
      studio: 'Vault Nine',
      rating: 4.8,
      players: '240K players',
      banner: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/275033/pexels-photo-275033.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ] satisfies MarketGame[],
  multiplayer: [
    {
      id: 'co-op-nebula',
      title: 'Nebula Ops',
      genre: 'Multiplayer',
      description: 'Team-based missions with voice-ready lobbies and live event drops.',
      studio: 'Nebula Core',
      rating: 4.8,
      players: '980K players',
      banner: 'https://images.pexels.com/photos/786003/pexels-photo-786003.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/786003/pexels-photo-786003.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
    {
      id: 'arena-echo',
      title: 'Arena Echo',
      genre: 'Multiplayer',
      description: 'A futuristic showdown arena with ranked ladders and social play.',
      studio: 'Echo Forge',
      rating: 4.7,
      players: '610K players',
      banner: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ] satisfies MarketGame[],
  trending: [
    {
      id: 'cosmic-rivals',
      title: 'Cosmic Rivals',
      genre: 'Action',
      description: 'Rise through weekly ranked seasons in a futuristic battle arena.',
      studio: 'Orbit House',
      rating: 4.9,
      players: '1.4M players',
      banner: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=1200',
      featured: true,
    },
    {
      id: 'hyper-drift',
      title: 'Hyper Drift',
      genre: 'Racing',
      description: 'Competitive street circuits with luminous trails and next-gen physics.',
      studio: 'Velocity Lab',
      rating: 4.8,
      players: '810K players',
      banner: 'https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=1200',
      screenshot: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1200',
    },
  ] satisfies MarketGame[],
}