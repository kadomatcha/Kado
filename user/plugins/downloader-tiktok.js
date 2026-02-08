import axios from 'axios'
import {
    textOnlyMessage,
    sendText,
    sendVideo,
    sendImage,
    sendFancyMp3
} from '#helper'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid, q }) {
    if (!textOnlyMessage(m)) return

    // ambil link dari reply ATAU dari text biasa
    const url =
        q?.message?.conversation ||
        q?.message?.extendedTextMessage?.text ||
        m.text?.split(' ').slice(1).join(' ')?.trim()

    if (!url) {
        return sendText(
            sock,
            jid,
            'masukin link tiktok\ncontoh:\ntiktok https://vt.tiktok.com/xxxx',
            m
        )
    }

    if (!/(tiktok\.com|vt\.tiktok\.com)/i.test(url)) {
        return sendText(sock, jid, 'itu bukan link tiktok', m)
    }

    try {
        const { data } = await axios.get(
            `https://api.deline.web.id/downloader/tiktok?url=${encodeURIComponent(url)}`
        )

        if (!data?.status || !data?.result) {
            return sendText(sock, jid, 'gagal ambil data tiktok', m)
        }

        const res = data.result
        const caption = `${res.title || ''}\n\n@${res.author?.unique_id || '-'}`

        if (res.type === 'video' && res.download) {
            await sendVideo(sock, jid, res.download, caption, m)
        } else if (res.type === 'image' && res.download) {
            if (Array.isArray(res.download)) {
                for (const img of res.download) {
                    await sendImage(sock, jid, img, caption, m)
                }
            } else {
                await sendImage(sock, jid, res.download, caption, m)
            }
        }

        if (res.music) {
            await sendFancyMp3(
                sock,
                jid,
                res.music,
                res.title || 'TikTok Audio',
                `@${res.author?.unique_id || '-'}`,
                res.author?.avatar || '',
                false,
                m
            )
        }

    } catch (e) {
        return sendText(sock, jid, `error: ${e.message}`, m)
    }
}

handler.pluginName = 'tiktok downloader'
handler.command = ['tt']
handler.category = ['downloader']

handler.meta = {
    fileName: 'downloader-tiktok.js',
    version: '1.1.1',
    author: 'Ky',
    note: 'download video or image from tiktok'
}

export default handler