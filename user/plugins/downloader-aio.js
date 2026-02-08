import DownrScraper from '../scrape/downr.js'
import {
    textOnlyMessage,
    sendText,
    sendVideo,
    sendImage
} from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid, q }) {
    if (!textOnlyMessage(m)) return

    const url =
        q?.message?.conversation ||
        q?.message?.extendedTextMessage?.text ||
        m.text?.split(' ').slice(1).join(' ')?.trim()

    if (!url) {
        return sendText(
            sock,
            jid,
            'masukin link youtube\ncontoh:\nyt https://youtu.be/xxxx',
            m
        )
    }

    try {
        const scraper = new DownrScraper()
        const res = await scraper.getVideoInfo(url)

        if (!res || !res.medias) {
            return sendText(sock, jid, 'gagal ambil video', m)
        }

        const caption = `${res.title || ''}\n${res.author || ''}`

        // ambil kualitas pertama
        const media = res.medias.find(v => v.url)

        if (media?.url) {
            await sendVideo(sock, jid, media.url, caption, m)
        } else {
            return sendText(sock, jid, 'video tidak ditemukan', m)
        }

    } catch (e) {
        return sendText(sock, jid, `error: ${e.message}`, m)
    }
}

handler.pluginName = 'download downr'
handler.command = ['aio']
handler.category = ['downloader']
handler.description = 'download semua video kayaknya'
handler.meta = {
    fileName: 'downloader-aio.js',
    version: '1.0.0',
    author: 'kado',
    note: 'downloader via downr'
}

export default handler