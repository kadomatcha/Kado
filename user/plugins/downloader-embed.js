import getDownloadLink from '../scrape/embed.js'
import { textOnlyMessage, sendText } from '#helper'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid, text }) {
    if (!textOnlyMessage(m)) return

    const url = text?.trim()
    if (!url) {
        return sendText(sock, jid, 'mana link nya', m)
    }

    try {
        // ambil video
        const videoRes = await getDownloadLink(url, 'mp4', '720')
        const videoUrl = videoRes.url || videoRes.downloadUrl
        const title = videoRes.title || 'video'

        if (videoUrl) {
            await sock.sendMessage(jid, {
                video: { url: videoUrl },
                caption: title
            }, { quoted: m })
        }

        // ambil mp3
        const audioRes = await getDownloadLink(url, 'mp3', '320')
        const audioUrl = audioRes.url || audioRes.downloadUrl

        if (audioUrl) {
            await sock.sendMessage(jid, {
                audio: { url: audioUrl },
                mimetype: 'audio/mpeg',
                fileName: title + '.mp3'
            }, { quoted: m })
        }

    } catch (e) {
        sendText(sock, jid, 'error: ' + e.message, m)
    }
}

handler.pluginName = 'embded downloader'
handler.command = ['embed']
handler.category = ['downloader']
handler.description = 'download'
handler.meta = {
fileName: 'downloader-embed.js',
version: '1',
author: 'Kado'
}

export default handler