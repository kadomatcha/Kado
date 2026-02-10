import fetch from 'node-fetch'
import { sendText, textOnlyMessage } from '#helper'

function toRaw(url) {
    if (url.includes('raw.githubusercontent.com')) return url

    const match = url.match(/gist\.github\.com\/([^\/]+)\/([a-f0-9]+)/i)
    if (match) {
        return `https://gist.githubusercontent.com/${match[1]}/${match[2]}/raw`
    }

    return url
}

/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */
async function handler({ sock, m, text, jid }) {
    if (!textOnlyMessage(m)) return
    if (!text) return sendText(sock, jid, 'contoh:\n.getgist url [-d]', m)

    try {
        const args = text.trim().split(/\s+/)
        const urlInput = args[0]
        const sendDoc = args.includes('-d')

        const rawUrl = toRaw(urlInput)

        const res = await fetch(rawUrl)
        if (!res.ok) {
            return sendText(sock, jid, 'gagal mengambil file', m)
        }
       const sk = 'scrape' + Date.now()
        const data = await res.text()

        if (sendDoc) {
            await sock.sendMessage(jid, {
                document: Buffer.from(data),
                fileName: `${sk}.js`,
                mimetype: 'application/javascript'
            }, { quoted: m })
            return
        }

       await sendText(sock, jid, data, m)

    } catch (e) {
        return sendText(sock, jid, 'error: ' + e.message, m)
    }
}

handler.pluginName = 'get gist'
handler.description = 'ambil isi raw / gist'
handler.command = ['getgist']
handler.category = ['tools']

handler.meta = {
    fileName: 'tools-getgist.js',
    version: '1.2',
    author: 'Kado',
    note: 'grw'
}

export default handler