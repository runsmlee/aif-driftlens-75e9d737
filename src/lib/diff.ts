import * as Diff from 'diff';
import type { DiffLine, ChangeType } from '../types';

export interface DiffOptions {
  ignoreWhitespace?: boolean;
}

function hasSharedPrefix(a: string, b: string): boolean {
  if (a.length === 0 || b.length === 0) return false;
  const minLen = Math.min(a.length, b.length);
  let matchLen = 0;
  for (let i = 0; i < minLen; i++) {
    if (a[i] === b[i]) {
      matchLen++;
    } else {
      break;
    }
  }
  return matchLen / minLen >= 0.3;
}

function splitLines(text: string): string[] {
  if (text === '') return [];
  const lines = text.split('\n');
  // Remove trailing empty string from trailing newline
  if (lines[lines.length - 1] === '') {
    lines.pop();
  }
  return lines;
}

export function computeLineDiff(
  left: string,
  right: string,
  options?: DiffOptions,
): DiffLine[] {
  const leftText = left || '';
  const rightText = right || '';

  if (leftText === rightText) return [];

  if (options?.ignoreWhitespace) {
    const normalizeWs = (s: string) =>
      s
        .split('\n')
        .map((l) => l.trimEnd())
        .join('\n');
    if (normalizeWs(leftText) === normalizeWs(rightText)) return [];
  }

  const changes = Diff.diffLines(leftText, rightText);

  // Build raw changes, splitting each chunk into individual lines
  interface RawChange {
    type: ChangeType;
    content: string;
  }

  const rawChanges: RawChange[] = [];

  for (const change of changes) {
    const lines = splitLines(change.value);
    const changeType: ChangeType = change.added
      ? 'added'
      : change.removed
        ? 'deleted'
        : 'unchanged';

    for (const line of lines) {
      rawChanges.push({ type: changeType, content: line });
    }
  }

  // Merge adjacent delete+add pairs into 'modified' where appropriate
  const merged: RawChange[] = [];
  let i = 0;
  while (i < rawChanges.length) {
    const current = rawChanges[i];
    if (
      current.type === 'deleted' &&
      i + 1 < rawChanges.length &&
      rawChanges[i + 1].type === 'added'
    ) {
      const next = rawChanges[i + 1];
      if (hasSharedPrefix(current.content, next.content)) {
        merged.push({ type: 'modified', content: next.content });
        i += 2;
      } else {
        merged.push(current);
        i++;
      }
    } else {
      merged.push(current);
      i++;
    }
  }

  // Assign line numbers and build final result
  const result: DiffLine[] = [];
  let oldLine = 1;
  let newLine = 1;

  for (const change of merged) {
    switch (change.type) {
      case 'unchanged':
        oldLine++;
        newLine++;
        break;
      case 'added':
        result.push({
          type: 'added',
          content: change.content,
          newLineNumber: newLine,
        });
        newLine++;
        break;
      case 'deleted':
        result.push({
          type: 'deleted',
          content: change.content,
          oldLineNumber: oldLine,
        });
        oldLine++;
        break;
      case 'modified':
        result.push({
          type: 'modified',
          content: change.content,
          oldLineNumber: oldLine,
          newLineNumber: newLine,
        });
        oldLine++;
        newLine++;
        break;
    }
  }

  return result;
}
