import { sendText } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, q, text, jid, sock }) {
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

    // ===== TARGET =====
    let target = null

    // reply pesan
    if (q?.senderId) {
        target = q.senderId
    }
    // manual number
    else if (text) {
        const num = text.replace(/[^0-9]/g, '')
        if (!num) {
            return sendText(sock, jid, 'nomor tidak valid', m)
        }
        target = num + '@s.whatsapp.net'
    }

    if (!target) {
        return sendText(sock, jid, 'reply pesan / add 628xxxx', m)
    }

    try {
        // ===== TRY DIRECT ADD =====
        await sock.groupParticipantsUpdate(
            jid,
            [target],
            'add'
        )

        return sendText(
            sock,
            jid,
            'berhasil di add',
            m
        )
    } catch (e) {
        try {
            // ===== FALLBACK INVITE =====
            const invite = await sock.groupInviteCode(jid)
            const link = `https://chat.whatsapp.com/${invite}`

            await sock.sendMessage(
                target,
                {
                    text:
                        `kamu diundang ke grup:\n\n${link}`
                }
            )

            return sendText(
                sock,
                jid,
                'gagal add, invite dikirim ke private',
                m
            )
        } catch (err) {
            return sendText(sock, jid, err.toString(), m)
        }
    }
}

handler.pluginName = 'add'
handler.command = ['add']
handler.category = ['group']
handler.deskripsi = 'add member (admin only)'
handler.meta = {
    fileName: 'group-add.js',
    version: '1.3',
    author: 'Kado'
}

export default handler