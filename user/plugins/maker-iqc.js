import { sendImage, botInfo } from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, jid, m, text }) {
  if (!text) {
    return sock.sendMessage(
      jid,
      { text: 'Format:\n.iqc text\n.iqc text|provider|jam|baterai' },
      { quoted: m }
    )
  }

  // parsing
  const parts = text.split('|').map(v => v.trim())

  const quoteText = parts[0] || 'hai'
  const provider = parts[1] || 'AcodexID'
  const jam = parts[2] || '00.03'
  const baterai = parts[3] || '100'

  const apiUrl =
    `https://api.nexray.web.id/maker/v1/iqc?text=${encodeURIComponent(quoteText)}` +
    `&provider=${encodeURIComponent(provider)}` +
    `&jam=${encodeURIComponent(jam)}` +
    `&baterai=${encodeURIComponent(baterai)}`

  await sendImage(sock, jid, apiUrl, 'nih iqc nya', m)
}

handler.pluginName = 'iqc maker'
handler.command = ['iqc']
handler.category = ['maker']
handler.description = 'fake iphone quote chat generator'
handler.meta = {
  fileName: 'maker-iqc.js',
  version: '1.0.0',
  author: botInfo.an,
  note: 'iqc nexray api'
}

export default handler