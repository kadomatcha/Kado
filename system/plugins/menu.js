import { pluginManager, sendText, sendFancyText, tag, pickRandom, botInfo, textOnlyMessage } from '../helper.js'

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, q, text, jid, command, prefix }) {
    if (!textOnlyMessage(m)) return
    if (q) return

    const pc = `${prefix || ''}${command}`

    if (!text) {
        const header = `halo ${tag(m.senderId)} 👋

ini adalah daftar menu yang tersedia.
silakan pilih kategori yang ingin kamu buka.\n\n`

        const content = pluginManager.forMenu.menuText
        const sampleCommand = `${pc} ${pickRandom(pluginManager.categoryArray)}`
        const footer = `\n\nketik *${sampleCommand}* untuk membuka menu kategori.`

        const print = header + content + footer

        return await sendFancyText(sock, jid, {
            text: print,
            title: botInfo.dn,
            body: botInfo.st,
            thumbnailUrlOrBuffer: botInfo.tm
        })
    }

    if (text === 'all') {
        const content = pluginManager.forMenu.menuAllText
        const sampleCommand = pickRandom(
            pluginManager.mapCatWithCmdArray.get(
                pickRandom(pluginManager.categoryArray)
            )
        ).cmd

        const _prefix = pluginManager.plugins.get(sampleCommand).config?.bypassPrefix
            ? ''
            : prefix || ''

        const example = `${_prefix}${sampleCommand}`

        const footer =
            `\n\ngunakan parameter *-h* untuk melihat detail perintah.` +
            `\ncontoh: *${example} -h*`

        return await sendFancyText(sock, jid, {
            text: content + footer,
            title: botInfo.dn,
            body: botInfo.st,
            renderLargerThumbnail: false,
            thumbnailUrlOrBuffer: botInfo.tm
        })
    }

    const validCategory = pluginManager.forMenu.category.get(text)
    if (!validCategory) {
        return sendText(
            sock,
            jid,
            `maaf ${tag(m.senderId)}, kategori *${text}* tidak ditemukan.`
        )
    }

    const sampleCommand = pickRandom(
        pluginManager.mapCatWithCmdArray.get(text)
    ).cmd

    const _prefix = pluginManager.plugins.get(sampleCommand).config?.bypassPrefix
        ? ''
        : prefix || ''

    const example = `${_prefix}${sampleCommand}`

    const footer =
        `\n\ngunakan *-h* untuk melihat fungsi perintah.` +
        `\ncontoh: *${example} -h*`

    const print = `${validCategory}${footer}`

    return await sendFancyText(sock, jid, {
        text: print,
        title: botInfo.sdn,
        body: botInfo.sst,
        renderLargerThumbnail: false,
        thumbnailUrlOrBuffer: botInfo.stm
    })
}

handler.pluginName = 'menu'
handler.description =
    'menampilkan daftar menu dan kategori.\n' +
    'contoh penggunaan:\n' +
    'menu\n' +
    'menu <kategori>\n' +
    'menu all'

handler.command = ['menu']
handler.category = ['main']

handler.config = {
    systemPlugin: true
}

handler.meta = {
    fileName: 'menu.js',
    version: '1',
    author: botInfo.an,
    note: 'clean & simple',
}

export default handler