import React from 'react';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { vi } from 'vitest';
import DreamDialogue from './DreamDialogue';

const props = { content: { title: '蓝色小狐狸', body: '第一句话。第二句话！' }, type: 'npc', language: 'zh', copy: { closeOverlay: '关闭内容' } };
beforeEach(() => vi.useFakeTimers());
afterEach(() => { cleanup(); vi.useRealTimers(); });

test('E advances sentence by sentence and only closes after the final sentence', () => {
  const close = vi.fn();
  render(<DreamDialogue {...props} onClose={close} />);
  expect(screen.getByText('第一句话。')).toBeInTheDocument();
  expect(screen.queryByText('第二句话！')).not.toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'e' });
  expect(screen.getByText('第二句话！')).toBeInTheDocument();
  expect(close).not.toHaveBeenCalled();
  expect(screen.getByRole('button', { name: '结束对话' })).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'E' });
  expect(close).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(260));
  expect(close).toHaveBeenCalledTimes(1);
});

test('held E does not skip pages and the closing event does not leak to world input', () => {
  const worldInput = vi.fn();
  const close = vi.fn();
  window.addEventListener('keydown', worldInput);
  const view = render(<DreamDialogue {...props} onClose={close} />);
  try {
    fireEvent.keyDown(window, { key: 'e', repeat: true });
    expect(screen.getByText('第一句话。')).toBeInTheDocument();
    fireEvent.keyDown(window, { key: 'e' });
    fireEvent.keyDown(window, { key: 'e' });
    expect(close).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(260));
  expect(close).toHaveBeenCalledTimes(1);
    expect(worldInput).not.toHaveBeenCalled();
    view.unmount();
    fireEvent.keyDown(window, { key: 'e' });
    expect(worldInput).toHaveBeenCalledTimes(1);
  } finally { window.removeEventListener('keydown', worldInput); }
});

test('single-page memories close with E, and reset confirmation blocks advancement', () => {
  const close = vi.fn();
  const view = render(<DreamDialogue {...props} content={{ title: '残念', body: '一段回忆。', unlock: '身份已复原' }} type="fragment" disabled onClose={close} />);
  fireEvent.keyDown(window, { key: 'e' });
  expect(close).not.toHaveBeenCalled();
  view.rerender(<DreamDialogue {...props} content={{ title: '残念', body: '一段回忆。', unlock: '身份已复原' }} type="fragment" onClose={close} />);
  expect(screen.getByText('身份已复原')).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'e' });
  expect(close).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(260));
  expect(close).toHaveBeenCalledTimes(1);
});

test('English sentences and authored page arrays support the same continue button', () => {
  const close = vi.fn();
  const view = render(<DreamDialogue {...props} language="en" content={{ title: 'Fox', body: 'A blue fox waits. It looks at you.' }} onClose={close} />);
  fireEvent.click(screen.getByRole('button', { name: 'Continue dialogue' }));
  expect(screen.getByText('It looks at you.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Close dialogue' }));
  expect(close).not.toHaveBeenCalled();
  act(() => vi.advanceTimersByTime(260));
  expect(close).toHaveBeenCalledTimes(1);
  view.unmount();
  render(<DreamDialogue {...props} content={{ title: 'Fox', body: ['First page. Two sentences.', 'Last page.'] }} onClose={close} />);
  expect(screen.getByText('First page. Two sentences.')).toBeInTheDocument();
});
