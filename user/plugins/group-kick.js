import { sendText, tag } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, q, jid, sock }) {
    // ===== GROUP ONLY =====
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    const metadata = await sock.groupMetadata(jid)
    const senderId = m.senderId // FIX LID
    const { participants } = metadata

    // ===== ADMIN CHECK (FIX TOTAL) =====
    const isAdmin = participants.some(p => {
        if (p.id === senderId && p.admin) return true
        if (metadata.owner === senderId) return true
        return false
    })

    if (!isAdmin) {
        return sendText(sock, jid, 'khusus admin grup', m)
    }

    let target

    // reply
    if (q?.senderId) {
        target = q.senderId
    }
    // mention
    else if (
        m?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length
    ) {
        target =
            m.message.extendedTextMessage.contextInfo.mentionedJid[0]
    }

    if (!target) {
        return sendText(sock, jid, 'infokan hama nya', m)
    }

    const member = participants.find(v => v.id === target)
    if (!member) {
        return sendText(sock, jid, 'member tidak ditemukan', m)
    }

    // ===== PROTECT ADMIN TARGET =====
    if (member.admin) {
        return sendText(
            sock,
            jid,
            'astaga beliau bangsawan gabisa di kick',
            m
        )
    }

    // ===== KICK =====
    await sock.groupParticipantsUpdate(jid, [target], 'remove')

    return sock.sendMessage(
        jid,
        {
            text: `${tag(target)} ( hama ) berhasil di kick`,
            mentions: [target]
        },
        { quoted: m }
    )
}

handler.pluginName = 'kick'
handler.command = ['kick','dor']
handler.category = ['group']
handler.deskripsi = 'kick member (reply / tag) (admin only)'
handler.meta = {
    fileName: 'group-kick.js',
    version: '1.4',
    author: 'Kado'
}

export default handler