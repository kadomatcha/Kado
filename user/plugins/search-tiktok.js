import axios from 'axios';
import { sendText, textOnlyMessage } from '#helper';

/**
 * @param {import('../types/plugin.js').HandlerParams} params
 */
async function handler({ sock, m, jid, text }) {
  if (!textOnlyMessage(m)) return;
  if (!text) return sendText(sock, jid, '❌ format: search {query} {value}\ncontoh: search tarot 2', m);

  let args = text.split(' ');
  let value = 1;
  const lastArg = args[args.length - 1];

  if (!isNaN(lastArg)) {
    value = Math.min(Math.max(parseInt(lastArg), 1), 3);
    args = args.slice(0, -1);
  }

  const query = args.join(' ');
  if (!query) return sendText(sock, jid, '❌ kasih kata kunci search', m);

  try {
    await sock.sendMessage(jid, { react: { text: '🕓', key: m.key } });

    // ambil video
    const videos = await tiktokSearch(query);
    if (!videos || videos.length === 0) {
      await sock.sendMessage(jid, { react: { text: null, key: m.key } });
      return sendText(sock, jid, '❌ Tidak ada video ditemukan', m);
    }

    // kirim video langsung
    for (let i = 0; i < Math.min(value, videos.length); i++) {
      const video = videos[i];
      await sock.sendMessage(jid, {
        video: { url: video.play },
        caption: `🎬 ${video.title}\n👤 ${video.author}`
      });
    }

    await sock.sendMessage(jid, { react: { text: '✅', key: m.key } });

  } catch (err) {
    console.error(err);
    await sendText(sock, jid, '❌ Gagal mengambil video', m);
    await sock.sendMessage(jid, { react: { text: '❌', key: m.key } });
  }
}

async function tiktokSearch(query) {
  try {
    const res = await axios.get(`https://tikwm.com/api/feed/search?keywords=${encodeURIComponent(query)}&count=5&cursor=0`);
    if (!res.data?.data?.videos) return [];
    return res.data.data.videos.map(v => ({
      title: v.title,
      play: v.play,
      author: v.author?.nickname || 'Unknown'
    }));
  } catch (err) {
    console.error('TikTok API error:', err.message);
    return [];
  }
}

handler.pluginName = 'search-tiktok';
handler.command = ['search'];
handler.category = ['search'];
handler.meta = {
  fileName: 'search-tiktok.js',
  version: '1.0.3',
  author: 'Kado',
  note: 'Search TikTok, kirim video langsung sesuai URL'
};

export default handler;