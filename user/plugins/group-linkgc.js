import { sendText, userManager, textOnlyMessage } from '#helper'
import { isJidGroup } from 'baileys'
import axios from 'axios'

async function handler({ sock, m, jid }) {
    if (!isJidGroup(jid)) {
        return sendText(sock, jid, 'khusus grup', m)
    }

    if (!textOnlyMessage(m)) return

    const metadata = await sock.groupMetadata(jid)
    const senderId = m.senderId

    const isAdmin = metadata.participants.some(p =>
        (p.id === senderId && p.admin) || metadata.owner === senderId
    )

    const isTrusted = userManager.trustedJids.has(senderId)

    if (!isAdmin && !isTrusted) {
        return sendText(sock, jid, 'khusus admin atau trusted user', m)
    }

    const code = await sock.groupInviteCode(jid)
    const link = `https://chat.whatsapp.com/${code}`

    let jpegThumbnail = null
    try {
        const ppUrl = await sock.profilePictureUrl(jid, 'image')
        const res = await axios.get(ppUrl, { responseType: 'arraybuffer' })
        jpegThumbnail = Buffer.from(res.data)
    } catch {}

    const textContent =
`link grup:
${link}

${metadata.subject}`

    const content = {
        extendedTextMessage: {
            text: textContent,
            matchedText: link,
            title: metadata.subject,
            description: "link undangan grup",
            previewType: 0,
            jpegThumbnail
        }
    }

    await sock.relayMessage(jid, content, {})
}

handler.pluginName = 'linkgc'
handler.description = 'ambil link grup'
handler.command = ['linkgc']
handler.category = ['group']

handler.meta = {
    fileName: 'group-linkgc.js',
    version: '1.0',
    author: 'Kado'
}

export default handler