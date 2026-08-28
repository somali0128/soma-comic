import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DreamGame from './DreamGame';
import {
  DREAM_TUTORIAL_STEPS,
  DREAM_TUTORIAL_STEP_IDS,
  dreamWorldFoundation,
  getDreamScene,
  getSceneFishingSpots,
  getSceneFragments,
  getSceneNpcs,
} from './dreamWorldData';
import {
  dreamWorldCopy,
  dreamWorldStory,
  getNpcPresentation,
} from './dreamWorldContent';
import {
  loadDreamSave,
  recordDreamFishingCatch,
  recordDreamFragment,
  recordDreamPosition,
  recordDreamTutorialStep,
  resetDreamSave,
  saveDreamSave,
} from './dreamSave';
import './DreamWorld.css';

const DreamWorld = ({ language = 'zh' }) => {
  const copy = dreamWorldCopy[language] || dreamWorldCopy.zh;
  const story = dreamWorldStory[language] || dreamWorldStory.zh;
  const [isReady, setIsReady] = useState(false);
  const [archive, setArchive] = useState(loadDreamSave);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [resetOpen, setResetOpen] = useState(false);
  const [gameRevision, setGameRevision] = useState(0);
  const scene = getDreamScene(archive.player.currentSceneId);
  const sceneNpcs = getSceneNpcs(scene.id);
  const sceneFragments = getSceneFragments(scene.id);
  const sceneFishingSpots = getSceneFishingSpots(scene.id);
  const collectedFragmentIds = archive.world.collectedFragmentIds;
  const caughtFishingIds = archive.world.caughtFishingIds;
  const sceneFishingCatchIds = sceneFishingSpots.flatMap((spot) => spot.catchIds);
  const fishingCatchCount = sceneFishingCatchIds.filter((id) => caughtFishingIds.includes(id)).length;
  const allFishingCatchesFound = sceneFishingCatchIds.length > 0
    && fishingCatchCount === sceneFishingCatchIds.length;
  const completedTutorialStepIds = archive.tutorial.completedStepIds;
  const fragmentCount = sceneFragments.filter(({ id }) => collectedFragmentIds.includes(id)).length;
  const allFragmentsCollected = sceneFragments.length > 0 && fragmentCount === sceneFragments.length;
  const tutorialComplete = DREAM_TUTORIAL_STEP_IDS.every((stepId) => (
    completedTutorialStepIds.includes(stepId)
  ));
  const [tutorialExpanded, setTutorialExpanded] = useState(() => !tutorialComplete);
  const npcPresentations = Object.fromEntries(sceneNpcs.map((npc) => [
    npc.id,
    getNpcPresentation(language, npc.id, allFragmentsCollected),
  ]));

  useEffect(() => {
    saveDreamSave(archive);
  }, [archive]);

  useEffect(() => {
    if (tutorialComplete) setTutorialExpanded(false);
  }, [tutorialComplete]);

  const recordTutorialStep = (save, stepId) => (
    recordDreamTutorialStep(save, stepId)
  );

  const handlePositionChange = (sceneId, position) => {
    setArchive((currentArchive) => recordTutorialStep(
      recordDreamPosition(currentArchive, sceneId, position),
      DREAM_TUTORIAL_STEPS.MOVE
    ));
  };

  const handleInteraction = (npcId) => {
    setArchive((currentArchive) => recordTutorialStep(
      currentArchive,
      DREAM_TUTORIAL_STEPS.TALK
    ));
    setActiveOverlay({ type: 'npc', id: npcId });
  };

  const handleFragment = (fragmentId) => {
    setArchive((currentArchive) => recordTutorialStep(
      recordDreamFragment(currentArchive, fragmentId),
      DREAM_TUTORIAL_STEPS.COLLECT
    ));
    setActiveOverlay({ type: 'fragment', id: fragmentId });
  };

  const handleFishingCatch = ({ catchId, isRepeat }) => {
    if (!isRepeat) {
      setArchive((currentArchive) => recordDreamFishingCatch(currentArchive, catchId));
    }
    setActiveOverlay({ type: 'fishing', id: catchId });
  };

  const handleReset = () => {
    setArchive(resetDreamSave());
    setActiveOverlay(null);
    setResetOpen(false);
    setIsReady(false);
    setTutorialExpanded(true);
    setGameRevision((revision) => revision + 1);
  };

  const overlayContent = (() => {
    if (!activeOverlay) return null;
    if (activeOverlay.type === 'npc') {
      const presentation = npcPresentations[activeOverlay.id];
      return presentation ? {
        eyebrow: presentation.name,
        title: presentation.name,
        body: presentation.dialogue,
      } : null;
    }

    if (activeOverlay.type === 'fishing') {
      const fishingCatch = story.fishingCatches[activeOverlay.id];
      return fishingCatch ? {
        eyebrow: copy.fishingCatchLabel,
        title: fishingCatch.title,
        body: fishingCatch.memory,
      } : null;
    }

    const fragment = story.fragments[activeOverlay.id];
    return fragment ? {
      eyebrow: copy.memoryLabel,
      title: fragment.title,
      body: fragment.memory,
      unlock: allFragmentsCollected ? copy.identityUnlocked : null,
    } : null;
  })();

  const tutorialItems = [
    [DREAM_TUTORIAL_STEPS.MOVE, copy.tutorialSteps.move],
    [DREAM_TUTORIAL_STEPS.TALK, copy.tutorialSteps.talk],
    [DREAM_TUTORIAL_STEPS.COLLECT, copy.tutorialSteps.collect],
  ];

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
              <span>{scene.regionId} / {scene.id}</span>
            </div>

            <DreamGame
              key={`${language}-${gameRevision}`}
              copy={copy}
              scene={scene}
              npcs={sceneNpcs}
              fragments={sceneFragments}
              fishingSpots={sceneFishingSpots}
              npcPresentations={npcPresentations}
              collectedFragmentIds={collectedFragmentIds}
              caughtFishingIds={caughtFishingIds}
              initialPosition={archive.player.position}
              onReady={() => setIsReady(true)}
              onInteraction={handleInteraction}
              onFragment={handleFragment}
              onFishingCatch={handleFishingCatch}
              onPositionChange={handlePositionChange}
            />

            <div
              className={`dream-dialogue${overlayContent ? ' is-open' : ''}${activeOverlay?.type === 'fragment' || activeOverlay?.type === 'fishing' ? ' dream-dialogue--memory' : ''}`}
              aria-hidden={!overlayContent}
              aria-live="polite"
            >
              <div className="dream-dialogue__portrait" aria-hidden="true">
                {activeOverlay?.type === 'fragment' ? '✦' : activeOverlay?.type === 'fishing' ? '≈' : '?'}
              </div>
              <div>
                <span className="dream-dialogue__eyebrow">{overlayContent?.eyebrow}</span>
                <strong>{overlayContent?.title}</strong>
                <p>{overlayContent?.body}</p>
                {overlayContent?.unlock && <em>{overlayContent.unlock}</em>}
              </div>
              <button
                type="button"
                tabIndex={overlayContent ? 0 : -1}
                onClick={() => setActiveOverlay(null)}
                aria-label={copy.closeOverlay}
              >×</button>
            </div>
          </section>

          <aside
            className="dream-console__sidebar"
            aria-label={copy.infoPanelLabel}
            tabIndex="0"
          >
            <section className="dream-panel dream-panel--quest">
              <p className="dream-panel__label">{copy.questLabel}</p>
              <h2>{copy.questTitle}</h2>
              <p>{allFragmentsCollected ? copy.questComplete : copy.questBody}</p>
              <div className="dream-progress" aria-label={copy.fragmentProgress}>
                <span style={{ width: `${Math.max(8, (fragmentCount / sceneFragments.length) * 100)}%` }} />
              </div>
              <strong>{fragmentCount} / {sceneFragments.length} {copy.fragments}</strong>
            </section>

            <section className={`dream-panel dream-panel--fishing${allFishingCatchesFound ? ' is-complete' : ''}`}>
              <p className="dream-panel__label">{copy.fishingLabel}</p>
              <h2>{copy.fishingTitle}</h2>
              <p>{allFishingCatchesFound ? copy.fishingComplete : copy.fishingBody}</p>
              <div className="dream-progress dream-progress--fishing" aria-label={copy.fishingProgress}>
                <span style={{ width: `${Math.max(8, (fishingCatchCount / sceneFishingCatchIds.length) * 100)}%` }} />
              </div>
              <strong>{fishingCatchCount} / {sceneFishingCatchIds.length}</strong>
              <ol className="dream-fishing-list">
                {sceneFishingCatchIds.map((catchId) => {
                  const found = caughtFishingIds.includes(catchId);
                  return (
                    <li key={catchId} className={found ? 'is-found' : ''}>
                      <span>{found ? '≈' : '·'}</span>
                      <strong>{found ? story.fishingCatches[catchId].title : copy.undiscoveredCatch}</strong>
                    </li>
                  );
                })}
              </ol>
            </section>

            <section className={`dream-panel dream-panel--tutorial${tutorialComplete ? ' is-complete' : ''}`}>
              <div className="dream-panel__collapsible-header">
                <div>
                  <p className="dream-panel__label">{copy.tutorialLabel}</p>
                  <h2>{tutorialComplete ? copy.tutorialCompleteTitle : copy.tutorialTitle}</h2>
                </div>
                <button
                  type="button"
                  aria-expanded={tutorialExpanded}
                  aria-controls="dream-tutorial-content"
                  onClick={() => setTutorialExpanded((expanded) => !expanded)}
                >
                  {tutorialExpanded ? copy.tutorialCollapse : copy.tutorialExpand}
                  <span aria-hidden="true">{tutorialExpanded ? '−' : '+'}</span>
                </button>
              </div>
              {tutorialExpanded ? (
                <div id="dream-tutorial-content">
                  {tutorialComplete ? (
                    <p className="dream-tutorial-complete-copy">{copy.tutorialCompleteBody}</p>
                  ) : (
                    <ul className="dream-tutorial-list">
                      {tutorialItems.map(([stepId, label]) => {
                        const completed = completedTutorialStepIds.includes(stepId);
                        return <li key={stepId} className={completed ? 'is-complete' : ''}><span>{completed ? '✓' : '○'}</span>{label}</li>;
                      })}
                    </ul>
                  )}
                </div>
              ) : (
                <p className="dream-tutorial-summary">
                  {copy.tutorialProgress}: {completedTutorialStepIds.length} / {DREAM_TUTORIAL_STEP_IDS.length}
                </p>
              )}
            </section>

            <section className="dream-panel dream-panel--archive">
              <p className="dream-panel__label">{copy.archiveLabel}</p>
              <ol>
                {sceneFragments.map((fragment) => {
                  const found = collectedFragmentIds.includes(fragment.id);
                  return (
                    <li key={fragment.id} className={found ? 'is-found' : ''}>
                      <span>{found ? '✦' : '◇'}</span>
                      <div>
                        <strong>{found ? story.fragments[fragment.id].title : copy.undiscoveredFragment}</strong>
                        {found && <p>{story.fragments[fragment.id].memory}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
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
              <div><span>{copy.npcCount}</span><strong>{sceneNpcs.length}</strong></div>
              <button type="button" className="dream-reset-button" onClick={() => setResetOpen(true)}>{copy.reset}</button>
            </section>
          </aside>
        </div>

        <p className="dream-world__footnote">{copy.footnote}</p>
      </div>

      {resetOpen && (
        <div className="dream-reset-modal" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setResetOpen(false);
        }}>
          <div role="dialog" aria-modal="true" aria-labelledby="dream-reset-title" className="dream-reset-modal__dialog">
            <span aria-hidden="true">⌁</span>
            <h2 id="dream-reset-title">{copy.resetTitle}</h2>
            <p>{copy.resetBody}</p>
            <div>
              <button type="button" onClick={() => setResetOpen(false)}>{copy.resetCancel}</button>
              <button type="button" className="is-danger" onClick={handleReset}>{copy.resetConfirm}</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DreamWorld;
