import { sendText, tag } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, jid, text, sock }) {
    // ===== GROUP ONLY =====
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    if (!text) {
        return sendText(sock, jid, 'masukkan teks', m)
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

    // ===== HIDETAG =====
    const members = metadata.participants.map(v => v.id)

    return await sock.sendMessage(
        jid,
        {
            text,
            mentions: members
        }
    )
}

handler.pluginName = 'hidetag'
handler.command = ['h', 'hidetag']
handler.category = ['group']
handler.deskripsi = 'mention semua member tanpa terlihat (admin only)'
handler.meta = {
    fileName: 'group-hidetag.js',
    version: '1.1',
    author: 'Kado'
}

export default handler