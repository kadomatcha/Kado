import { sendText } from '#helper'
import { isJidGroup } from 'baileys'

const groupTimers = new Map()

function parseTime(input = '') {
    const match = input.match(/(\d+)\s*(detik|menit|jam|hari)/i)
    if (!match) return null

    const value = Number(match[1])
    const unit = match[2].toLowerCase()

    const map = {
        detik: 1000,
        menit: 60 * 1000,
        jam: 60 * 60 * 1000,
        hari: 24 * 60 * 60 * 1000
    }

    return value * map[unit]
}

async function handler({ m, jid, sock, command, text }) {
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    const metadata = await sock.groupMetadata(jid)
    const senderId = m.senderId // 🔥 FIX UTAMA (LID)

    // ===== ADMIN CHECK (FIX TOTAL) =====
    const isAdmin = metadata.participants.some(p => {
        if (p.id === senderId && p.admin) return true
        if (metadata.owner === senderId) return true
        return false
    })

    if (!isAdmin) {
        return sendText(sock, jid, 'khusus admin grup', m)
    }

    // ===== CANCEL TIMER =====
    if (text?.includes('-c')) {
        const timer = groupTimers.get(jid)
        if (!timer) {
            return sendText(sock, jid, 'tidak ada timer aktif', m)
        }

        clearTimeout(timer)
        groupTimers.delete(jid)
        return sendText(sock, jid, '⛔ timer dibatalkan', m)
    }

    const duration = parseTime(text)
    if (!duration) {
        return sendText(
            sock,
            jid,
            `format salah\ncontoh:\n${command} 10 menit\n${command} -c`,
            m
        )
    }

    // clear timer lama
    if (groupTimers.has(jid)) {
        clearTimeout(groupTimers.get(jid))
        groupTimers.delete(jid)
    }

    // ===== OPENTIME =====
    if (command === 'opentime') {
        await sock.groupSettingUpdate(jid, 'announcement')
        await sendText(
            sock,
            jid,
            `🔒 grup ditutup sementara\nakan dibuka dalam ${text}`,
            m
        )

        const timer = setTimeout(async () => {
            await sock.groupSettingUpdate(jid, 'not_announcement')
            await sendText(sock, jid, '⏰ waktu habis, grup dibuka', m)
            groupTimers.delete(jid)
        }, duration)

        groupTimers.set(jid, timer)
    }

    // ===== CLOSETIME =====
    if (command === 'closetime') {
        await sock.groupSettingUpdate(jid, 'not_announcement')
        await sendText(
            sock,
            jid,
            `🔓 grup dibuka sementara\nakan ditutup dalam ${text}`,
            m
        )

        const timer = setTimeout(async () => {
            await sock.groupSettingUpdate(jid, 'announcement')
            await sendText(
                sock,
                jid,
                '⏰ waktu habis, grup ditutup (admin only)',
                m
            )
            groupTimers.delete(jid)
        }, duration)

        groupTimers.set(jid, timer)
    }
}

handler.pluginName = 'open/close time'
handler.command = ['opentime', 'closetime']
handler.category = ['group']
handler.description = 'wolep suka furry aku suka.. kamu'
handler.meta = {
    fileName: 'group-open-close-time.js',
    version: '1.4',
    author: 'Kado'
}

export default handler