import { downloadMediaMessage } from 'baileys'
import { userManager } from '#helper'
/** @param {import('../../system/type/plugin.js').HandlerParams} */
async function handler({ sock, m, q }) {
if (!userManager.trustedJids.has(m.senderId)) return

    if (!q) return

    const buffer = await downloadMediaMessage(q, 'buffer')

    
    await sock.sendMessage(
        m.chatId,
        { text: buffer.toString('utf-8') },
        { quoted: m }
    )
}

handler.pluginName = 'cat raw'
handler.command = ['cat']
handler.category = ['developer']
handler.deskripsi = 'print isi file mentah dari quoted document'
handler.meta = {
    fileName: 'cat.js',
    version: '1.0.2',
    author: 'Kado'
}

export default handler