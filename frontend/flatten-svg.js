const fs = require('fs');
const svg = fs.readFileSync('public/hand-shake.svg', 'utf8');
const pathRegex = /<path d="([^"]+)" fill="[^"]+" transform="translate\(([\d\.]+),([\d\.]+)\)"\/>/g;

let match;
let finalPaths = [];
// Target bounding box is 24x24, original SVG is 512x512 with some padding. 
// We want this icon to appear larger, so we'll scale it to an effectively larger box (~32x32 size factor) 
// and shift it slightly so it stays centered relative to the original 24x24 origin.
const scale = (24 / 512) * 1.30; 

while ((match = pathRegex.exec(svg)) !== null) {
  const [, d, tx, ty] = match;
  const dx = parseFloat(tx);
  const dy = parseFloat(ty);

  let newD = d.replace(/([MCLZ])([^MCLZ]*)/gi, (full, cmd, params) => {
    if (!params.trim()) return cmd;
    const nums = params.trim().split(/\s|,/).filter(Boolean).map(parseFloat);
    let newParams = [];
    for (let i = 0; i < nums.length; i += 2) {
      // Apply transform then scale. We also apply a small negative offset 
      // so the larger icon remains centered on its original (0,0) anchor.
      newParams.push(((nums[i] + dx) * scale) - 3);
      newParams.push(((nums[i+1] + dy) * scale) - 3);
    }
    // truncate to 3 decimal places for string brevity
    return cmd + newParams.map(n => n.toFixed(3)).join(' ');
  });
  finalPaths.push(newD);
}

fs.writeFileSync('src/components/ConflictExplorer/assets/icons/handshake_icon.js', `const handshake_icon = "${finalPaths.join(' ')}";\nexport default handshake_icon;`);
console.log('Scaled and flattened!');
