import { sendText } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, text, jid, sock }) {
    // ===== GROUP ONLY =====
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    const metadata = await sock.groupMetadata(jid)
    const senderId = m.senderId // FIX LID

    // ===== ADMIN CHECK (FIX TOTAL) =====
    const isAdmin = metadata.participants.some(p => {
        if (p.id === senderId && p.admin) return true
        if (metadata.owner === senderId) return true
        return false
    })

    if (!isAdmin) {
        return sendText(sock, jid, 'khusus admin grup', m)
    }

    // ===== DB INIT =====
    global.db ??= { data: { chats: {} } }
    global.db.data.chats ??= {}
    global.db.data.chats[jid] ??= {}

    const opt = (text || '').toLowerCase()

    if (opt === 'on') {
        global.db.data.chats[jid].antilink = true
        return sendText(sock, jid, '✅ anti link aktif', m)
    }

    if (opt === 'off') {
        global.db.data.chats[jid].antilink = false
        return sendText(sock, jid, '❌ anti link mati', m)
    }

    return sendText(
        sock,
        jid,
        'pakai:\nantilink on\nantilink off',
        m
    )
}

handler.pluginName = 'antilink'
handler.command = ['antilink']
handler.category = ['group']
handler.deskripsi = 'toggle anti link (admin only)'
handler.meta = {
    fileName: 'group-antilink.js',
    version: '1.2',
    author: 'Kado'
}

export default handler