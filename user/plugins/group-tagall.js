import { sendText } from '#helper'
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

    // ===== TAGALL =====
    return await sock.sendMessage(
        jid,
        {
            text: `@all ${text}`,
            contextInfo: {
                nonJidMentions: true
            }
        },
        { quoted: m }
    )
}

handler.pluginName = 'tagall'
handler.command = ['tagall']
handler.category = ['group']
handler.deskripsi = 'tag semua member (admin only)'
handler.meta = {
    fileName: 'group-tagall.js',
    version: '2.1',
    author: 'Kado'
}

export default handler