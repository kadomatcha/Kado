import axios from 'axios'
import FormData from 'form-data'
import moment from 'moment-timezone'
import mime from 'mime-types'
import { delay } from 'baileys'
import { sendText, getBuff, react } from '#helper'

const unitLabel = {
  minutes: 'menit',
  hours: 'jam',
  days: 'hari'
}

const ensureExt = (name, mimeType) => {
  if (/\.[a-z0-9]{1,5}$/i.test(name)) return name
  const ext = mime.extension(mimeType)
  return ext ? `${name}.${ext}` : name
}

const toSize = s =>
  s < 1024
    ? `${s} B`
    : s < 1048576
    ? `${(s / 1024).toFixed(1)} KB`
    : `${(s / 1048576).toFixed(2)} MB`

const getIcon = (mimeType, ext) => {
  if (!mimeType) return '📄'
  if (mimeType.startsWith('audio/')) return '🎵'
  if (mimeType.startsWith('image/')) return '🖼️'
  if (mimeType.startsWith('video/')) return '🎞️'
  if (mimeType === 'application/pdf') return '📕'
  if (['ppt', 'pptx'].includes(ext)) return '📊'
  if (['doc', 'docx'].includes(ext)) return '📝'
  if (['xls', 'xlsx'].includes(ext)) return '📈'
  if (['zip', 'rar', '7z'].includes(ext)) return '🗂️'
  if (['js', 'html', 'css', 'json', 'py', 'cpp', 'sh'].includes(ext)) return '🧩'
  return '📄'
}

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */
async function handler({ m, q, text, jid, sock, command }) {
  const target = q || m
  const msg = target.message
  const mimeType =
    msg?.imageMessage?.mimetype ||
    msg?.videoMessage?.mimetype ||
    msg?.audioMessage?.mimetype ||
    msg?.documentMessage?.mimetype ||
    ''

  const isReply = q

  if (!mimeType && !isReply) {
    return sendText(
      sock,
      jid,
`📤 *Cara pakai .${command}*

1️⃣ Reply media ➜ .${command} fileku|30|minutes
2️⃣ Reply teks  ➜ .${command} catatan|1|hours
3️⃣ Media + caption ➜ .${command} dokumentasi|2|days

📌 expire_unit: minutes | hours | days
📦 Maks ±100 MB`,
      m
    )
  }

  let buffer, filename
  let rawName = text?.split('|')[0]?.trim()

  if (mimeType) {
    buffer = await getBuff(target)
    if (!rawName) rawName = `file_${Date.now()}`
    filename = ensureExt(rawName, mimeType)
  } else if (isReply && q.text) {
    buffer = Buffer.from(q.text, 'utf-8')
    if (!rawName) rawName = `text_${Date.now()}`
    filename = rawName.endsWith('.txt') ? rawName : `${rawName}.txt`
  } else {
    return sendText(sock, jid, '❌ reply media atau teks.', m)
  }

  const [name = filename, expVal = '30', expUnit = 'minutes'] =
    (text || '').split('|').map(v => v.trim().toLowerCase())

  if (!['minutes', 'hours', 'days'].includes(expUnit))
    return sendText(sock, jid, '❗ expire_unit hanya minutes | hours | days', m)

  try {
    await react(sock, m, '🕒')

    const form = new FormData()
    form.append('file', buffer, {
      filename,
      contentType: mimeType || mime.lookup(filename) || 'application/octet-stream'
    })
    form.append('filename', name)
    form.append('expire_value', expVal)
    form.append('expire_unit', expUnit)

    const { data: up } = await axios.post(
      'https://nauval.cloud/upload',
      form,
      { headers: form.getHeaders() }
    )

    const ext = mime.extension(mimeType) || filename.split('.').pop()
    const icon = getIcon(mimeType, ext)

    const expiredWIB = up.expires_at
      ? moment.utc(up.expires_at).tz('Asia/Jakarta').format('D MMM YYYY, HH.mm [WIB]')
      : '-'

    const caption =
`${icon} *Upload berhasil!*

🔗 URL        : ${up.file_url}
🕓 Expired   : ${expiredWIB}
📆 Durasi    : ${expVal} ${unitLabel[expUnit]}
📄 Filename  : ${up.filename}
📦 Size      : ${toSize(up.size)}`

    const qrBuf = Buffer.from(
      up.qr_code_base64.split(',')[1],
      'base64'
    )

    await sock.sendMessage(
      jid,
      { image: qrBuf, caption },
      { quoted: m }
    )

    await delay(1000)
    await react(sock, m, '✅')
  } catch (e) {
    console.error(e)
    await react(sock, m, '❌')
    await sendText(sock, jid, '❌ gagal upload file.', m)
  }
}

handler.pluginName = 'nauval uploader'
handler.description = 'Upload file/text ke Nauval Cloud (expire + QR)'
handler.command = ['nurl']
handler.category = ['uploader']
handler.limit = true

handler.meta = {
  fileName: 'upload-nurl.js',
  version: '1.0.0',
  author: 'Kado'
}

export default handler