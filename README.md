

---

# 🤖 Acodex AI

<p align="center">
  <img src="https://cdn.nekohime.site/file/KyqNp64R.jpg" alt="Acodex AI Thumbnail" width="600"/>
</p>

<p align="center">
  <b>Fast • Lightweight • Modular WhatsApp Bot Framework</b><br>
  Built for Termux, Panel, VPS, RDP, & Laptop
</p>

---

## 🚀 Tentang Acodex AI

**Acodex AI** adalah WhatsApp bot framework berbasis **Node.js terbaru** yang fokus pada:
- **performa ringan**
- **manajemen plugin fleksibel**
- **kontrol penuh lewat sistem manager**
- **mudah dikustomisasi**

Cocok buat developer yang suka sistem rapi, scalable, dan anti ribet.

---

## ✨ Fitur Utama

- ✅ Bisa run di **Termux, Panel, VPS, RDP, Laptop**
- ✅ Store `groupMetadata` & `pushName`
- ✅ **Chat Manager**
  - self
  - public
  - private
  - group
  - override setting
- ✅ **User Manager**
  - block user
  - trusted user (owner)
- ✅ **Prefix Manager**
  - enable / disable prefix
  - add prefix baru
- ✅ **Plugin Manager**
  - pasang plugin
  - hapus plugin
- ✅ **Isolated Hot Process**
  - restart bot kapan saja
  - aman saat RAM tinggi
- ✅ **Easy Customize**
  - banyak opsi tampilan menu
- ✅ **Eval**
- ✅ **Eval Async**
- ✅ **Shell Access**
- ✅ **Small RAM Usage**
- ✅ **Fast & Lightweight**
- ✅ **Node.js Versi Terbaru**

---

## 🧠 Serialize Message Object

```
{
  chatId: 'XXXXXXXXXX98950133@g.us',
  senderId: 'XXXXXXXXXX29145@lid',
  pushName: 'Kado',
  type: 'conversation',
  text: '! m',
  messageId: 'XXXXXXXXXX8A6704E1D6A014F2C98142',
  timestamp: 1765707132,
  key: [Getter],
  message: [Getter],
  q: [Getter]
}
```

```Serialize Quoted Message

{
  chatId: 'XXXXXXXXXX98950133@g.us',
  senderId: 'XXXXXXXXXX33142@lid',
  pushName: 'ghofar',
  type: 'conversation',
  text: 'ada di video',
  key: [Getter],
  message: [Getter]
}
```
---

```🧩 Contoh Plugin Acodex AI

import { textOnlyMessage, sendText } from '../../system/helper.js'

/**
 * @param {import('../../system/types/plugin.js').HandlerParams} params
 */

async function handler({ sock, m, q, text, jid, command, prefix }) {
    if (!textOnlyMessage(m)) return
    if (q) return
    if (text) return
    await sendText(sock, jid, `halo juga`, m)
}

handler.pluginName = 'halo'
handler.description = 'deskripsi kamu'
handler.command = ['halo']
handler.category = ['test']

handler.meta = {
    fileName: 'halo.js',
    version: '1',
    author: 'ambatukam',
    note: 'ambasing'
}

export default handler
```

---

⚙️ Cara Pakai

git clone https://github.com/kadomatcha/Acodex-AI.git
cd Acodex-AI
npm install
npm start

1. Pilih QR atau Pairing Code


2. Kirim command berikut via private chat ke bot:

request_owner


3. Owner pertama otomatis terset


4. Bisa dipakai self-bot (chat ke diri sendiri)


5. Enjoy 🚀




---

👥 Komunitas

Gabung grup WhatsApp buat:

share plugin

request fitur

saran & diskusi


👉 https://chat.whatsapp.com/HjDJzwSBZQW0cLYbJorXP2


---

👨‍💻 Developer

Kado
Creator & Maintainer of Acodex AI


---

> Acodex AI — simple, powerful, and built for developers.
