import { botInfo as b, dirPovCwd } from './helper.js'

/**
 * serialize plugin info jadi tampilan “menu bot premium” dengan komentar penjelasan
 * @param {Object} handler - object handler plugin
 */
export function pluginHelpSerialize(handler) {
    // placeholder default
    const emptyPlaceholder = 'tidak ada'
    const notFound = '-'

    // default meta kalau tidak diisi
    const meta = {
        version: '1.0.0',
        author: b.an,
        fileName: notFound,
        note: '-',
        ...handler.meta
    }

    // garis pemisah dekoratif
    const line = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'

    return `
╭─〔 ✨ PLUGIN INFORMATION ✨ 〕─╮
${line}

// 🆔 Name
🆔 *Name*  
➤ ${handler.pluginName || notFound}
// ini adalah nama dari plugin, biasanya ditampilkan di menu atau log

// 📝 Description
📝 *Description*  
➤ ${handler.description || emptyPlaceholder}
// deskripsi singkat fungsional plugin

// 📂 Category
📂 *Category*  
➤ ${handler.category?.join(', ') || emptyPlaceholder}
// kategori plugin (misal: developer, fun, downloader)

// ⌨️ Command
⌨️ *Command*  
➤ ${handler.command?.join(', ') || emptyPlaceholder}
// perintah / trigger untuk menjalankan plugin

// ⚙️ Bypass Prefix
⚙️ *Bypass Prefix*  
➤ ${handler?.config?.bypassPrefix ? 'Yes ✅' : 'No ❌'}
// apakah plugin bisa dijalankan tanpa prefix

// 👤 Author
👤 *Author*  
➤ ${meta.author}
// nama author atau pembuat plugin

// 💭 Author Note
💭 *Author Note*  
➤ ${meta.note}
// catatan tambahan dari author

// 📄 File Name
📄 *File Name*  
➤ ${meta.fileName}
// nama file plugin, biasanya di folder plugin

// 🧩 Version
🧩 *Version*  
➤ ${meta.version}
// versi plugin, default 1.0.0 jika tidak diisi

// 📍 File Path
📍 *File Path*  
➤ ${dirPovCwd(handler.dir)}
// lokasi file plugin di sistem

${line}
╰─〔 🏁 END OF INFO 🏁 〕─╯
`.trim()
}
