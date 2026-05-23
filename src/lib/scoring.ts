import { computeLineDiff } from './diff';
import type { DriftSeverity } from '../types';

export function calculateDriftScore(left: string, right: string): number {
  if (left === right) return 0;
  if (left === '' && right === '') return 0;

  const leftLines = left ? left.split('\n') : [];
  const rightLines = right ? right.split('\n') : [];

  if (leftLines.length === 0 && rightLines.length > 0) return 100;
  if (rightLines.length === 0 && leftLines.length > 0) return 100;

  const diffLines = computeLineDiff(left, right);

  // Use the maximum of left/right line count as the denominator
  const totalLines = Math.max(leftLines.length, rightLines.length);
  if (totalLines === 0) return 0;

  // For modified lines, count each as one change (not two)
  const modifications = diffLines.filter((d) => d.type === 'modified').length;
  const additions = diffLines.filter((d) => d.type === 'added').length;
  const deletions = diffLines.filter((d) => d.type === 'deleted').length;

  // Changed lines = modifications + additions + deletions
  // But modified lines represent a pair, so effective changed = modifications + additions + deletions
  const effectiveChanged = modifications + additions + deletions;
  const score = Math.round((effectiveChanged / totalLines) * 100);

  return Math.min(100, Math.max(0, score));
}

export function getDriftSeverity(score: number): DriftSeverity {
  if (score <= 15) return 'aligned';
  if (score <= 35) return 'low';
  if (score <= 60) return 'medium';
  if (score <= 85) return 'high';
  return 'critical';
}
