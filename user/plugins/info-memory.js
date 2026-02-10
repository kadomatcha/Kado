import { botInfo, textOnlyMessage } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, q, text, jid }) {
    if (!textOnlyMessage(m)) return
    if (text) return

    const rt = `\`\`\`MEMORY DETAIL\`\`\``

    const codex = Object.entries(process.memoryUsage()).map(v => ({
        optionName: v[0] + " MB",
        optionVoteCount: Number((v[1] / (1024 * 1024)).toFixed(2))
    }))

    const content = {
        pollResultSnapshotMessage: {
            name: rt,
            pollVotes: codex,
            contextInfo: {
                forwardingScore: 127,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "173817930489991@lid",
                    serverMessageId: 0,
                    newsletterName: botInfo.sdn
                },
                forwardOrigin: 0
            },
            pollType: 0
        }
    }

    await sock.relayMessage(jid, content, {})
}

handler.pluginName = 'memory usage'
handler.description = 'cek memory usage node js'
handler.command = ['mem']
handler.category = ['info']
handler.meta = {
    fileName: 'info-memory.js',
    version: '1',
    author: botInfo.an,
    note: 'awawawa solid solid solid',
}

export default handler