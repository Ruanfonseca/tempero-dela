// Busca candidatos de fotos (licença livre para uso comercial) via Openverse.
// Uso: node scripts/search-images.mjs [ids...]
const queries = {
  'comum-1': ['rice beans ground beef plate', 'brazilian rice and beans meat'],
  'comum-2': ['ground beef okra', 'okra stew meat rice'],
  'comum-3': ['beef rice beans collard greens', 'feijão arroz carne couve'],
  'comum-4': ['white beans beef rice plate', 'beef stew white beans'],
  'comum-5': ['chicken onions rice beans', 'frango arroz feijão'],
  'comum-6': ['beef crepe plate', 'panqueca de carne'],
  'comum-7': ['chicken crepes plate'],
  'comum-8': ['beef stroganoff plate'],
  'comum-9': ['chicken stroganoff plate'],
  'comum-10': ['escondidinho', "shepherd's pie beef"],
  'comum-11': ['chicken shepherds pie', 'escondidinho de frango'],
  'comum-12': ['fish fillet tomato sauce rice', 'baked fish tomato sauce'],
  'comum-13': ['roasted chicken thigh rice beans', 'chicken thigh plate vegetables'],
  'comum-24': ['shrimp pasta cream sauce', 'shrimp alfredo spaghetti'],
  'comum-25': ['shrimp pasta tomato sauce broccoli', 'shrimp spaghetti marinara'],
  'comum-26': ['bife a parmegiana', 'steak parmigiana'],
  'fitness-1': ['spaghetti bolognese'],
  'fitness-2': ['hamburger steak plate', 'beef patty mashed'],
  'fitness-3': ['chicken stroganoff'],
  'fitness-4': ['beef stroganoff rice'],
  'fitness-5': ['chicken broccoli rice'],
  'fitness-6': ['chicken cabbage rice', 'sauteed cabbage chicken'],
  'fitness-9': ['grilled chicken zucchini'],
  'fitness-10': ['beef stew vegetables plate', 'pot roast plate'],
  'fitness-11': ['ground beef pumpkin', 'minced meat vegetables plate'],
  'fitness-12': ['chicken leek cream'],
  'fitness-13': ['chicken sweet potato broccoli'],
  'fitness-14': ['chicken crepe', 'savory crepe'],
  'fitness-15': ['beef crepe', 'meat crepes'],
  'lowcarb-1': ['beef broccoli cauliflower'],
  'lowcarb-2': ['minced beef mashed potato', 'ground beef mash'],
  'lowcarb-3': ['meat patties mashed', 'frikadeller'],
  'lowcarb-4': ['chicken sweet potato mash'],
  'lowcarb-5': ['meatballs pumpkin', 'meatballs broccoli'],
  'lowcarb-6': ['meat pancake', 'savory pancake'],
  'lowcarb-7': ['spinach crepe', 'spinach pancake'],
  'lowcarb-8': ['beef hummus', 'beef stew chickpeas'],
  'lowcarb-9': ['chicken leek sweet potato', 'creamy chicken leek'],
  'lowcarb-10': ['beef broccoli plate'],
  'lowcarb-11': ['ground beef kale', 'beef pumpkin kale'],
  'lowcarb-12': ['minced meat kale', 'beef mashed kale'],
  'lowcarb-13': ['sweet potato gnocchi'],
  'lowcarb-14': ['gnocchi ragu', 'gnocchi bolognese'],
}

const OK_LICENSES = new Set(['by', 'by-sa', 'cc0', 'pdm'])
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function search(q) {
  const url =
    'https://api.openverse.org/v1/images/?' +
    new URLSearchParams({ q, page_size: '20', license_type: 'commercial' })
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'TemperoDela/1.0 (dev)' } })
    if (res.status === 429) {
      await sleep(15000)
      continue
    }
    if (!res.ok) return []
    const json = await res.json()
    return json.results
      .filter((r) => OK_LICENSES.has(r.license) && r.width >= 800 && r.height >= 500 && r.width / r.height >= 0.9)
      .slice(0, 7)
      .map((r) => ({
        title: (r.title || '').slice(0, 80),
        w: r.width,
        h: r.height,
        license: `${r.license} ${r.license_version}`,
        creator: (r.creator || '').slice(0, 30),
        source: r.source,
        url: r.url,
      }))
  }
  return []
}

const only = process.argv.slice(2)
for (const [id, qs] of Object.entries(queries)) {
  if (only.length && !only.includes(id)) continue
  console.log(`\n=== ${id}`)
  for (const q of qs) {
    const results = await search(q)
    console.log(`  [${q}]`)
    for (const r of results) {
      console.log(`    - ${r.title} | ${r.w}x${r.h} | ${r.license} | ${r.creator} | ${r.source}`)
      console.log(`      ${r.url}`)
    }
    await sleep(3200)
  }
}
