// kalau node <18 aktifkan ini
import fetch from 'node-fetch'

class SaveTheVideoScraper {
    constructor() {
        this.baseURL = 'https://api.v02.savethevideo.com';
        this.headers = {
            'accept': 'application/json',
            'content-type': 'application/json',
            'origin': 'https://www.savethevideo.com',
            'referer': 'https://www.savethevideo.com/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 10)'
        };
    }

    sleep(ms) {
        return new Promise(r => setTimeout(r, ms))
    }

    async createTask(url) {
        const res = await fetch(`${this.baseURL}/tasks`, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({
                type: 'info',
                url
            })
        })

        const data = await res.json()

        if (!data?.id) {
            throw new Error('gagal membuat task')
        }

        return data.id
    }

    async waitResult(taskId) {
        for (let i = 0; i < 20; i++) {
            await this.sleep(1500)

            const res = await fetch(`${this.baseURL}/tasks/${taskId}`, {
                headers: this.headers
            })

            const data = await res.json()

            if (data.state === 'completed' && data.result?.length) {
                return data.result[0]
            }

            if (data.state === 'error') {
                throw new Error('api gagal memproses video')
            }
        }

        throw new Error('timeout menunggu hasil')
    }

    async extractFormats(url) {
        const taskId = await this.createTask(url)
        const videoInfo = await this.waitResult(taskId)

        return {
            title: videoInfo.title,
            duration: videoInfo.duration_string,
            thumbnail: videoInfo.thumbnail,
            formats: videoInfo.formats.map(f => ({
                url: f.url,
                quality: f.format,
                resolution: f.resolution
            }))
        }
    }
}

export default SaveTheVideoScraper