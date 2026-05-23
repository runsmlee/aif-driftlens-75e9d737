export type ChangeType = 'added' | 'deleted' | 'modified' | 'unchanged';

export interface DiffLine {
  type: ChangeType;
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export type DriftSeverity = 'aligned' | 'low' | 'medium' | 'high' | 'critical';

export interface ComparisonHistory {
  id: string;
  timestamp: number;
  specText: string;
  implText: string;
  score: number;
  severity: DriftSeverity;
}
