import {
  sendImage,
  sendText,
  botInfo
} from '#helper'

async function handler({ sock, jid, m, text }) {
  if (!text)
    return sendText(sock, jid, 'format: .fakestory caption', m)

  const username = m.pushName || 'user'
  const caption = text

  let avatar = 'https://cdn.nekohime.site/file/eFub3YDe.jpg'

  try {
    const senderJid =
      m.key?.participant ||
      m.senderId ||
      m.sender

    const jidFix = senderJid.includes('@lid')
      ? senderJid.replace('@lid', '@s.whatsapp.net')
      : senderJid

    const pp = await sock.profilePictureUrl(jidFix, 'image')
    if (pp) avatar = pp
  } catch {
    // fallback
  }

  const api =
    'https://api.nexray.web.id/maker/fakestory?' +
    `username=${encodeURIComponent(username)}` +
    `&caption=${encodeURIComponent(caption)}` +
    `&avatar=${encodeURIComponent(pp)}`

  return sendImage(sock, jid, api, 'nih fake story nya', m)
}

handler.pluginName = 'fake story'
handler.command = ['fakestory']
handler.category = ['maker']
handler.deskripsi = 'gatau'
handler.meta = {
  fileName: 'maker-fake-story.js',
  version: '2',
  author: botInfo.an,
  note: 'gatay'
}

export default handler