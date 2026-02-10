/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */

async function handler({ sock, m, jid }) {

const textContent =
`hai haii kak ${m.pushName}
untuk source bisa klik gambar ini yah jangan lupa buat kasih star nya juga
> sebenarnya ini recode dari Angelina bot by wolep ya`

const url = "https://github.com/kadomatcha/Kado"

const content = {
  extendedTextMessage: {
    text: url + "\n" + textContent,
    matchedText: url,
    description: "recode angelina bot by wolep",
    title: "Nikusa",
    previewType: 0,

    jpegThumbnail: "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxl/2wBDARARERgYGCgaGDAjODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4/3QAEAAH/2gAMAwEAAhEDEQA/AA",

    thumbnailDirectPath: "/v/t62.7118-24/539753426_1675964436706688_1198216521999701939_n.enc?ccb=11-4&oh=01_Q5Aa3wGsorEBDjFFOnhIo9OpUqOs6M56GTnpE5b1J1rXX6hSrw&oe=69B2A073&_nc_sid=5e03e0",
    thumbnailSha256: "0M9numzPLDRp4pqZa9Pfe9cXDbKGgFMm1gUvIkcimqs=",
    thumbnailEncSha256: "aFVU6BzoerkCpf4/DWmqibn8Zx9p1H3s1p5eP3vQ3Pg=",
    mediaKey: "qy+YO3U1sExFZJpYfeokQ2eyXGMA5nWcz8suRAfybBM=",
    mediaKeyTimestamp: 1770702009,
    thumbnailHeight: 525,
    thumbnailWidth: 735,

    faviconMMSMetadata: {
      thumbnailDirectPath: "/v/t62.36144-24/543165369_1179909830609505_7421095322403906053_n.enc?ccb=11-4&oh=01_Q5Aa3wFI9G1yoAjr24FURYGzaD3V_jzfYYTQ8DBONjXQsirYtQ&oe=69AECD6D&_nc_sid=5e03e0",
      thumbnailSha256: "MQtVU84tY8jVF9ukAKMqFl1mxmTTSCzhzSLZe8Iav28=",
      thumbnailEncSha256: "kOyMe4+ZtRLAA4cA5NhnpxFQMYwQ07nDI2sYxCXd9xc=",
      mediaKey: "5MXqk8VgOdzlVuzVe7vDN95n28+C0wfS9G4ykEfJNs4=",
      mediaKeyTimestamp: "1770481892",
      thumbnailHeight: 32,
      thumbnailWidth: 32
    }
  },

  messageContextInfo: {
    messageSecret: "76l9B5Ncax6M5vYygysJhbAlCD9es86IhLHxRgQ5hYU="
  }
}

await sock.relayMessage(jid, content, {})
}

handler.pluginName = 'get source code'
handler.description = 'show script download message'
handler.command = ['sc']
handler.category = ['info']

handler.meta = {
    fileName: 'info-sc.js',
    version: '3',
    author: 'ky',
    note: 'preview thumbnail + favicon custom',
}

export default handler