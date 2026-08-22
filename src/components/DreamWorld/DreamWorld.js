import React from 'react';
import { Link } from 'react-router-dom';
import { dreamWorldCopy, dreamWorldFoundation } from './dreamWorldData';
import './DreamWorld.css';

const DreamWorld = ({ language = 'zh' }) => {
  const copy = dreamWorldCopy[language] || dreamWorldCopy.zh;
  const scene = dreamWorldFoundation.scenes[0];

  return (
    <section className="dream-world">
      <div className="dream-world__stars" aria-hidden="true" />
      <div className="dream-world__content">
        <Link className="dream-world__back" to="/tools">← {copy.back}</Link>

        <header className="dream-world__header">
          <p className="dream-world__eyebrow">{copy.eyebrow}</p>
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
        </header>

        <div className="dream-world__grid">
          <section className="dream-preview" aria-labelledby="dream-preview-title">
            <div className="dream-preview__bar">
              <span id="dream-preview-title">{copy.sceneLabel}</span>
              <span>{scene.id}</span>
            </div>
            <div className="dream-preview__map" role="img" aria-label={copy.sceneLabel}>
              <span className="pixel-tree pixel-tree--one" aria-hidden="true" />
              <span className="pixel-tree pixel-tree--two" aria-hidden="true" />
              <span className="pixel-pond" aria-hidden="true" />
              <span className="pixel-character pixel-character--player" aria-hidden="true" />
              <span className="pixel-character pixel-character--npc" aria-hidden="true" />
              <span className="pixel-label pixel-label--player">{copy.playerLabel}</span>
              <span className="pixel-label pixel-label--npc">{copy.npcLabel}</span>
            </div>
            <blockquote className="dream-preview__dialogue">{copy.dialogue}</blockquote>
          </section>

          <aside className="dream-world__sidebar">
            <div className="dream-card dream-card--notice">
              <span className="dream-card__light" aria-hidden="true" />
              <h2>{copy.notice}</h2>
              <p>{copy.noticeBody}</p>
              <button type="button" disabled>{copy.enterLater}</button>
            </div>

            <div className="dream-card">
              <h2>{copy.plannedTitle}</h2>
              <ul>
                {copy.plannedItems.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </aside>
        </div>

        <section className="dream-archive">
          <div aria-hidden="true">✦</div>
          <div>
            <h2>{copy.archiveTitle}</h2>
            <p>{copy.archiveBody}</p>
          </div>
          <dl>
            <div><dt>Scenes</dt><dd>{dreamWorldFoundation.scenes.length}</dd></div>
            <div><dt>NPCs</dt><dd>{dreamWorldFoundation.npcs.length}</dd></div>
            <div><dt>Fragments</dt><dd>{dreamWorldFoundation.fragments.length}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  );
};

export default DreamWorld;
