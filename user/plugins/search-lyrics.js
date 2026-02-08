import fetch from 'node-fetch'
import { textOnlyMessage, sendText, botInfo } from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, jid, m, text }) {
  if (!textOnlyMessage(m) || !text)
    return sendText(sock, jid, 'masukkan judul lagu', m)

  try {
    // ambil data dari acodex
    const res = await fetch(
      `https://api.acodex.my.id/api/search/lyrics?q=${encodeURIComponent(text)}`
    )
    const json = await res.json()

    if (json.status !== 200 || !json.data?.lyrics) {
      return sendText(sock, jid, 'lyrics tidak ditemukan', m)
    }

    const { title, artist, album, duration, lyrics, source } = json.data

    const message = `🎵 *${title}*\n👤 Artist: ${artist}\n💿 Album: ${album}\n⏱ Duration: ${duration}\n📖 Source: ${source}\n\n${lyrics}`

    await sendText(sock, jid, message, m)
  } catch (e) {
    await sendText(sock, jid, `error: ${e.message}`, m)
  }
}

handler.pluginName = 'lyrics search'
handler.command = ['lyrics']
handler.category = ['search']
handler.description = 'menampilkan lirik lagu dari judul'
handler.meta = {
  fileName: 'search-lyrics.js',
  version: '1.0.0',
  author: botInfo.an,
  note: 'Acodex lyrics API'
}

export default handler