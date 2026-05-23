import { useState } from 'react';
import type { DiffLine } from '../types';

const typeStyles: Record<string, string> = {
  added: 'bg-emerald-50 text-emerald-900 border-l-[3px] border-l-emerald-400',
  deleted: 'bg-red-50 text-red-900 border-l-[3px] border-l-red-400',
  modified: 'bg-amber-50 text-amber-900 border-l-[3px] border-l-amber-400',
};

const typeIcons: Record<string, string> = {
  added: '+',
  deleted: '−',
  modified: '~',
};

const typeLabels: Record<string, string> = {
  added: 'Added',
  deleted: 'Deleted',
  modified: 'Modified',
};

interface TooltipState {
  visible: boolean;
  text: string;
  x: number;
  y: number;
}

interface DiffViewerProps {
  diffLines: DiffLine[];
}

export function DiffViewer({ diffLines }: DiffViewerProps) {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    text: '',
    x: 0,
    y: 0,
  });

  if (diffLines.length === 0) {
    return (
      <div
        data-testid="diff-viewer"
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
          <svg className="h-6 w-6 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">No differences found</p>
          <p className="mt-0.5 text-xs text-gray-400">Your implementation matches the spec</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="diff-viewer" className="relative">
      {tooltip.visible && (
        <div
          role="tooltip"
          className="pointer-events-none fixed z-50 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg animate-fade-in"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}
      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        {diffLines.map((line, index) => (
          <div
            key={`${line.type}-${line.oldLineNumber ?? 'new'}-${line.newLineNumber ?? 'old'}-${index}`}
            data-change-type={line.type}
            className={`group flex items-start gap-0 px-4 py-1.5 font-mono text-[13px] leading-relaxed whitespace-pre-wrap transition-colors duration-100 ${typeStyles[line.type] ?? ''}`}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setTooltip({
                visible: true,
                text: typeLabels[line.type] ?? line.type,
                x: rect.right + 8,
                y: rect.top,
              });
            }}
            onMouseLeave={() => setTooltip((prev) => ({ ...prev, visible: false }))}
          >
            <span className="mr-3 inline-block w-4 shrink-0 text-center text-xs font-bold opacity-60 select-none" aria-hidden="true">
              {typeIcons[line.type] ?? ' '}
            </span>
            <span className="select-all">{line.content}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
