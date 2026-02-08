/**
* @param {import('baileys').WASocket} sock
* @param {import('../../type/message.js').Message} wam*/

const reply = async (sock, wam, text) => {
    return sock.sendMessage(wam.key.remoteJid, { text }, { quoted: wam })
}
export{reply}
