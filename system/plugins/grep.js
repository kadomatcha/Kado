import { downloadMediaMessage } from 'baileys'
import {userManager} from '#helper'
/** @param {import('../../system/type/plugin.js').HandlerParams} */
async function handler({ sock, jid, m, q, text }) {
if (!userManager.trustedJids.has(m.senderId)) return
    if (!q || !text) return

    const buffer = await downloadMediaMessage(q, 'buffer')
    const content = buffer.toString('utf-8')

    const keyword = text.trim()
    const lines = content.split('\n')

    const matched = lines.filter(line => line.includes(keyword))

    if (!matched.length) {
        await sock.sendMessage(jid, { text: '' }, { quoted: m })
        return
    }

    await sock.sendMessage(
        jid,
        { text: matched.join('\n') },
        { quoted: m }
    )
}

handler.pluginName = 'grep'
handler.command = ['grep']
handler.category = ['developer']
handler.deskripsi = 'ambil baris yang cocok dari file'
handler.meta = {
    fileName: 'grep.js',
    version: '1.0.0',
    author: 'Kado'
}

export default handler