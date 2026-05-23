import type { ComparisonHistory } from '../types';

interface HistorySidebarProps {
  history: ComparisonHistory[];
  onSelect: (entry: ComparisonHistory) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function HistorySidebar({ history, onSelect, isOpen, onToggle }: HistorySidebarProps) {
  return (
    <aside className="flex h-full flex-col border-l border-gray-200 bg-gray-50/50">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700
          hover:bg-gray-100/80 transition-colors duration-150"
        aria-expanded={isOpen}
        aria-controls="history-panel"
      >
        <span className="flex items-center gap-2">
          <svg className="h-4 w-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          History
          <span className="text-xs font-normal tabular-nums text-gray-400">({history.length})</span>
        </span>
        <svg
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div id="history-panel" className="flex-1 overflow-y-auto border-t border-gray-200 animate-fade-in">
          {history.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-10 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">No saved comparisons</p>
              <p className="text-xs text-gray-400">Save a comparison to see it here</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    data-testid="history-entry"
                    className="group w-full px-5 py-3.5 text-left hover:bg-white transition-colors duration-150"
                    onClick={() => onSelect(entry)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs tabular-nums text-gray-400">
                        {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} · {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span
                        className={`badge
                          ${entry.severity === 'aligned' ? 'bg-emerald-50 text-emerald-700' : ''}
                          ${entry.severity === 'low' ? 'bg-green-50 text-green-700' : ''}
                          ${entry.severity === 'medium' ? 'bg-amber-50 text-amber-700' : ''}
                          ${entry.severity === 'high' ? 'bg-orange-50 text-orange-700' : ''}
                          ${entry.severity === 'critical' ? 'bg-red-50 text-red-700' : ''}
                        `}
                      >
                        {entry.score}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      {entry.specText.slice(0, 50) || '(empty)'}…
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
