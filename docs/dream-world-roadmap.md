# Dream World open-world roadmap

## Product direction

Dream World is a long-running, desktop-first 2D open-world project embedded in the Soma site. The tutorial provides a guided first contact; after that, players can explore in their own order. Chinese and English ship together for every player-facing feature.

Dream World is intentionally non-combat. Its core loop is exploration, conversation, environmental puzzles, collection, discovery, and persistent changes to the world. Architecture and content plans should not reserve systems or complexity for future combat.

The world should feel continuous to the player, but it should not be implemented as one enormous Phaser scene. The runtime will load bounded regions and smaller cells so maps, art, memory, and save data remain manageable as the project grows.

## Technical boundaries

- React owns routing, language, menus, accessibility, archive UI, settings, and save orchestration.
- Phaser owns world rendering, movement, collisions, cameras, local interactions, and scene transitions.
- A world manifest connects stable IDs for regions, scenes, entrances, NPCs, fragments, quests, and flags.
- Tiled maps provide tile layers, collision geometry, entity spawn points, portals, and interaction markers.
- Content modules provide bilingual text and rules; Phaser scenes do not contain final dialogue strings.
- Versioned local saves are the first persistence layer. A backend is added only when accounts, cloud sync, or shared-world systems become real requirements.

## World topology

Use three levels rather than a single giant map:

1. **World** — the complete Dream World and its global progression flags.
2. **Region** — a themed area with its own tilesets, ambience, and exploration state.
3. **Scene/cell** — a bounded playable map that Phaser can load and unload independently.

Transitions can later be hidden with gates, paths, fog, interiors, or background streaming. Stable IDs must survive map redesigns so saves do not break when art changes.

## Content and localization rules

- Every entity and quest uses a stable, language-neutral ID.
- Chinese and English text live under the same content key and are reviewed together.
- Dialogue nodes, conditions, and outcomes are data, not component branches.
- Art files never contain required text.
- Missing translations fail development checks instead of silently shipping placeholders.

## Art pipeline

The current meadow background is a visual reference and prototype asset, not the final open-world map format. Production regions should use:

- reusable tilesets and object sprites;
- Tiled source files committed alongside exported JSON;
- explicit collision, portal, spawn, depth, and interaction layers;
- texture atlases and compressed web assets;
- a short license/source record for every shipped asset;
- desktop composition first, followed by a supported reduced viewport rather than separate game rules.

The current player sprite can remain as the first character reference while the environment pipeline is rebuilt.

## Save contract

Save data is versioned from the start and records stable IDs rather than display text:

- current scene, entrance, and optional position;
- discovered scenes and regions;
- collected fragment IDs;
- tutorial steps;
- world and quest flags;
- future settings and inventory namespaces.

Every schema change requires a migration before release. Unknown content IDs should be preserved whenever possible so temporarily removed content does not destroy progress.

## Milestones

### M0 — Playable prototype (current)

- one meadow image;
- one player, NPC, dialogue, and collectible;
- keyboard and touch movement;
- hard-coded collision and entity positions.

### M1 — Durable vertical slice

- CI build and test gate;
- an explicit decision on modernizing the legacy Create React App toolchain;
- versioned local save and reset path;
- data-driven NPCs, fragments, dialogue, and quest state;
- tutorial plus a free-exploration loop in one region;
- three NPCs and three fragments;
- desktop usability, bilingual content, and basic accessibility.

### M2 — Production map pipeline

- first Tiled-authored region;
- reusable tileset and atlas conventions;
- portals, spawn points, collision, and depth from map data;
- region/cell loader and transition state;
- replacement for the prototype background.

### M3 — Open-world systems

- exploration journal and map;
- nonlinear quest graph;
- inventory and interactable world objects;
- environmental puzzles and world-state changes instead of combat;
- multiple regions with persistent world flags;
- audio and performance budgets.

### M4 — Long-term platform decisions

- cloud saves and accounts only if cross-device play is required;
- content tooling when hand-authored modules become a bottleneck;
- telemetry, modding, or shared-world features only after the single-player loop is proven.

## Immediate acceptance criteria

The next playable milestone is complete when a new player can finish the tutorial, freely explore the first region, speak to three NPCs in either language, collect three fragments in any order, refresh the browser without losing progress, and intentionally reset the archive.

The current dependency tree still contains legacy Create React App packages and install-time security warnings. Do not apply a forced audit fix. Evaluate a controlled toolchain migration behind the test and build gate before the game codebase grows substantially.
