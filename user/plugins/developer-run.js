import { reply } from '#simple'
import { userManager } from '#helper'
import { downloadMediaMessage } from 'baileys'

function extractCode(text = "") {
    const block = text.match(/```(?:js)?\n?([\s\S]*?)```/i)
    if (block) return block[1].trim()

    const lines = text
        .split('\n')
        .filter(line => !line.trim().startsWith('//'))

    return lines.join('\n').trim()
}

/** @param {import('..//type/plugin.js').HandlerParams} */
async function handler({ sock, jid, text, m, q }) {
    if (!userManager.trustedJids.has(m.senderId)) return
    if (!q) return reply(sock, m, 'reply ke pesan berisi kode')

    let raw = ""

    // ambil teks dari berbagai kemungkinan
    raw =
        q.text ||
        q.message?.conversation ||
        q.message?.extendedTextMessage?.text ||
        q.message?.imageMessage?.caption ||
        q.message?.videoMessage?.caption ||
        q.message?.documentMessage?.caption ||
        ""

    // fallback: kalau memang file txt / js dikirim sebagai dokumen
    if (!raw && q.message?.documentMessage) {
        try {
            const buffer = await downloadMediaMessage(q, "buffer")
            raw = buffer.toString()
        } catch {}
    }

    if (!raw) return reply(sock, m, "tidak ada kode yang bisa dijalankan")

    const code = extractCode(raw)
    if (!code) return reply(sock, m, "kode tidak ditemukan")

    try {
        await eval(`(async () => {
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
    version: '1.3.0',
    author: 'Kado'
}

export default handler