import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Lock, Sparkles, ShieldCheck } from 'lucide-react'
import { browserLocalPersistence, browserSessionPersistence, sendPasswordResetEmail, setPersistence, signInWithEmailAndPassword, signInWithPopup, type AuthError } from 'firebase/auth'
import { Link, useNavigate } from 'react-router-dom'
import { authFeatures, loginTrustBullets } from '../components/data/marketplaceData'
import { Badge, FieldShell, GlowButton, LoadingInline, PageShell, SectionHeader, SuccessInline, SupportLink, TextInput } from '../components/ui/StoreUI'
import { GitHubBadge } from '../components/ui/Shared'
import { auth, ensureUserRecord, getUserRole, githubAuthProvider, googleAuthProvider } from '../services/firebase'
import { useStoreTheme } from '../hooks/useStoreTheme'

function Login() {
	const { theme, setTheme } = useStoreTheme()
	const navigate = useNavigate()
	const [form, setForm] = useState({ email: '', password: '', rememberMe: true })
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')
	const [resetting, setResetting] = useState(false)

	const sectionCopy = useMemo(
		() => ({
			title: 'Sign in to Free App & Game Store',
			description: 'A premium Firebase-authenticated gateway built with the same glassmorphism, glow, and futuristic motion language as the homepage.',
		}),
		[],
	)

	const handleAuthError = (authError: unknown) => {
		const fallback = 'Unable to sign in right now. Please check your credentials and try again.'
		if (typeof authError === 'object' && authError && 'code' in authError) {
			const typedError = authError as AuthError
			if (typedError.code === 'auth/invalid-credential' || typedError.code === 'auth/wrong-password' || typedError.code === 'auth/user-not-found') {
				setError('Invalid email or password. Please try again.')
				return
			}
		}
		setError(fallback)
	}

	const routeByRole = async (uid: string, fallbackEmail: string, displayName?: string | null, photoURL?: string | null, providerId?: string) => {
		await ensureUserRecord({
			uid,
			displayName: displayName || fallbackEmail.split('@')[0] || 'Creator',
			username: fallbackEmail.split('@')[0] || uid.slice(0, 8),
			email: fallbackEmail,
			photoURL,
			providerId,
			role: 'user',
		})
		const role = await getUserRole(uid)
		setMessage(role === 'admin' ? 'Admin access confirmed. Redirecting to your dashboard...' : 'Signed in successfully. Redirecting to your dashboard...')
		setTimeout(() => navigate(role === 'admin' ? '/admin' : '/dashboard'), 700)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setMessage('')

		if (!form.email || !form.password) {
			setError('Please enter both email and password.')
			return
		}

		try {
			setLoading(true)
			await setPersistence(auth, form.rememberMe ? browserLocalPersistence : browserSessionPersistence)
			const credentials = await signInWithEmailAndPassword(auth, form.email, form.password)
			await routeByRole(credentials.user.uid, form.email, credentials.user.displayName, credentials.user.photoURL, credentials.user.providerId)
		} catch (authError) {
			handleAuthError(authError)
		} finally {
			setLoading(false)
		}
	}

	const handleProviderSignIn = async (provider: typeof googleAuthProvider | typeof githubAuthProvider) => {
		setError('')
		setMessage('')
		try {
			setLoading(true)
			const credentials = await signInWithPopup(auth, provider)
			await routeByRole(
				credentials.user.uid,
				credentials.user.email || form.email || 'creator@freeappgamestore.com',
				credentials.user.displayName,
				credentials.user.photoURL,
				credentials.user.providerId,
			)
		} catch (authError) {
			handleAuthError(authError)
		} finally {
			setLoading(false)
		}
	}

	const handleForgotPassword = async () => {
		if (!form.email) {
			setError('Enter your email first so we can send the reset link.')
			return
		}

		try {
			setResetting(true)
			setError('')
			await sendPasswordResetEmail(auth, form.email)
			setMessage('Password reset email sent. Check your inbox.')
		} catch {
			setError('Could not send the reset email right now.')
		} finally {
			setResetting(false)
		}
	}

	return (
		<PageShell
			theme={theme}
			onToggleTheme={setTheme}
			eyebrow="Authentication"
			title={sectionCopy.title}
			description={sectionCopy.description}
			action={<Badge tone="info">Firebase Auth Ready</Badge>}
		>
			<div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
				<div className="glass-panel-strong relative overflow-hidden rounded-[2.25rem] p-6 sm:p-8">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,255,0.14),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.18),transparent_32%)]" />
					<div className="relative">
						<Badge tone="success">Linear-grade auth experience</Badge>
						<h2 className="theme-heading mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Built to feel secure, modern, and premium.</h2>
						<p className="theme-text-muted mt-4 max-w-xl text-base leading-7">Use Google or GitHub for instant access, or sign in with email for a classic flow. Every state has clear feedback and motion, without breaking the homepage aesthetic.</p>

						<div className="mt-6 grid gap-3">
							{authFeatures.map((feature) => {
								const FeatureIcon = feature.icon
								return (
									<div key={feature.title} className="theme-card flex items-start gap-4 rounded-[1.4rem] p-4">
										<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
											<FeatureIcon className="h-5 w-5" />
										</span>
										<div>
											<h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{feature.title}</h3>
											<p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">{feature.description}</p>
										</div>
									</div>
								)
							})}
						</div>

						<div className="mt-6 rounded-[1.6rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)]/80 p-5">
							<div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
								<ShieldCheck className="h-4 w-4 text-emerald-300" />
								Trust indicators
							</div>
							<div className="mt-4 grid gap-2 sm:grid-cols-2">
								{loginTrustBullets.map((bullet) => (
									<div key={bullet} className="theme-card rounded-2xl px-3 py-3 text-sm text-[color:var(--text-secondary)]">{bullet}</div>
								))}
							</div>
							<div className="mt-5 flex flex-wrap gap-3 text-sm">
								<SupportLink to="/register">Create a new account</SupportLink>
								<SupportLink to="/publish">Publish an app instead</SupportLink>
							</div>
						</div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
					className="glass-panel-strong rounded-[2.25rem] p-6 sm:p-8"
				>
					<SectionHeader
						eyebrow="Welcome back"
						title="Continue with your account"
						description="Email/password and social sign-in are wired to Firebase Auth with loading and error states."
					/>

					<AnimatePresence>
						{message ? (
							<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3">
								<SuccessInline label={message} />
							</motion.div>
						) : null}
					</AnimatePresence>

					<AnimatePresence>
						{error ? (
							<motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-5 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-100">
								{error}
							</motion.div>
						) : null}
					</AnimatePresence>

					<div className="grid gap-3 sm:grid-cols-2">
						<button type="button" onClick={() => handleProviderSignIn(googleAuthProvider)} className="theme-card inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]" disabled={loading}>
							<Sparkles className="h-4 w-4 text-cyan-300" />
							Continue with Google
						</button>
						<button type="button" onClick={() => handleProviderSignIn(githubAuthProvider)} className="theme-card inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]" disabled={loading}>
							<GitHubBadge className="h-4 w-4" />
							Continue with GitHub
						</button>
					</div>

					<div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">
						<span className="h-px flex-1 bg-[color:var(--border-color)]" />
						or sign in with email
						<span className="h-px flex-1 bg-[color:var(--border-color)]" />
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<FieldShell label="Email address"><TextInput type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" autoComplete="email" /></FieldShell>
						<FieldShell label="Password"><TextInput type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" autoComplete="current-password" /></FieldShell>

						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<label className="inline-flex items-center gap-2 text-sm text-[color:var(--text-secondary)]">
								<input type="checkbox" checked={form.rememberMe} onChange={(event) => setForm({ ...form, rememberMe: event.target.checked })} className="h-4 w-4 rounded border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--accent)] focus:ring-[color:var(--focus-ring)]" />
								Remember me
							</label>
							<button type="button" onClick={handleForgotPassword} className="text-sm font-medium text-[color:var(--accent)] transition hover:text-[color:var(--text-primary)]" disabled={resetting}>
								{resetting ? <LoadingInline label="Sending reset email" /> : 'Forgot password?'}
							</button>
						</div>

						<GlowButton type="submit" className="w-full" disabled={loading}>
							{loading ? <LoadingInline label="Signing in" /> : <span className="inline-flex items-center gap-2"><Lock className="h-4 w-4" /> Sign in securely</span>}
						</GlowButton>
					</form>

					<p className="mt-6 text-center text-sm text-[color:var(--text-secondary)]">
						New here?{' '}
						<Link to="/register" className="font-semibold text-[color:var(--accent)] transition hover:text-[color:var(--text-primary)]">
							Create your account
						</Link>
					</p>
				</motion.div>
			</div>
		</PageShell>
	)
}

export default Login
