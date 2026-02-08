import {
  generateWAMessageContent,
  generateWAMessageFromContent
} from 'baileys'

import crypto from 'node:crypto'
import { sendText, getBuff, userManager } from '#helper'
import { isJidGroup } from 'baileys'

async function sendGroupStatus(sock, jid, content) {
  const { backgroundColor } = content
  delete content.backgroundColor

  const inside = await generateWAMessageContent(content, {
    upload: sock.waUploadToServer,
    backgroundColor
  })

  const messageSecret = crypto.randomBytes(32)

  const msg = generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: { messageSecret },
      groupStatusMessageV2: {
        message: {
          ...inside,
          messageContextInfo: { messageSecret }
        }
      }
    },
    {}
  )

  await sock.relayMessage(jid, msg.message, {
    messageId: msg.key.id
  })

  return msg
}

async function handler({ m, text, jid, command, sock }) {

  // ===== TRUSTED ONLY (OPSIONAL, TETAP DIPAKE) =====
  if (!userManager.trustedJids.has(m.senderId)) return

  // ===== GROUP ONLY =====
  if (!isJidGroup(jid)) {
    return sendText(sock, jid, 'khusus grup', m)
  }

  const metadata = await sock.groupMetadata(jid)
  const senderId = m.senderId // FIX LID

  // ===== ADMIN CHECK (FIX TOTAL) =====
  const isAdmin = metadata.participants.some(p => {
    if (p.id === senderId && p.admin) return true
    if (metadata.owner === senderId) return true
    return false
  })

  if (!isAdmin) {
    return sendText(sock, jid, 'khusus admin grup', m)
  }

  // ===== VALIDASI INPUT =====
  if (!text && !m.q) {
    return sendText(
      sock,
      jid,
      `Format:\n` +
      `${command} reply_media\n` +
      `${command} teks\n` +
      `${command} 123456@g.us caption`,
      m
    )
  }

  const q = m.q || m
  const msg = q?.message

  if (!msg) {
    return sendText(sock, jid, 'Reply media atau isi teks.', m)
  }

  const args = text ? text.trim().split(/\s+/) : []

  let targetJid = jid
  let caption = ''

  if (args[0]?.endsWith('@g.us')) {
    targetJid = args.shift()
  }

  caption = args.join(' ').trim()

  let type = null
  if (msg.imageMessage) type = 'image'
  else if (msg.videoMessage) type = 'video'
  else if (msg.audioMessage) type = 'audio'

  if (!type && !caption) {
    return sendText(sock, jid, 'Reply media atau isi teks.', m)
  }

  let payload = {}

  try {
    if (type === 'image') {
      payload = {
        image: await getBuff(q),
        caption
      }
    } else if (type === 'video') {
      payload = {
        video: await getBuff(q),
        caption
      }
    } else if (type === 'audio') {
      payload = {
        audio: await getBuff(q),
        mimetype: 'audio/mp4'
      }
    } else {
      payload = { text: caption }
    }

    await sendGroupStatus(sock, targetJid, payload)

  } catch (e) {
    console.error(e)
    await sendText(sock, jid, `❌ Error:\n${e.message}`, m)
  }
}

handler.pluginName = 'Upload Status Group'
handler.command = ['upswgc']
handler.category = ['group']
handler.deskripsi = 'upload status grup (admin only)'
handler.meta = {
  fileName: 'group-upsw.js',
  version: '1.1.0',
  author: 'Kado'
}

export default handler