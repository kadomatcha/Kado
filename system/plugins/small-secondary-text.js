import { sendText, botInfo, updateSmallSecondaryText, userManager, textOnlyMessage } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {

    // return return
    if (!userManager.trustedJids.has(m.senderId)) return
    if (!textOnlyMessage(m)) return
    if(q) return

    const pc = `${prefix||''}${command}`

    if (!text?.trim()) return await sendText(sock, jid, `mana namanya wok`, m)
    if (text && text.trim() === '-get') return await sendText(sock, jid, `${pc} ${botInfo.sst}`)
    updateSmallSecondaryText(text)
    await sendText(sock, jid, `small secondary text updated! coba ketik menu`)
    return
}

handler.pluginName = 'secondary text set'
handler.description = 'command ini buat ngatur secondary text...\n' +
    'cara pakai:\n' +
    'sst angelina (buat set display name)\n' +
    'sst get (buat dapetin current display name)'
handler.command = ['sst']
handler.category = ['developer']

handler.meta = {
    fileName: 'small-secondary-text.js',
    version: '1',
    author: botInfo.an,
    note: 'awuuuuu',
}

export default handler