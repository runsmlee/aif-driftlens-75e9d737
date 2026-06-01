import { useState, useEffect, useCallback } from 'react';
import { TextInput } from './components/TextInput';
import { DiffViewer } from './components/DiffViewer';
import { DriftScore } from './components/DriftScore';
import { HistorySidebar } from './components/HistorySidebar';
import { useDiff } from './hooks/useDiff';
import type { ComparisonHistory, DriftSeverity } from './types';

const HISTORY_KEY = 'driftlens-history';
const MAX_HISTORY = 10;

function loadHistory(): ComparisonHistory[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: ComparisonHistory[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function trackEvent(event: string, props?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.aif?.track) {
    window.aif.track(event, props);
  }
}

export default function App() {
  const [specText, setSpecText] = useState('');
  const [implText, setImplText] = useState('');
  const [history, setHistory] = useState<ComparisonHistory[]>(loadHistory);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { diffLines, score, severity } = useDiff(specText, implText);

  // Track page view on mount
  useEffect(() => {
    trackEvent('page_view', { path: window.location.pathname });
  }, []);

  const handleSave = useCallback(() => {
    const entry: ComparisonHistory = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      specText,
      implText,
      score,
      severity: severity as DriftSeverity,
    };

    const updated = [entry, ...history].slice(0, MAX_HISTORY);
    setHistory(updated);
    saveHistory(updated);
    setHistoryOpen(true);
    trackEvent('comparison_saved', { score, severity });
  }, [specText, implText, score, severity, history]);

  const handleHistorySelect = useCallback((entry: ComparisonHistory) => {
    setSpecText(entry.specText);
    setImplText(entry.implText);
    trackEvent('history_entry_clicked', { entryId: entry.id });
  }, []);

  const hasContent = specText.length > 0 || implText.length > 0;

  return (
    <div className="flex h-screen flex-col bg-white font-sans">
      {/* Header */}
      <header className="relative border-b border-gray-200 px-4 py-4 sm:px-8">
        {/* Subtle top accent line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-brand via-red-400 to-orange-400" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Brand mark */}
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white" aria-hidden="true">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
                <path d="M11 8v6" />
                <path d="M8 11h6" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-gray-900">DriftLens</span>
          </div>

          <DriftScore
            score={hasContent ? score : null}
            severity={severity}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* SEO Heading + Supporting Copy */}
          <div className="px-4 pt-5 sm:px-8 sm:pt-6 lg:px-10">
            <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
              Compare Spec vs Implementation — Instantly
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-600">
              Paste your spec and implementation for an instant spec diff with
              drift detection. Line-by-line implementation comparison flags every
              added, deleted, or modified line, and a 0–100 severity score
              quantifies drift — no account needed.
            </p>
          </div>

          {/* Input Panels */}
          <div className="flex flex-1 flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-6 lg:p-8">
            <div className="flex-1 min-w-0">
              <TextInput
                label="Original Spec"
                value={specText}
                onChange={setSpecText}
                placeholder="Paste your spec text here..."
              />
            </div>
            <div className="flex-1 min-w-0">
              <TextInput
                label="Implementation"
                value={implText}
                onChange={setImplText}
                placeholder="Paste your implementation text here..."
              />
            </div>
          </div>

          {/* Diff Results + Save */}
          {hasContent && (
            <div className="animate-slide-up border-t border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold tracking-wide text-gray-800 uppercase">
                    Differences
                  </h2>
                  {diffLines.length > 0 && (
                    <span className="badge bg-gray-100 text-gray-600">
                      {diffLines.length}
                    </span>
                  )}
                </div>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white
                    shadow-sm hover:bg-red-600 hover:shadow-md
                    focus:outline-none focus:ring-2 focus:ring-brand/50 focus:ring-offset-2
                    active:scale-[0.97] transition-all duration-150"
                  aria-label="Save comparison"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  Save
                </button>
              </div>
              <DiffViewer diffLines={diffLines} />
            </div>
          )}
        </main>

        {/* History Sidebar */}
        <div className="w-72 shrink-0 hidden md:block">
          <HistorySidebar
            history={history}
            onSelect={handleHistorySelect}
            isOpen={historyOpen}
            onToggle={() => setHistoryOpen(!historyOpen)}
          />
        </div>
      </div>
    </div>
  );
}
