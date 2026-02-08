import { botInfo, textOnlyMessage, formatByte, sendText, msToReadableTime } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {
    if (text) return
    if (q) return
    if (!textOnlyMessage(m)) return

    process.send({
        type: 'uptime',
        data: { jid }
    })
    return
}

handler.pluginName = 'runtime check'
handler.description = 'cek runtime atau uptime bot dari pertama kali di jalankan'
handler.command = ['rt']
handler.category = ['info']

handler.config = {
    systemPlugin: true,
}

handler.meta = {
    fileName: 'info-runtime.js',
    version: '1',
    author: botInfo.an,
    note: 'bisa yok 1 hari lebih',
}
export default handler