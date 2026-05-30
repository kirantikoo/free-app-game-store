import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { addDoc, serverTimestamp } from 'firebase/firestore'
import { getDownloadURL, uploadBytes } from 'firebase/storage'
import { Bot, Globe2, Sparkles, FileCode2, ImageUp, Link2, Layers3, Rocket, ShieldCheck, Tag, UploadCloud } from 'lucide-react'
import { Badge, FieldRow, FieldShell, GlowButton, LoadingInline, PageShell, ProgressBar, SecondaryButton, SelectInput, SectionHeader, SuccessInline, TextArea, TextInput, ToggleSwitch } from '../components/ui/StoreUI'
import { fireStoreSchemaPreview, publishProgress, publishSections, publishSidebarItems } from '../components/data/marketplaceData'
import { GitHubBadge } from '../components/ui/Shared'
import { firestoreCollections, storagePaths } from '../services/firebase'
import { generateAppSummary } from '../services/aiService'
import { useStoreTheme } from '../hooks/useStoreTheme'

type PricingModel = 'Free' | 'Freemium' | 'Paid' | 'Open Source'
type AppCategory = 'Productivity' | 'AI Apps' | 'Developer Tools' | 'Education' | 'Finance' | 'Music'

function Publish() {
  const { theme, setTheme } = useStoreTheme()
  const iconInputRef = useRef<HTMLInputElement | null>(null)
  const screenshotInputRef = useRef<HTMLInputElement | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState('')
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([])
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([])
  const [aiGenerating, setAiGenerating] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    category: 'Productivity' as AppCategory,
    pricing: 'Free' as PricingModel,
    githubUrl: '',
    demoUrl: '',
    branch: 'main',
    description: '',
    markdown: '',
    tags: 'open source, pwa, firebase',
    deployTarget: 'Vercel',
    buildCommand: 'npm run build',
    seoTitle: '',
    seoDescription: '',
    keywords: 'free app store, free games, pwa, firebase',
    pwaEnabled: true,
    summary: '',
  })

  useEffect(() => {
    if (!iconFile) {
      setIconPreview('')
      return
    }

    const preview = URL.createObjectURL(iconFile)
    setIconPreview(preview)
    return () => URL.revokeObjectURL(preview)
  }, [iconFile])

  useEffect(() => {
    if (!screenshotFiles.length) {
      setScreenshotPreviews([])
      return
    }

    const previews = screenshotFiles.map((file) => URL.createObjectURL(file))
    setScreenshotPreviews(previews)
    return () => previews.forEach((preview) => URL.revokeObjectURL(preview))
  }, [screenshotFiles])

  const tagList = useMemo(() => form.tags.split(',').map((tag) => tag.trim()).filter(Boolean), [form.tags])
  const schemaPreview = useMemo(() => JSON.stringify(fireStoreSchemaPreview, null, 2), [])

  const updateField = <Key extends keyof typeof form>(key: Key, value: (typeof form)[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

  const handleNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: current.slug || slugify(value),
      seoTitle: current.seoTitle || `${value} | Free App & Game Store`,
      summary: current.summary || `${value} is a ${current.category.toLowerCase()} release ready for the store.`,
    }))
  }

  const validate = () => {
    if (!form.name || !form.slug || !form.tagline || !form.description || !form.githubUrl || !form.demoUrl) {
      return 'Please complete the app details, GitHub integration, and deployment fields.'
    }
    if (!iconFile) {
      return 'Please upload an app icon before publishing.'
    }
    if (!screenshotFiles.length) {
      return 'Please upload at least one screenshot.'
    }
    return ''
  }

  const pickFiles = (files: FileList | null) => {
    if (!files) return
    const selectedFiles = Array.from(files)
    if (!selectedFiles.length) return
    if (!iconFile) {
      setIconFile(selectedFiles[0])
      setScreenshotFiles(selectedFiles.slice(1))
      return
    }
    setScreenshotFiles((current) => [...current, ...selectedFiles])
  }

  const uploadAssets = async () => {
    const uploadedIcon = await uploadBytes(storagePaths.appIcon(`${form.slug}-${iconFile?.name ?? 'icon'}`), iconFile as File)
    const iconUrl = await getDownloadURL(uploadedIcon.ref)

    const uploadedScreenshots = await Promise.all(
      screenshotFiles.map(async (file, index) => {
        const uploaded = await uploadBytes(storagePaths.screenshot(`${form.slug}-${index}-${file.name}`), file)
        return getDownloadURL(uploaded.ref)
      }),
    )

    return { iconUrl, screenshotUrls: uploadedScreenshots }
  }

  const handleGenerateSummary = async () => {
    setAiGenerating(true)
    try {
      const summary = await generateAppSummary(
        form.name || 'This release',
        form.category,
        tagList,
        form.description || form.tagline || ''
      )
      setForm((current) => ({ ...current, summary }))
    } catch {
      setForm((current) => ({
        ...current,
        summary: `${current.name || 'This release'} is a ${current.category.toLowerCase()} product with ${tagList.slice(0, 3).join(', ') || 'premium creator tooling'} built for fast distribution.`,
      }))
    } finally {
      setAiGenerating(false)
    }
  }

  const handlePublish = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const validationMessage = validate()
    if (validationMessage) {
      setError(validationMessage)
      return
    }

    try {
      setLoading(true)
      const assets = await uploadAssets()
      await addDoc(firestoreCollections.appSubmissions, {
        ...form,
        iconUrl: assets.iconUrl,
        screenshotUrls: assets.screenshotUrls,
        tags: tagList,
        createdAt: serverTimestamp(),
        status: 'pending-review',
      })
      setSuccess('Your app submission has been saved to Firestore and is ready for review.')
    } catch {
      setError('We could not publish this submission right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const sidebarTargets = publishSections.map((label, index) => ({ label, value: publishSidebarItems[index]?.value ?? `Step 0${index + 1}` }))

  return (
    <PageShell
      theme={theme}
      onToggleTheme={setTheme}
      eyebrow="Creator dashboard"
      title="Publish an app or game"
      description="A premium creator submission workflow with drag-and-drop uploads, AI summary generation, Firebase Storage, and Firestore publishing examples."
      action={<Badge tone="success">Production-ready structure</Badge>}
    >
      <div className="grid gap-8 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <div className="glass-panel-strong rounded-[2rem] p-5">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Submission flow</p>
                <p className="mt-1 text-sm font-semibold text-[color:var(--text-primary)]">Creator console</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {publishProgress.map((step) => (
                <div key={step.label} className="theme-card rounded-2xl p-3">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-[color:var(--text-primary)]">{step.label}</span>
                    <span className="text-[color:var(--accent)]">{step.value}%</span>
                  </div>
                  <div className="mt-2"><ProgressBar value={step.value} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.32em] text-[color:var(--text-secondary)]">Sections</p>
            <div className="mt-4 grid gap-2">
              {sidebarTargets.map((item) => (
                <a key={item.label} href={`#${item.label.toLowerCase().replace(/\s+/g, '-')}`} className="theme-card flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition hover:bg-[color:var(--accent-soft)]">
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">{item.value}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-[color:var(--text-primary)]"><ShieldCheck className="h-4 w-4 text-emerald-300" /> Firebase schema</div>
            <pre className="mt-4 max-h-[340px] overflow-auto rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--bg-primary)]/80 p-4 text-xs leading-6 text-[color:var(--text-secondary)]">{schemaPreview}</pre>
          </div>
        </aside>

        <motion.form onSubmit={handlePublish} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }} className="space-y-6">
          <AnimatePresence>
            {success ? <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3"><SuccessInline label={success} /></motion.div> : null}
          </AnimatePresence>

          <AnimatePresence>
            {error ? <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-100">{error}</motion.div> : null}
          </AnimatePresence>

          <section id="app-details" className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <SectionHeader eyebrow="App Details" title="Describe the release" description="Name, category, pricing, tags, and a markdown-friendly description editor." action={<Badge tone="info">{form.pwaEnabled ? 'PWA enabled' : 'PWA disabled'}</Badge>} />

            <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
              <div className="space-y-5">
                <FieldShell label="App name"><TextInput value={form.name} onChange={(event) => handleNameChange(event.target.value)} placeholder="Nova Studio" /></FieldShell>
                <FieldRow>
                  <FieldShell label="Slug"><TextInput value={form.slug} onChange={(event) => updateField('slug', slugify(event.target.value))} placeholder="nova-studio" /></FieldShell>
                  <FieldShell label="Tagline"><TextInput value={form.tagline} onChange={(event) => updateField('tagline', event.target.value)} placeholder="Ship fast, look premium" /></FieldShell>
                </FieldRow>
                <FieldRow>
                  <FieldShell label="Category"><SelectInput value={form.category} onChange={(event) => updateField('category', event.target.value as AppCategory)}>{['Productivity', 'AI Apps', 'Developer Tools', 'Education', 'Finance', 'Music'].map((option) => <option key={option} value={option}>{option}</option>)}</SelectInput></FieldShell>
                  <FieldShell label="Pricing model"><SelectInput value={form.pricing} onChange={(event) => updateField('pricing', event.target.value as PricingModel)}>{['Free', 'Freemium', 'Paid', 'Open Source'].map((option) => <option key={option} value={option}>{option}</option>)}</SelectInput></FieldShell>
                </FieldRow>
                <FieldShell label="Markdown description" helper="Use markdown for rich store details, release notes, and launch storytelling."><TextArea value={form.markdown} onChange={(event) => updateField('markdown', event.target.value)} placeholder={'## What it does\n\n- Premium onboarding\n- Firebase auth\n- PWA install support'} /></FieldShell>
                <FieldShell label="Short description"><TextArea value={form.description} onChange={(event) => updateField('description', event.target.value)} placeholder="A concise description for the store listing card." /></FieldShell>
                <FieldShell label="Tags" helper="Comma-separated tags power search and discovery."><TextInput value={form.tags} onChange={(event) => updateField('tags', event.target.value)} placeholder="open source, pwa, firebase" /></FieldShell>
              </div>

              <div className="space-y-4">
                <UploadPanel
                  title="App icon"
                  subtitle="Upload a square icon."
                  icon={UploadCloud}
                  onPick={() => iconInputRef.current?.click()}
                  onDrop={(files) => setIconFile(files[0] ?? null)}
                  active={dragActive}
                />
                <input ref={iconInputRef} type="file" accept="image/*" className="hidden" onChange={(event) => setIconFile(event.target.files?.[0] ?? null)} />

                <div className="theme-card rounded-[1.8rem] p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Icon preview</p>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-[1.5rem] border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]">
                      {iconPreview ? <img src={iconPreview} alt="App icon preview" className="h-full w-full object-cover" /> : <Layers3 className="h-8 w-8 text-[color:var(--text-secondary)]" />}
                    </div>
                    <div className="text-sm text-[color:var(--text-secondary)]">
                      <p className="font-medium text-[color:var(--text-primary)]">{iconFile?.name ?? 'No icon selected'}</p>
                      <p className="mt-1">Recommended: 512x512 or 1024x1024 PNG.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="screenshots" className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <SectionHeader eyebrow="Screenshots" title="Drag and drop store media" description="Upload app screenshots that automatically generate a preview strip for the store card." />
            <motion.div
              onDragOver={(event) => { event.preventDefault(); setDragActive(true) }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(event) => { event.preventDefault(); setDragActive(false); pickFiles(event.dataTransfer.files) }}
              className="grid gap-5 lg:grid-cols-[1.02fr_0.98fr]"
            >
              <button type="button" onClick={() => screenshotInputRef.current?.click()} className="theme-card group flex min-h-[260px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-[color:var(--border-color)] px-6 py-10 text-center transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]/40">
                <span className="inline-flex h-18 w-18 items-center justify-center rounded-[1.5rem] bg-[color:var(--accent-soft)] text-[color:var(--accent)] transition group-hover:scale-105"><ImageUp className="h-8 w-8" /></span>
                <p className="mt-5 text-lg font-semibold text-[color:var(--text-primary)]">Drop screenshots here</p>
                <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--text-secondary)]">Drag files from your desktop or click to select multiple screens. The upload pipeline will push these to Firebase Storage on publish.</p>
                <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">PNG, JPG, WebP</p>
              </button>
              <input ref={screenshotInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => pickFiles(event.target.files)} />

              <div className="grid gap-3 sm:grid-cols-2">
                {screenshotPreviews.length ? screenshotPreviews.map((preview, index) => (
                  <div key={preview} className="overflow-hidden rounded-[1.6rem] border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]">
                    <img src={preview} alt={`Screenshot ${index + 1}`} className="h-48 w-full object-cover" />
                  </div>
                )) : <div className="theme-card flex items-center justify-center rounded-[1.6rem] p-6 text-sm text-[color:var(--text-secondary)]">Uploaded screenshots will appear here as a preview strip.</div>}
              </div>
            </motion.div>
          </section>

          <section id="github-integration" className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <SectionHeader eyebrow="GitHub Integration" title="Connect code and release metadata" description="Link your repo, branch, and live deployment destination like a polished creator portal." />
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="GitHub repository URL"><TextInput value={form.githubUrl} onChange={(event) => updateField('githubUrl', event.target.value)} placeholder="https://github.com/your-name/repo" /></FieldShell>
              <FieldShell label="Repository branch"><TextInput value={form.branch} onChange={(event) => updateField('branch', event.target.value)} placeholder="main" /></FieldShell>
              <FieldShell label="Live demo URL"><TextInput value={form.demoUrl} onChange={(event) => updateField('demoUrl', event.target.value)} placeholder="https://demo.yoursite.com" /></FieldShell>
              <FieldShell label="Build command"><TextInput value={form.buildCommand} onChange={(event) => updateField('buildCommand', event.target.value)} placeholder="npm run build" /></FieldShell>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Badge tone="info"><GitHubBadge className="mr-2 h-3.5 w-3.5" /> GitHub ready</Badge>
              <Badge tone="default"><Link2 className="mr-2 h-3.5 w-3.5" /> Live demo</Badge>
              <Badge tone="success"><FileCode2 className="mr-2 h-3.5 w-3.5" /> Build validation</Badge>
            </div>
          </section>

          <section id="deployment-settings" className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <SectionHeader eyebrow="Deployment Settings" title="Choose how the release ships" description="PWA support, deployment target, and review-ready release settings." />
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="Deployment target"><SelectInput value={form.deployTarget} onChange={(event) => updateField('deployTarget', event.target.value)}>{['Vercel', 'Netlify', 'Firebase Hosting', 'Cloudflare Pages'].map((option) => <option key={option} value={option}>{option}</option>)}</SelectInput></FieldShell>
              <ToggleSwitch checked={form.pwaEnabled} onChange={() => updateField('pwaEnabled', !form.pwaEnabled)} label="PWA support" description="Enable installable app behavior and offline readiness." />
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="theme-card rounded-2xl p-4"><p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Release mode</p><p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">{form.pricing}</p></div>
              <div className="theme-card rounded-2xl p-4"><p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Platform</p><p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">{form.deployTarget}</p></div>
              <div className="theme-card rounded-2xl p-4"><p className="text-xs uppercase tracking-[0.28em] text-[color:var(--text-secondary)]">Tags</p><p className="mt-2 text-sm font-semibold text-[color:var(--text-primary)]">{tagList.length}</p></div>
            </div>
          </section>

          <section id="seo-metadata" className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
            <SectionHeader eyebrow="SEO Metadata" title="Prepare discovery and indexing" description="Metadata feeds search cards, previews, and launch sharing."
              action={<SecondaryButton type="button" onClick={handleGenerateSummary} disabled={aiGenerating}><Bot className="h-4 w-4" /> {aiGenerating ? 'Generating...' : 'AI-generated summary'}</SecondaryButton>}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <FieldShell label="SEO title"><TextInput value={form.seoTitle} onChange={(event) => updateField('seoTitle', event.target.value)} placeholder="Nova Studio | Free App & Game Store" /></FieldShell>
              <FieldShell label="Meta description"><TextInput value={form.seoDescription} onChange={(event) => updateField('seoDescription', event.target.value)} placeholder="A premium app listing built for installs and discovery." /></FieldShell>
              <FieldShell label="Keywords" helper="Separate terms with commas."><TextInput value={form.keywords} onChange={(event) => updateField('keywords', event.target.value)} placeholder="free app store, pwa, firebase" /></FieldShell>
              <FieldShell label="AI-generated summary"><TextArea value={form.summary} onChange={(event) => updateField('summary', event.target.value)} placeholder="A concise summary generated by the AI button." /></FieldShell>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Badge tone="success"><Sparkles className="mr-2 h-3.5 w-3.5" /> AI summary</Badge>
              <Badge tone="info"><Tag className="mr-2 h-3.5 w-3.5" /> {tagList.join(' • ') || 'No tags yet'}</Badge>
              <Badge tone="warning"><Globe2 className="mr-2 h-3.5 w-3.5" /> Public preview</Badge>
            </div>
          </section>

          <motion.div className="flex flex-col gap-3 sm:flex-row">
            <GlowButton type="submit" disabled={loading} className="sm:min-w-[240px]">
              {loading ? <LoadingInline label="Publishing to Firestore" /> : <span className="inline-flex items-center gap-2"><UploadCloud className="h-4 w-4" /> Publish with glow</span>}
            </GlowButton>
            <SecondaryButton type="button" onClick={() => { setForm((current) => ({ ...current, summary: `Preview only: ${current.name || 'Untitled app'} will be reviewed before release.` })) }}>
              <ShieldCheck className="h-4 w-4" /> Save draft preview
            </SecondaryButton>
          </motion.div>
        </motion.form>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:h-fit">
          <div className="glass-panel-strong rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Store preview card</p>
            <div className="mt-5 overflow-hidden rounded-[1.8rem] border border-[color:var(--border-color)] bg-[color:var(--card-bg)]">
              <div className="h-44 bg-gradient-to-br from-violet-500/30 via-cyan-400/15 to-fuchsia-500/25" />
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--bg-secondary)]">
                    {iconPreview ? <img src={iconPreview} alt="App icon preview" className="h-full w-full object-cover" /> : <Layers3 className="h-6 w-6 text-[color:var(--text-secondary)]" />}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[color:var(--text-primary)]">{form.name || 'Your app name'}</p>
                    <p className="text-sm text-[color:var(--text-secondary)]">{form.tagline || 'Tagline preview'}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge tone="info">{form.category}</Badge>
                  <Badge tone="success">{form.pricing}</Badge>
                  <Badge tone="default">PWA</Badge>
                </div>
                <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">{form.summary || 'The AI-generated summary will appear here as a polished preview paragraph.'}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {screenshotPreviews.slice(0, 2).map((preview) => <img key={preview} src={preview} alt="Screenshot preview" className="h-24 w-full rounded-2xl object-cover" />)}
                  {!screenshotPreviews.length ? <div className="theme-card col-span-2 flex items-center justify-center rounded-2xl p-4 text-sm text-[color:var(--text-secondary)]">Screenshots preview here</div> : null}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Publishing checklist</p>
            <div className="mt-4 space-y-2 text-sm text-[color:var(--text-secondary)]">
              <div className="theme-card rounded-2xl px-4 py-3">App details complete</div>
              <div className="theme-card rounded-2xl px-4 py-3">Assets uploaded to Storage</div>
              <div className="theme-card rounded-2xl px-4 py-3">Firestore submission recorded</div>
              <div className="theme-card rounded-2xl px-4 py-3">SEO metadata prepared</div>
            </div>
          </div>

          <div className="glass-panel rounded-[2rem] p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--text-secondary)]">Sections</p>
            <div className="mt-4 space-y-2 text-sm text-[color:var(--text-secondary)]">
              {publishSections.map((section) => <a key={section} href={`#${section.toLowerCase().replace(/\s+/g, '-')}`} className="block rounded-2xl px-4 py-3 transition hover:bg-[color:var(--accent-soft)]">{section}</a>)}
            </div>
          </div>
        </aside>
      </div>
    </PageShell>
  )
}

function UploadPanel({
  title,
  subtitle,
  icon: Icon,
  onPick,
  onDrop,
  active,
}: {
  title: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  onPick: () => void
  onDrop: (files: File[]) => void
  active?: boolean
}) {
  return (
    <div
      onClick={onPick}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault()
        onDrop(Array.from(event.dataTransfer.files))
      }}
      className={['theme-card group flex min-h-[230px] flex-col items-center justify-center rounded-[2rem] border border-dashed px-6 py-8 text-center transition hover:border-[color:var(--accent)] hover:bg-[color:var(--accent-soft)]/40', active ? 'border-[color:var(--accent)] bg-[color:var(--accent-soft)]/35' : 'border-[color:var(--border-color)]'].join(' ')}
    >
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[color:var(--accent-soft)] text-[color:var(--accent)] transition group-hover:scale-105">
        <Icon className="h-7 w-7" />
      </span>
      <p className="mt-4 text-lg font-semibold text-[color:var(--text-primary)]">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--text-secondary)]">{subtitle}</p>
    </div>
  )
}

export default Publish