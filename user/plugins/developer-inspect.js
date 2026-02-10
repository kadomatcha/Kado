import { sendText, botInfo } from '#helper'
import { getDevice } from 'baileys'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid }) {
    const mese = m.q || m
    const { pushName, key, type } = mese

    const lid = mese.senderId || key.participant || key.remoteJid
    const chatId = key.remoteJid
    const messageId = key.id
    const device = getDevice(key.id) || 'unknown'
    const quoted = m.q ? 'yes' : 'no'

    const print =
        'simple inspect\n' +
        '```' +
        `name   : ${pushName}\n` +
        `lid    : ${lid}\n` +
        `from   : ${device}\n` +
        `chat   : ${chatId}\n` +
        `msgId  : ${messageId}\n` +
        `type   : ${type}\n` +
        `quoted : ${quoted}` +
        '```'

    await sendText(sock, jid, print, mese)
}

handler.pluginName = 'dev inspect'
handler.description = 'inspect message cepat untuk debug'
handler.command = ['dev']
handler.category = ['developer']

handler.meta = {
    fileName: 'developer-inspect.js',
    version: '1.2.0',
    author: botInfo.an
}

export default handler