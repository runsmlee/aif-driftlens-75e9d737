import { describe, it, expect } from 'vitest';
import { computeLineDiff } from '../src/lib/diff';
import { calculateDriftScore, getDriftSeverity } from '../src/lib/scoring';
import type { DiffLine } from '../src/types';

describe('computeLineDiff', () => {
  it('returns empty array for identical texts', () => {
    const text = 'line 1\nline 2\nline 3';
    const result = computeLineDiff(text, text);
    expect(result).toEqual([]);
  });

  it('correctly identifies added lines (present in right, absent in left)', () => {
    const left = 'line 1\nline 2';
    const right = 'line 1\nline 2\nline 3';
    const result = computeLineDiff(left, right);
    expect(result.length).toBeGreaterThan(0);
    const added = result.filter((d: DiffLine) => d.type === 'added');
    expect(added.length).toBeGreaterThanOrEqual(1);
    expect(added.some((d: DiffLine) => d.content.includes('line 3'))).toBe(true);
  });

  it('correctly identifies deleted lines (present in left, absent in right)', () => {
    const left = 'line 1\nline 2\nline 3';
    const right = 'line 1\nline 3';
    const result = computeLineDiff(left, right);
    const deleted = result.filter((d: DiffLine) => d.type === 'deleted');
    expect(deleted.length).toBeGreaterThanOrEqual(1);
    expect(deleted.some((d: DiffLine) => d.content.includes('line 2'))).toBe(true);
  });

  it('correctly identifies modified lines (adjacent delete+add with shared prefix)', () => {
    const left = 'function foo() {\n  return 1;\n}';
    const right = 'function foo() {\n  return 2;\n}';
    const result = computeLineDiff(left, right);
    const modified = result.filter((d: DiffLine) => d.type === 'modified');
    expect(modified.length).toBeGreaterThanOrEqual(1);
  });

  it('ignores pure whitespace-only differences when option enabled', () => {
    const left = 'line 1\nline 2';
    const right = 'line 1  \nline 2';
    const result = computeLineDiff(left, right, { ignoreWhitespace: true });
    expect(result).toEqual([]);
  });

  it('handles empty left input (all additions)', () => {
    const left = '';
    const right = 'line 1\nline 2';
    const result = computeLineDiff(left, right);
    const added = result.filter((d: DiffLine) => d.type === 'added');
    expect(added.length).toBe(2);
  });

  it('handles empty right input (all deletions)', () => {
    const left = 'line 1\nline 2';
    const right = '';
    const result = computeLineDiff(left, right);
    const deleted = result.filter((d: DiffLine) => d.type === 'deleted');
    expect(deleted.length).toBe(2);
  });
});

describe('calculateDriftScore', () => {
  it('returns 0 for identical texts', () => {
    const score = calculateDriftScore('same text\nmore same', 'same text\nmore same');
    expect(score).toBe(0);
  });

  it('returns 100 when all lines changed', () => {
    const score = calculateDriftScore('old line 1\nold line 2', 'new line 1\nnew line 2');
    expect(score).toBe(100);
  });

  it('returns proportional score for partial changes', () => {
    const left = 'line 1\nline 2\nline 3\nline 4';
    const right = 'line 1\nchanged\nline 3\nline 4';
    const score = calculateDriftScore(left, right);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });
});

describe('getDriftSeverity', () => {
  it('returns "aligned" for scores 0–15', () => {
    expect(getDriftSeverity(0)).toBe('aligned');
    expect(getDriftSeverity(15)).toBe('aligned');
  });

  it('returns "low" for scores 16–35', () => {
    expect(getDriftSeverity(16)).toBe('low');
    expect(getDriftSeverity(35)).toBe('low');
  });

  it('returns "medium" for scores 36–60', () => {
    expect(getDriftSeverity(36)).toBe('medium');
    expect(getDriftSeverity(60)).toBe('medium');
  });

  it('returns "high" for scores 61–85', () => {
    expect(getDriftSeverity(61)).toBe('high');
    expect(getDriftSeverity(85)).toBe('high');
  });

  it('returns "critical" for scores 86–100', () => {
    expect(getDriftSeverity(86)).toBe('critical');
    expect(getDriftSeverity(100)).toBe('critical');
  });
});
