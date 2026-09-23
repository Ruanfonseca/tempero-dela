// Baixa as fotos do manifesto para public/images/dishes e gera src/data/imageCredits.ts
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const manifest = JSON.parse(await readFile(path.join(root, 'scripts/images.manifest.json'), 'utf8'))
const outDir = path.join(root, 'public/images/dishes')
await mkdir(outDir, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const only = process.argv.slice(2)

async function fetchWithRetry(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'TemperoDela/1.0 (dev; image fetch)' } })
    if (res.status !== 429) return res
    await sleep(8000 * (attempt + 1))
  }
  return fetch(url)
}

for (const entry of manifest) {
  if (only.length && !only.includes(entry.id)) continue
  const res = await fetchWithRetry(entry.url)
  if (!res.ok) {
    console.error(`FAIL ${entry.id}: HTTP ${res.status}`)
    continue
  }
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(path.join(outDir, `${entry.id}.jpg`), buf)
  console.log(`OK   ${entry.id} (${Math.round(buf.length / 1024)} KB)`)
  await sleep(400)
}

const credits = manifest.map(({ id, title, author, license, source }) => ({ id, title, author, license, source }))
const ts =
  '// Gerado por scripts/download-images.mjs - creditos das fotos ilustrativas\n' +
  'export interface ImageCredit {\n  id: string\n  title: string\n  author: string\n  license: string\n  source: string\n}\n\n' +
  `export const IMAGE_CREDITS: ImageCredit[] = ${JSON.stringify(credits, null, 2)}\n`
await writeFile(path.join(root, 'src/data/imageCredits.ts'), ts)
console.log('\nimageCredits.ts atualizado')
