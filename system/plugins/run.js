import { reply } from '../helper/baileys-generic.js'
import { userManager } from '#helper'
import { downloadMediaMessage } from 'baileys'

/** @param {import('../../system/type/plugin.js').HandlerParams} */
async function handler({ sock, jid, text, m, q, prefix, command }) {
if (!userManager.trustedJids.has(m.senderId))
return
    if (!q) return await reply(sock, m, `reply ke pesan`)

    const buffer = await downloadMediaMessage(q, "buffer")

    eval(`(async() => {
    ${buffer + ''}
    })()`)


}

handler.pluginName = 'execute js code'
handler.command = ['run']
handler.category = ['developer']
handler.deskripsi = 'buat execute kode js dari quoted document'
handler.meta = {
fileName: 'run.js',
version: '1.0.0',
author: 'Kado',
note: 'gai'
}
export default handler