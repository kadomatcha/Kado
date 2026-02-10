import { sendText, userManager } from '#helper'
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
    const senderId = m.senderId

    // ===== ADMIN CHECK =====
    const isAdmin = metadata.participants.some(p =>
        (p.id === senderId && p.admin) || metadata.owner === senderId
)

const isTrusted = userManager.trustedJids.has(m.senderId)
    

     
    if (!isAdmin && !isTrusted) {
        return sendText(sock, jid, 'khusus admin atau trusted user', m)
    }

    // ===== HIDETAG =====
    const members = metadata.participants.map(v => v.id)

    await sock.sendMessage(jid, {
        text,
        mentions: members
    })
}

handler.pluginName = 'hidetag'
handler.command = ['h', 'hidetag']
handler.category = ['group']
handler.deskripsi = 'mention semua member tanpa terlihat (admin & trusted)'
handler.meta = {
    fileName: 'group-hidetag.js',
    version: '1.2',
    author: 'Kado'
}

export default handler