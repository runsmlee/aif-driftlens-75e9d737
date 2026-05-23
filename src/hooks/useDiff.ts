import { useMemo } from 'react';
import { computeLineDiff } from '../lib/diff';
import { calculateDriftScore, getDriftSeverity } from '../lib/scoring';
import type { DiffLine, DriftSeverity } from '../types';

export interface DiffResult {
  diffLines: DiffLine[];
  score: number;
  severity: DriftSeverity;
}

export function useDiff(specText: string, implText: string): DiffResult {
  const result = useMemo(() => {
    const diffLines = computeLineDiff(specText, implText);
    const score = specText === '' && implText === '' ? 0 : calculateDriftScore(specText, implText);
    const severity = getDriftSeverity(score);
    return { diffLines, score, severity };
  }, [specText, implText]);

  return result;
}
