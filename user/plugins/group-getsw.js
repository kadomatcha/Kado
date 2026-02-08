import { sendText } from '#helper'
import { getContentType } from 'baileys'

/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */
async function handler({ sock, m, q, jid }) {

    if (!q)
        return sendText(sock, jid, 'reply status grup yang mau di ambil', m)

    // PAKAI STRUKTUR ASLI STATUS GRUP
    const container = q.message?.groupStatusMessageV2
    if (!container)
        return sendText(sock, jid, 'ini bukan status grup yang valid', m)

    // q.type TETAP DIPAKAI
    const WAMC = container.message
    if (!WAMC)
        return sendText(sock, jid, 'message kosong', m)

    const ct = getContentType(WAMC)
    if (!ct)
        return sendText(sock, jid, 'content type undefined', m)

    // hapus contextInfo biar aman
    if (WAMC[ct]?.contextInfo)
        delete WAMC[ct].contextInfo

    await sock.relayMessage(jid, WAMC, {})
}

handler.pluginName = 'group getsw'
handler.description = 'ambil ulang status grup (groupStatusMessageV2)'
handler.command = ['getsw']
handler.category = ['tools']

handler.meta = {
    fileName: 'group-getsw.js',
    version: '2.0.0',
    author: 'Acodex',
}

export default handler