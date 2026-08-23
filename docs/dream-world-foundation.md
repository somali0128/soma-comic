# Dream World foundation

This branch prepares the first durable playable slice for a long-running, desktop-first 2D open-world project. The northeast lakeside scene runs as an embedded Phaser experience instead of a static concept preview. The scalable world structure and milestones are defined in [dream-world-roadmap.md](./dream-world-roadmap.md).

## First playable milestone

- One compact top-down northeast lakeside map
- One visitor avatar with arrow-key, WASD, and touch movement
- Three NPCs with proximity-based dialogue: Maomao, Friend 1, and Friend 2
- Three collectible dream fragments that reveal Maomao's identity
- A one-time beginner quest covering movement, conversation, and collection
- Exact-position resume after refresh or return
- A versioned archive stored in the browser
- An explicit, confirmed reset that clears all Dream World progress
- A clear exit back to the main site

## Proposed technical boundary

- React owns routing, language selection, menus, accessibility, and the dream archive.
- Phaser owns rendering, movement, Arcade Physics collisions, camera behavior, and future scene transitions.
- Tiled JSON will describe maps and collision/object layers.
- Plain data modules will describe NPCs, dialogue, fragments, and unlock conditions.
- The first milestone should not require a backend or account system.

## Content model

The starter data files separate scenes, NPCs, fragments, bilingual presentation, and unlock rules by stable IDs. Maomao's display name is revealed only after all three fragments are collected. Friend 1 and Friend 2 intentionally keep placeholder identities until later clues are added. Future dialogue should follow the same data-driven pattern instead of being embedded directly inside React components or game scenes.

## Decisions intentionally deferred

- Tile size and master color palette
- Production tileset and expanded character sprite direction
- Cloud save and account requirements beyond local browser storage
- Music, ambient audio, and sound licensing
