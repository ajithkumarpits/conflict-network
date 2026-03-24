# Circle Layout

The Circle layout is a simple, deterministic layout that places all nodes evenly along the circumference of a circle.

## Implementation Details

The implementation is located in [circleLayout.js](file:///d:/peace_observatory_frontend/src/components/ConflictExplorer/utils/circleLayout.js).

### Algorithm Mechanics

1.  **Ordering**:
    - Nodes are placed around the circle in the order they appear in the input data.

2.  **Calculations**:
    - **Center**: The center $(cx, cy)$ is calculated as the midpoint of the available width and height.
    - **Radius**: The radius is calculated as $\min(width, height) / 2 - \text{padding}$.
    - **Angle**: Each node $i$ is assigned an angle $\theta_i = (2\pi \cdot i) / N - \pi/2$ (starting from the top).

3.  **Positioning**:
    - $x = cx + r \cdot \cos(\theta)$
    - $y = cy + r \cdot \sin(\theta)$

### Characteristics
- **Simplistic**: Ignores edges and interactions entirely.
- **Clarity**: Very useful for small groups of nodes where seeing all labels without overlap is the priority.
- **Uniformity**: Every node is given equal visual weight.
