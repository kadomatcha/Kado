import { sendText, botInfo, updateSmallDisplayName, userManager, textOnlyMessage } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {

    // return return
    if (!userManager.trustedJids.has(m.senderId)) return
    if (!textOnlyMessage(m)) return
    if (q) return

    if (!text?.trim()) return await sendText(sock, jid, `mana namanya wok? atau isi param -get buat dapetin current name`, m)
    const pc = `${prefix || ''}${command}`
    if (text && text.trim() === '-get') return await sendText(sock, jid, `${pc} ${botInfo.sdn}`)
    updateSmallDisplayName(text)
    await sendText(sock, jid, `small display name updated! coba ketik menu`)
    return
}

handler.pluginName = 'display name update'
handler.description = 'command ini buat ngatur display name...\n' +
    'cara pakai:\n' +
    'sdn angelina (buat set display name)\n' +
    'sdn get (buat dapetin current display name)'
handler.command = ['sdn']
handler.category = ['developer']

handler.meta = {
    fileName: 'small-display-name.js',
    version: '1',
    author: botInfo.an,
    note: 'ngihok',
}

export default handler