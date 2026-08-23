# Dream World foundation

This branch prepares a small, isolated foundation for a future 2D pixel RPG experience. The first scene now runs as an embedded Phaser prototype instead of a static concept preview.

## First playable milestone

- One compact top-down playable map
- One visitor avatar with arrow-key, WASD, and touch movement
- One NPC with proximity-based dialogue (expand to three to five)
- One collectible dream fragment (expand to three)
- A lightweight archive stored in the browser
- A clear exit back to the main site

## Proposed technical boundary

- React owns routing, language selection, menus, accessibility, and the dream archive.
- Phaser owns rendering, movement, Arcade Physics collisions, camera behavior, and future scene transitions.
- Tiled JSON will describe maps and collision/object layers.
- Plain data modules will describe NPCs, dialogue, fragments, and unlock conditions.
- The first milestone should not require a backend or account system.

## Content model

The starter data file intentionally separates scenes, NPCs, and fragments by stable IDs. Future dialogue should follow the same pattern instead of being embedded directly inside React components or game scenes.

## Decisions intentionally deferred

- Tile size and master color palette
- Original character and environment sprites
- Save-game schema beyond local browser storage
- Music, ambient audio, and sound licensing
