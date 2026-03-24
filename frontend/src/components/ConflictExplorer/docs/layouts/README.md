# Graph Layouts Documentation

This directory contains detailed explanations of the four graph layout algorithms implemented in the Conflict Explorer.

## Available Layouts

- [**Force-Directed (Default)**](force-directed.md): A dynamic, physical simulation powered by D3. Great for organic movement and cluster discovery.
- [**Fruchterman-Reingold**](fruchterman-reingold.md): A classic force-directed algorithm using repulsive and attractive forces with a cooling schedule.
- [**Kamada-Kawai**](kamada-kawai.md): An energy-minimization algorithm that correlates geometric distance with graph-theoretic distance. Excellent for revealing global structure.
- [**Circle**](circle.md): A simple, static layout that places all nodes evenly on a circle. Best for small graphs and clear label visibility.

## Implementation Locations

- **Logic**: `src/components/ConflictExplorer/utils/`
- **Visualization**: `src/components/ConflictExplorer/components/LocationGraph/LocationGraph.js`
