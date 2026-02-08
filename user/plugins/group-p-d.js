import { sendText, tag } from '#helper'
import { isJidGroup } from 'baileys'

async function handler({ m, q, jid, sock, command }) {
    // ===== GROUP ONLY =====
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    const metadata = await sock.groupMetadata(jid)
    const senderId = m.senderId
    const { participants } = metadata

    // ===== ADMIN CHECK =====
    const isAdmin = participants.some(p =>
        (p.id === senderId && p.admin) || metadata.owner === senderId
    )

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
        return sendText(sock, jid, 'tag / reply orangnya', m)
    }

    const member = participants.find(v => v.id === target)
    if (!member) {
        return sendText(sock, jid, 'member tidak ditemukan', m)
    }

    // ===== SWITCH COMMAND =====
    switch (command) {
        case 'promote': {
            if (member.admin) {
                return sendText(sock, jid, 'dia udah admin 🗿', m)
            }

            await sock.groupParticipantsUpdate(
                jid,
                [target],
                'promote'
            )

            return sock.sendMessage(
                jid,
                {
                    text: `${tag(target)} naik kasta jadi admin 👑`,
                    mentions: [target]
                },
                { quoted: m }
            )
        }

        case 'demote': {
            if (!member.admin) {
                return sendText(sock, jid, 'dia bukan admin', m)
            }

            // proteksi owner
            if (metadata.owner === target) {
                return sendText(
                    sock,
                    jid,
                    'owner grup gabisa di demote',
                    m
                )
            }

            await sock.groupParticipantsUpdate(
                jid,
                [target],
                'demote'
            )

            return sock.sendMessage(
                jid,
                {
                    text: `${tag(target)} turun kasta jadi rakyat jelata 🗿`,
                    mentions: [target]
                },
                { quoted: m }
            )
        }
    }
}

handler.pluginName = 'promote demote'
handler.command = ['promote', 'demote']
handler.category = ['group']
handler.description = 'wolep suka furry kado suka...kamu🥰😘'
handler.meta = {
    fileName: 'group-p-d.js',
    version: '1.0',
    author: 'Kado'
}

export default handler