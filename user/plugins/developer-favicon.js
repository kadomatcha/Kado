import { getContentType, normalizeMessageContent } from 'baileys'
import { allPath, loadJsonFallbackSync, saveJson, sendText, userManager, botInfo} from '#helper'


const simpleCache = new Map()

function cacheSet(key, value) {
  if (!key) return
  simpleCache.set(key, {
    value,
    expire: Date.now() + 5 * 60 * 1000 
  })
}

function cacheGet(key) {
  const data = simpleCache.get(key)
  if (!data) return null
  if (Date.now() > data.expire) {
    simpleCache.delete(key)
    return null
  }
  return data.value
}


function loadState() {
  const fallback = { current: 0, list: [] }
  const raw = loadJsonFallbackSync(allPath.favicons, fallback)
  const list = Array.isArray(raw?.list) ? raw.list : []
  let current = parseInt(raw?.current)
  if (!Number.isFinite(current) || current < 0) current = 0
  return { current, list }
}

function saveState(state) {
  saveJson({ current: state.current, list: state.list }, allPath.favicons)
}


function isValidFaviconMeta(meta) {
  return meta &&
    typeof meta === 'object' &&
    typeof meta.thumbnailDirectPath === 'string' &&
    typeof meta.mediaKey === 'string'
}

function findFaviconMeta(obj, depth = 0) {
  if (!obj || typeof obj !== 'object') return null
  if (depth > 12) return null

  const direct = obj.faviconMMSMetadata
  if (isValidFaviconMeta(direct)) return direct

  for (const key of Object.keys(obj)) {
    const v = obj[key]
    if (!v || typeof v !== 'object') continue
    const found = findFaviconMeta(v, depth + 1)
    if (found) return found
  }

  return null
}

function extractFaviconFromWAMessage(WAM) {
  try {
    const msg = normalizeMessageContent(WAM?.message)
    if (!msg) return null
    const ct = getContentType(msg)
    const node = ct ? msg?.[ct] : null
    if (isValidFaviconMeta(node?.faviconMMSMetadata)) return node.faviconMMSMetadata
    return findFaviconMeta(msg)
  } catch {
    return null
  }
}

function serializeList(state) {
  if (!state.list.length) return 'belum ada favicon yang tersimpan'
  const lines = state.list.map((item, i) => {
    const meta = item?.meta || item
    const w = meta?.thumbnailWidth
    const h = meta?.thumbnailHeight
    const size = w && h ? `${w}x${h}` : '-'
    const sig = typeof meta?.thumbnailSha256 === 'string'
      ? meta.thumbnailSha256.slice(0, 10)
      : '-'
    const mark = state.current === i + 1 ? ' *aktif*' : ''
    return `${i + 1}. ${size} ${sig}${mark}`
  })
  return lines.join('\n')
}



async function handler({ sock, m, q, text, jid }) {
  if (!userManager.trustedJids.has(m.senderId)) return

  // simpan pesan ke cache
  if (m.key?.id) cacheSet(m.key.id, m)

  const args = (text || '').trim().match(/\S+/g) || []
  const sub = (args[0] || '').toLowerCase()

  if (!sub || sub === '-h' || sub === '--help' || sub === 'help') {
    return await sendText(sock, jid, 'favicon -list\nfavicon -save\nfavicon -use <index>', m)
  }

  if (sub === '-list') {
    const state = loadState()
    return await sendText(sock, jid, serializeList(state), m)
  }

  if (sub === '-use') {
    const idx = parseInt(args[1])
    if (!Number.isFinite(idx) || idx <= 0)
      return await sendText(sock, jid, 'index harus angka > 0', m)

    const state = loadState()
    if (idx > state.list.length)
      return await sendText(sock, jid, 'index melebihi jumlah favicon tersimpan', m)

    state.current = idx
    saveState(state)

    const meta = state.list[idx - 1]?.meta || state.list[idx - 1]
    const size = meta?.thumbnailWidth && meta?.thumbnailHeight
      ? `${meta.thumbnailWidth}x${meta.thumbnailHeight}`
      : '-'

    return await sendText(sock, jid, `favicon aktif: ${idx} (${size})`, m)
  }

  if (sub === '-save' || sub === '-saved') {
    if (!q) return await sendText(sock, jid, 'Reply pesan yang punya faviconMMSMetadata', m)

    let meta = null
    const WAM = cacheGet(q.key.id)
    if (WAM) meta = extractFaviconFromWAMessage(WAM)
    if (!meta) meta = findFaviconMeta(q.message)

    if (!isValidFaviconMeta(meta))
      return await sendText(sock, jid, 'faviconMMSMetadata tidak ditemukan di pesan itu', m)

    const state = loadState()
    const sig = meta.thumbnailSha256 || meta.thumbnailEncSha256 || meta.mediaKey

    const exists = state.list.some(it => {
      const m2 = it?.meta || it
      const sig2 = m2?.thumbnailSha256 || m2?.thumbnailEncSha256 || m2?.mediaKey
      return sig && sig2 && sig === sig2
    })

    if (exists)
      return await sendText(sock, jid, 'favicon sudah tersimpan sebelumnya', m)

    state.list.push({ savedAt: Date.now(), meta })
    saveState(state)

    const size = meta.thumbnailWidth && meta.thumbnailHeight
      ? `${meta.thumbnailWidth}x${meta.thumbnailHeight}`
      : '-'

    return await sendText(sock, jid, `favicon tersimpan: ${state.list.length} (${size})`, m)
  }

  return await sendText(sock, jid, 'param tidak dikenali, pakai: favicon -h', m)
}

handler.pluginName = 'favicon manager'
handler.description = 'save dan pakai faviconMMSMetadata untuk preview link'
handler.command = ['icon']
handler.category = ['developer']

handler.config = {
  systemPlugin: true,
  bypassPrefix: true
}

handler.meta = {
  fileName: 'developer-favicon.js',
  version: '1.0.01',
  author: botInfo.an
}

export default handler