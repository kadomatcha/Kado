import { reply } from '#simple'
import { userManager } from '#helper'
import { downloadMediaMessage } from 'baileys'

function extractCode(text = "") {
    // ambil isi ``` ``` kalau ada
    const block = text.match(/```(?:js)?\n?([\s\S]*?)```/i)
    if (block) return block[1].trim()

    // hapus komentar baris yang diawali //
    const lines = text.split('\n')
        .filter(line => !line.trim().startsWith('//'))

    return lines.join('\n').trim()
}

/** @param {import('..//type/plugin.js').HandlerParams} */
async function handler({ sock, jid, text, m, q }) {
    if (!userManager.trustedJids.has(m.senderId)) return
    if (!q) return await reply(sock, m, `reply ke pesan berisi kode`)

    let raw = ""

    // media
    if (q.message?.documentMessage || q.message?.imageMessage || q.message?.videoMessage) {
        const buffer = await downloadMediaMessage(q, "buffer")
        raw = buffer.toString()
    }
    // teks
    else if (q.text) {
        raw = q.text
    }

    if (!raw) return reply(sock, m, "tidak ada kode yang bisa dijalankan")

    const code = extractCode(raw)
    if (!code) return reply(sock, m, "kode tidak ditemukan")

    try {
        await eval(`(async() => {
            ${code}
        })()`)
    } catch (e) {
        reply(sock, m, String(e))
    }
}

handler.pluginName = 'execute js code'
handler.command = ['run']
handler.category = ['developer']
handler.description = 'execute kode js'
handler.meta = {
    fileName: 'developer-run.js',
    version: '1.2.0',
    author: 'Kado',
    note: ''
}

export default handler