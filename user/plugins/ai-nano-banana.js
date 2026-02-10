import axios from 'axios'
import fs from 'fs'
import path from 'path'
import FormData from 'form-data'
import { delay } from 'baileys'
import {
  sendText,
  getBuff,
  react,
  tag
} from '#helper'

/* ================= API ================= */

function genserial() {
  let s = ''
  for (let i = 0; i < 32; i++) {
    s += Math.floor(Math.random() * 16).toString(16)
  }
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
  const type = path.extname(filePath) === '.png'
    ? 'image/png'
    : 'image/jpeg'

  const res = await axios.put(
    putUrl,
    file,
    {
      headers: {
        'Content-Type': type,
        'Content-Length': file.length
      },
      maxBodyLength: Infinity
    }
  )

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

async function processNano(buffer, prompt) {
  const imagePath = `./tmp-${Date.now()}.jpg`
  fs.writeFileSync(imagePath, buffer)

  const filename = path.basename(imagePath)
  const up = await upload(filename)

  await uploadtoOSS(up.url, imagePath)

  const cdn = 'https://cdn.imgupscaler.ai/' + up.object_name
  const jobId = await createJob(cdn, prompt)

  fs.unlinkSync(imagePath)

  let result
  for (let i = 0; i < 40; i++) {
    await delay(3000)
    result = await cekjob(jobId)
    if (result?.code !== 300006) break
  }

  return result?.result?.output_url?.[0] || null
}

/* ================= HANDLER ================= */

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ m, q, jid, sock, text }) {
  const target = q || m
  const msg = target.message

  if (!msg?.imageMessage && !msg?.stickerMessage) {
    return sendText(sock, jid, 'reply gambar / sticker + prompt', m)
  }

  if (!text) {
    return sendText(sock, jid, 'prompt nya mana', m)
  }

  try {
    await react(sock, m, '🕒')

    const buffer = await getBuff(target)

    const resultUrl = await processNano(buffer, text)
    if (!resultUrl) throw 'gagal generate'

    await sock.sendMessage(
      jid,
      {
        image: { url: resultUrl },
        caption: `${tag(m.senderId)} selesai`
      },
      { quoted: target }
    )

    await react(sock, m, '✅')
  } catch (e) {
    await react(sock, m, '❌')
    await sendText(sock, jid, String(e), m)
  }
}

/* ================= META ================= */

handler.pluginName = 'nano banana ai'
handler.description = 'edit gambar pakai magiceraser'
handler.command = ['nanobanana']
handler.category = ['ai']

handler.meta = {
  fileName: 'ai-nano-banana.js',
  version: '2.0.0',
  author: 'Kado',
  note: 'reply image/sticker + prompt'
}

export default handler