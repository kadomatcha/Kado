/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {
const textContent =
`hai haii kak ${m.pushName}
untuk source bisa klik gambar ini yah jangan lupa buat kasih star nya juga\n> sebenarnya ini recode dari Angelina bot by wolep ya`

const url = "https://github.com/WolfyFlutter/angelina-bot"
const content = {
  extendedTextMessage: {
    endCardTiles: [],
    text: url + "\n" + textContent,
    matchedText: url,
    description: "recode angelina bot by wolep",
    title: "Nikusa",
    previewType: 0,
    jpegThumbnail: "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxl/2wBDARARERgYGCgaGDAjODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4/3QAEAAH/2gAMAwEAAhEDEQA/AA",
    thumbnailDirectPath: "/o1/v/t24/f2/m269/AQNJvnzvpUd9_OGrGKy8yGRvsHkDYOfOyF0VxXHou9Gj_xdrS8zudaNMu3fxLrZWb-aC1NaCGqqgF-pMjnsT6tASYNtm5i8i0VnCBzW4Yg?ccb=9-4&oh=01_Q5Aa3gGNBDWBPkLwsc5HtlJcB8nVB8xufDfy4CS3m4YmmT4Zyg&oe=699ACC75&_nc_sid=e6ed6c",
    thumbnailSha256: "Q9GOU8fOZT5hZcWUBlvg/+gVRk1oTmO4MeDqc4ZO4mo=",
    thumbnailEncSha256: "RWlRl6IUkUxpsI21hFgpFzB4XhW5JqLzbBOdmofv++0=",
    mediaKey: "sE4dSe77o8Fb7kwyYx832mljDn3W0yxUj9JaSGzO1YI=",
    mediaKeyTimestamp: 1769174900,
    thumbnailHeight: 447,
    thumbnailWidth: 447,
    inviteLinkGroupTypeV2: 0,
    faviconMMSMetadata: {
      thumbnailDirectPath: "/v/t62.36144-24/571524679_2377206859367631_7962614594842159498_n.enc?ccb=11-4&oh=01_Q5Aa3gFv-NCjkuNLbBHMLHcyczG-Qu8rC1Hs2zWPyru9UfPVzQ&oe=6995A23F&_nc_sid=5e03e0",
      thumbnailSha256: "uT2cbz6nSMGyaC93qOyO9Dqg4HfctLvhSOSDqTZG0r8=",
      thumbnailEncSha256: "cteNRtZExGfqeBWE4wtKreWEQgs/SM2xf9l5Em5aSWU=",
      mediaKey: "7d8wvCfevs3UN2zWHZyM0xfaznmMK0pAq/Q7NVRZ9YQ=",
      mediaKeyTimestamp: 1768835605,
      thumbnailHeight: 48,
      thumbnailWidth: 48
    }
  }
}

const relayOption = {}

await sock.relayMessage(jid, content, relayOption)
}

handler.pluginName = 'get source code'
handler.description = 'show script download message'
handler.command = ['sc']
handler.category = ['info']

handler.meta = {
    fileName: 'info-sc.js',
    version: '2',
    author: 'ky',
    note: 'cihuy',
}
export default handler