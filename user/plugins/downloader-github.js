import { sendText, tag, botInfo } from '#helper'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import util from 'util'
import archiver from 'archiver'

const execPromise = util.promisify(exec)

async function handler({ sock, m, jid, text }) {
  if (!text) return sendText(sock, jid, 'mana url / repo nya', m)

  let repoInput = text.trim()

  // 🔹 auto github url
  if (!repoInput.startsWith('http')) {
    repoInput = `https://github.com/${repoInput}`
  }

  const repoUrl = repoInput
  const tmpFolder = path.join(process.cwd(), 'user/temp')

  const repoName = repoUrl
    .replace(/\/$/, '')
    .split('/')
    .pop()
    .replace(/\.git$/, '')

  const repoPath = path.join(tmpFolder, repoName)
  const zipPath = path.join(tmpFolder, `${repoName}.zip`)

  try {
    if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder, { recursive: true })

    await sendText(sock, jid, `⏳ clone repo **${repoName}**...`, m)

    // clone repo
    await execPromise(`git clone --depth=1 ${repoUrl} "${repoPath}"`)

    // zip folder
    await new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath)
      const archive = archiver('zip', { zlib: { level: 9 } })

      archive.pipe(output)
      archive.directory(repoPath, false)
      archive.finalize()

      output.on('close', resolve)
      archive.on('error', reject)
    })

    // kirim ke user
    await sock.sendMessage(
      jid,
      {
        document: fs.readFileSync(zipPath),
        fileName: `${repoName}.zip`,
        mimetype: 'application/zip'
      },
      { quoted: m }
    )

    // cleanup
    fs.rmSync(repoPath, { recursive: true, force: true })
    fs.rmSync(zipPath, { force: true })

    await sendText(
      sock,
      jid,
      `✅ repo **${repoName}** berhasil dikirim\nkak ${tag(m.senderId)} silahkan di rombak 😋`,
      m
    )

  } catch (err) {
    console.error(err)
    await sendText(sock, jid, `❌ error: ${err.message}`, m)
  }
}

handler.pluginName = 'get github repo clone'
handler.command = ['gitclone']
handler.category = ['downloader']
handler.deskripsi = 'Clone repository GitHub dan kirim ZIP ke user'
handler.meta = {
  fileName: 'downloader-github.js',
  version: '1.1',
  author: botInfo.an,
  note: 'auto github url'
}

export default handler