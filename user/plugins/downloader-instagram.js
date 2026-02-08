import axios from 'axios'
import {
  textOnlyMessage,
  sendText,
  sendVideo,
  sendImage
} from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid }) {
  if (!textOnlyMessage(m)) return

  const q = m.text?.split(' ').slice(1).join(' ')?.trim()
  if (!q) {
    return sendText(
      sock,
      jid,
      'masukin link instagram\ncontoh:\nig https://www.instagram.com/reel/xxxx',
      m
    )
  }

  if (!/instagram\.com/i.test(q)) {
    return sendText(sock, jid, 'itu bukan link instagram', m)
  }

  try {
    const { data } = await axios.get(
      'https://api.kiracloud.my.id/api/downloader/instagram',
      { params: { url: q } }
    )

    if (!data || data.status !== 200 || !Array.isArray(data.data) || !data.data.length) {
      return sendText(sock, jid, 'media tidak ditemukan', m)
    }

    for (const item of data.data) {
      const mediaUrl = item.url
      if (!mediaUrl) continue

      if (/\.(mp4|mkv)|dl=1/i.test(mediaUrl)) {
        await sendVideo(sock, jid, mediaUrl, 'Instagram Downloader', m)
      } else {
        await sendImage(sock, jid, mediaUrl, 'Instagram Downloader', m)
      }
    }

  } catch (e) {
    return sendText(sock, jid, `error: ${e.message}`, m)
  }
}

/* ================= META ================= */

handler.pluginName = 'instagram downloader'
handler.command = ['ig', 'instagram']
handler.category = ['downloader']

handler.meta = {
  fileName: 'downloader-instagram.js',
  version: '1.2.0',
  author: 'Ky',
  note: 'instagram downloader via kiracloud api'
}

export default handler