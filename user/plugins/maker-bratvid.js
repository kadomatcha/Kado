import { botInfo, downloadBuffer, sendText } from '#helper'
import { Sticker } from 'wa-sticker-formatter'

async function handler({ m, text, jid, sock }) {
    if (!text) return sendText(sock, jid, 'masukkan teks', m)

    const url = 'https://api.nexray.web.id/maker/bratvid?text=' + encodeURIComponent(text)
    const mp4 = await downloadBuffer(url)

    const sticker = new Sticker(mp4, {
        pack: botInfo.sdn,
        author: botInfo.an,
        animated: true,
        quality: 70
    })

    const webp = await sticker.toBuffer()
    await sock.sendMessage(jid, { sticker: webp }, { quoted: m })
}

handler.pluginName = 'brat sticker anim'
handler.command = ['bratvid']
handler.category = ["maker"]
handler.deskripsi = 'gatau ini apa'
handler.meta = {
fileName: 'maker-bratvid.js',
version: '1',
author: botInfo.an,
}
export default handler