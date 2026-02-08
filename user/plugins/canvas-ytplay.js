import fetch from 'node-fetch'
import axios from 'axios'
import { textOnlyMessage, sendText, sendFancyMp3, react, botInfo } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid, text }) {
  if (!textOnlyMessage(m)) return
  if (!text) return sendText(sock, jid, 'judul lagu nya?', m)

  await react(sock, m, '🕛')

  try {
    
    const res = await fetch(
      `https://api.nexray.web.id/downloader/ytplay?q=${encodeURIComponent(text)}`
    )
    const json = await res.json()

    if (!json.status || !json.result) {
      return sendText(sock, jid, 'lagu tidak ditemukan', m)
    }

    const yt = json.result
    const title = yt.title
    const artist = yt.channel
    const thumbnail = yt.thumbnail
    const audioUrl = yt.download_url

    if (!audioUrl) {
      return sendText(sock, jid, 'gagal download audio', m)
    }

   
    const { data: coverBuffer } = await axios.get(
      'https://api.nexray.web.id/canvas/youtube',
      {
        params: {
          title,
          artist,
          coverurl: thumbnail
        },
        responseType: 'arraybuffer'
      }
    )

    
    await sendFancyMp3(
      sock,
      jid,
      audioUrl,
      title,
      artist || botInfo.sdn,
      Buffer.from(coverBuffer)
    )

    await react(sock, m, '✅')
  } catch (e) {
    await sendText(sock, jid, `error: ${e.message}`, m)
    await react(sock, m, '❌')
  }
}

handler.pluginName = 'youtube play'
handler.command = ['play']
handler.category = ['canvas']
handler.description = 'kontol nya ada berapa ya'
handler.meta = {
  fileName: 'canvas-ytplay.js',
  version: '1.0.1',
  author: 'Kado',
  note: 'ytplay'
}

export default handler