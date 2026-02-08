import { downloadMediaMessage } from 'baileys'
import crypto from 'crypto'
import { user manager } from '#helper'
/** @param {import('../../system/type/plugin.js').HandlerParams} */
async function handler({ sock, jid, m, q }) {
if (!userManager.trustedJids.has(m.senderId))
return
    if (!q) return

   
    const msg = q.message?.[q.type] || q

    const buffer = await downloadMediaMessage(q, 'buffer')

    const filename =
        msg.fileName ||
        q.fileName ||
        'unknown'

    const mimetype =
        msg.mimetype ||
        q.mimetype ||
        'unknown'

    const size =
        msg.fileLength?.low ??
        buffer.length

    const sha256 = crypto
        .createHash('sha256')
        .update(buffer)
        .digest('hex')

    const text =
`file: ${filename}
mime: ${mimetype}
size: ${size} bytes
sha256: ${sha256}`

    await sock.sendMessage(
        jid,
        { text },
        { quoted: m }
    )
}

handler.pluginName = 'stat file'
handler.command = ['stat']
handler.category = ['developer']
handler.deskripsi = 'lihat metadata file dari quoted document'
handler.meta = {
    fileName: 'dev-stat.js',
    version: '1.0.1',
    author: 'Kado'
}

export default handler