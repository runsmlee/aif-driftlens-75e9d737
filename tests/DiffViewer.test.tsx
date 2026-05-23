import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DiffViewer } from '../src/components/DiffViewer';
import type { DiffLine } from '../src/types';

const addedLine: DiffLine = { type: 'added', content: 'new line here', newLineNumber: 3 };
const deletedLine: DiffLine = { type: 'deleted', content: 'old line here', oldLineNumber: 2 };
const modifiedLine: DiffLine = { type: 'modified', content: 'changed line', oldLineNumber: 4, newLineNumber: 4 };

describe('DiffViewer', () => {
  it('renders without crash when given diff results', () => {
    const diffs: DiffLine[] = [addedLine, deletedLine, modifiedLine];
    const { container } = render(<DiffViewer diffLines={diffs} />);
    expect(container).toBeTruthy();
  });

  it('renders "No differences" message when diff array is empty', () => {
    render(<DiffViewer diffLines={[]} />);
    expect(screen.getByText(/no differences/i)).toBeInTheDocument();
  });

  it('highlights added lines with green background class', () => {
    render(<DiffViewer diffLines={[addedLine]} />);
    const line = screen.getByText('new line here');
    expect(line.closest('[data-change-type="added"]')).toBeTruthy();
  });

  it('highlights deleted lines with red background class', () => {
    render(<DiffViewer diffLines={[deletedLine]} />);
    const line = screen.getByText('old line here');
    expect(line.closest('[data-change-type="deleted"]')).toBeTruthy();
  });

  it('highlights modified lines with yellow background class', () => {
    render(<DiffViewer diffLines={[modifiedLine]} />);
    const line = screen.getByText('changed line');
    expect(line.closest('[data-change-type="modified"]')).toBeTruthy();
  });

  it('shows change-type tooltip on hover over a highlighted line', async () => {
    const user = userEvent.setup();
    render(<DiffViewer diffLines={[addedLine]} />);
    const line = screen.getByText('new line here');
    await user.hover(line);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });
});
