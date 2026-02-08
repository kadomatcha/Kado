import axios from 'axios'
import sharp from 'sharp'
import { Sticker } from 'wa-sticker-formatter'
import { sendText } from '#helper'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ m, text, jid, sock }) {
  if (!text) return sendText(sock, jid, 'masukkan teks', m)

  const url =
    'https://api.deline.web.id/maker/brat?text=' +
    encodeURIComponent(text)

  const res = await axios.get(url, {
    responseType: 'stream',
    timeout: 30_000
  })

  // ===== STREAM -> WEBP BUFFER =====
  const buffer = await new Promise((resolve, reject) => {
    const chunks = []

    res.data
      .pipe(
        sharp()
          .resize(512, 512, { fit: 'contain' })
          .webp({ quality: 80 })
      )
      .on('data', c => chunks.push(c))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject)
  })

  // ===== STICKER FORMATTER =====
  const sticker = new Sticker(buffer, {
    pack: 'Made By',
    author: 'Acodex.id',
    type: 'full',
    quality: 80
  })

  const webp = await sticker.toBuffer()

  await sock.sendMessage(
    jid,
    { sticker: webp },
    { quoted: m }
  )
}

handler.pluginName = 'brat'
handler.description = 'buat stiker brat (packname & author)'
handler.command = ['brat']
handler.category = ['maker']
handler.meta = {
  fileName: 'maker-brat.js',
  version: '1.3',
  author: 'Ky',
  note: 'axios stream + wa-sticker-formatter'
}

export default handler