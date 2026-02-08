import {
tag,
sendImage,
botInfo
} from '#helper'

async function handler({ sock, jid, m }) {
    const api = 'https://api.acodex.my.id/random/nsfw'
    return await sendImage(sock, jid, api, ``, m)
}

handler.pluginName = 'random nsfw'
handler.command = ['nsfw']
handler.category = ['nsfw']
handler.deskripsi = 'api api api'
handler.meta = {
    fileName: 'nsfw-random-image.js',
    version: '1',
    author: botInfo.an,
    note: 'ngentod'
}
export default handler