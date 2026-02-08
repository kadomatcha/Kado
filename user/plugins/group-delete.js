import { botInfo, userManager, bot, sendText } from '#helper'
import { isJidGroup } from 'baileys'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, q, jid }) {

    // trusted only
    if (!userManager.trustedJids.has(m.senderId)) return

    // group only
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    // admin check
    const metadata = await sock.groupMetadata(jid)
    const isAdmin = metadata.participants.some(p =>
        p.id === m.senderId &&
        (p.admin === 'admin' || p.admin === 'superadmin')
    )

    if (!isAdmin) {
        return sendText(sock, jid, 'khusus admin', m)
    }

    // HARUS reply → q
    if (!q) {
        return sendText(sock, jid, 'reply pesan bot yang mau dihapus', m)
    }

    const qmk = q.key
    if (!qmk) return

    // pastikan pesan bot
    const botMessage =
        qmk.fromMe ||
        qmk.participant === bot.lid ||
        qmk.remoteJid === jid

    if (!botMessage) {
        return sendText(sock, jid, 'ga bisa hapus pesan itu', m)
    }

    const key = { ...qmk, fromMe: true }
    await sock.sendMessage(jid, { delete: key })
}

handler.pluginName = 'reply delete'
handler.description = 'hapus pesan bot dengan reply (admin only)'
handler.command = ['del', 'delete']
handler.category = ['group']
handler.meta = {
    fileName: 'group-delete.js',
    version: '1.2',
    author: botInfo.an,
    note: 'hapus dosa tapi admin dulu',
}

export default handler