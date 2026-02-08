/**
 * » Nama : Gemini AI (KiraCloud)
 * » Type : Plugin - ESM
 * » Author : Ky (adapted)
 */

import axios from 'axios'
import { sendText, react } from '#helper'

async function geminiAI(prompt) {
    const { data } = await axios.get(
        'https://api.kiracloud.my.id/api/ai/aichat',
        {
            params: {
                prompt,
                model: 'gemini'
            },
            timeout: 30_000
        }
    )

    if (data.status !== 200)
        throw new Error('respon api gagal')

    return data.data
}

async function handler({ m, text, jid, sock }) {
    if (!text)
        return sendText(
            sock,
            jid,
            'masukkan teks',
            m
        )

    if (text.includes('~'))
        return sendText(
            sock,
            jid,
            'karakter ~ tidak diperbolehkan',
            m
        )

    try {
        await react(sock, m, '🤖')

        const result = await geminiAI(text)
        await sendText(sock, jid, result, m)

    } catch (e) {
        await sendText(
            sock,
            jid,
            `terjadi kesalahan: ${e.message}`,
            m
        )
    }
}

handler.pluginName = 'gemini-ai'
handler.command = ['gemini']
handler.category = ['ai']
handler.deskripsi = 'chat ai Gemini (KiraCloud API)'

handler.meta = {
    fileName: 'ai-gemini.js',
    version: '1.0.0',
    author: 'Ky',
    note: 'stateless api'
}

export default handler