import axios from 'axios'
import fs from 'fs'
import { getBuff, sendText, react, botInfo, userManager } from '#helper'
import { tmpdir } from 'os'
import { join } from 'path'

async function handler({ m, jid, sock, q }) {

if (!userManager.trustedJids.has(m.senderId)) return
  const target = q || m
  const msg = target.message

  if (!msg?.imageMessage)
    return sendText(sock, jid, 'reply gambar', m)

  try {
    await react(sock, m, '🕒')

    // ambil buffer media
    const buffer = await getBuff(target)
    if (!buffer) {
      await react(sock, m, '❌')
      return sendText(sock, jid, 'Gagal mengambil gambar', m)
    }

    /**
     * ALTERARCHIVE SCRAPER - FINAL FIX
     * @description Ngabongkar Base64 tina JSON ameh gambar teu ruksak
     */
    async function undressPro(imageBuffer) {
      try {
        // 1. Buat file temporary
        const tempDir = tmpdir()
        const tempInput = join(tempDir, `gambar_${Date.now()}.jpg`)
        const tempOutput = join(tempDir, `result_${Date.now()}.jpg`)
        
        // 2. Simpan buffer ke file temporary
        fs.writeFileSync(tempInput, imageBuffer)
        
        if (!fs.existsSync(tempInput)) throw new Error("File gambar tidak dibuat!")

        // 3. Convert gambar ke Base64
        const base64Payload = `data:image/jpeg;base64,${fs.readFileSync(tempInput).toString('base64')}`

        console.log("[-] Nembak API AlterArchive...")

        // 4. Request ke API
        const res = await axios.post('https://alterarchive.vercel.app/api/undress', {
          value: base64Payload,
          key: "core"
        }, {
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'origin': 'https://alterarchive.vercel.app',
            'referer': 'https://alterarchive.vercel.app/alterdreams',
            'X-Forwarded-For': `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
          },
          timeout: 30000
        })

        // 5. Bongkar data
        if (res.data && res.data.success && res.data.result) {
          console.log("[+] Response Success! Ngolah data gambar...")

          // Pastikan hasil adalah base64 yang valid
          let base64Data = res.data.result
          
          // Hapus prefix jika ada
          if (base64Data.includes('base64,')) {
            base64Data = base64Data.split('base64,')[1]
          }
          
          // Decode base64 ke buffer
          const imgBuffer = Buffer.from(base64Data, 'base64')
          
          if (imgBuffer.length === 0) {
            throw new Error("Buffer hasil kosong!")
          }

          // 6. Simpan hasil ke file temporary
          fs.writeFileSync(tempOutput, imgBuffer)
          
          // 7. Bersihkan file input temporary
          try { fs.unlinkSync(tempInput) } catch {}
          
          console.log(`[+] MANTAP LUR! Gambar berhasil diproses`)
          return imgBuffer
        } else {
          throw new Error("API tidak mengembalikan data yang valid")
        }

      } catch (err) {
        // Cleanup jika error
        try { 
          if (tempInput && fs.existsSync(tempInput)) fs.unlinkSync(tempInput) 
        } catch {}
        try { 
          if (tempOutput && fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput) 
        } catch {}
        
        if (err.response) {
          console.error(`[!] Error ${err.response.status}:`, err.response.data)
          if (err.response.status === 429) {
            throw new Error("Limit API tercapai, coba lagi nanti!")
          } else if (err.response.status === 500) {
            throw new Error("Server API error, coba lagi nanti!")
          }
        }
        throw new Error(`Gagal memproses: ${err.message}`)
      }
    }

    const kntl = await undressPro(buffer)

    await sock.sendMessage(
      jid,
      { image: kntl, caption: 'done' },
      { quoted: m }
    )

    await react(sock, m, '✅')
    
  } catch (e) {
    console.error("Error handler:", e)
    await react(sock, m, '❌')
    await sendText(sock, jid, `Error: ${e.message}`, m)
  }
}

handler.command = ['rc']
handler.category = ['tools']
handler.description = 'gatau'
handler.pluginName = 'rc'
handler.meta = {
  fileName: 'tools-remove-clothes.js',
  version: '1',
  author: botInfo.an
}
export default handler