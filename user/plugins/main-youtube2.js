import { react } from '#helper'

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */
async function handler({ sock, m, q, text, jid }) {
  if (!text)
    return await sock.sendMessage(
      jid,
      { text: `mau puter musik apa ${m.pushName}?` },
      { quoted: m }
    )

  await react(sock, m, '💤')

  // ===== YT SEARCH =====
  const youtubeSearch = async (query) => {
    const headers = {
      'User-Agent': UA,
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Content-Type': 'application/json'
    }

    const body = JSON.stringify({
      context: {
        client: {
          hl: 'en',
          gl: 'ID',
          clientName: 'WEB',
          clientVersion: '2.20250701.09.00'
        }
      },
      params: 'EgIQAQ%3D%3D',
      query
    })

    const response = await fetch(
      'https://www.youtube.com/youtubei/v1/search?prettyPrint=false',
      { method: 'POST', headers, body }
    )

    if (!response.ok)
      throw Error(`${response.status} ${response.statusText}`)

    const json = await response.json()

    const result =
      json.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents
        .filter(v => v?.videoRenderer?.lengthText?.simpleText)
        .map(v => {
          const vr = v.videoRenderer
          return {
            videoId: vr.videoId,
            title: vr.title.runs[0].text,
            channel: vr.ownerText.runs[0].text,
            thumbnail:
              vr.thumbnail.thumbnails[1]?.url ||
              vr.thumbnail.thumbnails[0]?.url,
            views: vr.shortViewCountText.simpleText
          }
        })

    if (!result.length) throw Error('video tidak ditemukan')
    return result
  }

  // ===== DOWNLOAD =====
  const download = async (videoId, format = 'mp3') => {
    const headers = {
      'User-Agent': UA,
      'accept-encoding': 'gzip, deflate, br, zstd',
      origin: 'https://ht.flvto.online',
      'content-type': 'application/json'
    }

    const body = JSON.stringify({
      id: videoId,
      fileType: format
    })

    const response = await fetch(
      'https://ht.flvto.online/converter',
      { method: 'POST', headers, body }
    )

    if (!response.ok)
      throw Error(`${response.status} ${response.statusText}`)

    return response.json()
  }

  const youtubeResult = await youtubeSearch(text)
  const { videoId, title, channel, thumbnail, views } = youtubeResult[0]
  const { link } = await download(videoId)

  // ⛔ masih URL mode (rawan tapi sesuai request lu)
  await sock.sendMessage(jid, {
    audio: { url: link },
    mimetype: 'audio/mpeg',
    contextInfo: {
      externalAdReply: {
        renderLargerThumbnail: true,
        mediaType: 1,
        thumbnailUrl: thumbnail,
        title,
        body: `${channel} | ${views}`
      }
    }
  })

  await sock.sendMessage(jid, { react: { key: m.key, text: '✅' } })
}

handler.pluginName = 'youtube play'
handler.command = ['ytp']
handler.category = ['main']
handler.meta = {
  fileName: 'main-youtube2.js',
  version: '2',
  author: 'Kado',
  note: 'fix ban WA fetch + buffer mode'
}
export default handler