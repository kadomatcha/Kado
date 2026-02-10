import { textOnlyMessage } from '#helper'

/**
 * @param {import('../../system/types/plugin').HandlerParams} params
 */
async function handler({ sock, m, jid }) {
    if (!textOnlyMessage(m)) return

    const textContent =
`hai ${m.pushName}
ini kontak owner.
kalau perlu sesuatu, langsung chat aja.`

    const content = {
      extendedTextMessage: {
        endCardTiles: [],
        text: "https://wa.me/6287781287196\n" + textContent,
        matchedText: "https://wa.me/6287781287196",
        description: "btw aku juga ope nokos",
        title: "Kado",
        previewType: 0,
        jpegThumbnail: "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxl/2wBDARARERgYGCgaGDAjODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4ODg4/3QAEAAH/2gAMAwEAAhEDEQA/AA",
        thumbnailDirectPath: "/o1/v/t24/f2/m232/AQOjNwQp689a1qzE1pF2DHWTptaex-7hBdCP-l7XABNtKeuSs82zZNy0_aM9E4mzNPdk5YYIJzOHo_Zs2zRRr746v3w0g580-OADq0u5vQ?ccb=9-4&oh=01_Q5Aa3wFAq5XOtj-WTPd6lGmmyINndsRKzyCzVGQBYhdZIRzpAw&oe=69AFFB8E&_nc_sid=e6ed6c",
        thumbnailSha256: "kxwAe6gFr5O6z/wDKIwnSABmxTWxJ65/hAUWjY7Gkog=",
        thumbnailEncSha256: "PCe2JQKxiteJHsJIMAXcdrNkYNaSGMjv/VTs5lIpaEo=",
        mediaKey: "tOSRmcjikoAQfXa9NxDJKGIakVXOqb9WGI1OPi5bzE0=",
        mediaKeyTimestamp: 1770550175,
        thumbnailHeight: 460,
        thumbnailWidth: 735,
        inviteLinkGroupTypeV2: 0,
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

handler.pluginName = 'owner card preview'
handler.description = 'kirim kontak owner dengan preview'
handler.command = ['owner']
handler.category = ['info']

handler.meta = {
    fileName: 'info-owner.js',
    version: '1',
    author: 'Kado',
    note: 'extendedTextMessage preview'
}

export default handler