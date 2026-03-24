# Kamada-Kawai Layout

The Kamada-Kawai layout is an "energy minimization" algorithm. It attempts to match the geometric (Euclidean) distance between nodes in the 2D plane to their graph-theoretic (shortest-path) distance.

## Implementation Details

The implementation is located in [kamadaKawai.js](file:///d:/peace_observatory_frontend/src/components/ConflictExplorer/utils/kamadaKawai.js).

### Algorithm Mechanics

1.  **Shortest Paths**:
    - The algorithm first computes the shortest path between all pairs of nodes using a Breadth-First Search (BFS).
    - Pairs that are not connected are assigned a distance slightly larger than the graph's diameter.

2.  **Spring Constants ($k$)**:
    - Each pair of nodes $(i, j)$ is connected by a virtual spring.
    - The spring constant is $k_{ij} = K / d_{ij}^2$, where $d_{ij}$ is the shortest path distance.
    - This means nodes that are "close" in the graph have much stronger springs than those that are far apart.

3.  **Energy Minimization**:
    - The algorithm iteratively moves one node at a time to minimize the total "stress" (potential energy) of all springs.
    - It uses the Newton-Raphson method to find the position with the lowest local energy.

### Characteristics
- **Structure**: Kamada-Kawai is excellent at revealing the global structure of the graph and maintaining symmetries.
- **Deterministic**: Unlike some force-directed methods, it produces a very consistent layout for the same topology.
- **Computational Cost**: Due to the all-pairs shortest path calculation and the iterative minimization, it is more computationally intensive than simpler layouts for very large graphs.
