import { botInfo, textOnlyMessage } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, q, text, jid }) {
    if (!textOnlyMessage(m)) return
    if (text) return

    const rt = `\`\`\`MEMORY DETAIL\`\`\``

    const codex = Object.entries(process.memoryUsage()).map(v => {
        return {
            optionName: v[0] + " MB",
            optionVoteCount: (v[1] / (1024 * 1024)).toFixed(2)
        }
    })

    await sock.relayMessage(
        jid,
        {
            pollResultSnapshotMessage: {
                name: rt,
                pollVotes: codex
            }
        },
        {}
    )
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