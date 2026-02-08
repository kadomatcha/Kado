import { sendImage, botInfo } from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, jid, m, text }) {
  if (!text) {
    return sock.sendMessage(
      jid,
      { text: 'Format:\n.balogo KadoKawa\n.balogo Kado|Kawa' },
      { quoted: m }
    )
  }

  // hanya pisah pakai |
  const finalText = text.split('|').map(v => v.trim()).join(' ')

  const apiUrl = `https://api.nexray.web.id/maker/balogo?text=${encodeURIComponent(finalText)}`

  await sendImage(sock, jid, apiUrl, 'nih', m)
}

handler.pluginName = 'balogo maker'
handler.command = ['balogo']
handler.category = ['maker']
handler.description = 'membuat logo balogo dari text'
handler.meta = {
  fileName: 'maker-balogo.js',
  version: '1.0.1',
  author: botInfo.an,
  note: 'balogo'
}

export default handler