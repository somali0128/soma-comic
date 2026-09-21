import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import dreamWalker from './assets/dream-walker.png';
import { renderDreamRegion } from './dreamRegionRenderer';
import {
  TILE_SIZE, cellToWorld, worldToCell,
  cellDistance, nextGridCell, resolveGridPosition,
} from './lakesideMap';

const GAME_WIDTH = 960;
const GAME_HEIGHT = 640;
const STEP_DURATION = 190;

const DreamGame = ({
  caughtFishingIds = [],
  collectedFragmentIds = [],
  copy,
  fishingSpots = [],
  fragments,
  initialPosition,
  npcPresentations,
  npcs,
  onFragment,
  onFishingCatch,
  onInteraction,
  onPositionChange,
  onReady,
  onPortal,
  scene,
  language = 'zh',
  paused = false,
}) => {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const controlsRef = useRef({ up: false, down: false, left: false, right: false, interact: false });
  const runtimeRef = useRef({
    caughtFishingIds,
    collectedFragmentIds,
    copy,
    fishingSpots,
    fragments,
    initialPosition,
    npcPresentations,
    npcs,
    scene,
  });
  const callbacksRef = useRef({ onFragment, onFishingCatch, onInteraction, onPositionChange, onReady, onPortal });

  useEffect(() => {
    runtimeRef.current = {
      caughtFishingIds,
      collectedFragmentIds,
      copy,
      fishingSpots,
      fragments,
      initialPosition,
      npcPresentations,
      npcs,
      scene,
    };
  }, [caughtFishingIds, collectedFragmentIds, copy, fishingSpots, fragments, initialPosition, npcPresentations, npcs, scene]);

  useEffect(() => {
    callbacksRef.current = { onFragment, onFishingCatch, onInteraction, onPositionChange, onReady, onPortal };
  }, [onFragment, onFishingCatch, onInteraction, onPositionChange, onReady, onPortal]);

  useEffect(() => {
    const activeScene = gameRef.current?.scene?.getScene(scene.id);
    activeScene?.updateNpcPresentations?.(npcPresentations);
  }, [npcPresentations, scene.id]);

  useEffect(() => {
    if (!mountRef.current || gameRef.current) return undefined;

    const controls = controlsRef;
    const runtime = runtimeRef;
    const callbacks = callbacksRef;
    const initialScene = runtime.current.scene;

    class DreamRegionScene extends Phaser.Scene {
      constructor() {
        super({ key: initialScene.id });
        this.lastDirection = 'down';
        this.lastPositionEmit = 0;
        this.isStepping = false;
        this.queuedDirection = null;
        this.npcObjects = new Map();
        this.fragmentObjects = new Map();
        this.fishingSpotObjects = new Map();
        this.activeFishing = null;
      }

      preload() {
        this.load.spritesheet('dream-walker', dreamWalker, {
          frameWidth: 341,
          frameHeight: 384,
        });
      }

      create() {
        const sceneConfig = runtime.current.scene;
        const savedPosition = runtime.current.initialPosition;
        this.occupiedCells = runtime.current.npcs.map(worldToCell);
        const spawn = resolveGridPosition(savedPosition, sceneConfig.spawn, this.occupiedCells, sceneConfig.map);
        this.gridCell = worldToCell(spawn);

        renderDreamRegion(this, sceneConfig, language);
        const worldWidth = sceneConfig.map[0].length * TILE_SIZE;
        const worldHeight = sceneConfig.map.length * TILE_SIZE;
        this.physics.world.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBounds(0, 0, worldWidth, worldHeight);
        this.cameras.main.setBackgroundColor('#12152f');
        this.cameras.main.setRoundPixels(true);

        this.createAnimations();
        this.player = this.add.sprite(
          spawn.x,
          spawn.y,
          'dream-walker',
          1
        );
        this.player.setScale(0.14).setOrigin(0.5, 0.75).setDepth(spawn.y + 16);

        this.createNpcs(runtime.current.npcs, runtime.current.npcPresentations);
        this.createFragments(runtime.current.fragments, runtime.current.collectedFragmentIds);
        this.createFishingSpots(runtime.current.fishingSpots);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
        this.input.keyboard.on('keydown', (event) => {
          const direction = { ArrowUp: 'up', w: 'up', W: 'up', ArrowDown: 'down', s: 'down', S: 'down',
            ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' }[event.key];
          if (direction && !event.repeat && !pausedRef.current && !this.activeFishing) this.queuedDirection = direction;
          if (['e', 'E', ' '].includes(event.key) && !event.repeat && !pausedRef.current
            && (event.key !== ' ' || event.target?.tagName !== 'BUTTON')) controls.current.interact = true;
        });
        const clearInput = () => {
          Object.keys(controls.current).forEach((key) => { controls.current[key] = false; });
          this.queuedDirection = null;
          this.input.keyboard.resetKeys();
        };
        this.game.events.on('blur', clearInput);
        this.events.once('shutdown', () => this.game.events.off('blur', clearInput));
        this.input.keyboard.addCapture([
          Phaser.Input.Keyboard.KeyCodes.UP,
          Phaser.Input.Keyboard.KeyCodes.DOWN,
          Phaser.Input.Keyboard.KeyCodes.LEFT,
          Phaser.Input.Keyboard.KeyCodes.RIGHT,
          Phaser.Input.Keyboard.KeyCodes.SPACE,
        ]);

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setDeadzone(180, 120);
        this.cameras.main.fadeIn(700, 15, 15, 35);
        this.updatePositionLabel();
        callbacks.current.onReady?.();
      }

      createAnimations() {
        [
          ['walk-down', [0, 1, 2, 1]],
          ['walk-left', [3, 4, 5, 4]],
          ['walk-right', [6, 7, 8, 7]],
          ['walk-up', [9, 10, 11, 10]],
        ].forEach(([key, frames]) => {
          this.anims.create({
            key,
            frames: this.anims.generateFrameNumbers('dream-walker', { frames }),
            frameRate: 8,
            repeat: -1,
          });
        });
      }

      createNpcs(npcDefinitions = [], presentations = {}) {
        npcDefinitions.forEach((definition) => {
          const presentation = presentations[definition.id] || { name: definition.id };
          const sprite = this.add.sprite(
            definition.x,
            definition.y,
            definition.sprite === 'blue-fox' ? 'lake-blue-fox' : 'dream-walker',
            definition.sprite === 'blue-fox' ? undefined : definition.frame ?? 1
          );
          sprite.setScale(definition.sprite === 'blue-fox' ? 1 : 0.14).setOrigin(0.5, 0.75).setDepth(definition.y + 16);
          if (definition.tint) sprite.setTint(definition.tint);

          const label = this.add.text(definition.x, definition.y - 62, presentation.name, {
            fontFamily: 'monospace',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#fff6d8',
            backgroundColor: '#161633cc',
            padding: { x: 7, y: 4 },
          }).setOrigin(0.5).setDepth(3000);

          const prompt = this.add.text(definition.x, definition.y - 100, runtime.current.copy.talkPrompt, {
            fontFamily: 'monospace',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#18162f',
            backgroundColor: '#fff4b8',
            padding: { x: 9, y: 6 },
          }).setOrigin(0.5).setDepth(3000).setVisible(false);

          this.npcObjects.set(definition.id, { definition, label, prompt, sprite });
        });
      }

      updateNpcPresentations(presentations = {}) {
        this.npcObjects.forEach((entry, npcId) => {
          const presentation = presentations[npcId];
          if (presentation?.name) entry.label.setText(presentation.name);
        });
      }

      createFragmentTexture(fragment) {
        const textureKey = `dream-fragment-${fragment.id}`;
        if (this.textures.exists(textureKey)) return textureKey;

        const shape = this.make.graphics({ x: 0, y: 0, add: false });
        shape.fillStyle(fragment.color, 0.3);
        shape.fillCircle(14, 14, 14);
        shape.fillStyle(0xf4ffff, 1);
        shape.fillTriangle(14, 0, 27, 14, 1, 14);
        shape.fillStyle(fragment.color, 1);
        shape.fillTriangle(1, 14, 27, 14, 14, 28);
        shape.generateTexture(textureKey, 28, 28);
        shape.destroy();
        return textureKey;
      }

      createFragments(fragmentDefinitions = [], collectedIds = []) {
        fragmentDefinitions.forEach((fragment) => {
          if (collectedIds.includes(fragment.id)) return;

          const textureKey = this.createFragmentTexture(fragment);
          const glow = this.add.circle(fragment.x, fragment.y, 24, fragment.color, 0.2).setDepth(8);
          const sprite = this.physics.add.image(fragment.x, fragment.y, textureKey).setDepth(9);
          sprite.body.setAllowGravity(false);
          this.tweens.add({
            targets: [sprite, glow],
            y: '-=10',
            alpha: { from: 0.45, to: 0.78 },
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });

          this.fragmentObjects.set(fragment.id, { definition: fragment, glow, sprite });
        });
      }

      collectFragment(fragmentId) {
        const entry = this.fragmentObjects.get(fragmentId);
        if (!entry) return;
        entry.sprite.disableBody(true, true);
        entry.glow.destroy();
        this.fragmentObjects.delete(fragmentId);
        this.createSoftPulse(entry.definition.x, entry.definition.y, entry.definition.color);
        this.createSoftCameraFlash(126, 216, 226, 0.1, 340);
        callbacks.current.onFragment?.(fragmentId);
      }

      createSoftPulse(x, y, color = 0x83d7df) {
        const pulse = this.add.ellipse(x, y, 34, 18, color, 0.08)
          .setStrokeStyle(2, color, 0.28)
          .setDepth(34);
        this.tweens.add({
          targets: pulse,
          scaleX: 2.4,
          scaleY: 2.4,
          alpha: 0,
          duration: 720,
          ease: 'Sine.easeOut',
          onComplete: () => pulse.destroy(),
        });
      }

      createSoftCameraFlash(red, green, blue, alpha = 0.08, duration = 360) {
        this.cameras.main.flashEffect.alpha = alpha;
        this.cameras.main.flash(duration, red, green, blue, true);
      }

      createFishingSpots(spotDefinitions = []) {
        spotDefinitions.forEach((definition) => {
          const ripple = this.add.ellipse(
            definition.bobberX,
            definition.bobberY,
            36,
            15,
            0x83efff,
            0.035
          ).setStrokeStyle(2, 0x83d7df, 0.38).setDepth(7);
          this.tweens.add({
            targets: ripple,
            scaleX: 1.35,
            scaleY: 1.35,
            alpha: { from: 0.48, to: 0.1 },
            duration: 1850,
            repeat: -1,
            ease: 'Sine.easeOut',
          });

          const marker = this.add.text(definition.x, definition.y - 26, '⌁', {
            fontFamily: 'monospace',
            fontSize: '25px',
            fontStyle: 'bold',
            color: '#83cbd4',
            backgroundColor: '#10233a88',
            padding: { x: 6, y: 2 },
          }).setOrigin(0.5).setDepth(2999);
          this.tweens.add({
            targets: marker,
            y: '-=3',
            duration: 1400,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });

          const prompt = this.add.text(definition.x, definition.y - 74, runtime.current.copy.fishPrompt, {
            fontFamily: 'monospace',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#102235',
            backgroundColor: '#aef8ff',
            padding: { x: 9, y: 6 },
          }).setOrigin(0.5).setDepth(3000).setVisible(false);

          this.fishingSpotObjects.set(definition.id, { definition, marker, prompt, ripple });
        });
      }

      findNearbyFishingSpot() {
        let nearbySpotId = null;
        let nearestDistance = Infinity;

        this.fishingSpotObjects.forEach((entry, spotId) => {
          const distance = cellDistance(this.gridCell, worldToCell(entry.definition));
          if (distance <= 1 && distance < nearestDistance) {
            nearbySpotId = spotId;
            nearestDistance = distance;
          }
        });

        this.fishingSpotObjects.forEach((entry, spotId) => {
          entry.prompt.setVisible(!this.activeFishing && spotId === nearbySpotId);
        });
        return nearbySpotId;
      }

      startFishing(spotId) {
        const spotEntry = this.fishingSpotObjects.get(spotId);
        if (!spotEntry || this.activeFishing) return;

        const { definition } = spotEntry;
        this.player.anims.stop();
        this.lastDirection = definition.facing || 'left';
        const idleFrames = { down: 1, left: 4, right: 7, up: 10 };
        this.player.setFrame(idleFrames[this.lastDirection]);
        this.emitPosition(this.time.now, true);

        const line = this.add.graphics().setDepth(2000);
        line.lineStyle(2, 0xeefcff, 0.9);
        line.beginPath();
        line.moveTo(this.player.x, this.player.y - 20);
        line.lineTo(definition.bobberX, definition.bobberY);
        line.strokePath();

        const bobber = this.add.circle(
          definition.bobberX,
          definition.bobberY,
          6,
          0xe8edf0,
          0.9
        ).setStrokeStyle(2, 0xc77791, 0.82).setDepth(2001);
        const statusText = this.add.text(definition.x, definition.y - 105, runtime.current.copy.fishingWaiting, {
          fontFamily: 'monospace',
          fontSize: '14px',
          fontStyle: 'bold',
          color: '#e9fdff',
          backgroundColor: '#101a36e8',
          padding: { x: 10, y: 7 },
        }).setOrigin(0.5).setDepth(3001);
        const bobberTween = this.tweens.add({
          targets: bobber,
          y: '+=3',
          duration: 550,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        this.activeFishing = {
          bobber,
          bobberTween,
          definition,
          line,
          phase: 'waiting',
          statusText,
        };
        spotEntry.prompt.setVisible(false);

        this.activeFishing.biteTimer = this.time.delayedCall(1500, () => {
          if (!this.activeFishing || this.activeFishing.definition.id !== definition.id) return;
          this.activeFishing.phase = 'bite';
          this.activeFishing.statusText.setText(runtime.current.copy.fishingBite);
          this.activeFishing.bobberTween.stop();
          this.activeFishing.bobber.setFillStyle(0xef668d, 1);
          this.tweens.add({
            targets: this.activeFishing.bobber,
            y: '+=9',
            scale: { from: 1, to: 0.72 },
            duration: 180,
            yoyo: true,
            repeat: -1,
          });
          this.cameras.main.shake(70, 0.0007);
        });
      }

      finishFishing() {
        if (!this.activeFishing || this.activeFishing.phase !== 'bite') return;

        const { definition } = this.activeFishing;
        const caughtIds = runtime.current.caughtFishingIds || [];
        const newCatchId = definition.catchIds.find((catchId) => !caughtIds.includes(catchId));
        const catchId = newCatchId || definition.repeatCatchId;
        const isRepeat = !newCatchId;

        this.createSoftPulse(definition.bobberX, definition.bobberY);
        this.createSoftCameraFlash(115, 185, 196, 0.075, 380);
        this.cleanupFishing();
        callbacks.current.onFishingCatch?.({ catchId, isRepeat, spotId: definition.id });
      }

      cleanupFishing() {
        if (!this.activeFishing) return;
        const { bobber, bobberTween, biteTimer, line, statusText } = this.activeFishing;
        biteTimer?.remove(false);
        bobberTween?.stop();
        this.tweens.killTweensOf(bobber);
        bobber.destroy();
        line.destroy();
        statusText.destroy();
        this.activeFishing = null;
      }

      findNearbyNpc() {
        let nearbyNpcId = null;
        let nearestDistance = Infinity;

        this.npcObjects.forEach((entry, npcId) => {
          const distance = cellDistance(this.gridCell, worldToCell(entry.definition));
          if (distance === 1 && distance < nearestDistance) {
            nearbyNpcId = npcId;
            nearestDistance = distance;
          }
        });

        this.npcObjects.forEach((entry, npcId) => {
          entry.prompt.setVisible(npcId === nearbyNpcId);
        });
        return nearbyNpcId;
      }

      checkFragments() {
        let nearbyFragmentId = null;
        this.fragmentObjects.forEach((entry, fragmentId) => {
          if (nearbyFragmentId) return;
          if (cellDistance(this.gridCell, worldToCell(entry.definition)) === 0) nearbyFragmentId = fragmentId;
        });
        if (nearbyFragmentId) this.collectFragment(nearbyFragmentId);
      }

      emitPosition(time, force = false) {
        if (!this.player || (!force && time - this.lastPositionEmit < 600)) return;
        this.lastPositionEmit = time;
        this.updatePositionLabel();
        callbacks.current.onPositionChange?.(initialScene.id, cellToWorld(this.gridCell.col, this.gridCell.row));
      }

      updatePositionLabel() {
        mountRef.current?.setAttribute('aria-label',
          `${runtime.current.copy.gameLabel} · ${runtime.current.copy.positionLabel} ${this.gridCell.col + 1}, ${this.gridCell.row + 1}`);
      }

      step(direction) {
        this.lastDirection = direction;
        const idleFrames = { down: 1, left: 4, right: 7, up: 10 };
        const destination = nextGridCell(this.gridCell, direction, this.occupiedCells, initialScene.map);
        if (!destination) {
          this.player.anims.stop();
          this.player.setFrame(idleFrames[direction]);
          return;
        }
        this.isStepping = true;
        this.player.anims.play(`walk-${direction}`, true);
        this.tweens.add({
          targets: this.player,
          ...cellToWorld(destination.col, destination.row),
          duration: STEP_DURATION,
          ease: 'Linear',
          onComplete: () => {
            this.gridCell = destination;
            this.isStepping = false;
            this.player.anims.stop();
            this.player.setFrame(idleFrames[direction]);
            this.emitPosition(this.time.now, true);
            this.checkFragments();
            const portal = initialScene.portals.find(({ col, row }) => col === destination.col && row === destination.row);
            if (portal) {
              this.transitioning = true;
              this.queuedDirection = null;
              this.cameras.main.fadeOut(180, 15, 18, 27);
              this.time.delayedCall(180, () => callbacks.current.onPortal?.(portal.id));
            }
          },
        });
      }

      update() {
        if (!this.player || this.transitioning) return;
        this.player.setDepth(this.player.y + 16);

        const input = controls.current;
        const interactionPressed = input.interact;
        input.interact = false;

        if (pausedRef.current) {
          this.queuedDirection = null;
          this.npcObjects.forEach((entry) => entry.prompt.setVisible(false));
          this.fishingSpotObjects.forEach((entry) => entry.prompt.setVisible(false));
          return;
        }
        if (this.isStepping) return;

        if (this.activeFishing) {
          this.player.anims.stop();
          this.npcObjects.forEach((entry) => entry.prompt.setVisible(false));
          this.fishingSpotObjects.forEach((entry) => entry.prompt.setVisible(false));
          if (this.activeFishing.phase === 'bite' && interactionPressed) this.finishFishing();
          return;
        }

        const left = this.cursors.left.isDown || this.keys.A.isDown || input.left;
        const right = this.cursors.right.isDown || this.keys.D.isDown || input.right;
        const up = this.cursors.up.isDown || this.keys.W.isDown || input.up;
        const down = this.cursors.down.isDown || this.keys.S.isDown || input.down;
        const nearbyNpcId = this.findNearbyNpc();
        const nearbyFishingSpotId = this.findNearbyFishingSpot();

        if (nearbyFishingSpotId && interactionPressed) {
          this.startFishing(nearbyFishingSpotId);
        } else if (nearbyNpcId && interactionPressed) {
          callbacks.current.onInteraction?.(nearbyNpcId);
        } else {
          // One axis per step. A brief press is queued; holding repeats full cells.
          const direction = this.queuedDirection || (left ? 'left' : right ? 'right' : up ? 'up' : down ? 'down' : null);
          this.queuedDirection = null;
          if (direction) this.step(direction);
        }
      }
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: mountRef.current,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: '#12152f',
      pixelArt: true,
      roundPixels: true,
      physics: {
        default: 'arcade',
        arcade: { gravity: { x: 0, y: 0 }, debug: false },
      },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [DreamRegionScene],
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  const setControl = (direction, active) => {
    controlsRef.current[direction] = active;
    if (active) {
      const activeScene = gameRef.current?.scene?.getScene(scene.id);
      if (activeScene && !pausedRef.current && !activeScene.activeFishing) activeScene.queuedDirection = direction;
    }
  };

  const pressProps = (direction) => ({
    onPointerDown: () => setControl(direction, true),
    onPointerUp: () => setControl(direction, false),
    onPointerCancel: () => setControl(direction, false),
    onPointerLeave: () => setControl(direction, false),
    onKeyDown: (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        if (!event.repeat) setControl(direction, true);
      }
    },
    onKeyUp: (event) => {
      if (event.key === 'Enter' || event.key === ' ') setControl(direction, false);
    },
    onBlur: () => setControl(direction, false),
  });

  return (
    <div className="dream-game">
      <div
        ref={mountRef}
        className="dream-game__mount"
        role="application"
        tabIndex={0}
        aria-label={copy.gameLabel}
      />

      <div className="dream-game__controls" aria-label={copy.touchControlsLabel}>
        <div className="dream-dpad">
          <button type="button" className="dream-dpad__up" aria-label={copy.moveUp} {...pressProps('up')}>▲</button>
          <button type="button" className="dream-dpad__left" aria-label={copy.moveLeft} {...pressProps('left')}>◀</button>
          <span aria-hidden="true" />
          <button type="button" className="dream-dpad__right" aria-label={copy.moveRight} {...pressProps('right')}>▶</button>
          <button type="button" className="dream-dpad__down" aria-label={copy.moveDown} {...pressProps('down')}>▼</button>
        </div>
        <button
          type="button"
          className="dream-action"
          aria-label={copy.interact}
          onClick={() => { controlsRef.current.interact = true; }}
        >
          <span>E</span>
          {copy.interact}
        </button>
      </div>
    </div>
  );
};

export default DreamGame;
