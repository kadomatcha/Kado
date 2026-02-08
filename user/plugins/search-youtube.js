import fetch from 'node-fetch'
import {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto,
  jidNormalizedUser
} from 'baileys'
import { sendText } from '#helper'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ m, text, jid, sock }) {
  if (!text) {
    return sendText(
      sock,
      jid,
      `mau cari youtube apa?\ncontoh: yts otsuka ray 5`,
      m
    )
  }

  await sock.sendMessage(jid, {
    react: { text: '🔍', key: m.key }
  })

  // ambil jumlah
  let args = text.split(' ')
  let jumlah = 5
  let last = args[args.length - 1]

  if (!isNaN(last)) {
    jumlah = Math.min(Math.max(parseInt(last), 1), 10)
    text = args.slice(0, -1).join(' ')
  }

  // helper upload image
  async function createImage(url) {
    const { imageMessage } = await generateWAMessageContent(
      { image: { url } },
      { upload: sock.waUploadToServer }
    )
    return imageMessage
  }

  // fetch youtube search
  let json
  try {
    const res = await fetch(
      `https://api.kiracloud.my.id/api/search/youtube?q=${encodeURIComponent(text)}`
    )
    json = await res.json()
  } catch {
    return sendText(sock, jid, 'gagal mengambil data youtube.', m)
  }

  if (json.status !== 200 || !json.data?.length) {
    return sendText(sock, jid, 'video tidak ditemukan.', m)
  }

  let list = json.data.slice(0, jumlah)

  let cards = []
  let i = 1

  for (let v of list) {
    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
  text:
`🎬 *${v.title}*
👤 ${v.channel}
⏱ ${v.duration}
👁 ${v.views}

🔗 ${v.url}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: `Result ${i++}`
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: 'YouTube Search',
        hasMediaAttachment: true,
        imageMessage: await createImage(v.thumbnail)
      }),
      nativeFlowMessage:
        proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: '▶ Tonton di YouTube',
                url: v.url,
                merchant_url: v.url
              })
            }
          ]
        })
    })
  }

  // kirim carousel
  const msg = generateWAMessageFromContent(
    jid,
    {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage:
            proto.Message.InteractiveMessage.fromObject({
              body: {
                text: `hasil pencarian youtube: *${text}*`
              },
              footer: { text: 'Veronica Ira' },
              header: { hasMediaAttachment: false },
              carouselMessage: { cards }
            })
        }
      }
    },
    {
      userJid: jidNormalizedUser(sock.user.id),
      quoted: m
    }
  )

  await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id
  })

  await sock.sendMessage(jid, {
    react: { text: null, key: m.key }
  })
}

handler.pluginName = 'youtube search'
handler.description = 'search youtube'
handler.command = ['yts']
handler.category = ['search']
handler.meta = {
  fileName: 'search-youtube.js',
  version: '1.0',
  author: 'Gula',
  note: 'kiracloud api'
}

export default handler