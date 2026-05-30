import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { deleteDoc, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Area, AreaChart, BarChart, Bar, LineChart, Line } from 'recharts'
import { BarChart3, CheckCircle2, Code2, DollarSign, Gamepad2, Search, Sparkles, Trash2, TrendingUp, Users } from 'lucide-react'
import { AdminLayout, CategoryManager, DashboardChart, EmptyState, LoadingSkeleton, StatCard, StatusBadge, SubmissionDetailsModal, SubmissionTable, UserTable, SettingsPanel } from '../components/admin/AdminUI'
import type { AdminNavItem, AdminSectionId, AdminSettingsState } from '../components/admin/AdminUI'
import { Badge, TextInput } from '../components/ui/StoreUI'
import { auth, firestoreCollections } from '../services/firebase'
import { useStoreTheme } from '../hooks/useStoreTheme'

type SubmissionStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'changes_requested'
type SubmissionType = 'app' | 'game'
type CatalogVisibility = 'public' | 'private' | 'unlisted'
type UserRole = 'user' | 'developer' | 'admin'

interface SubmissionRecord {
	id: string
	type: SubmissionType
	name: string
	developer: string
	category: string
	status: SubmissionStatus
	createdAt: string
	downloads: string
	rating: number
	githubUrl: string
	demoUrl: string
	summary: string
	screenshots: string[]
	tags: string[]
}

interface CatalogRecord {
	id: string
	name: string
	category: string
	developer: string
	status: 'approved' | 'draft'
	featured: boolean
	trending: boolean
	visibility: CatalogVisibility
	downloads: string
	rating: number
	screenshots: string[]
	updatedAt: string
	playUrl: string
	genre?: string
}

interface UserRecord {
	id: string
	name: string
	email: string
	role: UserRole
	joinedAt: string
	projects: number
	status: 'active' | 'disabled'
}

interface CategoryRecord {
	id: string
	name: string
	icon: string
	color: string
	description: string
	order: number
}

const demoSubmissions: SubmissionRecord[] = [
	{ id: 'sub_001', type: 'app', name: 'Nova Notes', developer: 'Nova Forge', category: 'AI Apps', status: 'pending', createdAt: '2h ago', downloads: '12.4K', rating: 4.9, githubUrl: 'https://github.com/nova/notes', demoUrl: 'https://nova-notes.app', summary: 'Semantic notes with AI summaries and premium workspace layouts.', screenshots: ['https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80'], tags: ['ai', 'notes', 'pwa'] },
	{ id: 'sub_002', type: 'game', name: 'Hyper Drift', developer: 'Velocity Lab', category: 'Racing', status: 'changes_requested', createdAt: '6h ago', downloads: '8.1K', rating: 4.8, githubUrl: 'https://github.com/velocity/hyper-drift', demoUrl: 'https://hyper-drift.game', summary: 'A neon racer with cinematic tracks and progressive handling.', screenshots: ['https://images.pexels.com/photos/210019/pexels-photo-210019.jpeg?auto=compress&cs=tinysrgb&w=900'], tags: ['racing', 'multiplayer', 'neon'] },
	{ id: 'sub_003', type: 'app', name: 'Forge Metrics', developer: 'Forge Studio', category: 'Developer Tools', status: 'approved', createdAt: '1d ago', downloads: '42.2K', rating: 4.7, githubUrl: 'https://github.com/forge/metrics', demoUrl: 'https://forge-metrics.app', summary: 'Release monitoring and traces in a polished dark dashboard.', screenshots: ['https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80'], tags: ['dashboard', 'devtools'] },
]

const demoApps: CatalogRecord[] = [
	{ id: 'app_001', name: 'Pulse Workspace', category: 'Productivity', developer: 'Pulse Labs', status: 'approved', featured: true, trending: true, visibility: 'public', downloads: '120K+', rating: 4.9, screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80'], updatedAt: 'Today', playUrl: 'https://pulse.example.com' },
	{ id: 'app_002', name: 'Nova AI Studio', category: 'AI Apps', developer: 'Nova Forge', status: 'approved', featured: true, trending: true, visibility: 'public', downloads: '86K+', rating: 4.8, screenshots: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80'], updatedAt: 'Yesterday', playUrl: 'https://nova.example.com' },
	{ id: 'app_003', name: 'LearnLoop', category: 'Education', developer: 'Loop Labs', status: 'approved', featured: false, trending: false, visibility: 'public', downloads: '54K+', rating: 4.9, screenshots: ['https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=900&q=80'], updatedAt: '2d ago', playUrl: 'https://learnloop.example.com' },
]

const demoGames: CatalogRecord[] = [
	{ id: 'game_001', name: 'Neon Drift', category: 'Racing', developer: 'Arc Pulse', status: 'approved', featured: true, trending: true, visibility: 'public', downloads: '1.2M', rating: 4.9, screenshots: ['https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=900'], updatedAt: 'Today', playUrl: 'https://neondrift.example.com', genre: 'Racing' },
	{ id: 'game_002', name: 'Quantum Arena', category: 'Action', developer: 'Nova Games', status: 'approved', featured: true, trending: true, visibility: 'public', downloads: '890K', rating: 4.9, screenshots: ['https://images.pexels.com/photos/3945685/pexels-photo-3945685.jpeg?auto=compress&cs=tinysrgb&w=900'], updatedAt: 'Yesterday', playUrl: 'https://quantumarena.example.com', genre: 'Action' },
	{ id: 'game_003', name: 'Puzzle Rift', category: 'Puzzle', developer: 'Lattice Works', status: 'approved', featured: false, trending: false, visibility: 'public', downloads: '310K', rating: 4.7, screenshots: ['https://images.pexels.com/photos/163450/board-game-pieces-pieces-figure-163450.jpeg?auto=compress&cs=tinysrgb&w=900'], updatedAt: '3d ago', playUrl: 'https://puzzlerift.example.com', genre: 'Puzzle' },
]

const demoUsers: UserRecord[] = [
	{ id: 'user_001', name: 'Maya Chen', email: 'maya@nova.app', role: 'developer', joinedAt: 'Jan 12', projects: 4, status: 'active' },
	{ id: 'user_002', name: 'Jordan Rivera', email: 'jordan@pulse.dev', role: 'user', joinedAt: 'Feb 03', projects: 1, status: 'active' },
	{ id: 'user_003', name: 'Alyssa Noor', email: 'alyssa@studio.io', role: 'admin', joinedAt: 'Mar 18', projects: 7, status: 'active' },
]

const demoCategories: CategoryRecord[] = [
	{ id: 'cat_001', name: 'Productivity', icon: '◉', color: '#8b5cf6', description: 'Workflow, notes, and collaboration', order: 1 },
	{ id: 'cat_002', name: 'AI Apps', icon: '✦', color: '#22d3ee', description: 'Assistants and automation tools', order: 2 },
	{ id: 'cat_003', name: 'Games', icon: '▲', color: '#ec4899', description: 'Immersive and replayable games', order: 3 },
	{ id: 'cat_004', name: 'Developer Tools', icon: '⌘', color: '#34d399', description: 'Build, monitor, and ship faster', order: 4 },
]

const demoSettings: AdminSettingsState = {
	platformName: 'Free App & Game Store',
	heroText: 'Discover premium free apps and games',
	featuredAppsLimit: 6,
	maintenanceMode: false,
	submissionApprovalMode: true,
	logoUrl: '',
	firebaseStatus: 'Connected',
}

const weeklyGrowth = [
	{ day: 'Mon', users: 340, downloads: 2400, submissions: 12 },
	{ day: 'Tue', users: 380, downloads: 2800, submissions: 16 },
	{ day: 'Wed', users: 420, downloads: 3050, submissions: 18 },
	{ day: 'Thu', users: 460, downloads: 3560, submissions: 20 },
	{ day: 'Fri', users: 520, downloads: 4120, submissions: 24 },
	{ day: 'Sat', users: 560, downloads: 4800, submissions: 28 },
	{ day: 'Sun', users: 610, downloads: 5280, submissions: 30 },
]

const topCategories = [
	{ name: 'Productivity', value: 34, color: '#8b5cf6' },
	{ name: 'AI Apps', value: 22, color: '#06b6d4' },
	{ name: 'Games', value: 27, color: '#ec4899' },
	{ name: 'Developer Tools', value: 17, color: '#34d399' },
]

const sectionMeta: Record<AdminSectionId, { title: string; subtitle: string }> = {
	overview: { title: 'Admin Overview', subtitle: 'Track growth, moderation, revenue, and platform health in one premium console.' },
	submissions: { title: 'Submission Management', subtitle: 'Review drafts, pending releases, and approval decisions from Firestore.' },
	apps: { title: 'Apps Management', subtitle: 'Manage approved apps, featured slots, trending status, and visibility.' },
	games: { title: 'Games Management', subtitle: 'Curate the gaming catalog with genre, banners, play URLs, and featured placement.' },
	users: { title: 'User Management', subtitle: 'Manage community roles, submission history, and account health.' },
	categories: { title: 'Categories Management', subtitle: 'Organize store categories with icons, colors, and priority order.' },
	analytics: { title: 'Analytics', subtitle: 'Visualize installs, plays, visitors, and growth trends using chart data.' },
	settings: { title: 'Settings', subtitle: 'Control platform branding, moderation mode, and Firebase configuration status.' },
}

function Admin() {
	const { theme, setTheme } = useStoreTheme()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [message, setMessage] = useState('')
	const [activeSection, setActiveSection] = useState<AdminSectionId>('overview')
	const [search, setSearch] = useState('')
	const [submissionFilter, setSubmissionFilter] = useState<'all' | SubmissionStatus>('pending')
	const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null)
	const [submissions, setSubmissions] = useState<SubmissionRecord[]>(demoSubmissions)
	const [apps, setApps] = useState<CatalogRecord[]>(demoApps)
	const [games, setGames] = useState<CatalogRecord[]>(demoGames)
	const [users, setUsers] = useState<UserRecord[]>(demoUsers)
	const [categories, setCategories] = useState<CategoryRecord[]>(demoCategories)
	const [settings, setSettings] = useState<AdminSettingsState>(demoSettings)

	const currentUserName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || 'Admin'
	const currentUserEmail = auth.currentUser?.email || 'admin@freeappgamestore.com'

	useEffect(() => {
		let active = true

		async function load() {
			try {
				const [submissionSnap, appSnap, gameSnap, userSnap, categorySnap, settingsSnap] = await Promise.all([
					getDocs(firestoreCollections.submissions),
					getDocs(firestoreCollections.apps),
					getDocs(firestoreCollections.games),
					getDocs(firestoreCollections.users),
					getDocs(firestoreCollections.categories),
					getDocs(firestoreCollections.settings),
				])

				if (!active) return

				if (!submissionSnap.empty) {
					setSubmissions(submissionSnap.docs.map((snapshot) => ({
						id: snapshot.id,
						type: (snapshot.data().type as SubmissionType) ?? 'app',
						name: snapshot.data().name ?? snapshot.id,
						developer: snapshot.data().developer ?? 'Unknown',
						category: snapshot.data().category ?? 'Uncategorized',
						status: (snapshot.data().status as SubmissionStatus) ?? 'pending',
						createdAt: snapshot.data().createdAt?.toDate?.()?.toLocaleDateString?.() ?? 'Today',
						downloads: snapshot.data().downloads ?? '0',
						rating: Number(snapshot.data().rating ?? 0),
						githubUrl: snapshot.data().githubUrl ?? '',
						demoUrl: snapshot.data().demoUrl ?? '',
						summary: snapshot.data().summary ?? '',
						screenshots: snapshot.data().screenshots ?? [],
						tags: snapshot.data().tags ?? [],
					})))
				}

				if (!appSnap.empty) {
					setApps(appSnap.docs.map((snapshot) => ({
						id: snapshot.id,
						name: snapshot.data().name ?? snapshot.id,
						category: snapshot.data().category ?? 'Uncategorized',
						developer: snapshot.data().developer ?? 'Unknown',
						status: 'approved',
						featured: Boolean(snapshot.data().featured),
						trending: Boolean(snapshot.data().trending),
						visibility: (snapshot.data().visibility as CatalogVisibility) ?? 'public',
						downloads: snapshot.data().downloads ?? '0',
						rating: Number(snapshot.data().rating ?? 0),
						screenshots: snapshot.data().screenshots ?? [],
						updatedAt: snapshot.data().updatedAt?.toDate?.()?.toLocaleDateString?.() ?? 'Today',
						playUrl: snapshot.data().playUrl ?? '',
					})))
				}

				if (!gameSnap.empty) {
					setGames(gameSnap.docs.map((snapshot) => ({
						id: snapshot.id,
						name: snapshot.data().name ?? snapshot.id,
						category: snapshot.data().category ?? 'Uncategorized',
						developer: snapshot.data().developer ?? 'Unknown',
						status: 'approved',
						featured: Boolean(snapshot.data().featured),
						trending: Boolean(snapshot.data().trending),
						visibility: (snapshot.data().visibility as CatalogVisibility) ?? 'public',
						downloads: snapshot.data().downloads ?? '0',
						rating: Number(snapshot.data().rating ?? 0),
						screenshots: snapshot.data().screenshots ?? [],
						updatedAt: snapshot.data().updatedAt?.toDate?.()?.toLocaleDateString?.() ?? 'Today',
						playUrl: snapshot.data().playUrl ?? '',
						genre: snapshot.data().genre ?? snapshot.data().category ?? 'Arcade',
					})))
				}

				if (!userSnap.empty) {
					setUsers(userSnap.docs.map((snapshot) => ({
						id: snapshot.id,
						name: snapshot.data().displayName ?? snapshot.data().name ?? snapshot.id,
						email: snapshot.data().email ?? 'unknown@example.com',
						role: (snapshot.data().role as UserRole) ?? 'user',
						joinedAt: snapshot.data().createdAt?.toDate?.()?.toLocaleDateString?.() ?? 'Today',
						projects: Number(snapshot.data().projects ?? 0),
						status: snapshot.data().disabled ? 'disabled' : 'active',
					})))
				}

				if (!categorySnap.empty) {
					setCategories(categorySnap.docs.map((snapshot, index) => ({
						id: snapshot.id,
						name: snapshot.data().name ?? snapshot.id,
						icon: snapshot.data().icon ?? '◉',
						color: snapshot.data().color ?? '#8b5cf6',
						description: snapshot.data().description ?? '',
						order: Number(snapshot.data().order ?? index + 1),
					})))
				}

				if (!settingsSnap.empty) {
					const data = settingsSnap.docs[0]?.data()
					if (data) {
						setSettings({
							platformName: data.platformName ?? demoSettings.platformName,
							heroText: data.heroText ?? demoSettings.heroText,
							featuredAppsLimit: Number(data.featuredAppsLimit ?? demoSettings.featuredAppsLimit),
							maintenanceMode: Boolean(data.maintenanceMode ?? demoSettings.maintenanceMode),
							submissionApprovalMode: Boolean(data.submissionApprovalMode ?? demoSettings.submissionApprovalMode),
							logoUrl: data.logoUrl ?? demoSettings.logoUrl,
							firebaseStatus: data.firebaseStatus ?? demoSettings.firebaseStatus,
						})
					}
				}
			} finally {
				if (active) setLoading(false)
			}
		}

		load().catch(() => setLoading(false))
		return () => {
			active = false
		}
	}, [])

	const navItems = useMemo<AdminNavItem[]>(() => ([
		{ id: 'overview', label: 'Overview', description: 'Performance snapshot and charted insights', count: submissions.filter((item) => item.status === 'pending').length },
		{ id: 'submissions', label: 'Submissions', description: 'Approve, reject, or request changes', count: submissions.length },
		{ id: 'apps', label: 'Apps', description: 'Catalog moderation and feature flags', count: apps.length },
		{ id: 'games', label: 'Games', description: 'Gaming catalog and launch controls', count: games.length },
		{ id: 'users', label: 'Users', description: 'Roles, access, and contributors', count: users.length },
		{ id: 'categories', label: 'Categories', description: 'Ordering and branding system', count: categories.length },
		{ id: 'analytics', label: 'Analytics', description: 'Growth, installs, and plays', count: 3 },
		{ id: 'settings', label: 'Settings', description: 'Brand and system configuration' },
	]), [apps.length, categories.length, games.length, submissions.length, users.length])

	const filteredSubmissions = useMemo(() => submissions.filter((submission) => {
		const query = search.trim().toLowerCase()
		const matchesFilter = submissionFilter === 'all' ? true : submission.status === submissionFilter
		const matchesQuery = !query || [submission.name, submission.developer, submission.category].some((field) => field.toLowerCase().includes(query))
		return matchesFilter && matchesQuery
	}), [search, submissionFilter, submissions])

	const filteredApps = useMemo(() => apps.filter((item) => !search || [item.name, item.developer, item.category].some((field) => field.toLowerCase().includes(search.toLowerCase()))), [apps, search])
	const filteredGames = useMemo(() => games.filter((item) => !search || [item.name, item.developer, item.category, item.genre ?? ''].some((field) => field.toLowerCase().includes(search.toLowerCase()))), [games, search])
	const filteredUsers = useMemo(() => users.filter((item) => !search || [item.name, item.email, item.role].some((field) => field.toLowerCase().includes(search.toLowerCase()))), [search, users])

	const overviewStats = useMemo(() => [
		{ title: 'Total apps', value: String(apps.length), delta: 'Approved releases', icon: Code2, tone: 'default' as const },
		{ title: 'Total games', value: String(games.length), delta: 'Playable titles', icon: Gamepad2, tone: 'info' as const },
		{ title: 'Pending submissions', value: String(submissions.filter((item) => item.status === 'pending').length), delta: 'Awaiting review', icon: Sparkles, tone: 'warning' as const },
		{ title: 'Approved submissions', value: String(submissions.filter((item) => item.status === 'approved').length), delta: 'Shipped to store', icon: CheckCircle2, tone: 'success' as const },
		{ title: 'Rejected submissions', value: String(submissions.filter((item) => item.status === 'rejected').length), delta: 'Blocked for quality', icon: Trash2, tone: 'warning' as const },
		{ title: 'Total users', value: String(users.length), delta: 'Creators and visitors', icon: Users, tone: 'default' as const },
		{ title: 'Total downloads', value: '12.4M', delta: 'Placeholder revenue view', icon: DollarSign, tone: 'success' as const },
		{ title: 'Active developers', value: String(users.filter((item) => item.role !== 'user').length), delta: 'Contributing teams', icon: TrendingUp, tone: 'info' as const },
	], [apps.length, games.length, submissions, users])

	const selectedSubmission = submissions.find((item) => item.id === selectedSubmissionId) ?? null

	const updateSubmissionStatus = async (submissionId: string, nextStatus: SubmissionStatus) => {
		const target = submissions.find((item) => item.id === submissionId)
		if (!target) return

		setSubmissions((current) => current.map((item) => (item.id === submissionId ? { ...item, status: nextStatus } : item)))
		await setDoc(doc(firestoreCollections.submissions, submissionId), { ...target, status: nextStatus, reviewedAt: serverTimestamp() }, { merge: true })

		if (nextStatus !== 'approved') return

		const targetCollection = target.type === 'game' ? firestoreCollections.games : firestoreCollections.apps
		const promotedRecord = {
			name: target.name,
			category: target.category,
			developer: target.developer,
			downloads: target.downloads,
			rating: target.rating,
			visibility: 'public' as CatalogVisibility,
			featured: false,
			trending: false,
			updatedAt: serverTimestamp(),
			playUrl: target.demoUrl,
			screenshots: target.screenshots,
			status: 'approved',
			genre: target.category,
		}
		await setDoc(doc(targetCollection, submissionId), promotedRecord, { merge: true })

		if (target.type === 'app') {
			setApps((current) => [
				...current.filter((item) => item.id !== submissionId),
				{ id: submissionId, name: target.name, category: target.category, developer: target.developer, status: 'approved', featured: false, trending: false, visibility: 'public', downloads: target.downloads, rating: target.rating, screenshots: target.screenshots, updatedAt: 'Just now', playUrl: target.demoUrl },
			])
		} else {
			setGames((current) => [
				...current.filter((item) => item.id !== submissionId),
				{ id: submissionId, name: target.name, category: target.category, developer: target.developer, status: 'approved', featured: false, trending: false, visibility: 'public', downloads: target.downloads, rating: target.rating, screenshots: target.screenshots, updatedAt: 'Just now', playUrl: target.demoUrl, genre: target.category },
			])
		}
	}

	const adminAction = async (submissionId: string, action: 'approve' | 'reject' | 'request_changes') => {
		if (action === 'approve') {
			await updateSubmissionStatus(submissionId, 'approved')
			setMessage('Submission approved and promoted to the catalog.')
			return
		}

		if (action === 'reject') {
			await updateSubmissionStatus(submissionId, 'rejected')
			setMessage('Submission rejected and stored with review notes.')
			return
		}

		await updateSubmissionStatus(submissionId, 'changes_requested')
		setMessage('Changes requested. The creator can resubmit with the requested updates.')
	}

	const updateApp = async (appId: string, patch: Partial<CatalogRecord>) => {
		setApps((current) => current.map((item) => (item.id === appId ? { ...item, ...patch } : item)))
		await setDoc(doc(firestoreCollections.apps, appId), patch, { merge: true })
	}

	const updateGame = async (gameId: string, patch: Partial<CatalogRecord>) => {
		setGames((current) => current.map((item) => (item.id === gameId ? { ...item, ...patch } : item)))
		await setDoc(doc(firestoreCollections.games, gameId), patch, { merge: true })
	}

	const updateUserRole = async (userId: string, role: UserRole) => {
		setUsers((current) => current.map((item) => (item.id === userId ? { ...item, role } : item)))
		await setDoc(doc(firestoreCollections.users, userId), { role, updatedAt: serverTimestamp() }, { merge: true })
	}

	const handleCategoryCreate = async (value: { name: string; icon: string; color: string; description: string }) => {
		const id = `cat_${Date.now()}`
		const nextCategory: CategoryRecord = { id, order: categories.length + 1, ...value }
		setCategories((current) => [...current, nextCategory])
		await setDoc(doc(firestoreCollections.categories, id), nextCategory, { merge: true })
	}

	const handleCategoryUpdate = async (id: string, patch: Partial<{ name: string; icon: string; color: string; description: string }>) => {
		setCategories((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
		await setDoc(doc(firestoreCollections.categories, id), patch, { merge: true })
	}

	const handleCategoryDelete = async (id: string) => {
		setCategories((current) => current.filter((item) => item.id !== id))
		await deleteDoc(doc(firestoreCollections.categories, id))
	}

	const handleCategoryMove = (id: string, direction: 'up' | 'down') => {
		setCategories((current) => {
			const index = current.findIndex((item) => item.id === id)
			if (index < 0) return current
			const nextIndex = direction === 'up' ? index - 1 : index + 1
			if (nextIndex < 0 || nextIndex >= current.length) return current
			const updated = [...current]
			;[updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]]
			return updated.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }))
		})
	}

	const handleSettingsSave = async () => {
		await setDoc(doc(firestoreCollections.settings, 'platform'), settings, { merge: true })
		setMessage('Platform settings saved successfully.')
	}

	const handleLogout = async () => {
		await signOut(auth)
		navigate('/login')
	}

	return (
		<AdminLayout
			theme={theme}
			onToggleTheme={setTheme}
			title={sectionMeta[activeSection].title}
			subtitle={sectionMeta[activeSection].subtitle}
			navItems={navItems}
			activeSection={activeSection}
			onSectionChange={setActiveSection}
			userName={currentUserName}
			userEmail={currentUserEmail}
			profileRole="Admin"
			onLogout={handleLogout}
			notificationCount={3}
		>
			{message ? <div className="mb-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-100">{message}</div> : null}

			{loading ? <LoadingSkeleton /> : (
				<>
					{activeSection === 'overview' ? (
						<div className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								{overviewStats.map((stat) => <StatCard key={stat.title} title={stat.title} value={stat.value} delta={stat.delta} icon={stat.icon} tone={stat.tone} />)}
							</div>

							<div className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
								<DashboardChart title="Weekly growth" subtitle="Visitor, download, and submission trends over the last seven days.">
									<ResponsiveContainer width="100%" height={320}>
										<AreaChart data={weeklyGrowth}>
											<defs>
												<linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
													<stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
													<stop offset="95%" stopColor="#06b6d4" stopOpacity={0.02} />
												</linearGradient>
											</defs>
											<CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
											<XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" />
											<YAxis stroke="rgba(255,255,255,0.35)" />
											<Tooltip contentStyle={{ background: 'rgba(10, 10, 20, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }} />
											<Area type="monotone" dataKey="downloads" stroke="#8b5cf6" fill="url(#growthFill)" strokeWidth={2} />
											<Line type="monotone" dataKey="users" stroke="#06b6d4" strokeWidth={2} dot={false} />
										</AreaChart>
									</ResponsiveContainer>
								</DashboardChart>

								<DashboardChart title="Top categories" subtitle="Distribution of platform activity across the store.">
									<ResponsiveContainer width="100%" height={320}>
										<PieChart>
											<Pie data={topCategories} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>{topCategories.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie>
											<Tooltip contentStyle={{ background: 'rgba(10, 10, 20, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }} />
											<Legend />
										</PieChart>
									</ResponsiveContainer>
								</DashboardChart>
							</div>

							<div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
								<DashboardChart title="Recent submissions" subtitle="A live moderation queue from Firestore or demo data.">
									<SubmissionTable rows={filteredSubmissions.slice(0, 5)} onSelect={setSelectedSubmissionId} onAction={adminAction} />
								</DashboardChart>

								<DashboardChart title="Revenue placeholder" subtitle="Placeholder revenue and growth context for executive visibility.">
									<div className="space-y-4">
										<div className="theme-card rounded-[1.6rem] p-5">
											<p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Monthly revenue</p>
											<p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">$128K</p>
											<p className="mt-2 text-sm text-emerald-200">+18.4% from last month</p>
										</div>
										<div className="theme-card rounded-[1.6rem] p-5">
											<p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Active developers</p>
											<p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-[color:var(--text-primary)]">{users.filter((item) => item.role !== 'user').length}</p>
											<p className="mt-2 text-sm text-[color:var(--text-secondary)]">Contributing across apps and games</p>
										</div>
									</div>
								</DashboardChart>
							</div>
						</div>
					) : null}

					{activeSection === 'submissions' ? (
						<div className="space-y-6">
							<div className="glass-panel-strong rounded-[1.8rem] p-5">
								<div className="grid gap-4 lg:grid-cols-[1.2fr_auto] lg:items-end">
									<label className="relative block">
										<span className="mb-2 block text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Search submissions</span>
										<TextInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by app, developer, or category" className="pl-11" />
										<Search className="pointer-events-none absolute left-4 top-[2.55rem] h-4 w-4 text-[color:var(--text-secondary)]" />
									</label>
									<div className="flex flex-wrap gap-2">
										{(['all', 'pending', 'approved', 'rejected', 'changes_requested'] as const).map((status) => (
											<button key={status} type="button" onClick={() => setSubmissionFilter(status)} className={['rounded-full border px-4 py-2 text-sm font-medium transition', submissionFilter === status ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)] text-[color:var(--text-primary)]' : 'border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--text-secondary)]'].join(' ')}>{status.replace('_', ' ')}</button>
										))}
									</div>
								</div>
							</div>

							{filteredSubmissions.length ? <SubmissionTable rows={filteredSubmissions} onSelect={setSelectedSubmissionId} onAction={adminAction} /> : <EmptyState title="No submissions match" description="Try a different search query or status filter. The queue will show demo data if Firestore is empty." />}

							<SubmissionDetailsModal
								submission={selectedSubmission}
								open={Boolean(selectedSubmission)}
								onClose={() => setSelectedSubmissionId(null)}
								onApprove={async () => { if (selectedSubmission) await adminAction(selectedSubmission.id, 'approve'); setSelectedSubmissionId(null) }}
								onReject={async () => { if (selectedSubmission) await adminAction(selectedSubmission.id, 'reject'); setSelectedSubmissionId(null) }}
								onRequestChanges={async () => { if (selectedSubmission) await adminAction(selectedSubmission.id, 'request_changes'); setSelectedSubmissionId(null) }}
							/>
						</div>
					) : null}

					{activeSection === 'apps' ? (
						<div className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
								{filteredApps.map((item) => (
									<div key={item.id} className="theme-card overflow-hidden rounded-[1.8rem]">
										<img src={item.screenshots[0]} alt={item.name} className="h-44 w-full object-cover" />
										<div className="p-4">
											<div className="flex items-start justify-between gap-3">
												<div><h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{item.name}</h3><p className="text-sm text-[color:var(--text-secondary)]">{item.developer} · {item.category}</p></div>
												<StatusBadge status={item.visibility} />
											</div>
											<div className="mt-3 flex flex-wrap gap-2"><Badge tone={item.featured ? 'success' : 'default'}>{item.featured ? 'Featured' : 'Not featured'}</Badge><Badge tone={item.trending ? 'info' : 'default'}>{item.trending ? 'Trending' : 'Standard'}</Badge></div>
											<div className="mt-4 flex flex-wrap gap-2 text-xs">
												<button type="button" onClick={() => updateApp(item.id, { featured: !item.featured })} className="rounded-full border border-[color:var(--border-color)] px-3 py-2 text-[color:var(--text-secondary)]">{item.featured ? 'Unfeature' : 'Feature'}</button>
												<button type="button" onClick={() => updateApp(item.id, { trending: !item.trending })} className="rounded-full border border-[color:var(--border-color)] px-3 py-2 text-[color:var(--text-secondary)]">{item.trending ? 'Untrend' : 'Trend'}</button>
												<select value={item.visibility} onChange={(event) => updateApp(item.id, { visibility: event.target.value as CatalogVisibility })} className="rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-2 text-[color:var(--text-secondary)] outline-none">
													<option value="public">Public</option>
													<option value="unlisted">Unlisted</option>
													<option value="private">Private</option>
												</select>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					) : null}

					{activeSection === 'games' ? (
						<div className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
								{filteredGames.map((item) => (
									<div key={item.id} className="theme-card overflow-hidden rounded-[1.8rem]">
										<img src={item.screenshots[0]} alt={item.name} className="h-44 w-full object-cover" />
										<div className="p-4">
											<div className="flex items-start justify-between gap-3">
												<div><h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{item.name}</h3><p className="text-sm text-[color:var(--text-secondary)]">{item.developer} · {item.genre}</p></div>
												<StatusBadge status={item.visibility} />
											</div>
											<div className="mt-3 flex flex-wrap gap-2"><Badge tone={item.featured ? 'success' : 'default'}>{item.featured ? 'Featured' : 'Not featured'}</Badge><Badge tone={item.trending ? 'info' : 'default'}>{item.trending ? 'Trending' : 'Standard'}</Badge></div>
											<div className="mt-4 flex flex-wrap gap-2 text-xs">
												<button type="button" onClick={() => updateGame(item.id, { featured: !item.featured })} className="rounded-full border border-[color:var(--border-color)] px-3 py-2 text-[color:var(--text-secondary)]">{item.featured ? 'Unfeature' : 'Feature'}</button>
												<button type="button" onClick={() => updateGame(item.id, { trending: !item.trending })} className="rounded-full border border-[color:var(--border-color)] px-3 py-2 text-[color:var(--text-secondary)]">{item.trending ? 'Untrend' : 'Trend'}</button>
												<select value={item.visibility} onChange={(event) => updateGame(item.id, { visibility: event.target.value as CatalogVisibility })} className="rounded-full border border-[color:var(--border-color)] bg-[color:var(--card-bg)] px-3 py-2 text-[color:var(--text-secondary)] outline-none">
													<option value="public">Public</option>
													<option value="unlisted">Unlisted</option>
													<option value="private">Private</option>
												</select>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					) : null}

					{activeSection === 'users' ? (
						<div className="space-y-6">
							{filteredUsers.length ? <UserTable users={filteredUsers} onChangeRole={updateUserRole} /> : <EmptyState title="No users found" description="Your user collection is empty. The demo data will appear once Firestore returns no records." />}
						</div>
					) : null}

					{activeSection === 'categories' ? (
						<div className="space-y-6">
							<CategoryManager categories={categories} onCreate={handleCategoryCreate} onUpdate={handleCategoryUpdate} onDelete={handleCategoryDelete} onMove={handleCategoryMove} />
						</div>
					) : null}

					{activeSection === 'analytics' ? (
						<div className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
								<StatCard title="App installs" value="8.6M" delta="+24% month over month" icon={BarChart3} tone="info" />
								<StatCard title="Game plays" value="4.2M" delta="+18% month over month" icon={Gamepad2} tone="success" />
								<StatCard title="Visitor stats" value="1.8M" delta="Placeholder session analytics" icon={TrendingUp} tone="default" />
								<StatCard title="Revenue" value="$128K" delta="Placeholder finance context" icon={DollarSign} tone="warning" />
							</div>

							<div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
								<DashboardChart title="Weekly install growth" subtitle="App installs, game plays, and submissions over the last seven days.">
									<ResponsiveContainer width="100%" height={320}>
										<BarChart data={weeklyGrowth}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" /><XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" /><YAxis stroke="rgba(255,255,255,0.35)" /><Tooltip contentStyle={{ background: 'rgba(10, 10, 20, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }} /><Bar dataKey="downloads" fill="#8b5cf6" radius={[10, 10, 0, 0]} /><Bar dataKey="users" fill="#06b6d4" radius={[10, 10, 0, 0]} /></BarChart>
									</ResponsiveContainer>
								</DashboardChart>

								<DashboardChart title="Top played games" subtitle="Gaming engagement trends across featured titles.">
									<ResponsiveContainer width="100%" height={320}>
										<LineChart data={weeklyGrowth}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" /><XAxis dataKey="day" stroke="rgba(255,255,255,0.35)" /><YAxis stroke="rgba(255,255,255,0.35)" /><Tooltip contentStyle={{ background: 'rgba(10, 10, 20, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }} /><Line type="monotone" dataKey="downloads" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 3 }} /><Line type="monotone" dataKey="submissions" stroke="#ec4899" strokeWidth={2} dot={false} /></LineChart>
									</ResponsiveContainer>
								</DashboardChart>
							</div>

							<DashboardChart title="Top categories" subtitle="Proportional split of platform activity.">
								<ResponsiveContainer width="100%" height={320}>
									<PieChart>
										<Pie data={topCategories} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>{topCategories.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie>
										<Tooltip contentStyle={{ background: 'rgba(10, 10, 20, 0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px' }} />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</DashboardChart>
						</div>
					) : null}

					{activeSection === 'settings' ? (
						<div className="space-y-6">
							<div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
								<DashboardChart title="System settings" subtitle="Platform identity, approval mode, and Firebase status.">
									<SettingsPanel settings={settings} onChange={(next) => setSettings((current) => ({ ...current, ...next }))} onSave={handleSettingsSave} />
								</DashboardChart>

								<DashboardChart title="Platform status" subtitle="Storage, Firestore, and auth readiness.">
									<div className="space-y-3">
										{[
											{ label: 'Firebase Auth', value: 'Connected', tone: 'success' },
											{ label: 'Firestore', value: settings.firebaseStatus, tone: 'info' },
											{ label: 'Storage', value: 'Ready', tone: 'success' },
											{ label: 'Featured apps limit', value: String(settings.featuredAppsLimit), tone: 'warning' },
										].map((item) => (
											<div key={item.label} className="theme-card rounded-2xl p-4">
												<div className="flex items-center justify-between gap-3"><span className="text-sm text-[color:var(--text-secondary)]">{item.label}</span><StatusBadge status={item.tone === 'success' ? 'approved' : item.tone === 'warning' ? 'pending' : 'changes_requested'} /></div>
												<p className="mt-2 text-lg font-semibold text-[color:var(--text-primary)]">{item.value}</p>
											</div>
										))}
									</div>
								</DashboardChart>
							</div>
						</div>
					) : null}
				</>
			)}
		</AdminLayout>
	)
}

export default Admin
