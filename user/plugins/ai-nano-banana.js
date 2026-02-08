import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { delay } from 'baileys'
import {
  sendText,
  getBuff,
  react,
  tag
} from '#helper'

/* ================= CONFIG ================= */

const BASE_URL = 'https://www.nanobana.net'

const COOKIES = `
_ga=GA1.1.309218641.1769387797;
__Secure-authjs.session-token=PASTE_TOKEN_KAMU
`.replace(/\n/g, '').replace(/\s+/g, ' ').trim()

const HEADERS = {
  'accept': '*/*',
  'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8',
  'origin': BASE_URL,
  'referer': BASE_URL + '/',
  'user-agent':
    'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome Mobile',
  'cookie': COOKIES
}

/* ================= API ================= */

async function uploadNano(buffer) {
  const form = new FormData()
  form.append('file', buffer, {
    filename: 'image.png',
    contentType: 'image/png'
  })

  const res = await axios.post(
    BASE_URL + '/api/upload/image',
    form,
    {
      headers: {
        ...HEADERS,
        ...form.getHeaders()
      }
    }
  )

  return res.data?.url
}

async function createTask(imageUrl, prompt) {
  const payload = {
    prompt,
    image_input: [imageUrl],
    output_format: 'png',
    aspect_ratio: '1:1',
    resolution: '1K'
  }

  const res = await axios.post(
    BASE_URL + '/api/nano-banana-pro/generate',
    payload,
    { headers: HEADERS }
  )

  return res.data?.data?.taskId
}

async function checkTask(taskId, prompt) {
  const res = await axios.get(
    BASE_URL + `/api/nano-banana-pro/task/${taskId}`,
    {
      headers: HEADERS,
      params: { save: 1, prompt }
    }
  )

  const d = res.data?.data
  if (d?.status === 'completed' && d?.provider_state === 'success') {
    return d.savedFiles?.[0]?.publicUrl
      || d.result?.images?.[0]?.url
  }
  return null
}

async function waitResult(taskId, prompt) {
  for (let i = 0; i < 40; i++) {
    const url = await checkTask(taskId, prompt)
    if (url) return url
    await delay(2000)
  }
  return null
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

    const imgUrl = await uploadNano(buffer)
    if (!imgUrl) throw 'upload gagal'

    const taskId = await createTask(imgUrl, text)
    if (!taskId) throw 'task gagal dibuat'

    const resultUrl = await waitResult(taskId, text)
    if (!resultUrl) throw 'timeout generate'

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
handler.description = 'edit gambar pakai nano-banana'
handler.command = ['nanobanana']
handler.category = ['ai']

handler.meta = {
  fileName: 'ai-nano-banana.js',
  version: '1.0.0',
  author: 'Kado',
  note: 'reply image/sticker + prompt'
}

export default handler