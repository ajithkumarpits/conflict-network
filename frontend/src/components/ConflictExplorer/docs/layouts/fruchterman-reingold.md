# Fruchterman-Reingold Layout

The Fruchterman-Reingold layout is a classic force-directed algorithm that treats nodes as charged particles and edges as springs. This implementation is deterministic and follows a fixed cooling schedule to converge on a static layout.

## Implementation Details

The implementation is located in [fruchtermanReingold.js](file:///d:/peace_observatory_frontend/src/components/ConflictExplorer/utils/fruchtermanReingold.js).

### Algorithm Mechanics

1.  **Optimal Distance ($k$)**:
    - Calculated as $\sqrt{\text{Area} / \text{NodeCount}}$.
    - This defines the "ideal" distance nodes should be from one another.

2.  **Repulsive Forces**:
    - Calculated for all pairs of nodes.
    - Force function: $f_r(d) = k^2 / d$
    - Nodes push each other away based on the square of the optimal distance divided by their current distance.

3.  **Attractive Forces**:
    - Calculated only for connected nodes (edges).
    - Force function: $f_a(d) = d^2 / k$
    - Connected nodes pull each other together based on the square of their distance divided by the optimal distance.

4.  **Cooling Schedule**:
    - The algorithm runs for a fixed number of iterations (default 200).
    - A "temperature" constant limits the maximum displacement in each step.
    - As iterations progress, the temperature decreases, allowing the layout to "settle."

### Recent Adjustments
The layout includes a `padding` constant (set to `120`) to ensure that nodes are kept away from the extreme edges of the drawing area. This padding affects both the internal clamping during simulation and the final scaling phase.
