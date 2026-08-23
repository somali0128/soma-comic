import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import meadowMap from './assets/threshold-meadow.png';
import dreamWalker from './assets/dream-walker.png';

const GAME_WIDTH = 960;
const GAME_HEIGHT = 640;
const WORLD_WIDTH = 1536;
const WORLD_HEIGHT = 1024;

const DreamGame = ({ copy, onFragment, onInteraction, onReady }) => {
  const mountRef = useRef(null);
  const gameRef = useRef(null);
  const controlsRef = useRef({ up: false, down: false, left: false, right: false, interact: false });
  const callbacksRef = useRef({ onFragment, onInteraction, onReady });

  useEffect(() => {
    callbacksRef.current = { onFragment, onInteraction, onReady };
  }, [onFragment, onInteraction, onReady]);

  useEffect(() => {
    if (!mountRef.current || gameRef.current) return undefined;

    const controls = controlsRef;
    const callbacks = callbacksRef;

    class ThresholdMeadowScene extends Phaser.Scene {
      constructor() {
        super({ key: 'threshold-meadow' });
        this.lastDirection = 'down';
        this.fragmentCollected = false;
      }

      preload() {
        this.load.image('threshold-meadow', meadowMap);
        this.load.spritesheet('dream-walker', dreamWalker, {
          frameWidth: 341,
          frameHeight: 384,
        });
      }

      create() {
        this.add.image(0, 0, 'threshold-meadow').setOrigin(0);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.cameras.main.setBackgroundColor('#12152f');
        this.cameras.main.setRoundPixels(true);

        this.createAnimations();

        this.player = this.physics.add.sprite(700, 535, 'dream-walker', 1);
        this.player.setScale(0.18).setDepth(20).setCollideWorldBounds(true);
        this.player.body.setSize(100, 78).setOffset(121, 286);

        this.createObstacles();
        this.createFragment();

        this.npc = this.physics.add.staticSprite(905, 500, 'dream-walker', 1);
        this.npc.setScale(0.17).setTint(0xf2c0db).setDepth(19);
        this.npc.body.setSize(108, 84).setOffset(116, 280);
        this.npc.refreshBody();
        this.physics.add.collider(this.player, this.npc);

        this.add.text(this.npc.x, this.npc.y - 62, copy.npcLabel, {
          fontFamily: 'monospace',
          fontSize: '15px',
          fontStyle: 'bold',
          color: '#fff6d8',
          backgroundColor: '#161633cc',
          padding: { x: 7, y: 4 },
        }).setOrigin(0.5).setDepth(40);

        this.interactionPrompt = this.add.text(this.npc.x, this.npc.y - 100, copy.talkPrompt, {
          fontFamily: 'monospace',
          fontSize: '15px',
          fontStyle: 'bold',
          color: '#18162f',
          backgroundColor: '#fff4b8',
          padding: { x: 9, y: 6 },
        }).setOrigin(0.5).setDepth(40).setVisible(false);

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
        const definitions = [
          ['walk-down', [0, 1, 2, 1]],
          ['walk-left', [3, 4, 5, 4]],
          ['walk-right', [6, 7, 8, 7]],
          ['walk-up', [9, 10, 11, 10]],
        ];

        definitions.forEach(([key, frames]) => {
          this.anims.create({
            key,
            frames: this.anims.generateFrameNumbers('dream-walker', { frames }),
            frameRate: 8,
            repeat: -1,
          });
        });
      }

      createObstacles() {
        const obstacles = [
          [445, 245, 350, 245],
          [1025, 170, 370, 250],
          [770, 780, 425, 205],
          [45, 560, 90, 780],
          [1495, 560, 82, 780],
          [765, 28, 1530, 56],
          [765, 1000, 1530, 48],
          [135, 365, 170, 190],
          [1385, 310, 210, 230],
          [1325, 735, 260, 240],
          [190, 875, 300, 230],
        ];

        obstacles.forEach(([x, y, width, height]) => {
          const zone = this.add.zone(x, y, width, height);
          this.physics.add.existing(zone, true);
          this.physics.add.collider(this.player, zone);
        });
      }

      createFragment() {
        const shape = this.make.graphics({ x: 0, y: 0, add: false });
        shape.fillStyle(0x9ef8ff, 0.35);
        shape.fillCircle(14, 14, 14);
        shape.fillStyle(0xe7ffff, 1);
        shape.fillTriangle(14, 0, 27, 14, 1, 14);
        shape.fillStyle(0x5ce4f1, 1);
        shape.fillTriangle(1, 14, 27, 14, 14, 28);
        shape.generateTexture('dream-fragment', 28, 28);
        shape.destroy();

        this.fragmentGlow = this.add.circle(1165, 505, 24, 0x83efff, 0.2).setDepth(8);
        this.fragment = this.physics.add.image(1165, 505, 'dream-fragment').setDepth(9);
        this.fragment.body.setAllowGravity(false);
        this.tweens.add({
          targets: [this.fragment, this.fragmentGlow],
          y: '-=10',
          alpha: { from: 0.6, to: 1 },
          duration: 950,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

      }

      collectFragment() {
        if (this.fragmentCollected) return;
        this.fragmentCollected = true;
        this.fragment.disableBody(true, true);
        this.fragmentGlow.destroy();
        this.cameras.main.flash(220, 126, 236, 255);
        callbacks.current.onFragment?.('first-light');
      }

      update() {
        if (!this.player) return;

        const input = controls.current;
        const left = this.cursors.left.isDown || this.keys.A.isDown || input.left;
        const right = this.cursors.right.isDown || this.keys.D.isDown || input.right;
        const up = this.cursors.up.isDown || this.keys.W.isDown || input.up;
        const down = this.cursors.down.isDown || this.keys.S.isDown || input.down;

        let velocityX = Number(right) - Number(left);
        let velocityY = Number(down) - Number(up);
        const speed = 185;

        if (velocityX && velocityY) {
          velocityX *= 0.7071;
          velocityY *= 0.7071;
        }

        this.player.setVelocity(velocityX * speed, velocityY * speed);

        if (velocityX || velocityY) {
          if (Math.abs(velocityX) > Math.abs(velocityY)) {
            this.lastDirection = velocityX < 0 ? 'left' : 'right';
          } else {
            this.lastDirection = velocityY < 0 ? 'up' : 'down';
          }
          this.player.anims.play(`walk-${this.lastDirection}`, true);
        } else {
          const idleFrames = { down: 1, left: 4, right: 7, up: 10 };
          this.player.setVelocity(0, 0).anims.stop();
          this.player.setFrame(idleFrames[this.lastDirection]);
        }

        const nearNpc = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.npc.x,
          this.npc.y
        ) < 125;
        this.interactionPrompt.setVisible(nearNpc);

        const nearFragment = !this.fragmentCollected && Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          this.fragment.x,
          this.fragment.y
        ) < 64;
        if (nearFragment) this.collectFragment();

        const keyboardInteraction = Phaser.Input.Keyboard.JustDown(this.keys.E)
          || Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
        const touchInteraction = input.interact;
        input.interact = false;

        if (nearNpc && (keyboardInteraction || touchInteraction)) {
          this.player.setVelocity(0, 0);
          callbacks.current.onInteraction?.('gatekeeper');
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
      scene: [ThresholdMeadowScene],
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [copy.npcLabel, copy.talkPrompt]);

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
