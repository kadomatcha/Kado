import fs from 'fs'
import path from 'path'
import { sendText, userManager } from '#helper'

const DIR = './user/scrape'

if (!fs.existsSync(DIR)) {
  fs.mkdirSync(DIR, { recursive: true })
}

async function handler({ m, q, text, jid, sock }) {

  if (!userManager.trustedJids.has(m.senderId)) return

  if (!text) {
    return sendText(sock, jid,
`format:
scrape -add namafile.js
scrape -list
scrape -del namafile.js
scrape -get 1
scrape -get namafile.js`, m)
  }

  const args = text.trim().split(/\s+/)
  const cmd = args[0]
  const name = args[1]

  try {

    // LIST
    if (cmd === '-list') {
      const files = fs.readdirSync(DIR).filter(v => v.endsWith('.js'))

      if (!files.length) {
        return sendText(sock, jid, 'tidak ada file scrape', m)
      }

      const list = files.map((v,i)=>`${i+1}. ${v}`).join('\n')
      return sendText(sock, jid, `daftar file:\n\n${list}`, m)
    }

// ADD
if (cmd === '-add') {
  if (!name) return sendText(sock, jid, 'masukan nama file', m)

  if (!q) {
    return sendText(sock, jid, 'reply code yang mau disimpan', m)
  }

  const filePath = path.join(DIR, name)

  if (fs.existsSync(filePath)) {
    return sendText(sock, jid, 'file sudah ada', m)
  }

 
  const code = q.text

  if (!code) {
    return sendText(sock, jid, 'reply harus berisi text/code', m)
  }

  fs.writeFileSync(filePath, code)

  return sendText(sock, jid, `berhasil simpan ${name}`, m)
}
    // DELETE
    if (cmd === '-del') {
      if (!name) return sendText(sock, jid, 'masukan nama file', m)

      const filePath = path.join(DIR, name)

      if (!fs.existsSync(filePath)) {
        return sendText(sock, jid, 'file tidak ditemukan', m)
      }

      fs.unlinkSync(filePath)
      return sendText(sock, jid, `berhasil hapus ${name}`, m)
    }

    // GET
    if (cmd === '-get') {
      if (!name) return sendText(sock, jid, 'masukan nomor atau nama file', m)

      const files = fs.readdirSync(DIR).filter(v => v.endsWith('.js'))

      let fileName = name

      // kalau angka → ambil dari list
      if (!isNaN(name)) {
        const index = parseInt(name) - 1
        if (!files[index]) {
          return sendText(sock, jid, 'nomor tidak valid', m)
        }
        fileName = files[index]
      }

      const filePath = path.join(DIR, fileName)

      if (!fs.existsSync(filePath)) {
        return sendText(sock, jid, 'file tidak ditemukan', m)
      }

      const content = fs.readFileSync(filePath, 'utf8')

      // kirim full tanpa potong
      await sock.sendMessage(jid, {
        document: Buffer.from(content),
        mimetype: 'text/javascript',
        fileName: fileName
      }, { quoted: m })

      return
    }

    return sendText(sock, jid, 'command tidak dikenal', m)

  } catch (e) {
    return sendText(sock, jid, String(e), m)
  }
}

handler.pluginName = 'scrape manager'
handler.command = ['scrape']
handler.category = ['developer']

handler.meta = {
  fileName: 'developer-scrape.js',
  version: '1.1.0',
  author: 'Kado'
}

export default handler