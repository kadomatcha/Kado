import {
  sendImage,
  botInfo
} from '#helper'

async function handler({ sock, jid, m, text }) {
  if (!text) {
    return sock.sendMessage(
      jid,
      { text: 'kodenya mana bang' },
      { quoted: m }
    )
  }

  const api =
    'https://api.nexray.web.id/maker/codesnap?code=' +
    encodeURIComponent(text)

  return await sendImage(
    sock,
    jid,
    api,
    'nih codesnap nya',
    m
  )
}

handler.pluginName = 'codesnap'
handler.command = ['csnap']
handler.category = ['maker']
handler.deskripsi = 'membuat gambar code snap dari teks'
handler.meta = {
  fileName: 'maker-codesnap.js',
  version: '1',
  author: botInfo.an,
  note: 'auto'
}

export default handler