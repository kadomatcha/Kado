import axios from 'axios'
import { textOnlyMessage, sendText } from '#helper'

function extractPasteId(url = '') {
    const match = url.match(/pastebin\.com\/([A-Za-z0-9]+)/)
    return match ? match[1] : null
}

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid }) {
    if (!textOnlyMessage(m)) return

    const url = m.text.split(' ').slice(1).join(' ').trim()
    if (!url) {
        return sendText(sock, jid, 'contoh:\ngetpastebin https://pastebin.com/xxxx', m)
    }

    const id = extractPasteId(url)
    if (!id) {
        return sendText(sock, jid, 'link pastebin tidak valid', m)
    }

    try {
        const rawUrl = `https://pastebin.com/raw/${id}`
        const { data } = await axios.get(rawUrl)

        if (!data) {
            return sendText(sock, jid, 'paste kosong atau tidak ditemukan', m)
        }

      
            await sendText(sock, jid, data, m)
      

    } catch (e) {
        return sendText(sock, jid, 'gagal ambil paste\n' + e.message, m)
    }
}

handler.pluginName = 'get pastebin'
handler.command = ['getpastebin']
handler.category = ['tools']

handler.meta = {
    fileName: 'tools-getpastebin.js',
    version: '1.0.0',
    author: 'Kado',
    note: 'ambil isi pastebin'
}

export default handler