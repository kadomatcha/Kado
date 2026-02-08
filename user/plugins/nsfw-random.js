import { tag, sendImage, sendVideo, botInfo, userManager } from '#helper'

const SOURCE = {
  ass: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/ass',
    caption: m => ``
  },
  blowjob: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/blowjob',
    caption: m => ``
  },
  ecchi: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/ecchi',
    caption: m => ``
  },
  ero: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/ero',
    caption: m => ``
  },
  hentai: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/hentai',
    caption: m => ``
  },
  milf: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/milf',
    caption: m => ``
  },
  neko: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/neko',
    caption: m => ``
  },
  oral: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/oral',
    caption: m => ``
  },
  paizuri: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/paizuri',
    caption: m => ``
  },
  trap: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/trap',
    caption: m => ``
  },
  waifu: {
    type: 'image',
    api: 'https://api.kiracloud.my.id/api/random-nsfw/waifu',
    caption: m => ``
  }
}

async function handler({ sock, jid, m, command }) {
if(!userManager.trustedJids.has(m.senderId)) return
  const src = SOURCE[command]
  if (!src) return

  if (src.type === 'gif') {
    return await sendVideo(
      sock,
      jid,
      src.api,
      src.caption(m),
      m,
      { gifPlayback: true }
    )
  }

  return await sendImage(
    sock,
    jid,
    src.api,
    src.caption(m),
    m
  )
}

handler.command = Object.keys(SOURCE)
handler.category = ['nsfw']
handler.pluginName = 'nsfw'
handler.deskripsi = 'ini bokep anjir'
handler.meta = {
  fileName: 'nsfw-random.js',
  version: '1.1.0',
  author: botInfo.an
}

export default handler