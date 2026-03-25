/**
 * Kamada-Kawai graph layout algorithm.
 *
 * Positions nodes so that geometric (Euclidean) distances
 * approximate graph-theoretic (shortest-path) distances.
 *
 * Reference:
 *   T. Kamada and S. Kawai,
 *   "An algorithm for drawing general undirected graphs",
 *   Information Processing Letters, 31(1):7-15, 1989.
 */

/**
 * Compute all-pairs shortest paths using BFS (unweighted).
 * @param {number} n          – number of nodes
 * @param {number[][]} adj    – adjacency list (index-based)
 * @returns {number[][]}      – dist[i][j] = shortest path length
 */
function allPairsShortestPaths(n, adj) {
  const dist = Array.from({ length: n }, () => Array(n).fill(Infinity));

  for (let s = 0; s < n; s++) {
    dist[s][s] = 0;
    const queue = [s];
    let head = 0;
    while (head < queue.length) {
      const u = queue[head++];
      for (const v of adj[u]) {
        if (dist[s][v] === Infinity) {
          dist[s][v] = dist[s][u] + 1;
          queue.push(v);
        }
      }
    }
  }
  return dist;
}

/**
 * Run the Kamada-Kawai layout algorithm.
 *
 * @param {Object[]} nodes  – array of node objects (must have a unique `actor_id`)
 * @param {Object[]} links  – array of link objects with `source` and `target`
 *                            (values can be actor_id strings/numbers OR node objects with `.actor_id`)
 * @param {number}   width  – available drawing width
 * @param {number}   height – available drawing height
 * @returns {Object[]}      – the same nodes array with `x` and `y` set
 */
export default function kamadaKawaiLayout(nodes, links, width, height) {
  const n = nodes.length;
  if (n === 0) return nodes;
  if (n === 1) {
    nodes[0].x = width / 2;
    nodes[0].y = height / 2;
    return nodes;
  }

  // ---- 1. Map actor_id → index ----------------------------------------
  const idToIndex = {};
  nodes.forEach((node, i) => {
    idToIndex[node.actor_id] = i;
  });

  // ---- 2. Build adjacency list -----------------------------------------
  const adj = Array.from({ length: n }, () => []);
  links.forEach((link) => {
    const sId = typeof link.source === "object" ? link.source.actor_id : link.source;
    const tId = typeof link.target === "object" ? link.target.actor_id : link.target;
    const si = idToIndex[sId];
    const ti = idToIndex[tId];
    if (si !== undefined && ti !== undefined) {
      adj[si].push(ti);
      adj[ti].push(si);
    }
  });

  // ---- 3. All-pairs shortest paths -------------------------------------
  const dist = allPairsShortestPaths(n, adj);

  // Graph diameter (max finite distance)
  let diameter = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (dist[i][j] !== Infinity && dist[i][j] > diameter) {
        diameter = dist[i][j];
      }
    }
  }
  if (diameter === 0) diameter = 1;

  // ---- 4. Ideal edge length L ------------------------------------------
  const L = Math.min(width, height) / (diameter + 1);

  // ---- 5. Ideal distances & spring constants ---------------------------
  // l[i][j] = L * dist[i][j]         (desired distance)
  // k[i][j] = K / (dist[i][j]^2)     (spring constant)
  const K = 1; // global spring constant
  const l = Array.from({ length: n }, () => Array(n).fill(0));
  const k = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const d = dist[i][j] === Infinity ? diameter + 1 : dist[i][j];
        l[i][j] = L * d;
        k[i][j] = K / (d * d);
      }
    }
  }

  // ---- 6. Initialize positions in a circle -----------------------------
  const cx = width / 2;
  const cy = height / 2;
  const r = Math.min(width, height) * 0.35;

  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    nodes[i].x = cx + r * Math.cos(angle);
    nodes[i].y = cy + r * Math.sin(angle);
  }

  // ---- 7. Iterative stress minimization --------------------------------
  const MAX_ITERATIONS = 200;
  const EPSILON = 1e-3;

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    // Find node m with maximum delta (partial derivative magnitude)
    let maxDelta = -1;
    let m = -1;

    for (let i = 0; i < n; i++) {
      let dEdx = 0;
      let dEdy = 0;

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dij = Math.sqrt(dx * dx + dy * dy);
        if (dij < 1e-6) continue;

        const factor = k[i][j] * (1 - l[i][j] / dij);
        dEdx += factor * dx;
        dEdy += factor * dy;
      }

      const delta = Math.sqrt(dEdx * dEdx + dEdy * dEdy);
      if (delta > maxDelta) {
        maxDelta = delta;
        m = i;
      }
    }

    if (maxDelta < EPSILON) break;

    // Move node m using Newton-Raphson (inner loop)
    const INNER_ITERS = 50;
    const INNER_EPS = 1e-4;

    for (let inner = 0; inner < INNER_ITERS; inner++) {
      let dEdx = 0, dEdy = 0;
      let d2Edx2 = 0, d2Edy2 = 0, d2Edxdy = 0;

      for (let j = 0; j < n; j++) {
        if (j === m) continue;
        const dx = nodes[m].x - nodes[j].x;
        const dy = nodes[m].y - nodes[j].y;
        const dij = Math.sqrt(dx * dx + dy * dy);
        if (dij < 1e-6) continue;
        const dij3 = dij * dij * dij;

        dEdx += k[m][j] * (dx - l[m][j] * dx / dij);
        dEdy += k[m][j] * (dy - l[m][j] * dy / dij);

        d2Edx2 += k[m][j] * (1 - l[m][j] * dy * dy / dij3);
        d2Edy2 += k[m][j] * (1 - l[m][j] * dx * dx / dij3);
        d2Edxdy += k[m][j] * (l[m][j] * dx * dy / dij3);
      }

      // Solve 2×2 system:  H * [deltaX, deltaY]^T = -[dEdx, dEdy]^T
      const det = d2Edx2 * d2Edy2 - d2Edxdy * d2Edxdy;
      if (Math.abs(det) < 1e-10) break;

      const deltaX = -(d2Edy2 * dEdx - d2Edxdy * dEdy) / det;
      const deltaY = -(d2Edx2 * dEdy - d2Edxdy * dEdx) / det;

      nodes[m].x += deltaX;
      nodes[m].y += deltaY;

      if (Math.sqrt(deltaX * deltaX + deltaY * deltaY) < INNER_EPS) break;
    }
  }

  // ---- 8. Center the layout in the drawing area ------------------------
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  for (const node of nodes) {
    if (node.x < minX) minX = node.x;
    if (node.x > maxX) maxX = node.x;
    if (node.y < minY) minY = node.y;
    if (node.y > maxY) maxY = node.y;
  }

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const padding = 60;
  const scaleX = (width - 2 * padding) / rangeX;
  const scaleY = (height - 2 * padding) / rangeY;
  const scale = Math.min(scaleX, scaleY);

  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  for (const node of nodes) {
    node.x = cx + (node.x - midX) * scale;
    node.y = cy + (node.y - midY) * scale;
  }

  return nodes;
}
