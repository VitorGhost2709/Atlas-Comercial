import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@supabase/supabase-js'

function loadEnvFile(filepath) {
  if (!fs.existsSync(filepath)) return
  const content = fs.readFileSync(filepath, 'utf8')
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]
    let value = m[2] ?? ''
    value = value.replace(/^['"]|['"]$/g, '')
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(path.resolve(process.cwd(), '.env'))

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY')
  process.exit(2)
}

const cityId = process.argv[2] ?? '00e3525e-c924-4338-b570-789c3053de4d'
const categoryId = process.argv[3] ?? '2cddc776-cdff-4233-b785-ce600f03b77f'

const supabase = createClient(url, key)

const countRes = await supabase
  .from('lojas')
  .select('id', { head: true, count: 'exact' })
  .eq('cidade_id', cityId)
  .eq('categoria_id', categoryId)
  .is('empresa_id', null)

if (countRes.error) {
  console.error('count error', countRes.error)
  process.exit(1)
}

console.log('lojas_avulsas_count', countRes.count)

const trueRes = await supabase
  .from('lojas')
  .select('id', { head: true, count: 'exact' })
  .eq('cidade_id', cityId)
  .eq('categoria_id', categoryId)
  .is('empresa_id', null)
  .eq('aparece_no_site', true)

if (trueRes.error) {
  console.error('count(true) error', trueRes.error)
  process.exit(1)
}

const nullRes = await supabase
  .from('lojas')
  .select('id', { head: true, count: 'exact' })
  .eq('cidade_id', cityId)
  .eq('categoria_id', categoryId)
  .is('empresa_id', null)
  .is('aparece_no_site', null)

if (nullRes.error) {
  console.error('count(null) error', nullRes.error)
  process.exit(1)
}

console.log('lojas_avulsas_aparece_true_count', trueRes.count)
console.log('lojas_avulsas_aparece_null_count', nullRes.count)

const sampleRes = await supabase
  .from('lojas')
  .select('id,empresa_id,nome_estabelecimento')
  .eq('cidade_id', cityId)
  .eq('categoria_id', categoryId)
  .is('empresa_id', null)
  .order('nome_estabelecimento', { ascending: true })
  .limit(10)

if (sampleRes.error) {
  console.error('sample error', sampleRes.error)
  process.exit(1)
}

console.log('sample', sampleRes.data)

