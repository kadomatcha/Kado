import DoronimeScraper from '../scrape/doronime.js'
import {
    textOnlyMessage,
    sendText,
    sendImage
} from '#helper'

async function handler({ sock, m, jid, q }) {
    if (!textOnlyMessage(m)) return

    const query =
        q?.message?.conversation ||
        q?.message?.extendedTextMessage?.text ||
        m.text?.split(' ').slice(1).join(' ')?.trim()

    if (!query) {
        return sendText(sock, jid, 'contoh:\nanime naruto', m)
    }

    try {
        const scraper = new DoronimeScraper()
        const results = await scraper.search(query)

        if (!results.length) {
            return sendText(sock, jid, 'anime tidak ditemukan', m)
        }

        const first = results[0]
        const details = await scraper.getDetails(first.url)

        const caption =
`judul: ${details.title}
jepang: ${details.japaneseTitle || '-'}
episode: ${details.episodes.length}
status: ${details.info.status || '-'}
genre: ${details.info.genre || '-'}

sinopsis:
${details.synopsis || '-'}`

        await sendImage(sock, jid, details.image, caption, m)

    } catch (e) {
        return sendText(sock, jid, `error: ${e.message}`, m)
    }
}

handler.pluginName = 'anime search'
handler.command = ['anime']
handler.category = ['search']
handler.description = 'gatau males mw beli truck'
handler.meta = {
    fileName: 'search-anime.js',
    version: '1.0.0',
    author: 'Kado',
    note: 'search anime doronime'
}

export default handler
