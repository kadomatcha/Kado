import axios from 'axios'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import { delay } from 'baileys'
import { getBuff, sendText, react } from '#helper'

function genserial() {
  let s = ''
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16)
  return s
}

async function upload(filename) {
  const form = new FormData()
  form.append('file_name', filename)

  const res = await axios.post(
    'https://api.imgupscaler.ai/api/common/upload/upload-image',
    form,
    {
      headers: {
        ...form.getHeaders(),
        origin: 'https://imgupscaler.ai',
        referer: 'https://imgupscaler.ai/'
      }
    }
  )
  return res.data.result
}

async function uploadtoOSS(putUrl, filePath) {
  const file = fs.readFileSync(filePath)
  const type = path.extname(filePath) === '.png' ? 'image/png' : 'image/jpeg'

  const res = await axios.put(putUrl, file, {
    headers: {
      'Content-Type': type,
      'Content-Length': file.length
    },
    maxBodyLength: Infinity
  })

  return res.status === 200
}

async function createJob(imageUrl, prompt) {
  const form = new FormData()
  form.append('model_name', 'magiceraser_v4')
  form.append('original_image_url', imageUrl)
  form.append('prompt', prompt)
  form.append('ratio', 'match_input_image')
  form.append('output_format', 'jpg')

  const res = await axios.post(
    'https://api.magiceraser.org/api/magiceraser/v2/image-editor/create-job',
    form,
    {
      headers: {
        ...form.getHeaders(),
        'product-code': 'magiceraser',
        'product-serial': genserial(),
        origin: 'https://imgupscaler.ai',
        referer: 'https://imgupscaler.ai/'
      }
    }
  )
  return res.data.result.job_id
}

async function cekjob(jobId) {
  const res = await axios.get(
    `https://api.magiceraser.org/api/magiceraser/v1/ai-remove/get-job/${jobId}`,
    {
      headers: {
        origin: 'https://imgupscaler.ai',
        referer: 'https://imgupscaler.ai/'
      }
    }
  )
  return res.data
}

const PROMPT = {
  hytamkan: 'ubah warna kulit menjadi sangat hitam, rapi, natural, hanya kulit',
  putihkan: 'ubah warna kulit menjadi putih cerah, rapi, natural',
  hijabkan: 'tambahkan hijab yang rapi dan natural',
  sundakan: 'ubah pakaian menjadi adat Sunda yang rapi',
  jawakan: 'ubah pakaian menjadi adat Jawa yang rapi'
}

async function handler({ m, q, jid, sock, command }) {
  const target = q || m
  if (!target.message?.imageMessage)
    return sendText(sock, jid, 'reply gambar.', m)

  const prompt = PROMPT[command]
  if (!prompt) return

  const tmp = `/tmp/${Date.now()}.jpg`

  try {
    await react(sock, m, '🕒')

    const buffer = await getBuff(target)
    fs.writeFileSync(tmp, buffer)

    const up = await upload(path.basename(tmp))
    await uploadtoOSS(up.url, tmp)

    const cdn = 'https://cdn.imgupscaler.ai/' + up.object_name
    const jobId = await createJob(cdn, prompt)

    let result
    do {
      await delay(3000)
      result = await cekjob(jobId)
    } while (result.code === 300006)

    await sock.sendMessage(
      jid,
      {
        image: { url: result.result.output_url[0] },
        caption: `✅ selesai (${command})`
      },
      { quoted: m }
    )

    fs.unlinkSync(tmp)
    await react(sock, m, '✅')
  } catch (e) {
    console.error(e)
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    await react(sock, m, '❌')
    await sendText(sock, jid, 'gagal.', m)
  }
}

handler.command = Object.keys(PROMPT)
handler.category = ['ai']
handler.pluginName = 'magic earser'
handler.meta = {
  fileName: 'ai-editimg.js',
  version: '1.0.0',
  author: 'Ky'
}

export default handler