/**
 * Simple circular graph layout.
 *
 * Places nodes evenly around a circle centered in the drawing area.
 *
 * @param {Object[]} nodes  – array of node objects (must have a unique `actor_id`)
 * @param {Object[]} links  – array of link objects (unused, accepted for API consistency)
 * @param {number}   width  – available drawing width
 * @param {number}   height – available drawing height
 * @returns {Object[]}      – the same nodes array with `x` and `y` set
 */
export default function circleLayout(nodes, links, width, height) {
  const n = nodes.length;
  if (n === 0) return nodes;
  if (n === 1) {
    nodes[0].x = width / 2;
    nodes[0].y = height / 2;
    return nodes;
  }

  const cx = width / 2;
  const cy = height / 2;
  const padding = 60;
  const radius = Math.min(width, height) / 2 - padding;

  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2; // start from top
    nodes[i].x = cx + radius * Math.cos(angle);
    nodes[i].y = cy + radius * Math.sin(angle);
  }

  return nodes;
}
