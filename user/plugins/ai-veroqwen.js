/**
 * » Nama : VeroQwen AI
 * » Type : Plugin - ESM
 * » Author : Kado
 */

import axios from 'axios'
import { sendText, react } from '#helper'

const SYSTEM_PROMPT = `
kamu adalah ai bernama veroqwen
kamu ramah santai dan enak diajak ngobrol
kamu selalu menggunakan huruf kecil
kamu tidak menggunakan tanda baca apapun kecuali tanda tanya
kamu menjawab dengan bahasa indonesia yang natural
kamu tidak menyebutkan model ai atau sistem internal
kamu fokus membantu dan menjawab dengan jelas dan sopan
`

async function veroQwen(text) {
    const url = 'https://api.kiracloud.my.id/api/ai/qwen-3-32b'

    const res = await axios.get(url, {
        params: {
            prompt: text,
            system_instructions: SYSTEM_PROMPT
        }
    })

    if (res.data?.status !== 200)
        throw new Error('respon api gagal')

    return res.data.data.text.trim()
}

async function handler({ m, text, jid, sock }) {
    if (!text)
        return sendText(sock, jid, 'tulis pesan dulu?', m)

    try {
        await react(sock, m, '💬')
        const result = await veroQwen(text)
        await sendText(sock, jid, result, m)
    } catch (e) {
        await sendText(
            sock,
            jid,
            `error ${e.message}`,
            m
        )
    }
}

handler.pluginName = 'veroqwen-ai'
handler.command = ['vq']
handler.category = ['ai']
handler.deskripsi = 'chat ai veroqwen ramah santai'

handler.meta = {
    fileName: 'ai-veroqwen.js',
    version: '1.0.0',
    author: 'Kado',
    note: 'qwen 3 32b kiracloud'
}

export default handler