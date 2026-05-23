import type { DriftSeverity } from '../types';

const severityConfig: Record<DriftSeverity, { label: string; color: string; bg: string; ring: string; dot: string }> = {
  aligned: { label: 'Aligned', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', ring: 'ring-emerald-500/20', dot: 'bg-emerald-500' },
  low: { label: 'Low Drift', color: 'text-green-700', bg: 'bg-green-50 border-green-200', ring: 'ring-green-500/20', dot: 'bg-green-500' },
  medium: { label: 'Medium Drift', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', ring: 'ring-amber-500/20', dot: 'bg-amber-500' },
  high: { label: 'High Drift', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', ring: 'ring-orange-500/20', dot: 'bg-orange-500' },
  critical: { label: 'Critical', color: 'text-red-700', bg: 'bg-red-50 border-red-200', ring: 'ring-red-500/20', dot: 'bg-red-500' },
};

interface DriftScoreProps {
  score: number | null;
  severity: DriftSeverity;
}

export function DriftScore({ score, severity }: DriftScoreProps) {
  const config = severityConfig[severity];
  const displayScore = score !== null ? score : '—';
  const isActive = score !== null;

  return (
    <div
      data-testid="drift-score"
      className={`inline-flex items-center gap-3 rounded-xl border px-4 py-2.5 transition-all duration-300 ${
        isActive ? `${config.bg} ring-1 ${config.ring}` : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className={`text-2xl font-bold tabular-nums tracking-tight transition-colors duration-300 ${
        isActive ? config.color : 'text-gray-400'
      }`}>
        {displayScore}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
            isActive ? config.dot : 'bg-gray-300'
          }`} aria-hidden="true" />
          <span className={`text-xs font-semibold tracking-wide uppercase transition-colors duration-300 ${
            isActive ? config.color : 'text-gray-400'
          }`}>
            {isActive ? config.label : 'No Data'}
          </span>
        </div>
      </div>
    </div>
  );
}
