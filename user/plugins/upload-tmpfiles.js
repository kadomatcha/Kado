import axios from 'axios'
import FormData from 'form-data'
import { delay } from 'baileys'
import { getBuff, sendText, react } from '#helper'

/**
 * Upload buffer ke tmpfiles.org
 * @param {Buffer} buffer
 * @param {string} filename
 */
const tmpfilesUpload = async (buffer, filename) => {
  const origin = 'https://tmpfiles.org'

  // ambil cookie + token
  const r1 = await axios.get(origin)
  const cookie = r1.headers['set-cookie']?.map(v => v.split(';')[0]).join('; ') || ''
  const token = r1.data.match(/token" value="(.+?)"/)?.[1]
  if (!token) throw new Error('Gagal mendapatkan token tmpfiles')

  // form data
  const form = new FormData()
  form.append('file', buffer, filename)
  form.append('_token', token)
  form.append('upload', 'Upload')

  const r2 = await axios.post(origin, form, {
    headers: { ...form.getHeaders(), cookie }
  })

  const html = r2.data
  const filenameRes = html.match(/Filename(?:.+?)<td>(.+?)<\/td>/s)?.[1] || filename
  const size = html.match(/Size(?:.+?)<td>(.+?)<\/td>/s)?.[1] || 'unknown'
  const url = html.match(/URL(?:.+?)href="(.+?)"/s)?.[1]
  const expiresAt = html.match(/Expires at(?:.+?)<td>(.+?)<\/td>/s)?.[1] || 'unknown'

  if (!url) throw new Error('Gagal mendapatkan URL download tmpfiles')
  return { filename: filenameRes, size, expiresAt, url }
}

/**
 * Handler plugin tmpfiles
 */
async function handler({ m, q, jid, sock }) {
  const target = q || m
  const msg = target.message

  const isImage = msg?.imageMessage
  const isVideo = msg?.videoMessage
  const isSticker = msg?.stickerMessage

  if (!isImage && !isVideo && !isSticker)
    return sendText(sock, jid, '❌ reply media (image/video/sticker) dulu', m)

  let ext = 'bin'
  if (isImage) ext = 'jpg' // default jpg
  else if (isVideo) ext = 'mp4'
  else if (isSticker) ext = 'webp'

  try {
    await react(sock, m, '🕒')

    const buffer = await getBuff(target)
    const filename = `file.${ext}`
    const result = await tmpfilesUpload(buffer, filename)

    // kirim interactive message + tombol copy / url
    await sock.relayMessage(
      jid,
      {
        interactiveMessage: {
          body: { text:
            `✅ *Upload tmpfiles berhasil!*\n\n` +
            `📄 File: ${result.filename}\n` +
            `📦 Size: ${result.size}\n` +
            `⏳ Expire: ${result.expiresAt}\n` +
            `🔗 ${result.url}`
          },
          footer: { text: 'Veronica Ira' },
          nativeFlowMessage: {
            buttons: [
              {
                name: 'cta_copy',
                buttonParamsJson: JSON.stringify({
                  display_text: 'Salin link',
                  copy_code: result.url
                })
              },
              {
                name: 'cta_url',
                buttonParamsJson: JSON.stringify({
                  display_text: 'Lihat media',
                  url: result.url
                })
              }
            ]
          }
        }
      },
      {
        quoted: m,
        additionalNodes: [
          {
            tag: 'biz',
            attrs: {},
            content: [
              {
                tag: 'interactive',
                attrs: { type: 'native_flow', v: '1' },
                content: [
                  { tag: 'native_flow', attrs: { v: '9', name: 'cta_copy' } }
                ]
              }
            ]
          }
        ]
      }
    )

    await delay(1500)
    await react(sock, m, '✅')
  } catch (e) {
    console.error(e)
    await react(sock, m, '❌')
    await sendText(sock, jid, `❌ Gagal upload: ${e.message}`, m)
  }
}

handler.pluginName = 'tmpfiles upload'
handler.description = 'Upload image/video/sticker ke tmpfiles.org'
handler.command = ['tmpfiles']
handler.category = ['uploader']
handler.meta = {
  fileName: 'upload-tmpfiles.js',
  version: '1.1.0',
  author: 'Ky',
  note: 'pakai q untuk reply, support img/vid/sticker, tombol copy + url'
}

export default handler