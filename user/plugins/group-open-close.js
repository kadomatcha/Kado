import { sendText } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, jid, sock, command }) {
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

    // ===== OPEN / CLOSE =====
    switch (command) {
        case 'open': {
            await sock.groupSettingUpdate(jid, 'not_announcement')
            return sendText(sock, jid, '🔓 grup dibuka, silakan ngoceh', m)
        }

        case 'close': {
            await sock.groupSettingUpdate(jid, 'announcement')
            return sendText(sock, jid, '🔒 grup ditutup, admin only', m)
        }

        default:
            return sendText(sock, jid, 'command tidak dikenal', m)
    }
}

handler.pluginName = 'open/close'
handler.command = ['open', 'close']
handler.category = ['group']
handler.description = 'plc lppyu'
handler.meta = {
    fileName: 'group-open-close.js',
    version: '1.1',
    author: 'Kado'
}

export default handler