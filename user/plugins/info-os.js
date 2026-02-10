import os from 'os'
import axios from 'axios'
import { exec } from 'child_process'
import util from 'util'
import { botInfo } from '#helper'

const run = util.promisify(exec)

function formatUptime(sec) {
    sec = Number(sec)
    const d = Math.floor(sec / 86400)
    const h = Math.floor(sec % 86400 / 3600)
    const m = Math.floor(sec % 3600 / 60)
    const s = Math.floor(sec % 60)
    return `${d}h ${h}j ${m}m ${s}d`
}

function formatBytes(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB'
}

async function getDisk() {
    try {
        const { stdout } = await run("df -h / | tail -1")
        const parts = stdout.trim().split(/\s+/)
        return {
            total: parts[1],
            used: parts[2],
            free: parts[3],
            percent: parts[4]
        }
    } catch {
        return null
    }
}

async function getGit() {
    try {
        const { stdout } = await run("git rev-parse --abbrev-ref HEAD")
        return stdout.trim()
    } catch {
        return "-"
    }
}

async function handler({ sock, m, jid }) {
    const start = Date.now()

    try {
        const cpu = os.cpus()[0]
        const totalRam = os.totalmem()
        const freeRam = os.freemem()
        const usedRam = totalRam - freeRam
        const botMem = process.memoryUsage()

        const disk = await getDisk()
        const gitBranch = await getGit()

        let net = {}
        try {
            const { data } = await axios.get('http://ip-api.com/json/')
            net = data
        } catch {}

        const latency = Date.now() - start

        const text =
`📊 DETAIL RESOURCE SERVER & NETWORK
━━━━━━━━━━━━━━━━━━━━━━━━

🌐 NETWORK & ISP
> ISP: ${net.isp || '-'}
> Org: ${net.org || '-'}
> IP: ${net.query || '-'}
> Location: ${net.city || '-'}, ${net.country || '-'}
> ASN: ${net.as || '-'}

💻 HARDWARE & OS
> Platform: ${os.platform()} (${os.arch()})
> Hostname: ${os.hostname()}
> CPU: ${cpu.model}
> Core: ${os.cpus().length}
> Load Avg: ${os.loadavg()[0].toFixed(2)}
> Node.js: ${process.version}

🧠 MEMORY
> Total: ${formatBytes(totalRam)}
> Used: ${formatBytes(usedRam)}
> Free: ${formatBytes(freeRam)}
> Bot RSS: ${formatBytes(botMem.rss)}
> Heap Used: ${formatBytes(botMem.heapUsed)}

💾 STORAGE
${disk ? 
`> Total: ${disk.total}
> Used: ${disk.used}
> Free: ${disk.free}
> Usage: ${disk.percent}` 
: '> Tidak terdeteksi'}

⚙️ SERVICE
> Server Uptime: ${formatUptime(os.uptime())}
> Bot Uptime: ${formatUptime(process.uptime())}
> Git Branch: ${gitBranch}
> Speed: ${latency} ms
> Time: ${new Date().toLocaleString('id-ID')}

━━━━━━━━━━━━━━━━━━━━━━━━
${botInfo.sdn || 'acodex'} 🚀`

        await sock.sendMessage(jid, { text }, { quoted: m })

    } catch (e) {
        await sock.sendMessage(jid, { text: 'error:\n' + e.message }, { quoted: m })
    }
}

handler.command = ['os']
handler.category = ['info']
handler.description = 'panel resource server premium'
handler.pluginName = 'os'
handler.meta = {
fileName: 'info-os.js',
version: '1',
author: botInfo.an
}

export default handler