const fs = require('fs');
const path = require('path');

const USER = 'atjegercama';
const REPO = 'real-cookbook'; // change if different
const base = `https://${USER}.github.io/${REPO}`;

const recipesDir = path.join('data','recipes');
const files = fs.readdirSync(recipesDir).filter(f => f.endsWith('.json'));

const index = files.map(f => {
  const full = path.join(recipesDir, f);
  const json = JSON.parse(fs.readFileSync(full,'utf8'));
  return {
    id: json.id || path.basename(f, '.json'),
    title: json.title || path.basename(f, '.json'),
    tags: json.tags || [],
    href: `${base}/data/recipes/${f}`
  };
});

fs.mkdirSync('public',{ recursive: true });
fs.writeFileSync('public/recipes_index.json', JSON.stringify(index, null, 2));

// Also refresh public/index.json’s updated timestamp if it exists
const idxPath = path.join('public','index.json');
if (fs.existsSync(idxPath)) {
  const idx = JSON.parse(fs.readFileSync(idxPath,'utf8'));
  idx.updated = new Date().toISOString();
  fs.writeFileSync(idxPath, JSON.stringify(idx, null, 2));
}
console.log(`Wrote public/recipes_index.json with ${index.length} recipes.`);
