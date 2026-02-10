import SaveTheVideoScraper from '../scrape/stv.js'
import { textOnlyMessage, sendText, sendVideo, botInfo } from '#helper'

async function handler({ sock, m, jid, q }) {
    if (!textOnlyMessage(m)) return

    const url =
        q?.text ||
        m.text?.split(' ').slice(1).join(' ').trim()

    if (!url) {
        return sendText(sock, jid, 'masukin link video', m)
    }

    try {
        const scraper = new SaveTheVideoScraper()
        const res = await scraper.extractFormats(url)

        if (!res?.formats?.length) {
            return sendText(sock, jid, 'video tidak ditemukan', m)
        }

        // pilih kualitas terbaik (biasanya terakhir)
        const video = res.formats.reverse().find(v => v.url)

        await sendVideo(sock, jid, video.url, res.title || '', m)

    } catch (e) {
        sendText(sock, jid, 'error: ' + e.message, m)
    }
}

handler.command = ['stv']
handler.category = ['downloader']
handler.pluginName = 'savethevideo downloader'
handler.description = 'mamaknlugwjumpshot'
handler.meta = {
fileName: 'downloader-stv.js',
version: '1',
author: botInfo.an
}

export default handler