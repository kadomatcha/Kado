import { pluginManager, sendText, sendFancyText, tag, botInfo, textOnlyMessage } from '#helper'

function formatUptime(sec) {
    sec = Number(sec)
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = Math.floor(sec % 60)
    return `${h}h ${m}m ${s}s`
}

function premiumHeader(m, prefix, command) {
    const uptime = formatUptime(process.uptime())

    return `╔══〔 ${botInfo.dn || 'bot'} 〕═══▧
╠  👤 𝐔𝐬𝐞𝐫 : ${tag(m.senderId)}
╠  🏮 𝐎𝐰𝐧𝐞𝐫 : ${botInfo.an || '-'}
╠  🧬 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : ${botInfo.v || '1.0'}
╠  🔮 𝐏𝐫𝐞𝐟𝐢𝐱 : [ ${prefix || '.'} ]
╠  🛠️ 𝐍𝐨𝐏𝐫𝐞𝐟𝐢𝐱 : 𝐎𝐧
╠  ⏳ 𝐔𝐩𝐭𝐢𝐦𝐞 : ${uptime}
╚═════════════▧`
}

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, q, text, jid, command, prefix }) {
    if (!textOnlyMessage(m)) return
    if (q) return

    const pc = `${prefix || ''}${command}`

    if (!text) {
        const header = premiumHeader(m, prefix, command)

        const categoryList = pluginManager.categoryArray
            .map(cat => ` │ ◈ menu ${cat}`)
            .join('\n')

        const footer =
`\n▧═════════════▧

𝐍𝐨𝐭𝐞:
𝐮𝐧𝐭𝐮𝐤 𝐦𝐞𝐦𝐛𝐮𝐤𝐚 𝐬𝐞𝐦𝐮𝐚 𝐟𝐢𝐭𝐮𝐫
𝐊𝐞𝐭𝐢𝐤: \`allmenu\` atau \`${pc} all\``

        const print =
`${header}

▧─『 𝐊𝐀𝐓𝐄𝐆𝐎𝐑𝐈 𝐌𝐄𝐍𝐔 』─▧
${categoryList}
▧═════════════▧${footer}`

        return await sendFancyText(sock, jid, {
            text: print,
            title: botInfo.dn,
            body: botInfo.st,
            thumbnailUrlOrBuffer: botInfo.tm
        })
    }

    if (text === 'all') {
        const header = premiumHeader(m, prefix, command)

        const content = pluginManager.forMenu.menuAllText

        const print =
`${header}

▧─『 𝐒𝐄𝐌𝐔𝐀 𝐌𝐄𝐍𝐔 』─▧
${content}
▧═════════════▧`

        return await sendFancyText(sock, jid, {
            text: print,
            title: botInfo.dn,
            body: botInfo.st,
            thumbnailUrlOrBuffer: botInfo.tm
        })
    }

    const validCategory = pluginManager.forMenu.category.get(text)

    if (!validCategory) {
        return sendText(
            sock,
            jid,
            `kategori *${text}* tidak ditemukan.`
        )
    }

    const header = premiumHeader(m, prefix, command)

    const print =
`${header}

▧─『 𝐌𝐄𝐍𝐔 ${text.toUpperCase()} 』─▧
${validCategory}
▧═════════════▧

ketik *${pc}* untuk kembali ke menu utama.`

    return await sendFancyText(sock, jid, {
        text: print,
        title: botInfo.dn,
        body: botInfo.st,
        thumbnailUrlOrBuffer: botInfo.tm
    })
}

handler.pluginName = 'menu'
handler.description = 'kntl'
handler.command = ['unem']
handler.category = ['main']

handler.meta = {
    fileName: 'developer-unem.js',
    version: '3.0',
    author: botInfo.an
}

export default handler