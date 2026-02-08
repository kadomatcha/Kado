import { textOnlyMessage } from '#helper'
import { sendVContact } from '#kyhlpr'

/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */

async function handler({ sock, m, jid }) {
    if (!textOnlyMessage(m)) return

    return await sendVContact(sock, jid, m)
}

handler.pluginName = 'send vcontact kado'
handler.description = 'kirim kontak Kado via helper'
handler.command = ['owner']
handler.category = ['info']

handler.meta = {
    fileName: 'info-owner.js',
    version: '1',
    author: 'k',
    note: 'using sendVContact helper'
}

export default handler