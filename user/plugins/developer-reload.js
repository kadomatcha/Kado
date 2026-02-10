import { exec } from 'child_process'
import util from 'util'
import { pluginManager, userManager, botInfo } from '#helper'

const run = util.promisify(exec)

// folder/file yang tidak mau ditampilkan atau di-commit
const ignoreList = [
    'auth/',
    'node_modules/',
    'tmp/',
    'session/',
    'message-store.json'
]

function shouldIgnore(filePath) {
    return ignoreList.some(i => filePath.startsWith(i) || filePath.includes(i))
}

async function handler({ sock, m, jid }) {
    if (!userManager.trustedJids.has(m.senderId)) return

    try {
        // reload plugin
        await pluginManager.loadPlugins()
        pluginManager.buildMenu()

        const { stdout } = await run('git status --porcelain')

        if (!stdout.trim()) {
            return await sock.sendMessage(jid, {
                text: 'plugin reload selesai\nrepo: tidak ada perubahan'
            }, { quoted: m })
        }

        // parsing + filter
        const changedLines = stdout
            .trim()
            .split('\n')
            .map(line => {
                const status = line.slice(0, 2).trim()
                const filePath = line.slice(3).trim()
                return { status, filePath }
            })
            .filter(f => !shouldIgnore(f.filePath))

        if (!changedLines.length) {
            return await sock.sendMessage(jid, {
                text: 'plugin reload selesai\nperubahan hanya pada file yang di-ignore'
            }, { quoted: m })
        }

        const files = changedLines
            .map(f => `• [${f.status}] ${f.filePath}`)
            .join('\n')

        // commit hanya file yang tidak di-ignore
        await run('git add .')
        await run(`git commit -m "auto update ${Date.now()}"`)
        await run('git push')

        const msg =
`plugin reload selesai

perubahan terdeteksi:
${files}

repo: berhasil di push`

        await sock.sendMessage(jid, { text: msg }, { quoted: m })

    } catch (e) {
        await sock.sendMessage(jid, {
            text: 'error:\n' + e.message
        }, { quoted: m })
    }
}

handler.pluginName = 'reload & auto push'
handler.description = 'reload plugin dan push repo jika ada perubahan'
handler.command = ['r']
handler.category = ['developer']
handler.meta = {
    fileName: 'developer-reload.js',
    version: '1.2',
    author: botInfo.an
}

export default handler