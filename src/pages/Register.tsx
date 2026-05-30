import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, UserRoundPlus, Upload, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { browserLocalPersistence, createUserWithEmailAndPassword, setPersistence, signInWithPopup, updateProfile, type AuthError } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { getDownloadURL, uploadBytes } from 'firebase/storage'
import { Link, useNavigate } from 'react-router-dom'
import { authFeatures, onboardingSteps, registerTrustBullets } from '../components/data/marketplaceData'
import { Badge, FieldShell, GlowButton, LoadingInline, PageShell, SectionHeader, SuccessInline, TextInput } from '../components/ui/StoreUI'
import { GitHubBadge } from '../components/ui/Shared'
import { auth, ensureUserRecord, firestoreCollections, getUserRole, githubAuthProvider, googleAuthProvider, storagePaths } from '../services/firebase'
import { useStoreTheme } from '../hooks/useStoreTheme'

function Register() {
	const { theme, setTheme } = useStoreTheme()
	const navigate = useNavigate()
	const [form, setForm] = useState({
		fullName: '',
		username: '',
		email: '',
		password: '',
		confirmPassword: '',
		avatar: null as File | null,
		terms: false,
	})
	const [avatarPreview, setAvatarPreview] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')
	const [error, setError] = useState('')

	useEffect(() => {
		if (!form.avatar) {
			setAvatarPreview('')
			return
		}

		const previewUrl = URL.createObjectURL(form.avatar)
		setAvatarPreview(previewUrl)

		return () => URL.revokeObjectURL(previewUrl)
	}, [form.avatar])

	const passwordScore = useMemo(() => {
		const password = form.password
		const score = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length
		if (score <= 1) return { label: 'Weak', width: 25, tone: 'bg-rose-400' }
		if (score === 2) return { label: 'Fair', width: 50, tone: 'bg-amber-400' }
		if (score === 3) return { label: 'Strong', width: 75, tone: 'bg-cyan-400' }
		return { label: 'Excellent', width: 100, tone: 'bg-emerald-400' }
	}, [form.password])

	const validate = () => {
		if (!form.fullName || !form.username || !form.email || !form.password || !form.confirmPassword) {
			return 'Please complete every required field.'
		}
		if (form.password !== form.confirmPassword) {
			return 'Passwords do not match.'
		}
		if (!form.terms) {
			return 'Please accept the terms to continue.'
		}
		return ''
	}

	const handleAuthError = (authError: unknown, fallbackMessage: string) => {
		if (typeof authError === 'object' && authError && 'code' in authError) {
			const typedError = authError as AuthError
			if (typedError.code === 'auth/email-already-in-use') {
				setError('An account already exists for this email. Sign in instead, or use a different email to create a new account.')
				return
			}
			if (typedError.code === 'auth/operation-not-allowed') {
				setError('This Firebase sign-in method is disabled for the project. Enable Email/Password or the social provider in Firebase Console > Authentication > Sign-in method.')
				return
			}
			if (typedError.code === 'auth/unauthorized-domain') {
				setError('This domain is not authorized in Firebase. Add your site domain in Firebase Console > Authentication > Settings > Authorized domains.')
				return
			}
			if (typedError.code === 'auth/popup-closed-by-user') {
				setError('The sign-in popup was closed before Firebase could finish the request.')
				return
			}
		}

		setError(authError instanceof Error ? authError.message : fallbackMessage)
	}

	const uploadAvatar = async (uid: string) => {
		if (!form.avatar) return ''
		const avatarRef = storagePaths.avatar(`${uid}-${form.avatar.name}`)
		await uploadBytes(avatarRef, form.avatar)
		return getDownloadURL(avatarRef)
	}

	const persistProfile = async (uid: string, profile: { displayName: string; username: string; email: string; photoURL: string; providerId: string }) => {
		let succeeded = true

		try {
			await ensureUserRecord({
				uid,
				displayName: profile.displayName,
				username: profile.username,
				email: profile.email,
				photoURL: profile.photoURL,
				providerId: profile.providerId,
				role: 'user',
			})
		} catch {
			succeeded = false
		}

		try {
			await setDoc(doc(firestoreCollections.userProfiles, uid), {
				uid,
				displayName: profile.displayName,
				username: profile.username,
				email: profile.email,
				photoURL: profile.photoURL,
				providerId: profile.providerId,
				createdAt: serverTimestamp(),
			})
		} catch {
			succeeded = false
		}

		return succeeded
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError('')
		setMessage('')

		const validationMessage = validate()
		if (validationMessage) {
			setError(validationMessage)
			return
		}

		try {
			setLoading(true)
			await setPersistence(auth, browserLocalPersistence)
			const credentials = await createUserWithEmailAndPassword(auth, form.email, form.password)
			const photoURL = await uploadAvatar(credentials.user.uid)
			await updateProfile(credentials.user, {
				displayName: form.fullName,
				photoURL: photoURL || null,
			})
			const savedProfile = await persistProfile(credentials.user.uid, {
				displayName: form.fullName,
				username: form.username,
				email: form.email,
				photoURL,
				providerId: 'password',
			})
			const role = await getUserRole(credentials.user.uid)
			setMessage(savedProfile ? 'Account created successfully. Redirecting to your dashboard...' : 'Account created. Some profile details could not be saved, but your account is active. Redirecting now...')
			setTimeout(() => navigate(role === 'admin' ? '/admin' : '/dashboard'), 850)
		} catch (authError) {
			handleAuthError(authError, 'We could not complete the signup right now. Please try again.')
		} finally {
			setLoading(false)
		}
	}

	const handleProviderSignUp = async (provider: typeof googleAuthProvider | typeof githubAuthProvider) => {
		try {
			setLoading(true)
			setError('')
			setMessage('')
			const credentials = await signInWithPopup(auth, provider)
			const savedProfile = await persistProfile(credentials.user.uid, {
				displayName: credentials.user.displayName || form.fullName || credentials.user.email?.split('@')[0] || 'Creator',
				username: credentials.user.email?.split('@')[0] || credentials.user.uid.slice(0, 8),
				email: credentials.user.email || form.email,
				photoURL: credentials.user.photoURL || '',
				providerId: credentials.user.providerId,
			})
			const role = await getUserRole(credentials.user.uid)
			setMessage(savedProfile ? 'Account connected successfully. Taking you inside...' : 'Account connected, but profile sync could not be completed. Taking you inside...')
			setTimeout(() => navigate(role === 'admin' ? '/admin' : '/dashboard'), 850)
		} catch (authError) {
			handleAuthError(authError, 'Social signup failed. Please try email registration instead.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<PageShell
			theme={theme}
			onToggleTheme={setTheme}
			eyebrow="Onboarding"
			title="Create your account"
			description="A premium signup flow with avatar preview, password strength, Firebase Auth, and a polished onboarding feel."
			action={<Badge tone="info">Creator ready</Badge>}
		>
			<div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
				<div className="glass-panel-strong rounded-[2.25rem] p-6 sm:p-8">
					<Badge tone="success">Designed like a product launch</Badge>
					<h2 className="theme-heading mt-5 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">Build trust before the first click.</h2>
					<p className="theme-text-muted mt-4 max-w-xl text-base leading-7">This page combines a premium onboarding feel with practical Firebase auth, live avatar feedback, and social sign-up shortcuts.</p>

					<div className="mt-6 space-y-3">
						{authFeatures.map((feature) => {
							const FeatureIcon = feature.icon
							return (
								<div key={feature.title} className="theme-card flex items-start gap-4 rounded-[1.4rem] p-4">
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]"><FeatureIcon className="h-5 w-5" /></span>
									<div>
										<h3 className="text-sm font-semibold text-[color:var(--text-primary)]">{feature.title}</h3>
										<p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">{feature.description}</p>
									</div>
								</div>
							)
						})}
					</div>

					<div className="mt-6 rounded-[1.6rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)]/80 p-5">
						<div className="flex items-center gap-2 text-sm text-[color:var(--text-secondary)]"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Onboarding steps</div>
						<div className="mt-4 space-y-3">
							{onboardingSteps.map((step, index) => (
								<div key={step.title} className="theme-card rounded-2xl p-4">
									<p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Step {index + 1}</p>
									<h4 className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">{step.title}</h4>
									<p className="mt-1 text-sm leading-6 text-[color:var(--text-secondary)]">{step.description}</p>
								</div>
							))}
						</div>
						<div className="mt-5 grid gap-2 sm:grid-cols-2">
							{registerTrustBullets.map((bullet) => (
								<div key={bullet} className="theme-card rounded-2xl px-3 py-3 text-sm text-[color:var(--text-secondary)]">{bullet}</div>
							))}
						</div>
					</div>
				</div>

				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }} className="glass-panel-strong rounded-[2.25rem] p-6 sm:p-8">
					<SectionHeader eyebrow="Create account" title="Join the store" description="Full name, username, email, avatar, and social signup all flow into Firebase Auth and Firestore." />

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

					<div className="grid gap-4 sm:grid-cols-2">
						<button type="button" onClick={() => handleProviderSignUp(googleAuthProvider)} className="theme-card inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]" disabled={loading}>
							<Sparkles className="h-4 w-4 text-cyan-300" />
							Continue with Google
						</button>
						<button type="button" onClick={() => handleProviderSignUp(githubAuthProvider)} className="theme-card inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[color:var(--text-primary)] transition hover:bg-[color:var(--accent-soft)]" disabled={loading}>
							<GitHubBadge className="h-4 w-4" />
							Continue with GitHub
						</button>
					</div>

					<div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">
						<span className="h-px flex-1 bg-[color:var(--border-color)]" />
						or create with email
						<span className="h-px flex-1 bg-[color:var(--border-color)]" />
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="grid gap-4 sm:grid-cols-2">
							<FieldShell label="Full name"><TextInput value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} placeholder="Avery Morgan" autoComplete="name" /></FieldShell>
							<FieldShell label="Username"><TextInput value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="averym" autoComplete="username" /></FieldShell>
						</div>

						<FieldShell label="Email address"><TextInput type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" autoComplete="email" /></FieldShell>

						<div className="grid gap-4 sm:grid-cols-2">
							<FieldShell label="Password" helper={`Strength: ${passwordScore.label}`}>
								<div className="space-y-3">
									<div className="relative">
										<TextInput type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Create a secure password" autoComplete="new-password" />
										<button type="button" className="absolute inset-y-0 right-4 inline-flex items-center text-[color:var(--text-secondary)]" onClick={() => setShowPassword((value) => !value)}>
											{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										</button>
									</div>
									<div className="h-2 overflow-hidden rounded-full bg-[color:var(--bg-secondary)]"><div className={`h-full rounded-full ${passwordScore.tone}`} style={{ width: `${passwordScore.width}%` }} /></div>
								</div>
							</FieldShell>
							<FieldShell label="Confirm password"><TextInput type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Repeat your password" autoComplete="new-password" /></FieldShell>
						</div>

						<FieldShell label="Profile avatar" helper="Upload a PNG or JPG. The preview updates instantly before submission.">
							<div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
								<TextInput type="file" accept="image/*" onChange={(event) => setForm({ ...form, avatar: event.target.files?.[0] ?? null })} className="py-2.5" />
								{avatarPreview ? <img src={avatarPreview} alt="Avatar preview" className="h-18 w-18 rounded-2xl border border-[color:var(--border-color)] object-cover" /> : <div className="inline-flex h-18 w-18 items-center justify-center rounded-2xl border border-dashed border-[color:var(--border-color)] text-[color:var(--text-secondary)]"><Upload className="h-5 w-5" /></div>}
							</div>
						</FieldShell>

						<label className="flex items-start gap-3 rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)]/80 p-4 text-sm text-[color:var(--text-secondary)]">
							<input type="checkbox" checked={form.terms} onChange={(event) => setForm({ ...form, terms: event.target.checked })} className="mt-1 h-4 w-4 rounded border-[color:var(--border-color)] bg-[color:var(--card-bg)] text-[color:var(--accent)] focus:ring-[color:var(--focus-ring)]" />
							<span>I agree to the terms, creator policies, and the premium store experience.</span>
						</label>

						<GlowButton type="submit" className="w-full" disabled={loading}>
							{loading ? <LoadingInline label="Creating account" /> : <span className="inline-flex items-center gap-2"><UserRoundPlus className="h-4 w-4" /> Create account</span>}
						</GlowButton>
					</form>

					<p className="mt-6 text-center text-sm text-[color:var(--text-secondary)]">
						Already have an account?{' '}
						<Link to="/login" className="font-semibold text-[color:var(--accent)] transition hover:text-[color:var(--text-primary)]">
							Sign in
						</Link>
					</p>
				</motion.div>
			</div>
		</PageShell>
	)
}

export default Register