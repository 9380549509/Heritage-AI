import { type ChangeEvent, type DragEvent, type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAnalyzeHeritageImage, useExplainHeritageImage, useHealthCheck, useListHeritageSites } from '@workspace/api-client-react';
import type { HeritageAnalysis, HeritageAnalysisInputLanguage, HeritageAnalysisInputMimeType, HeritageExplanation } from '@workspace/api-client-react';
import { ArrowUpRight, Camera, Check, ChevronRight, Compass, FileImage, Info, Landmark, LoaderCircle, MapPin, Menu, RotateCcw, ScanLine, Sparkles, X } from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();
const SESSION_KEY = 'heritage-ai-session';
type SupportedMime = HeritageAnalysisInputMimeType;

type HeritageSession = {
  imageUrl: string;
  imageBase64: string;
  mimeType: SupportedMime;
  language: HeritageAnalysisInputLanguage;
  analysis?: HeritageAnalysis;
  explanation?: HeritageExplanation;
};

const languageOptions: { value: HeritageAnalysisInputLanguage; label: string; native: string }[] = [
  { value: 'English', label: 'English', native: 'English' },
  { value: 'Kannada', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { value: 'Hindi', label: 'Hindi', native: 'हिन्दी' },
];

function readSession(): HeritageSession | null {
  try {
    const stored = window.localStorage.getItem(SESSION_KEY);
    return stored ? (JSON.parse(stored) as HeritageSession) : null;
  } catch {
    return null;
  }
}

function writeSession(session: HeritageSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function extractError(error: unknown) {
  if (typeof error === 'object' && error && 'error' in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === 'string') return value;
  }
  return 'We could not read that image. Try another clear photograph.';
}

function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();
  const health = useHealthCheck({ query: { queryKey: ['/api/healthz'], staleTime: 60_000 } });
  const hasSession = Boolean(readSession()?.imageUrl);

  const navigation = [
    { href: '/', label: 'Identify', icon: ScanLine, detail: 'Start with a photograph' },
    { href: '/results', label: 'Field notes', icon: Landmark, detail: 'Your identification', disabled: !hasSession },
    { href: '/explain', label: 'Read the stone', icon: Compass, detail: 'Architectural details', disabled: !hasSession },
  ];

  return (
    <div className="heritage-shell paper-grain text-foreground">
      <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-[#3b251a] bg-[#1b0f0a]/90 px-5 backdrop-blur-md md:hidden">
        <Link href="/" className="flex items-center gap-3" data-testid="link-mobile-logo">
          <Mark />
          <span className="display-font text-lg text-[#f2e4c7]">Heritage AI</span>
        </Link>
        <button type="button" onClick={() => setMobileOpen((open) => !open)} className="rounded-lg p-2 text-[#d9a441] hover:bg-[#392217]" aria-label="Open navigation" data-testid="button-mobile-menu">
          {mobileOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </header>

      <aside className={`fixed inset-y-0 left-0 z-30 flex w-[270px] flex-col border-r border-[#3b251a] bg-[#21120c] px-6 py-7 transition-transform duration-300 md:translate-x-0 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Link href="/" className="mb-14 flex items-center gap-3" onClick={() => setMobileOpen(false)} data-testid="link-logo">
          <Mark />
          <div>
            <div className="display-font text-[21px] leading-none text-[#f2e4c7]">Heritage AI</div>
            <div className="mono-font mt-1.5 text-[9px] uppercase tracking-[.22em] text-[#9e7955]">Karnataka field guide</div>
          </div>
        </Link>
        <div className="mb-4 px-3 eyebrow">Your expedition</div>
        <nav className="space-y-1.5">
          {navigation.map(({ href, label, icon: Icon, detail, disabled }) => (
            <Link
              key={href}
              href={disabled ? '#' : href}
              onClick={() => { if (!disabled) setMobileOpen(false); }}
              aria-disabled={disabled}
              className={`nav-link flex items-center gap-3 rounded-xl px-3 py-3.5 ${disabled ? 'pointer-events-none opacity-35' : ''} ${location === href ? 'bg-[#392217] text-[#e4b650]' : 'text-[#bca385] hover:bg-[#2c1a12] hover:text-[#eadcbf]'}`}
              data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}
            >
              <Icon size={18} strokeWidth={1.7} />
              <span className="flex-1">
                <span className="block text-[14px] font-semibold">{label}</span>
                <span className="mt-0.5 block text-[10px] text-[#85674b]">{detail}</span>
              </span>
              {location === href && <span className="h-1.5 w-1.5 rounded-full bg-[#e4b650] pulse-dot" />}
            </Link>
          ))}
        </nav>
        <div className="mt-auto">
          <div className="gold-rule mb-5 opacity-50" />
          <div className="rounded-xl border border-[#4a2e1d] bg-[#2a1810] p-4">
            <div className="mb-2 flex items-center gap-2 text-[#d9a441]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#76a475] pulse-dot" />
              <span className="mono-font text-[10px] uppercase tracking-[.15em]">{health.isError ? 'Service offline' : 'Guide online'}</span>
            </div>
            <p className="text-[12px] leading-5 text-[#96785c]">A cautious companion for noticing what stone remembers.</p>
          </div>
          <div className="mt-5 flex items-center justify-between px-1 text-[10px] text-[#71543e]">
            <span>Built for Karnataka</span>
            <span>v0.1</span>
          </div>
        </div>
      </aside>

      {mobileOpen && <button type="button" className="fixed inset-0 z-20 bg-[#130a06]/60 md:hidden" onClick={() => setMobileOpen(false)} aria-label="Close navigation" data-testid="button-close-navigation" />}
      <main className="min-h-[calc(100dvh-72px)] md:ml-[270px] md:min-h-screen">{children}</main>
    </div>
  );
}

function Mark() {
  return (
    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#b5843b] bg-[#d9a441] text-[#28160d]">
      <span className="absolute bottom-0 left-0 h-4 w-full border-t border-[#7a4b26]" />
      <span className="relative z-10 display-font text-lg font-bold">H</span>
    </span>
  );
}

function SectionHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="eyebrow mb-3">{eyebrow}</div>
        <h1 className="display-font max-w-[680px] text-4xl leading-[1.08] tracking-[-.03em] text-[#f0e3c9] sm:text-[52px]">{title}</h1>
      </div>
      {children}
    </div>
  );
}

function LanguageSelect({ value, onChange }: { value: HeritageAnalysisInputLanguage; onChange: (value: HeritageAnalysisInputLanguage) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="eyebrow whitespace-nowrap">Read in</span>
      <select value={value} onChange={(event) => onChange(event.target.value as HeritageAnalysisInputLanguage)} className="cursor-pointer appearance-none rounded-lg border border-[#533522] bg-[#2c1a12] px-3 py-2 text-[12px] text-[#e5d5b6] outline-none transition-colors focus:border-[#d9a441]" data-testid="select-language">
        {languageOptions.map((option) => <option key={option.value} value={option.value}>{option.native} · {option.label}</option>)}
      </select>
    </label>
  );
}

function Home() {
  const [, setLocation] = useLocation();
  const [language, setLanguage] = useState<HeritageAnalysisInputLanguage>('English');
  const [preview, setPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ imageBase64: string; mimeType: SupportedMime; imageUrl: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const analyze = useAnalyzeHeritageImage();
  const sites = useListHeritageSites({ query: { queryKey: ['/api/heritage/sites'], staleTime: 300_000 } });

  const accepted = 'image/jpeg,image/png,image/webp';

  function processFile(file?: File) {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Use a JPEG, PNG, or WebP photograph.');
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      setError('That photograph is larger than 12 MB. Choose a smaller file.');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = String(reader.result);
      const imageBase64 = imageUrl.split(',')[1] ?? '';
      const next = { imageBase64, mimeType: file.type as SupportedMime, imageUrl };
      setSelectedFile(next);
      setPreview(imageUrl);
    };
    reader.readAsDataURL(file);
  }

  function onInput(event: ChangeEvent<HTMLInputElement>) {
    processFile(event.target.files?.[0]);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    processFile(event.dataTransfer.files?.[0]);
  }

  function identify() {
    if (!selectedFile) {
      setError('Choose a monument photograph first.');
      return;
    }
    const session: HeritageSession = { ...selectedFile, language };
    writeSession(session);
    analyze.mutate({ data: { image_base64: selectedFile.imageBase64, mime_type: selectedFile.mimeType, language } }, {
      onSuccess: (analysis) => {
        writeSession({ ...session, analysis });
        setLocation('/results');
      },
      onError: (mutationError) => setError(extractError(mutationError)),
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
      <div className="mb-8 flex items-center justify-between md:mb-14">
        <div className="eyebrow flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#d9a441]" />Plate 01 / Begin</div>
        <div className="hidden text-right text-[11px] leading-5 text-[#84674d] sm:block">A visual field guide<br />for the curious</div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_470px] lg:items-start lg:gap-20">
        <section className="fade-up pt-2 lg:pt-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#583a27] bg-[#2b1a12] px-3 py-1.5 text-[11px] text-[#c79c62]">
            <Sparkles size={13} /> An attentive second opinion
          </div>
          <h1 className="display-font max-w-[780px] text-[clamp(3.4rem,8vw,7.5rem)] leading-[.89] tracking-[-.065em] text-[#f3e5c8]">
            Let the stone<br /><span className="text-[#d9a441]">tell its story.</span>
          </h1>
          <p className="mt-8 max-w-[510px] text-[16px] leading-7 text-[#a98b6c] sm:text-[18px]">
            Photograph a monument anywhere in Karnataka. We’ll offer a careful identification, the history around it, and the details worth looking at twice.
          </p>
          <div className="mt-12 flex max-w-[470px] items-center gap-5 border-t border-[#43291c] pt-5 text-[11px] text-[#8b6a4e]">
            <div className="flex items-center gap-2"><Camera size={15} className="text-[#d9a441]" /> One photograph</div>
            <div className="h-4 w-px bg-[#543522]" />
            <div className="flex items-center gap-2"><Info size={15} className="text-[#d9a441]" /> No certainty theatre</div>
          </div>
        </section>

        <section className="fade-up fade-up-delay-1">
          <div className="ink-card rounded-[22px] p-3 sm:p-4">
            <div className="mb-4 flex items-center justify-between px-2 pt-1">
              <div>
                <div className="eyebrow mb-1">Field capture</div>
                <div className="text-[13px] text-[#d4bea0]">What are you looking at?</div>
              </div>
              <LanguageSelect value={language} onChange={setLanguage} />
            </div>
            <label onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={onDrop} className={`upload-dropzone relative flex min-h-[320px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[16px] border border-dashed border-[#75502d] bg-[#29170e] px-6 text-center ${isDragging ? 'is-dragging' : ''}`} data-testid="dropzone-upload">
              <input type="file" accept={accepted} onChange={onInput} className="sr-only" data-testid="input-monument-image" />
              {preview ? (
                <>
                  <img src={preview} alt="Selected monument preview" className="absolute inset-0 h-full w-full object-cover opacity-80" data-testid="img-upload-preview" />
                  <div className="absolute inset-0 bg-[#1d100a]/45" />
                  <div className="relative z-10 rounded-xl border border-[#f0c968]/45 bg-[#22130d]/80 px-5 py-3 backdrop-blur-sm">
                    <Check size={17} className="mx-auto mb-1 text-[#e4b650]" />
                    <span className="text-[12px] font-semibold text-[#f5e4bd]">Photograph ready</span>
                    <span className="mt-1 block text-[10px] text-[#c19b6e]">Choose another to replace it</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#80582f] bg-[#3b2114] text-[#d9a441] slow-drift"><FileImage size={28} strokeWidth={1.3} /></span>
                  <span className="text-[15px] font-semibold text-[#ead8b9]">Drop a photograph here</span>
                  <span className="mt-2 text-[12px] text-[#987454]">or click to browse your camera roll</span>
                  <span className="mono-font mt-7 text-[9px] uppercase tracking-[.15em] text-[#71543e]">JPG · PNG · WEBP / 12 MB MAX</span>
                </>
              )}
            </label>
            {error && <div className="mt-3 flex items-start gap-2 rounded-lg border border-[#754034] bg-[#3a1d18] px-3 py-2.5 text-[12px] leading-5 text-[#e9ac92]" role="alert" data-testid="status-upload-error"><Info size={15} className="mt-0.5 shrink-0" />{error}</div>}
            <button type="button" onClick={identify} disabled={analyze.isPending} className="button-lift mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#d9a441] px-5 py-4 text-[13px] font-bold text-[#2a160b] disabled:cursor-wait disabled:opacity-60" data-testid="button-identify">
              {analyze.isPending ? <><LoaderCircle size={17} className="animate-spin" /> Reading the photograph</> : <>Identify this monument <ArrowUpRight size={17} /></>}
            </button>
          </div>
          <p className="mt-4 px-2 text-center text-[10px] leading-5 text-[#73553c]">Heritage AI is a guide, not an authority. Verify details locally and treat every answer as a thoughtful lead.</p>
        </section>
      </div>

      <section className="fade-up fade-up-delay-2 mt-20 border-t border-[#43291c] pt-8 sm:mt-28">
        <div className="mb-6 flex items-end justify-between">
          <div><div className="eyebrow mb-2">The Karnataka index</div><h2 className="display-font text-2xl text-[#e8d7b8]">Places we know by shape</h2></div>
          <span className="mono-font text-[10px] text-[#75583f]">{sites.isLoading ? 'LOADING INDEX' : `${sites.data?.length ?? 0} SITES IN INDEX`}</span>
        </div>
        {sites.isError ? (
          <div className="rounded-xl border border-[#4a2b1d] bg-[#27160f] p-5 text-sm text-[#aa8968]">The index is taking a pause. You can still identify a photograph.</div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {(sites.data ?? []).slice(0, 4).map((site, index) => (
              <div key={`${site.name}-${index}`} className="group relative overflow-hidden rounded-xl border border-[#3f281b] bg-[#25150e] p-4 transition-colors hover:border-[#78562f]" data-testid={`card-heritage-site-${index}`}>
                <div className="mb-7 flex items-center justify-between"><span className="mono-font text-[10px] text-[#806044]">0{index + 1}</span><span className="h-2 w-2 rounded-full" style={{ background: site.accent }} /></div>
                <div className="text-[14px] font-semibold text-[#e0cdae]">{site.name}</div>
                <div className="mt-1 text-[11px] text-[#88674d]">{site.region} · {site.period}</div>
                <ChevronRight size={15} className="absolute bottom-4 right-4 text-[#735239] transition-transform group-hover:translate-x-1" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SessionEmpty({ page }: { page: 'results' | 'explain' }) {
  const [, setLocation] = useLocation();
  return (
    <div className="mx-auto flex min-h-[80dvh] max-w-[600px] flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#76502d] bg-[#2e1a11] text-[#d9a441]"><ScanLine size={27} strokeWidth={1.4} /></div>
      <div className="eyebrow mb-4">No field note yet</div>
      <h1 className="display-font text-4xl text-[#f0e2c6]">Start with a photograph.</h1>
      <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#967656]">Identify a Karnataka monument first, then return here for the {page === 'results' ? 'full field note' : 'architectural reading'}.</p>
      <button type="button" onClick={() => setLocation('/')} className="button-lift mt-8 flex items-center gap-2 rounded-xl bg-[#d9a441] px-5 py-3 text-sm font-bold text-[#28160c]" data-testid="button-empty-start">Go to identification <ArrowUpRight size={16} /></button>
    </div>
  );
}

function Results() {
  const session = useMemo(() => readSession(), []);
  if (!session?.imageUrl || !session.analysis) return <SessionEmpty page="results" />;
  const analysis = session.analysis;
  const confidence = Math.max(0, Math.min(100, Math.round(analysis.confidence <= 1 ? analysis.confidence * 100 : analysis.confidence)));
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
      <div className="mb-10 flex items-center justify-between">
        <div className="eyebrow">Plate 02 / Field note</div>
        <Link href="/" className="flex items-center gap-2 text-[11px] text-[#b99668] transition-colors hover:text-[#e8c66f]" data-testid="link-new-identification"><RotateCcw size={14} /> New photograph</Link>
      </div>
      <SectionHeading eyebrow="A considered identification" title={analysis.monument_name}>
        <div className="flex items-center gap-2 rounded-full border border-[#624529] bg-[#2d1a11] px-3 py-2 text-[11px] text-[#cbaa72]"><MapPin size={13} /> {analysis.location}</div>
      </SectionHeading>
      <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.82fr)_minmax(0,1.18fr)]">
        <div className="fade-up overflow-hidden rounded-[20px] border border-[#604126] bg-[#28170f]">
          <div className="relative aspect-[4/5] max-h-[620px]">
            <img src={session.imageUrl} alt={`Uploaded photograph of ${analysis.monument_name}`} className="h-full w-full object-cover" data-testid="img-result-monument" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1e1009] via-[#1e1009]/50 to-transparent px-5 pb-5 pt-20">
              <div className="eyebrow mb-2">Your photograph</div>
              <div className="text-sm text-[#ead9b8]">Read with attention to the edges.</div>
            </div>
          </div>
        </div>
        <div className="space-y-5">
          <div className="ink-card fade-up fade-up-delay-1 rounded-[20px] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-5 border-b border-[#49301f] pb-6">
              <div><div className="eyebrow mb-2">The short answer</div><p className="max-w-[590px] text-[15px] leading-7 text-[#d5c1a0]" data-testid="text-analysis-description">{analysis.description}</p></div>
              <div className="shrink-0"><div className="mono-font text-3xl text-[#e0b24c]" data-testid="text-confidence">{confidence}%</div><div className="mt-1 text-right text-[10px] uppercase tracking-[.1em] text-[#856549]">confidence</div></div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Fact label="Likely period" value={analysis.historical_period} />
              <Fact label="Place" value={analysis.location} />
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <InfoBlock eyebrow="Why this reading" title="Clues in the frame" content={analysis.reason_for_identification} />
            <InfoBlock eyebrow="A little context" title="Why it matters" content={analysis.historical_significance} />
          </div>
          <div className="ink-card fade-up fade-up-delay-2 rounded-[20px] p-6 sm:p-8">
            <div className="eyebrow mb-3">Architecture / notice this</div>
            <h2 className="display-font mb-3 text-2xl text-[#e9d9ba]">The language of the building</h2>
            <p className="text-[14px] leading-7 text-[#b59877]" data-testid="text-architecture">{analysis.architecture}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <ListBlock eyebrow="Field discoveries" items={analysis.interesting_facts} />
            <ListBlock eyebrow="Continue the day" items={analysis.nearby_attractions} />
          </div>
          <div className="flex flex-col gap-4 rounded-[20px] border border-[#634428] bg-[#392216] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div><div className="eyebrow mb-2">If you visit</div><p className="text-sm leading-6 text-[#d2b78d]" data-testid="text-best-time">{analysis.best_time_to_visit}</p></div>
            <Link href="/explain" className="button-lift flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d9a441] px-4 py-3 text-[12px] font-bold text-[#2a160b]" data-testid="link-explain-features">Read the stone <ArrowUpRight size={15} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return <div><div className="eyebrow mb-1.5 text-[#8b694b]">{label}</div><div className="text-[14px] text-[#d9c5a3]">{value}</div></div>;
}

function InfoBlock({ eyebrow, title, content }: { eyebrow: string; title: string; content: string }) {
  return <div className="rounded-[18px] border border-[#452b1d] bg-[#25150e] p-5"><div className="eyebrow mb-3 text-[#a47b4c]">{eyebrow}</div><h3 className="display-font mb-2 text-[21px] text-[#dfcdaa]">{title}</h3><p className="text-[13px] leading-6 text-[#9d7f60]">{content}</p></div>;
}

function ListBlock({ eyebrow, items }: { eyebrow: string; items: string[] }) {
  return <div className="rounded-[18px] border border-[#452b1d] bg-[#25150e] p-5"><div className="eyebrow mb-3 text-[#a47b4c]">{eyebrow}</div><ul className="space-y-3">{items.map((item, index) => <li key={`${item}-${index}`} className="flex gap-3 text-[13px] leading-5 text-[#bda381]"><span className="mono-font mt-0.5 text-[10px] text-[#d9a441]">0{index + 1}</span><span>{item}</span></li>)}</ul></div>;
}

function Explain() {
  const [, setLocation] = useLocation();
  const [session, setSession] = useState<HeritageSession | null>(() => readSession());
  const explain = useExplainHeritageImage();
  if (!session?.imageUrl) return <SessionEmpty page="explain" />;
  const activeSession = session;

  function requestExplanation() {
    explain.mutate({ data: { image_base64: activeSession.imageBase64, mime_type: activeSession.mimeType, language: activeSession.language } }, {
      onSuccess: (explanation) => {
        const next: HeritageSession = { ...activeSession, explanation };
        writeSession(next);
        setSession(next);
      },
    });
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-8 sm:py-12 lg:px-14 lg:py-16">
      <div className="mb-10 flex items-center justify-between">
        <div className="eyebrow">Plate 03 / Read the stone</div>
        <button type="button" onClick={() => setLocation('/results')} className="flex items-center gap-2 text-[11px] text-[#b99668] transition-colors hover:text-[#e8c66f]" data-testid="button-back-to-note"><ChevronRight size={14} className="rotate-180" /> Back to field note</button>
      </div>
      <SectionHeading eyebrow="A closer reading" title={session.explanation?.title ?? 'What is the stone saying?'} />
      {!session.explanation && (
        <div className="mb-8 flex flex-col gap-4 rounded-[18px] border border-[#5d4026] bg-[#2f1b11] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3"><Sparkles size={18} className="mt-1 shrink-0 text-[#d9a441]" /><p className="max-w-[650px] text-[13px] leading-6 text-[#c8ad86]">Ask the guide to look past the landmark and point out the architectural features visible in your photograph.</p></div>
          <button type="button" onClick={requestExplanation} disabled={explain.isPending} className="button-lift flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#d9a441] px-5 py-3 text-[12px] font-bold text-[#2a160b] disabled:cursor-wait disabled:opacity-60" data-testid="button-explain">
            {explain.isPending ? <><LoaderCircle size={15} className="animate-spin" /> Studying the frame</> : <>Explain visible features <ArrowUpRight size={15} /></>}
          </button>
        </div>
      )}
      {explain.isError && <div className="mb-6 rounded-xl border border-[#754034] bg-[#3a1d18] p-4 text-sm text-[#e9ac92]" role="alert" data-testid="status-explain-error">{extractError(explain.error)}</div>}
      <div className="grid gap-5 lg:grid-cols-[minmax(250px,.72fr)_minmax(0,1.28fr)]">
        <div className="relative overflow-hidden rounded-[20px] border border-[#604126] bg-[#28170f]">
          <div className="aspect-[4/5] max-h-[620px]"><img src={session.imageUrl} alt="Uploaded monument photograph for architectural explanation" className="h-full w-full object-cover" data-testid="img-explain-monument" /></div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1d0f09] via-[#1d0f09]/75 to-transparent px-5 pb-5 pt-24"><div className="eyebrow mb-1">Reading from</div><div className="text-sm text-[#e8d5b4]">{session.analysis?.monument_name ?? 'Your photograph'}</div></div>
        </div>
        <div>
          {session.explanation ? (
            <div className="space-y-5">
              <div className="ink-card rounded-[20px] p-6 sm:p-8"><div className="eyebrow mb-3">In plain sight</div><p className="text-[16px] leading-8 text-[#d8c2a1]" data-testid="text-explanation-summary">{session.explanation.summary}</p></div>
              <div className="space-y-3">
                {session.explanation.features.map((feature, index) => (
                  <div key={`${feature.feature}-${index}`} className="group rounded-[18px] border border-[#452b1d] bg-[#25150e] p-5 transition-colors hover:border-[#75532e]" data-testid={`card-feature-${index}`}>
                    <div className="flex gap-4"><span className="mono-font pt-1 text-[11px] text-[#d9a441]">0{index + 1}</span><div><h3 className="display-font text-[22px] text-[#e3d1b0]">{feature.feature}</h3><p className="mt-2 text-[13px] leading-6 text-[#aa8b69]">{feature.explanation}</p></div></div>
                  </div>
                ))}
              </div>
              <div className="rounded-[18px] border border-[#634428] bg-[#392216] p-5"><div className="flex gap-3"><Info size={16} className="mt-1 shrink-0 text-[#d9a441]" /><p className="text-[12px] leading-6 text-[#c7aa7e]" data-testid="text-explanation-note">{session.explanation.note}</p></div></div>
            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center rounded-[20px] border border-dashed border-[#59402a] bg-[#25150e] px-8 text-center"><div><div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#3c2416] text-[#d9a441]"><Landmark size={22} /></div><div className="display-font text-2xl text-[#dbc5a2]">Details await your question.</div><p className="mx-auto mt-2 max-w-[330px] text-[13px] leading-6 text-[#947456]">The guide will trace the visible forms, materials, and meanings without pretending it can see what the photograph cannot show.</p></div></div>
          )}
        </div>
      </div>
    </div>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <AppShell>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/results" component={Results} />
          <Route path="/explain" component={Explain} />
          <Route component={NotFound} />
        </Switch>
      </AppShell>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;