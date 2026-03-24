# Force-Directed Layout (Default)

The Default layout in the Conflict Explorer is a dynamic, physical simulation powered by the [d3-force](https://github.com/d3/d3-force) library. Unlike static layouts, this simulation runs continuously for a short duration to find an equilibrium, creating fluid and organic movement.

## Implementation Details

The implementation is located in [LocationGraph.js](file:///d:/peace_observatory_frontend/src/components/ConflictExplorer/components/LocationGraph/LocationGraph.js).

### Core Forces
The simulation uses five primary forces to determine node positions:

1.  **Many-Body Force (Repulsion)**:
    - Nodes act like charged particles that repel each other.
    - **Strength**: `-300`
    - **Purpose**: Prevents nodes from clumping and ensures the graph expands to fill the space.

2.  **Link Force (Attraction)**:
    - Connected nodes are pulled together by "springs."
    - **Distance**: `200` pixels.
    - **Purpose**: Groups related actors together based on their interactions.

3.  **Center Force**:
    - Translates the entire graph to the center of the viewport.
    - **Purpose**: Keeps the visualization centered within the SVG container.

4.  **Collision Force**:
    - Each node has a physical radius derived from its UI size.
    - **Purpose**: Prevents visual overlap of node icons and radial bars.

5.  **Positioning Gravity (X & Y)**:
    - A gentle pull (strength `0.1`) towards the center coordinates.
    - **Purpose**: Prevents unconnected nodes or small "islands" from drifting endlessly away.

### Lifecycle & Interactivity
- **Simulation Warm-up**: The simulation starts with a high "alpha" (energy) whenever data or filters change.
- **Cooling Schedule**: The simulation naturally "cools" over 2 seconds, gradually slowing down movement until nodes reach a stable state.
- **User Interaction**: Users can manually drag nodes. Dragging a node "reheats" the simulation, allowing the rest of the graph to react and adjust to the new position.
