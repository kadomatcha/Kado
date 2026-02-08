import axios from 'axios'
import cheerio from 'cheerio'
import crypto from 'crypto'

class DoronimeScraper {
    constructor() {
        this.baseURL = 'https://doronime.id'
        this.headers = {
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'referer': 'https://doronime.id/',
            'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5)'
        }
    }

    generateCookie() {
        const timestamp = Math.floor(Date.now() / 1000)
        const ga1 = `GA1.2.${Math.floor(Math.random() * 1000000000)}.${timestamp}`
        const gid = `GA1.2.${Math.floor(Math.random() * 1000000000)}.${timestamp}`
        const cfClearance = crypto.randomBytes(32).toString('hex')
        return `_ga=${ga1}; _gid=${gid}; cf_clearance=${cfClearance}`
    }

    async search(keyword) {
        const headers = {
            ...this.headers,
            cookie: this.generateCookie()
        }

        const response = await axios.get(`${this.baseURL}/search`, {
            headers,
            params: { s: keyword }
        })

        const $ = cheerio.load(response.data)
        const results = []

        $('.Card--column').each((_, el) => {
            const $el = $(el)

            results.push({
                title: $el.attr('title'),
                url: $el.attr('href'),
                image: $el.find('img').attr('src'),
                type: $el.find('.Card__badge--bottom').text().trim(),
                status: $el.find('.Badge--success').text().trim()
            })
        })

        return results
    }

    async getDetails(animeUrl) {
        const headers = {
            ...this.headers,
            cookie: this.generateCookie()
        }

        const response = await axios.get(animeUrl, { headers })
        const $ = cheerio.load(response.data)

        const title = $('.Content__title').text().trim()
        const japaneseTitle = $('.Content__tabs-content-title span').text().trim()
        const description = $('meta[property="og:description"]').attr('content')
        const image = $('meta[property="og:image"]').attr('content')

        const info = {}
        $('.Content__header-caption-item').each((_, el) => {
            const $el = $(el)
            const label = $el.find('b').text().replace(':', '').trim()
            const value = $el.find('span, a')
                .map((i, e) => $(e).text().trim())
                .get()
                .join(', ')

            if (label && value) info[label.toLowerCase()] = value
        })

        const episodes = []
        $('.Content__table-body').each((_, el) => {
            const $el = $(el)

            episodes.push({
                episode: $el.find('.col:first-child a').text().trim(),
                title: $el.find('.col-9.col-md-7 a').text().trim(),
                url: $el.find('.col:first-child a').attr('href'),
                releaseDate: $el.find('.d-none.d-md-block.col:first-of-type').text().trim(),
                downloadUrl: $el.find('.d-none.d-md-block.col:last-of-type a').attr('href')
            })
        })

        const synopsis = $('.Content__tabs-content--small p').text().trim()

        return {
            title,
            japaneseTitle,
            description,
            image,
            info,
            synopsis,
            episodes
        }
    }
}

export default DoronimeScraper