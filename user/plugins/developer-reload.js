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

const delay = ms => new Promise(r => setTimeout(r, ms))

function mapStatus(raw) {
    if (raw.includes('M')) return 'Update'
    if (raw.includes('A') || raw === '??') return 'Add'
    if (raw.includes('D')) return 'Delete'
    if (raw.includes('R')) return 'Rename'
    return raw || 'Unknown'
}

async function progressBar(sock, jid, sent) {
    const steps = 10
    for (let i = 1; i <= steps; i++) {
        const filled = '█'.repeat(i)
        const empty = '░'.repeat(steps - i)
        const percent = i * 10

        await editText(sock, jid, sent,
`📂 load plugins... ✅

🔎 scanning system
[${filled}${empty}] ${percent}%`)

        await delay(900)
    }

    await editText(sock, jid, sent,
`📂 load plugins... ✅
🔎 scanning system... selesai ✅`)
}

async function handler({ sock, m, jid }) {
    if (!userManager.trustedJids.has(m.senderId)) return

    const sent = await sock.sendMessage(jid, { text: '🔄 checking update...' }, { quoted: m })

    await delay(1500)

    try {
        await editText(sock, jid, sent, '📂 load plugins...')
        await delay(1500)

        await pluginManager.loadPlugins()
        pluginManager.buildMenu()

        await progressBar(sock, jid, sent)

        const { stdout } = await run('git status --porcelain')

        if (!stdout.trim()) {
            return await editText(sock, jid, sent,
`📂 load plugins... ✅
🔎 scanning system... selesai ✅

✅ plugin reload selesai
repo: tidak ada perubahan`)
        }

        const changedLines = stdout
            .trim()
            .split('\n')
            .map(line => {
                const rawStatus = line.slice(0, 2).trim()
                const filePath = line.replace(/^[ MADRCU?]{1,2}\s+/, '').trim()
                return { status: mapStatus(rawStatus), filePath }
            })
            .filter(f => !shouldIgnore(f.filePath))

        if (!changedLines.length) {
            return await editText(sock, jid, sent,
`📂 load plugins... ✅
🔎 scanning system... selesai ✅

✅ plugin reload selesai`)
        }

        const files = changedLines
            .map(f => `• [${f.status}] ${f.filePath}`)
            .join('\n')

        await editText(sock, jid, sent,
`📂 load plugins... ✅
🔎 scanning system... selesai ✅

⬆️ pushing changes to repo...`)
        await delay(1500)

        await run('git add .')
        await run(`git commit -m "auto update ${Date.now()}"`)
        await run('git push')

        await editText(sock, jid, sent,
`📂 load plugins... ✅

✅ plugin reload selesai

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
    version: '1.7',
    author: botInfo.an
}

export default handler