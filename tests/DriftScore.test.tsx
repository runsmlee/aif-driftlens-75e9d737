import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DriftScore } from '../src/components/DriftScore';
import type { DriftSeverity } from '../src/types';

describe('DriftScore', () => {
  it('renders the numeric score', () => {
    render(<DriftScore score={42} severity="medium" />);
    expect(screen.getByTestId('drift-score')).toHaveTextContent('42');
  });

  it('displays correct severity label based on score range', () => {
    const cases: Array<[number, DriftSeverity, string]> = [
      [0, 'aligned', 'Aligned'],
      [20, 'low', 'Low Drift'],
      [50, 'medium', 'Medium Drift'],
      [70, 'high', 'High Drift'],
      [95, 'critical', 'Critical'],
    ];

    for (const [score, severity, label] of cases) {
      const { unmount } = render(<DriftScore score={score} severity={severity} />);
      expect(screen.getByTestId('drift-score')).toHaveTextContent(label);
      unmount();
    }
  });

  it('applies correct color class for each severity level', () => {
    const cases: Array<[number, DriftSeverity, string]> = [
      [5, 'aligned', 'text-emerald-700'],
      [25, 'low', 'text-green-700'],
      [50, 'medium', 'text-amber-700'],
      [75, 'high', 'text-orange-700'],
      [90, 'critical', 'text-red-700'],
    ];

    for (const [score, severity, colorClass] of cases) {
      const { container, unmount } = render(<DriftScore score={score} severity={severity} />);
      const scoreEl = container.querySelector(`.${colorClass}`);
      expect(scoreEl).toBeTruthy();
      unmount();
    }
  });

  it('shows dash placeholder when score is null', () => {
    render(<DriftScore score={null} severity="aligned" />);
    expect(screen.getByTestId('drift-score')).toHaveTextContent('—');
  });
});
