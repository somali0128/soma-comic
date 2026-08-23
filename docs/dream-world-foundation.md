# Dream World foundation

This branch prepares the first playable foundation for a long-running, desktop-first 2D open-world project. The first scene runs as an embedded Phaser prototype instead of a static concept preview. The scalable world structure and milestones are defined in [dream-world-roadmap.md](./dream-world-roadmap.md).

## First playable milestone

- One compact top-down playable map
- One visitor avatar with arrow-key, WASD, and touch movement
- One NPC with proximity-based dialogue (expand to three to five)
- One collectible dream fragment (expand to three)
- A versioned archive stored in the browser
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
- Cloud save and account requirements beyond local browser storage
- Music, ambient audio, and sound licensing
