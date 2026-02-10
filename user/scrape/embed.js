import axios from 'axios'

function extractId(url) {
    const match = url.match(
        /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    )
    return match ? match[1] : url
}

async function getDownloadLink(url, type = 'mp3', quality = '320') {
    const videoId = extractId(url)

    try {
        const { data } = await axios.post(
            `https://embed.dlsrv.online/api/download/${type}`,
            { videoId, format: type, quality },
            {
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    referer: `https://embed.dlsrv.online/v1/full?videoId=${videoId}`,
                    'user-agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121.0.0.0 Safari/537.36'
                }
            }
        )

        return data
    } catch (error) {
        throw new Error(error.response?.data?.message || error.message)
    }
}

export { getDownloadLink, extractId }
export default getDownloadLink