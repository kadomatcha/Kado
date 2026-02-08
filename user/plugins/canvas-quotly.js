import { tag, sendImage, botInfo } from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, jid, m, text }) {
  if (!text) {
    return sock.sendMessage(
      jid,
      { text: 'Format: .quotly Nama|Text|Hitam/Putih' },
      { quoted: m }
    )
  }

  const [name, quoteText, color = 'Hitam'] = text.split('|').map(s => s.trim())
  if (!name || !quoteText) {
    return sock.sendMessage(
      jid,
      { text: 'Nama dan text wajib diisi' },
      { quoted: m }
    )
  }

  // ambil avatar sender, fallback ke default
  let avatarUrl = 'https://cdn.nekohime.site/file/eFub3YDe.jpg'
  try {
    avatarUrl = await sock.profilePictureUrl(m.senderId, 'image')
  } catch (e) {
    console.log('Gagal ambil profile picture, pakai default')
  }

  // encode parameter URL
  const apiUrl = `https://api.nexray.web.id/canvas/quotly?text=${encodeURIComponent(
    quoteText
  )}&name=${encodeURIComponent(name)}&avatar=${encodeURIComponent(
    avatarUrl
  )}&color=${encodeURIComponent(color)}`

  return await sendImage(
    sock,
    jid,
    apiUrl,
    `ini quotly nya kak ${tag(m.senderId)}`,
    m
  )
}

handler.pluginName = 'quotly generator'
handler.command = ['quotly']
handler.category = ['canvas']
handler.description =
  'generate quotly image dengan nama, text, warna dan avatar sender'
handler.meta = {
  fileName: 'canvas-quotly.js',
  version: '1.0',
  author: botInfo.an,
  note: 'quotly API canvas dengan avatar sender'
}

export default handler