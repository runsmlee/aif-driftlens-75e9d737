import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../src/App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renders the SEO heading with comparison copy', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Spec vs Implementation Diff');
  });

  it('renders keyword-rich copy above the tool', () => {
    render(<App />);
    // 'spec vs implementation' appears in both H1 and paragraph copy
    expect(screen.getAllByText(/spec vs implementation/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/spec vs implementation diff/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/compare specification to code/i)).toBeInTheDocument();
    expect(screen.getByText(/catch drift before rework/i)).toBeInTheDocument();
  });

  it('renders both text input areas on load', () => {
    render(<App />);
    const textareas = screen.getAllByRole('textbox');
    expect(textareas.length).toBe(2);
  });

  it('shows drift score placeholder initially (empty inputs)', () => {
    render(<App />);
    expect(screen.getByTestId('drift-score')).toBeInTheDocument();
  });

  it('updates drift score when text is entered in both panels', () => {
    render(<App />);
    const textareas = screen.getAllByRole('textbox');
    const specInput = textareas[0];
    const implInput = textareas[1];

    fireEvent.change(specInput, { target: { value: 'spec line 1\nspec line 2' } });
    fireEvent.change(implInput, { target: { value: 'impl line 1\nimpl line 2' } });

    const scoreEl = screen.getByTestId('drift-score');
    expect(scoreEl.textContent).not.toBe('—');
  });

  it('updates diff highlights when text changes in either panel', () => {
    render(<App />);
    const textareas = screen.getAllByRole('textbox');
    const specInput = textareas[0];
    const implInput = textareas[1];

    fireEvent.change(specInput, { target: { value: 'line a\nline b' } });
    fireEvent.change(implInput, { target: { value: 'line a\nline c' } });

    expect(screen.getByTestId('diff-viewer')).toBeInTheDocument();
  });

  it('saves comparison to localStorage after running', () => {
    render(<App />);
    const textareas = screen.getAllByRole('textbox');

    fireEvent.change(textareas[0], { target: { value: 'spec text' } });
    fireEvent.change(textareas[1], { target: { value: 'impl text' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    const stored = JSON.parse(localStorage.getItem('driftlens-history') || '[]');
    expect(stored.length).toBe(1);
  });

  it('restores comparison from history on click', () => {
    render(<App />);
    const textareas = screen.getAllByRole('textbox');

    fireEvent.change(textareas[0], { target: { value: 'spec text' } });
    fireEvent.change(textareas[1], { target: { value: 'impl text' } });

    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);

    const historyItems = screen.getAllByTestId('history-entry');
    expect(historyItems.length).toBe(1);

    fireEvent.click(historyItems[0]);

    const restoredTextareas = screen.getAllByRole('textbox');
    expect(restoredTextareas[0]).toHaveValue('spec text');
    expect(restoredTextareas[1]).toHaveValue('impl text');
  });
});
