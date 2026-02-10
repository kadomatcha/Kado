import TiktokScraper from '../scrape/tiktok.js'
import {
    textOnlyMessage,
    sendText,
    sendVideo,
    sendFancyMp3,
    sendImage,
botInfo
} from '#helper'

const scraper = new TiktokScraper()

async function handler({ sock, m, jid }) {
    if (!textOnlyMessage(m)) return

    const url = m.text.split(' ').slice(1).join(' ').trim()

    if (!url) {
        return sendText(
            sock,
            jid,
            'masukin link tiktok',
            m
        )
    }

    if (!/(tiktok\.com|vt\.tiktok\.com)/i.test(url)) {
        return sendText(sock, jid, 'itu bukan link tiktok', m)
    }

    try {
        const res = await scraper.download(url)

        if (!res.status) {
            return sendText(sock, jid, 'gagal ambil data\n' + res.message, m)
        }

        const caption = `${res.title || ''}\n\n@${res.author || '-'}`

        if (res.video) {
            await sendVideo(sock, jid, res.video, caption, m)
        }

        else if (res.images) {
            for (const img of res.images) {
                await sendImage(sock, jid, img, caption, m)
            }
        }

        if (res.music) {
            await sendFancyMp3(
                sock,
                jid,
                res.music,
                res.title || 'TikTok Audio',
                `@${res.author || '-'}`,
                res.thumbnail || '',
                false,
                m
            )
        }

    } catch (e) {
        return sendText(sock, jid, 'error: ' + e.message, m)
    }
}

handler.pluginName = 'tiktok downloader'
handler.command = ['tiktok','tt']
handler.category = ['downloader']
handler.meta = {
fileName: 'downloader-tiktok.js',
version: '2',
author: botInfo.an
}
export default handler