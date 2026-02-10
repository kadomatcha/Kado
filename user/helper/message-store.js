import fs from 'fs'
import path from 'path'
import { prepareWAMessageMedia } from 'baileys'
import { getBuff, userManager } from '#helper'

const STORE_FILE = path.join(process.cwd(), 'message-store.json')

// ===== util =====
function loadStore() {
  if (!fs.existsSync(STORE_FILE)) return {}
  try { return JSON.parse(fs.readFileSync(STORE_FILE, 'utf-8')) } catch { return {} }
}
function saveStore(store) {
  fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2))
}
function genId(len = 6) {
  return Buffer.from(Math.random().toString()).toString('hex').slice(0, len)
}

// ===== main =====
export async function storeMessage(IWMI) {
  try {
    if (!IWMI.message) return
    if (!IWMI.pushName) return

    const store = loadStore()
    const mId = genId(6)
    const m = {
      id: mId,
      timestamp: Date.now(),
      from: IWMI.sender || IWMI.key?.participant || IWMI.key?.remoteJid,
      remoteJid: IWMI.key?.remoteJid,
      pushName: IWMI.pushName,
      type: IWMI.type || 'unknown',
      message: IWMI.message,
      buffer: null
    }

    // ambil media buffer kalau ada
    let mediaType = null
    if (IWMI.message.imageMessage) mediaType = 'image'
    else if (IWMI.message.videoMessage) mediaType = 'video'
    else if (IWMI.message.audioMessage) mediaType = 'audio'
    if (mediaType) {
      try {
        const buff = await getBuff(IWMI)
        if (buff) {
          const media = await prepareWAMessageMedia({ [mediaType]: buff }, { upload: global.sock?.waUploadToServer })
          m.message[mediaType + 'Message'] = { ...m.message[mediaType + 'Message'], ...media[mediaType + 'Message'] }
          m.buffer = buff.toString('base64')
        }
      } catch {}
    }

    // simpan favicon kalau ada
    if (IWMI.message?.extendedTextMessage?.contextInfo?.thumbnail) {
      m.faviconMMSMetadata = IWMI.message.extendedTextMessage.contextInfo
    }

    store[mId] = m
    saveStore(store)

    return mId
  } catch (e) {
    console.error('storeMessage error:', e)
  }
}

// ===== helper =====
export function getStoredMessage(id) {
  const store = loadStore()
  return store[id] || null
}

export function listStoredMessages() {
  const store = loadStore()
  return Object.values(store)
}

// buat alias biar bisa import saveMessage
export { storeMessage as saveMessage }

export function deleteStoredMessage(id) {
  const store = loadStore()
  if (store[id]) {
    delete store[id]
    saveStore(store)
    return true
  }
  return false
}
