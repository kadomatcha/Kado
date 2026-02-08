import { sendText } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, text, jid, sock }) {
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    global.db ??= { data: { chats: {} } }
    global.db.data.chats ??= {}
    global.db.data.chats[jid] ??= {}

    const opt = (text || '').toLowerCase()

    if (opt === 'on') {
        global.db.data.chats[jid].antitagsw = true
        return sendText(sock, jid, '✅ anti tag sw aktif', m)
    }

    if (opt === 'off') {
        global.db.data.chats[jid].antitagsw = false
        return sendText(sock, jid, '❌ anti tag sw mati', m)
    }

    return sendText(
        sock,
        jid,
        'pakai:\nantitagsw on\nantitagsw off',
        m
    )
}

handler.pluginName = 'antitagsw'
handler.command = ['antitagsw']
handler.category = ['group']
handler.deskripsi = 'toggle anti tag sw'
handler.meta = {
    fileName: 'group-antitagsw.js',
    version: '1.1',
    author: 'gwehj'
}

export default handler