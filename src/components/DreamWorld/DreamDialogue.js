import React, { useEffect, useState } from 'react';

export const dialoguePages = (body) => {
  if (Array.isArray(body)) return body.filter(Boolean);
  const text = String(body || '').trim();
  return text.match(/[^.!?。！？\n]+(?:[.!?。！？]+[”’"']*|$)/g)?.map((line) => line.trim()).filter(Boolean) || [text];
};

const DreamDialogue = ({ content, type, language, copy, onClose, disabled = false }) => {
  const [page, setPage] = useState(0);
  const [closing, setClosing] = useState(false);
  const requestClose = () => { if (!disabled) setClosing(true); };
  useEffect(() => {
    if (!closing) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(onClose, reducedMotion ? 0 : 260);
    return () => window.clearTimeout(timer);
  }, [closing, onClose]);
  const pages = dialoguePages(content.body);
  const currentPage = Math.min(page, pages.length - 1);
  const lastPage = currentPage === pages.length - 1;
  const advance = () => {
    if (disabled || closing) return;
    if (lastPage) requestClose();
    else setPage((current) => current + 1);
  };

  useEffect(() => {
    const handleKey = (event) => {
      if (disabled || !['e', 'E', ' '].includes(event.key)) return;
      if (event.target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return;
      // Consume the entire key event before Phaser sees it. The closing E must
      // not also start a new conversation or cast the fishing line again.
      event.preventDefault();
      event.stopImmediatePropagation();
      if (event.repeat || closing) return;
      if (lastPage) setClosing(true);
      else setPage((current) => current + 1);
    };
    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [disabled, lastPage, closing]);

  const action = language === 'en'
    ? (lastPage ? 'Close dialogue' : 'Continue dialogue')
    : (lastPage ? '结束对话' : '继续对话');

  return (
    <div className={`dream-dialogue ${closing ? 'is-closing' : 'is-open'}${type === 'fragment' || type === 'fishing' ? ' dream-dialogue--memory' : ''}`}>
      <div className="dream-dialogue__portrait" aria-hidden="true">{type === 'fragment' ? '✦' : type === 'fishing' ? '≈' : '?'}</div>
      <div className="dream-dialogue__text">
        <span className="dream-dialogue__eyebrow">{content.eyebrow}</span>
        <strong>{content.title}</strong>
        <div aria-live="polite" aria-atomic="true">
          <p>{pages[currentPage]}</p>
          {lastPage && content.unlock && <em>{content.unlock}</em>}
        </div>
        <div className="dream-dialogue__advance">
          <span>{currentPage + 1} / {pages.length}</span>
          <button type="button" onClick={advance} disabled={disabled || closing} aria-label={action}>
            <kbd>E</kbd> {action} {lastPage ? '✓' : '▸'}
          </button>
        </div>
      </div>
      <button type="button" disabled={disabled || closing} onClick={requestClose} aria-label={copy.closeOverlay}>×</button>
    </div>
  );
};

export default DreamDialogue;
