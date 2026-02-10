import { sendText, pluginManager } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, text, jid, prefix, command }) {

    if (!text) {
        return await sendText(
            sock,
            jid,
            `gunakan:\n${prefix || ''}${command} <nama command>\ncontoh:\n${prefix || ''}${command} ping`
        )
    }

    const query = text.trim().toLowerCase()

    // cari plugin dari map
    let foundPlugin = null
    let foundCmd = null

    for (const [cmd, plugin] of pluginManager.plugins.entries()) {
        if (cmd === query) {
            foundPlugin = plugin
            foundCmd = cmd
            break
        }
    }

    if (!foundPlugin) {
        return await sendText(
            sock,
            jid,
            `command *${query}* tidak ditemukan.\nlihat daftar command di menu.`
        )
    }

    const cmdName = foundPlugin.command?.join('\n- ') || '-'
    const desc = foundPlugin.description || 'tidak ada deskripsi'
    const cat = foundPlugin.category?.join(', ') || 'umum'

    let access = []
    if (foundPlugin.onlyOwner) access.push('khusus owner')
    if (foundPlugin.onlyGroup) access.push('hanya grup')
    if (foundPlugin.onlyPrivate) access.push('hanya private')

    const accessText = access.length ? access.join(' & ') : 'bisa semua orang'

    const print =
`BANTUAN COMMAND: \`${foundCmd}\`

\`Nama command:\`
- ${cmdName}

\`\`\`
Kategori : ${cat}
Akses    : ${accessText}
\`\`\`

\`Deskripsi:\`
${desc}`

    await sendText(sock, jid, print, m)
}

handler.pluginName = 'help'
handler.description = 'menampilkan informasi detail tentang sebuah command'
handler.command = ['help']
handler.category = ['tools']

handler.meta = {
    fileName: 'tools-help.js',
    version: '1.0.0',
    author: 'Kado',
}

export default handler