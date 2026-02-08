import axios from 'axios'
import { react } from '#helper'

/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */
async function handler({ sock, m, text, jid }) {
    if (!text)
        return await sock.sendMessage(
            jid,
            { text: `link youtubenya mana ${m.pushName}?` },
            { quoted: m }
        )

    if (!/youtu\.?be/.test(text))
        return await sock.sendMessage(
            jid,
            { text: 'itu bukan link youtube 😐' },
            { quoted: m }
        )

    await react(sock, m, '🕒')

    // fungsi ytdl (inline)
    const ytdl = async (url, type = 'audio') => {
        const res = await axios.get(
            'https://youtubedl.siputzx.my.id/download',
            {
                params: { url, type },
                headers: {
                    'accept': 'application/json, text/plain, */*',
                    'accept-language': 'ms-MY',
                    'cache-control': 'no-cache',
                    'origin': 'https://youdl.pages.dev',
                    'pragma': 'no-cache',
                    'referer': 'https://youdl.pages.dev/',
                    'user-agent':
                        'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/127.0.0.0 Mobile Safari/537.36'
                }
            }
        )

        if (res.data?.status === 'completed') {
            res.data.fileUrl =
                'https://youtubedl.siputzx.my.id' + res.data.fileUrl
            return res.data
        }

        // masih proses → polling
        await new Promise(r => setTimeout(r, 1500))
        return ytdl(url, type)
    }

    try {
        const data = await ytdl(text, 'audio')

        await sock.sendMessage(
            jid,
            {
                audio: { url: data.fileUrl },
                mimetype: 'audio/mpeg',
                contextInfo: {
                    externalAdReply: {
                        renderLargerThumbnail: true,
                        mediaType: 1,
                        thumbnailUrl: data.thumbnail,
                        title: data.title,
                        body: 'YouTube Audio'
                    }
                }
            },
            { quoted: m }
        )

        await react(sock, m, '✅')
    } catch (e) {
        console.error(e)
        await react(sock, m, '❌')
        await sock.sendMessage(
            jid,
            { text: 'gagal ngambil audio 😵‍💫' },
            { quoted: m }
        )
    }
}

handler.pluginName = 'youtube play 2'
handler.description = 'putar audio dari link youtube'
handler.command = ['ytmp3']
handler.category = ['downloader']

handler.meta = {
    fileName: 'downloader-ytmp3.js',
    version: '1.0.0',
    author: 'Kado',
    note: 'ytmp3'
}

export default handler