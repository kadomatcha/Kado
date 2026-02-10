import { exec } from 'child_process'
import util from 'util'
import { pluginManager, userManager, botInfo, editText } from '#helper'

const run = util.promisify(exec)

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

    const sent = await sock.sendMessage(jid, { text: '🔄 checking update...' }, { quoted: m })

    await new Promise(r => setTimeout(r, 1000))

    try {
        // mulai load plugin
        await editText(sock, jid, sent, '📂 load plugins...')

        // jalankan loadPlugins & buildMenu
        await pluginManager.loadPlugins()
        pluginManager.buildMenu()

        
        await editText(sock, jid, sent, '📂 load plugins selesai!')

        // cek git
        const { stdout } = await run('git status --porcelain')

        if (!stdout.trim()) {
            return await editText(sock, jid, sent, '✅ plugin reload selesai\nrepo: tidak ada perubahan')
        }

        const changedLines = stdout
            .trim()
            .split('\n')
            .map(line => {
                const status = line.slice(0, 2).trim()
                const filePath = line.replace(/^[ MADRCU?]{1,2}\s+/, '').trim()
                return { status, filePath }
            })
            .filter(f => !shouldIgnore(f.filePath))

        if (!changedLines.length) {
            return await editText(sock, jid, sent, '✅ plugin reload selesai\nperubahan hanya pada file yang di-ignore')
        }

        const files = changedLines.map(f => `• [${f.status}] ${f.filePath}`).join('\n')

        // push ke repo
        await editText(sock, jid, sent, '⬆️ pushing changes to repo...')
        await run('git add .')
        await run(`git commit -m "auto update ${Date.now()}"`)
        await run('git push')

        await editText(sock, jid, sent,
`✅ plugin reload selesai

perubahan terdeteksi:
${files}

repo: berhasil di push`)
    } catch (e) {
        await editText(sock, jid, sent, '❌ error:\n' + e.message)
    }
}

handler.pluginName = 'reload & auto push'
handler.description = 'reload plugin dan push repo jika ada perubahan'
handler.command = ['r']
handler.category = ['developer']
handler.meta = {
    fileName: 'developer-reload.js',
    version: '1.3',
    author: botInfo.an
}

export default handler