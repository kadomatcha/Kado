import iz from 'image-size'
import * as baileys from 'baileys'
import { sendText, getBuff, userManager, botInfo } from '#helper'
import axios from 'axios'

async function handler({ m, text, jid, sock }) {

  // trusted only
  if (!userManager.trustedJids.has(m.senderId)) return

  let buff
  let caption = ''

  try {

    
    if (text && /^https?:\/\//i.test(text.split(/\s+/)[0])) {
      const args = text.split(/\s+/)
      const url = args.shift()
      caption = args.join(' ')

      const res = await axios.get(url, { responseType: 'arraybuffer' })
      buff = Buffer.from(res.data)

  
    } else if (m.q?.message?.imageMessage) {
      buff = await getBuff(m.q)
      caption = text || ''

    } else {
      return sendText(
        sock,
        jid,
        `format:\n` +
        `ct https://link.jpg caption\n` +
        `atau reply gambar + ct caption`,
        m
      )
    }

    const u = iz(buff)

    const fakeUrl = 'https://Xvideos.com'

  
    const { imageMessage: img } = await baileys.prepareWAMessageMedia(
      { image: buff },
      {
        upload: sock.waUploadToServer,
        mediaTypeOverride: 'thumbnail-link'
      }
    )

    // biz-cover-photo
    const { imageMessage: anu } = await baileys.prepareWAMessageMedia(
      { image: buff },
      {
        upload: sock.waUploadToServer,
        mediaTypeOverride: 'biz-cover-photo'
      }
    )

    const waMsg = baileys.generateWAMessageFromContent(
      jid,
      {
        extendedTextMessage: {
          text: fakeUrl + '\n' + caption,
          matchedText: fakeUrl,
          jpegThumbnail: buff,
          description: botInfo.sst,
          title: botInfo.an,
          previewType: 1,
          thumbnailDirectPath: img.directPath,
          mediaKey: img.mediaKey,
          mediaKeyTimestamp: img.mediaKeyTimestamp,
          thumbnailWidth: u.width || 192,
          thumbnailHeight: u.height || 192,
          thumbnailSha256: img.fileSha256,
          thumbnailEncSha256: img.fileEncSha256,
          faviconMMSMetadata: {
            thumbnailDirectPath: anu.directPath,
            mediaKey: anu.mediaKey,
            mediaKeyTimestamp: anu.mediaKeyTimestamp,
            thumbnailWidth: 40,
            thumbnailHeight: 40,
            thumbnailSha256: anu.fileSha256,
            thumbnailEncSha256: anu.fileEncSha256
          }
        }
      },
      {
        userJid: m.senderId,
        upload: sock.waUploadToServer
      }
    )

    await sock.relayMessage(jid, waMsg.message, {
      messageId: waMsg.key.id
    })

  } catch (e) {
    console.error(e)
    await sendText(sock, jid, `error:\n${e.message}`, m)
  }
}

handler.pluginName = 'developer-ct'
handler.command = ['ct']
handler.category = ['developer']
handler.deskripsi = 'custom thumbnail link via url / reply'
handler.meta = {
  fileName: 'developer-ct.js',
  version: '1.0.0',
  author: 'Kado'
}

export default handler