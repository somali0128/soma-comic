import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DreamGame from './DreamGame';
import { dreamWorldCopy, dreamWorldFoundation } from './dreamWorldData';
import { loadDreamSave, recordDreamFragment, saveDreamSave } from './dreamSave';
import './DreamWorld.css';

const DreamWorld = ({ language = 'zh' }) => {
  const copy = dreamWorldCopy[language] || dreamWorldCopy.zh;
  const [isReady, setIsReady] = useState(false);
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [archive, setArchive] = useState(loadDreamSave);
  const scene = dreamWorldFoundation.scenes[0];
  const sceneFragmentIds = scene.fragmentIds || [];
  const collectedFragmentIds = archive.world.collectedFragmentIds;
  const fragmentCount = sceneFragmentIds.filter((fragmentId) => (
    collectedFragmentIds.includes(fragmentId)
  )).length;

  useEffect(() => {
    saveDreamSave(archive);
  }, [archive]);

  const handleFragment = (fragmentId) => {
    setArchive((currentArchive) => recordDreamFragment(currentArchive, fragmentId));
  };

  return (
    <section className="dream-world">
      <div className="dream-world__noise" aria-hidden="true" />
      <div className="dream-world__content">
        <nav className="dream-world__topbar" aria-label={copy.pageNavigationLabel}>
          <Link className="dream-world__back" to="/tools">← {copy.back}</Link>
          <div className={`dream-world__status${isReady ? ' is-online' : ''}`}>
            <span aria-hidden="true" />
            {isReady ? copy.online : copy.loading}
          </div>
        </nav>

        <header className="dream-world__header">
          <div>
            <p className="dream-world__eyebrow">{copy.eyebrow}</p>
            <h1>{copy.title}</h1>
          </div>
          <p>{copy.intro}</p>
        </header>

        <div className="dream-console">
          <section className="dream-console__game" aria-labelledby="dream-game-title">
            <div className="dream-console__bar">
              <div>
                <span className="dream-console__signal" aria-hidden="true" />
                <strong id="dream-game-title">{copy.sceneLabel}</strong>
              </div>
              <span>{scene.id}</span>
            </div>

            <DreamGame
              key={language}
              copy={copy}
              collectedFragmentIds={collectedFragmentIds}
              onReady={() => setIsReady(true)}
              onInteraction={() => setDialogueOpen(true)}
              onFragment={handleFragment}
            />

            <div
              className={`dream-dialogue${dialogueOpen ? ' is-open' : ''}`}
              aria-hidden={!dialogueOpen}
              aria-live="polite"
            >
              <div className="dream-dialogue__portrait" aria-hidden="true">?</div>
              <div>
                <strong>{copy.npcLabel}</strong>
                <p>{copy.dialogue}</p>
              </div>
              <button
                type="button"
                tabIndex={dialogueOpen ? 0 : -1}
                onClick={() => setDialogueOpen(false)}
                aria-label={copy.closeDialogue}
              >×</button>
            </div>
          </section>

          <aside className="dream-console__sidebar">
            <section className="dream-panel dream-panel--quest">
              <p className="dream-panel__label">{copy.questLabel}</p>
              <h2>{copy.questTitle}</h2>
              <p>{fragmentCount ? copy.questComplete : copy.questBody}</p>
              <div className="dream-progress" aria-label={copy.fragmentProgress}>
                <span style={{ width: fragmentCount ? '100%' : '12%' }} />
              </div>
              <strong>{fragmentCount} / {sceneFragmentIds.length} {copy.fragments}</strong>
            </section>

            <section className="dream-panel">
              <p className="dream-panel__label">{copy.controlsTitle}</p>
              <dl className="dream-controls-list">
                <div><dt>↑ ↓ ← →</dt><dd>{copy.move}</dd></div>
                <div><dt>W A S D</dt><dd>{copy.moveAlt}</dd></div>
                <div><dt>E / SPACE</dt><dd>{copy.interact}</dd></div>
              </dl>
            </section>

            <section className="dream-panel dream-panel--system">
              <p className="dream-panel__label">{copy.systemLabel}</p>
              <div><span>{copy.engine}</span><strong>Phaser 4</strong></div>
              <div><span>{copy.sceneCount}</span><strong>{dreamWorldFoundation.scenes.length}</strong></div>
              <div><span>{copy.npcCount}</span><strong>{dreamWorldFoundation.npcs.length}</strong></div>
            </section>
          </aside>
        </div>

        <p className="dream-world__footnote">{copy.footnote}</p>
      </div>
    </section>
  );
};

export default DreamWorld;
