import axios from 'axios'
import { delay } from 'baileys'
import { textOnlyMessage, sendText, sendFancyMp3, react, botInfo } from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, text, m, jid, q }) {
    if (!textOnlyMessage(m)) return


    if (!text) return sendText(sock, jid, 'query atau judulnya?', m)
    
    const query = text

    await react(sock, m, '🕛')

    try {
        const { data } = await axios.get(
            `https://api.deline.web.id/downloader/ytplay?q=${encodeURIComponent(query)}`
        )

        if (!data?.status || !data?.result)
            return sendText(sock, jid, 'tidak ada hasil', m)

        const { title, thumbnail, dlink } = data.result

        await sendFancyMp3(sock, jid, dlink, title, botInfo.sdn, thumbnail)

    } catch (e) {
        await sendText(sock, jid, `error: ${e.message}`, m)
    }

    await react(sock, m, '✅')
}

handler.pluginName = 'youtube play'
handler.command = ['play2']
handler.category = ['main']

handler.meta = {
    fileName: 'main-youtube.js',
    version: '1.0.0',
    author: 'Ky',
    note: 'plugin youtube play'
}

export default handler