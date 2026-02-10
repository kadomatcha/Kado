import axios from 'axios'
import https from 'https'

class TiktokScraper {
    constructor() {
        this.oembedURL = 'https://www.tiktok.com/oembed'
        this.tikwmURL = 'https://www.tikwm.com/api/'
        this.httpsAgent = new https.Agent({ rejectUnauthorized: false })

        this.headers = {
            'accept': '*/*',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'connection': 'keep-alive',
            'origin': 'https://snaptik.app',
            'referer': 'https://snaptik.app/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome Mobile'
        }
    }

    async normalizeUrl(url) {
        try {
            // handle vt.tiktok redirect
            if (/vt\.tiktok\.com/i.test(url)) {
                const res = await axios.get(url, {
                    maxRedirects: 0,
                    validateStatus: s => s >= 200 && s < 400
                })
                return res.headers.location || url
            }
            return url
        } catch {
            return url
        }
    }

    async getVideoInfo(url) {
        const res = await axios.get(this.oembedURL, {
            headers: this.headers,
            params: { url },
            httpsAgent: this.httpsAgent
        })
        return res.data
    }

    async getVideoDownload(url) {
        const res = await axios.post(
            this.tikwmURL,
            new URLSearchParams({ url }),
            {
                headers: {
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'x-requested-with': 'XMLHttpRequest'
                }
            }
        )
        return res.data
    }

    async download(url) {
        try {
            url = await this.normalizeUrl(url)

            const info = await this.getVideoInfo(url)
            const dl = await this.getVideoDownload(url)

            if (!dl || !dl.data) {
                return { status: false, message: 'gagal ambil video' }
            }

            const videoUrl =
                dl.data.play ||
                dl.data.wmplay ||
                null

            const images =
                dl.data.images && dl.data.images.length
                    ? dl.data.images
                    : null

            return {
                status: true,
                videoId: info.embed_product_id,
                author: info.author_unique_id,
                title: info.title || '',
                thumbnail: info.thumbnail_url,
                video: videoUrl,
                images,
                music: dl.data.music || null
            }

        } catch (e) {
            return {
                status: false,
                message: e.message
            }
        }
    }
}

export default TiktokScraper