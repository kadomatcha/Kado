import { sendText, botInfo, updateAuthorName, userManager, textOnlyMessage } from '../helper.js'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {

    // return return
    if (!userManager.trustedJids.has(m.senderId)) return
    if (!textOnlyMessage(m)) return
    if (q) return

    if (!text?.trim()) return await sendText(sock, jid, `mana namanya wok? atau isi param -get buat dapetin current name`, m)
    const pc = `${prefix || ''}${command}`
    if (text && text.trim() === '-get') return await sendText(sock, jid, `${pc} ${botInfo.an}`)
    updateAuthorName(text)
    await sendText(sock, jid, `author name updated! coba ketik menu`)
    return
}

handler.pluginName = 'author name update'
handler.description = 'command ini buat ngatur author name...\n' +
    'cara pakai:\n' +
    'an angelina (buat set author name)\n' +
    'an get (buat dapetin current author name)'
handler.command = ['an']
handler.category = ['developer']

handler.config = {
    systemPlugin: true,
}

handler.meta = {
    fileName: 'author-name.js',
    version: '1',
    author: botInfo.an,
    note: 'ngihok',
}

export default handler