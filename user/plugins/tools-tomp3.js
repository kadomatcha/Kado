import { textOnlyMessage, sendText, sendFancyMp3, react, botInfo, toMp3 } from '#helper'

/**
 * @param {import('../../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid, q }) {
  if (!textOnlyMessage(m)) return

 
  if (!q) return sendText(sock, jid, 'reply video nya', m)

  const mime = q.type
  if (!mime.startsWith('video'))
    return sendText(sock, jid, 'harus reply video', m)

  await react(sock, m, '🕛')

  try {
    const mp3Buffer = await toMp3({ m, q })

    await sendFancyMp3(
      sock,
      jid,
      mp3Buffer,
      'Converted MP3',
      botInfo.sdn,
      null
    )

    await react(sock, m, '✅')
  } catch (e) {
    await sendText(sock, jid, `error: ${e.message}`, m)
    await react(sock, m, '❌')
  }
}

handler.pluginName = 'to mp3'
handler.command = ['tomp3']
handler.category = ['tools']
handler.description = 'convert video ke mp3'
handler.meta = {
  fileName: 'tools-tomp3.js',
  version: '1.0.0',
  author: 'Kado'
}

export default handler