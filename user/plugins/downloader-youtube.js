import axios from 'axios'
import { sendText, react } from '#helper'
import fs from 'fs'
import path from 'path'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ m, text, jid, sock }) {
  if (!text)
    return sendText(
      sock,
      jid,
      'contoh:\nyt <url> -mp3\nyt <url> -mp4',
      m
    )

  if (!/youtu\.?be/.test(text))
    return sendText(sock, jid, 'itu bukan link youtube 😐', m)

  const isMp3 = text.includes('-mp3')
  const isMp4 = text.includes('-mp4')

  if (!isMp3 && !isMp4)
    return sendText(sock, jid, 'pilih format: -mp3 / -mp4', m)

  const url = text.replace(/-mp3|-mp4/g, '').trim()
  const tmpDir = path.join(process.cwd(), 'tmp')

  try {
    await react(sock, m, '🕒')

    // ================= MP3 =================
    if (isMp3) {
      const { data } = await axios.get(
        'https://api.deline.web.id/downloader/ytmp3',
        { params: { url } }
      )

      if (!data.status) throw 'gagal ambil mp3'

      const yt = data.result.youtube
      const dl = data.result.dlink

      await sock.sendMessage(
        jid,
        {
          audio: { url: dl },
          mimetype: 'audio/mpeg',
          contextInfo: {
            externalAdReply: {
              renderLargerThumbnail: true,
              mediaType: 1,
              thumbnailUrl: yt.thumbnail,
              title: yt.title,
              body: 'YouTube MP3'
            }
          }
        },
        { quoted: m }
      )
    }

    // ================= MP4 =================
    if (isMp4) {
      const { data } = await axios.get(
        'https://api.deline.web.id/downloader/ytmp4',
        { params: { url } }
      )

      if (!data.status) throw 'gagal ambil mp4'

      const dlUrl = data.result.downloadUrl
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir)

      const filePath = path.join(tmpDir, `${Date.now()}.mp4`)

      const res = await axios.get(dlUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 Chrome/120.0.0.0 Mobile Safari/537.36',
          'Accept': '*/*',
          'Referer': 'https://api.deline.web.id/'
        }
      })

      await new Promise((resolve, reject) => {
        const stream = fs.createWriteStream(filePath)
        res.data.pipe(stream)
        stream.on('finish', resolve)
        stream.on('error', reject)
      })

      await sock.sendMessage(
        jid,
        {
          video: fs.readFileSync(filePath),
          mimetype: 'video/mp4',
          caption: '🎬 YouTube MP4'
        },
        { quoted: m }
      )

      fs.unlinkSync(filePath)
    }

    await react(sock, m, '✅')
  } catch (e) {
    console.error(e)
    await react(sock, m, '❌')
    await sendText(sock, jid, 'gagal download 😵‍💫', m)
  }
}

handler.pluginName = 'youtube downloader'
handler.command = ['yt']
handler.category = ['downloader']
handler.description = 'yt downloader pakai flag -mp3 / -mp4'

handler.meta = {
  fileName: 'downloader-youtube.js',
  version: '1.3',
  author: 'Kado',
  note: 'mp4 anti 403 (cloudflare), mp3 direct'
}

export default handler