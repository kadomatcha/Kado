import fetch from 'node-fetch'
import {
  generateWAMessageContent,
  generateWAMessageFromContent,
  proto,
  jidNormalizedUser
} from 'baileys'
import { sendText, tag } from '#helper'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ m, text, jid, sock, prefix, command }) {
  if (!text) {
    return sendText(
      sock,
      jid,
      `mw cari apa? pake param {query} {value} ya\ncontoh pin2 kucing 5`,
      m
    )
  }

  await sock.sendMessage(jid, {
    react: { text: '🕓', key: m.key }
  })

  // ambil jumlah
  let args = text.split(' ')
  let jumlah = 6
  let last = args[args.length - 1]

  if (!isNaN(last)) {
    jumlah = Math.min(Math.max(parseInt(last), 1), 50)
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

  // shuffle
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }

  // fetch pinterest api
  let json
  try {
    const res = await fetch(
      `https://api.siputzx.my.id/api/s/pinterest?query=${encodeURIComponent(text)}`
    )
    json = await res.json()
  } catch {
    return sendText(sock, jid, 'gagal mengambil data pinterest.', m)
  }

  if (!json.status || !json.data?.length) {
    return sendText(sock, jid, 'gambar tidak ditemukan.', m)
  }

  let list = json.data.map(v => ({
    img: v.image_url,
    source: v.pin
  }))

  shuffle(list)
  list = list.slice(0, jumlah)

  let cards = []
  let i = 1

  for (let item of list) {
    cards.push({
      body: proto.Message.InteractiveMessage.Body.fromObject({
        text: `Image ke - ${i++}`
      }),
      footer: proto.Message.InteractiveMessage.Footer.fromObject({
        text: 'Veronica Ira'
      }),
      header: proto.Message.InteractiveMessage.Header.fromObject({
        title: `Hasil pencarian: ${text}`,
        hasMediaAttachment: true,
        imageMessage: await createImage(item.img)
      }),
      nativeFlowMessage:
        proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: [
            {
              name: 'cta_url',
              buttonParamsJson: JSON.stringify({
                display_text: 'Lihat di Pinterest',
                url: item.source,
                merchant_url: item.source
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
                text: `ini hasilnya kak ${m.pushName}`
              },
              footer: { text: 'Veronica Ira' },
              header: { hasMediaAttachment: false },
              carouselMessage: {
                cards
              }
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

handler.pluginName = 'pinterest'
handler.description = 'search gambar pinterest (interactive)'
handler.command = ['pin2']
handler.category = ['search']

handler.meta = {
  fileName: 'search-pinterest2.js',
  version: '2.0',
  author: 'Gula',
  note: 'nada'
}

export default handler