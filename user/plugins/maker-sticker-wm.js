import { Sticker } from 'wa-sticker-formatter'
import { sendText, getBuff } from '#helper'
import fs from 'fs'
import path from 'path'
import os from 'os'

async function handler({ m, sock, jid, text }) {
  const quoted = m.q ? m.q : m
  const stickerMsg = quoted?.message?.stickerMessage
  if (!stickerMsg) return sendText(sock, jid, 'reply stikernya', m)

  if (!text || !text.includes('|')) {
    return sendText(sock, jid, 'format: wm pack|author', m)
  }

  const [pack, author] = text.split('|').map(v => v.trim())
  if (!pack || !author) {
    return sendText(sock, jid, 'pack / author tidak valid', m)
  }

  try {
    const buffer = await getBuff(quoted)
    const tempFile = path.join(os.tmpdir(), `wm_${Date.now()}.webp`)
    await fs.promises.writeFile(tempFile, buffer)

    const sticker = new Sticker(tempFile, {
      pack,
      author,
      type: 'full',
      quality: 100
    })

    const out = await sticker.toBuffer()
    await sock.sendMessage(jid, { sticker: out }, { quoted: m })

    await fs.promises.unlink(tempFile)
  } catch (e) {
    console.error(e)
    sendText(sock, jid, e.message, m)
  }
}

handler.pluginName = 'Sticker WM Changer'
handler.command = ['wm', 'stickerwm']
handler.category = ['maker']
handler.deskripsi = 'Ganti watermark stiker (reply stiker)'
handler.meta = {
  fileName: 'maker-sticker-wm.js',
  version: '1.0',
  author: 'Ky'
}

export default handler