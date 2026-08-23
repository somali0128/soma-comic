import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import meadowMap from './assets/threshold-meadow.png';
import dreamWalker from './assets/dream-walker.png';

const GAME_WIDTH = 960;
const GAME_HEIGHT = 640;
const WORLD_WIDTH = 1536;
const WORLD_HEIGHT = 1024;

const DreamGame = ({
  collectedFragmentIds = [],
  copy,
  fragments,
  initialPosition,
  npcPresentations,
  npcs,
  onFragment,
  onInteraction,
  onPositionChange,
  onReady,
  scene,
}) => {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const controlsRef = useRef({ up: false, down: false, left: false, right: false, interact: false });
  const runtimeRef = useRef({
    collectedFragmentIds,
    copy,
    fragments,
    initialPosition,
    npcPresentations,
    npcs,
    scene,
  });
  const callbacksRef = useRef({ onFragment, onInteraction, onPositionChange, onReady });

  useEffect(() => {
    runtimeRef.current = {
      collectedFragmentIds,
      copy,
      fragments,
      initialPosition,
      npcPresentations,
      npcs,
      scene,
    };
  }, [collectedFragmentIds, copy, fragments, initialPosition, npcPresentations, npcs, scene]);

  useEffect(() => {
    callbacksRef.current = { onFragment, onInteraction, onPositionChange, onReady };
  }, [onFragment, onInteraction, onPositionChange, onReady]);

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
        this.wasMoving = false;
        this.npcObjects = new Map();
        this.fragmentObjects = new Map();
      }

      preload() {
        this.load.image('threshold-meadow', meadowMap);
        this.load.spritesheet('dream-walker', dreamWalker, {
          frameWidth: 341,
          frameHeight: 384,
        });
      }

      create() {
        const sceneConfig = runtime.current.scene;
        const savedPosition = runtime.current.initialPosition;
        const spawnX = Number.isFinite(savedPosition?.x) ? savedPosition.x : sceneConfig.spawn.x;
        const spawnY = Number.isFinite(savedPosition?.y) ? savedPosition.y : sceneConfig.spawn.y;

        this.add.image(0, 0, 'threshold-meadow').setOrigin(0);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBackgroundColor('#12152f');
        this.cameras.main.setRoundPixels(true);

        this.createAnimations();
        this.player = this.physics.add.sprite(
          Phaser.Math.Clamp(spawnX, 80, WORLD_WIDTH - 80),
          Phaser.Math.Clamp(spawnY, 80, WORLD_HEIGHT - 80),
          'dream-walker',
          1
        );
        this.player.setScale(0.18).setDepth(20).setCollideWorldBounds(true);
        this.player.body.setSize(100, 78).setOffset(121, 286);

        this.createObstacles(sceneConfig.obstacles);
        this.createNpcs(runtime.current.npcs, runtime.current.npcPresentations);
        this.createFragments(runtime.current.fragments, runtime.current.collectedFragmentIds);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE');
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

      createObstacles(obstacles = []) {
        obstacles.forEach(([x, y, width, height]) => {
          const zone = this.add.zone(x, y, width, height);
          this.physics.add.existing(zone, true);
          this.physics.add.collider(this.player, zone);
        });
      }

      createNpcs(npcDefinitions = [], presentations = {}) {
        npcDefinitions.forEach((definition) => {
          const presentation = presentations[definition.id] || { name: definition.id };
          const sprite = this.physics.add.staticSprite(
            definition.x,
            definition.y,
            'dream-walker',
            definition.frame ?? 1
          );
          sprite.setScale(0.17).setTint(definition.tint).setDepth(19);
          sprite.body.setSize(108, 84).setOffset(116, 280);
          sprite.refreshBody();
          this.physics.add.collider(this.player, sprite);

          const label = this.add.text(definition.x, definition.y - 62, presentation.name, {
            fontFamily: 'monospace',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#fff6d8',
            backgroundColor: '#161633cc',
            padding: { x: 7, y: 4 },
          }).setOrigin(0.5).setDepth(40);

          const prompt = this.add.text(definition.x, definition.y - 100, runtime.current.copy.talkPrompt, {
            fontFamily: 'monospace',
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#18162f',
            backgroundColor: '#fff4b8',
            padding: { x: 9, y: 6 },
          }).setOrigin(0.5).setDepth(40).setVisible(false);

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
            alpha: { from: 0.6, to: 1 },
            duration: 950,
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
        this.cameras.main.flash(220, 126, 236, 255);
        callbacks.current.onFragment?.(fragmentId);
      }

      findNearbyNpc() {
        let nearbyNpcId = null;
        let nearestDistance = Infinity;

        this.npcObjects.forEach((entry, npcId) => {
          const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            entry.sprite.x,
            entry.sprite.y
          );
          if (distance < 125 && distance < nearestDistance) {
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
          const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            entry.sprite.x,
            entry.sprite.y
          );
          if (distance < 64) nearbyFragmentId = fragmentId;
        });
        if (nearbyFragmentId) this.collectFragment(nearbyFragmentId);
      }

      emitPosition(time, force = false) {
        if (!this.player || (!force && time - this.lastPositionEmit < 600)) return;
        this.lastPositionEmit = time;
        callbacks.current.onPositionChange?.(initialScene.id, {
          x: Math.round(this.player.x * 10) / 10,
          y: Math.round(this.player.y * 10) / 10,
        });
      }

      update(time) {
        if (!this.player) return;

        const input = controls.current;
        const left = this.cursors.left.isDown || this.keys.A.isDown || input.left;
        const right = this.cursors.right.isDown || this.keys.D.isDown || input.right;
        const up = this.cursors.up.isDown || this.keys.W.isDown || input.up;
        const down = this.cursors.down.isDown || this.keys.S.isDown || input.down;
        let velocityX = Number(right) - Number(left);
        let velocityY = Number(down) - Number(up);

        if (velocityX && velocityY) {
          velocityX *= 0.7071;
          velocityY *= 0.7071;
        }

        const isMoving = Boolean(velocityX || velocityY);
        this.player.setVelocity(velocityX * 185, velocityY * 185);

        if (isMoving) {
          if (Math.abs(velocityX) > Math.abs(velocityY)) {
            this.lastDirection = velocityX < 0 ? 'left' : 'right';
          } else {
            this.lastDirection = velocityY < 0 ? 'up' : 'down';
          }
          this.player.anims.play(`walk-${this.lastDirection}`, true);
          this.emitPosition(time);
        } else {
          const idleFrames = { down: 1, left: 4, right: 7, up: 10 };
          this.player.setVelocity(0, 0).anims.stop();
          this.player.setFrame(idleFrames[this.lastDirection]);
          if (this.wasMoving) this.emitPosition(time, true);
        }
        this.wasMoving = isMoving;

        const nearbyNpcId = this.findNearbyNpc();
        this.checkFragments();

        const keyboardInteraction = Phaser.Input.Keyboard.JustDown(this.keys.E)
          || Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
        const touchInteraction = input.interact;
        input.interact = false;

        if (nearbyNpcId && (keyboardInteraction || touchInteraction)) {
          this.player.setVelocity(0, 0);
          callbacks.current.onInteraction?.(nearbyNpcId);
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
  };

  const pressProps = (direction) => ({
    onPointerDown: () => setControl(direction, true),
    onPointerUp: () => setControl(direction, false),
    onPointerCancel: () => setControl(direction, false),
    onPointerLeave: () => setControl(direction, false),
  });

  return (
    <div className="dream-game">
      <div
        ref={mountRef}
        className="dream-game__mount"
        role="application"
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
          onPointerDown={() => { controlsRef.current.interact = true; }}
        >
          <span>E</span>
          {copy.interact}
        </button>
      </div>
    </div>
  );
};

export default DreamGame;
