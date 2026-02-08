import axios from 'axios'
import CryptoJS from 'crypto-js'
import { sendText } from '#helper'

const mega = {
  decryptAttr: (enc, fileKey) => {
    try {
      const ab = (s) =>
        Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64')

      const kResult = ab(fileKey)

      const k = new Uint32Array(kResult.buffer)
      const key = new Uint32Array([
        k[0] ^ k[4],
        k[1] ^ k[5],
        k[2] ^ k[6],
        k[3] ^ k[7]
      ])

      const keyWA = CryptoJS.lib.WordArray.create(new Uint8Array(key.buffer))
      const ivWA = CryptoJS.lib.WordArray.create(new Uint8Array(16))
      const cipherWA = CryptoJS.lib.WordArray.create(ab(enc))

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: cipherWA },
        keyWA,
        { iv: ivWA, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
      )

      const str = CryptoJS.enc.Utf8.stringify(decrypted)
      const startIdx = str.indexOf('{"n"')
      const endIdx = str.lastIndexOf('}')

      if (startIdx === -1) throw new Error('Format JSON tidak ditemukan')

      return JSON.parse(str.substring(startIdx, endIdx + 1))
    } catch (e) {
      return { n: '[Decryption Error]' }
    }
  },

  fetch: async (url) => {
    try {
      const fileId = url.match(/file\/([a-zA-Z0-9_-]+)/)?.[1]
      const fileKey = url.split('#')[1]

      if (!fileId || !fileKey) throw new Error('URL Mega tidak valid')

      const { data } = await axios.post(
        'https://g.api.mega.co.nz/cs',
        [{ a: 'g', g: 1, p: fileId }],
        {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000
        }
      )

      if (!data || data[0] === -1 || typeof data[0] === 'number') {
        throw new Error(`Mega Server Error`)
      }

      const info = data[0]
      const attr = mega.decryptAttr(info.at, fileKey)

      return {
        status: true,
        creator: 'KadoZxzx',
        data: {
          filename: attr.n || 'file.bin',
          size: info.s,
          size_formatted: (info.s / (1024 * 1024)).toFixed(2) + ' MB',
          download_url: info.g
        }
      }
    } catch (err) {
      return { status: false, creator: 'KadoZxzx', message: err.message }
    }
  }
}

async function handler({ sock, jid, m, text }) {
  if (!text) {
    return sendText(sock, jid, 'kirim link mega\ncontoh: .mega https://mega.nz/file/xxxx', m)
  }

  const res = await mega.fetch(text)

  if (!res.status) {
    return sendText(sock, jid, `error: ${res.message}`, m)
  }

  const { filename, size_formatted, download_url } = res.data

  // info dulu biar user tau
  await sendText(
    sock,
    jid,
    `📥 *Mengirim File...*\n\n📁 ${filename}\n📦 ${size_formatted}`,
    m
  )

  // kirim dokumen langsung
  await sock.sendMessage(
    jid,
    {
      document: { url: download_url },
      fileName: filename,
      mimetype: 'application/octet-stream'
    },
    { quoted: m }
  )
}

handler.pluginName = 'mega downloader'
handler.command = ['mega']
handler.category = ['downloader']
handler.meta = {
  fileName: 'downloader-mega.js',
  version: '1.1.0',
  author: 'KadoZxzx',
  note: 'mega.nz downloader send document'
}

export default handler