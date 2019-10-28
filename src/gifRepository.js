const axios = require('axios')

const gifRepository = (config) => {
  function buildEndpoint (prTitle) {
    const { host, apiKey, language, rating } = config

    const query = prTitle.replace(/[^a-zA-Z\s]/g, '')

    return `${host}/gifs/search?api_key=${apiKey}&limit=10&lang=${language}&q=${query}&rating=${rating}`
  }

  return {
    findGifUrlForTitle: async (prTitle) => {
      const searchTerm = `approved ${prTitle}`
      const endpoint = buildEndpoint(searchTerm)

      try {
        const { data: response } = await axios.get(endpoint)

        if (!response || !response.data) {
          throw new Error(`No GIF found for PR title '${prTitle}'`)
        }

        const index = Math.floor(Math.random() * response.data.length)

        return response.data[index].images.original.url
      } catch (error) {
        throw Error(`Unable to fetch GIF for PR title '${prTitle}': ${error}`)
      }
    }
  }
}

module.exports = gifRepository
