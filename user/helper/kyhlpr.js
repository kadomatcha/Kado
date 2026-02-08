import axios from 'axios'

export async function sendVContact(sock, jid, replyTo) {
  const vcard = 
`BEGIN:VCARD
VERSION:3.0
FN:Kado
N:Kado;;;;
TEL;type=CELL;type=VOICE;waid=6287781287196:6287781287196
END:VCARD`

  return await sock.sendMessage(
    jid,
    {
      contacts: {
        displayName: 'Kado',
        contacts: [{ vcard }]
      }
    },
    {
      quoted: replyTo
    }
  )
}

export async function sendPTVFromUrl(sock, jid, url, quoted) {
  const res = await axios.get(url, { responseType: 'arraybuffer' })

  return await sock.sendMessage(
    jid,
    {
      video: Buffer.from(res.data),
      ptv: true
    },
    { quoted }
  )
}

export function extractUrl(text) {
    const urlRegex = /https?:\/\/(?:\[[^\]]+\]|[A-Za-z0-9\-._~%]+(?:\.[A-Za-z0-9\-._~%]+)*)(?::\d{1,5})?(?:[/?#][^\s"'<]*)?/gi;
    const raw = text.match(urlRegex) || [];

    // bersihkan trailing punctuation yang sering muncul di teks: . , ; : ! ? ) ] " '
    const cleaned = raw.map(u => {
        // hapus penutup kurung/quote/tanda baca berulang di akhir
        return u.match(/http([^\s\\]+)/g)?.[0];
    });

    // optional: validasi benar-benar URL (mengeliminasi false positives)
    return cleaned.filter(s => {
        try {
            new URL(s); // akan throw kalau bukan url valid
            return true;
        } catch (e) {
            return false;
        }
    });
}






