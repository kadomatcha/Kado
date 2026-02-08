/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {
    
    const url = "https://api.kiracloud.my.id/api/random/baka"
    return await sock.sendMessage(jid,{
        image: { url },
        caption: 'bakaaaaaa'
    }, {
        quoted: q || m
    })
}

handler.pluginName = 'baka image'
handler.description = 'get random cat image'
handler.command = ['baka']
handler.category = ['random']

handler.meta = {
    fileName: 'baka.js',
    version: '1',
    author: 'wolep',
    note: 'kyaaaa'
}
export default handler