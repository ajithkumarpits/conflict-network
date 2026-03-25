/**
 * Fruchterman-Reingold force-directed graph layout algorithm.
 *
 * Nodes repel each other (like charged particles) while edges act as
 * springs pulling connected nodes together. A cooling schedule gradually
 * reduces movement to converge on a stable layout.
 *
 * Reference:
 *   T. M. J. Fruchterman and E. M. Reingold,
 *   "Graph Drawing by Force-directed Placement",
 *   Software – Practice & Experience, 21(11):1129-1164, 1991.
 */

/**
 * Run the Fruchterman-Reingold layout algorithm.
 *
 * @param {Object[]} nodes  – array of node objects (must have a unique `actor_id`)
 * @param {Object[]} links  – array of link objects with `source` and `target`
 * @param {number}   width  – available drawing width
 * @param {number}   height – available drawing height
 * @returns {Object[]}      – the same nodes array with `x` and `y` set
 */
export default function fruchtermanReingoldLayout(nodes, links, width, height) {
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

  // ---- 2. Build edge list (index-based) --------------------------------
  const edges = [];
  links.forEach((link) => {
    const sId = typeof link.source === "object" ? link.source.actor_id : link.source;
    const tId = typeof link.target === "object" ? link.target.actor_id : link.target;
    const si = idToIndex[sId];
    const ti = idToIndex[tId];
    if (si !== undefined && ti !== undefined) {
      edges.push([si, ti]);
    }
  });

  // ---- 3. Parameters ---------------------------------------------------
  const area = width * height;
  const k = Math.sqrt(area / n); // optimal distance between nodes
  const ITERATIONS = 200;
  let temperature = Math.min(width, height) / 4; // initial temperature
  const coolingFactor = temperature / (ITERATIONS + 1);

  // Attractive force
  function fa(dist) {
    return (dist * dist) / k;
  }

  // Repulsive force
  function fr(dist) {
    return (k * k) / dist;
  }

  // ---- 4. Initialize positions in a circle (deterministic) --------------
  const padding = 120;
  const cx = width / 2;
  const cy = height / 2;
  const initRadius = Math.min(width, height) * 0.35;
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n;
    nodes[i].x = cx + initRadius * Math.cos(angle);
    nodes[i].y = cy + initRadius * Math.sin(angle);
  }

  // Displacement vectors
  const dispX = new Float64Array(n);
  const dispY = new Float64Array(n);

  // ---- 5. Iterate -------------------------------------------------------
  for (let iter = 0; iter < ITERATIONS; iter++) {
    // Reset displacements
    dispX.fill(0);
    dispY.fill(0);

    // --- Repulsive forces (all pairs) ---
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        let dx = nodes[i].x - nodes[j].x;
        let dy = nodes[i].y - nodes[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.01) {
          // Jitter to avoid division by zero
          dx = (Math.random() - 0.5) * 0.1;
          dy = (Math.random() - 0.5) * 0.1;
          dist = Math.sqrt(dx * dx + dy * dy);
        }

        const force = fr(dist);
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        dispX[i] += fx;
        dispY[i] += fy;
        dispX[j] -= fx;
        dispY[j] -= fy;
      }
    }

    // --- Attractive forces (edges only) ---
    for (const [si, ti] of edges) {
      const dx = nodes[si].x - nodes[ti].x;
      const dy = nodes[si].y - nodes[ti].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 0.01) dist = 0.01;

      const force = fa(dist);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;

      dispX[si] -= fx;
      dispY[si] -= fy;
      dispX[ti] += fx;
      dispY[ti] += fy;
    }

    // --- Apply displacements (limited by temperature) ---
    for (let i = 0; i < n; i++) {
      const dispLen = Math.sqrt(dispX[i] * dispX[i] + dispY[i] * dispY[i]);
      if (dispLen > 0) {
        const capped = Math.min(dispLen, temperature);
        nodes[i].x += (dispX[i] / dispLen) * capped;
        nodes[i].y += (dispY[i] / dispLen) * capped;
      }

      // Keep within bounds
      nodes[i].x = Math.max(padding, Math.min(width - padding, nodes[i].x));
      nodes[i].y = Math.max(padding, Math.min(height - padding, nodes[i].y));
    }

    // --- Cool down ---
    temperature = Math.max(temperature - coolingFactor, 0.01);
  }

  // ---- 6. Center the layout --------------------------------------------
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
