const axios = require('axios')
const gifRepository = require('../src/gifRepository')

jest.mock('axios')

describe('gifRepository', () => {
  let config

  beforeAll(() => {
    config = {
      host: 'http://gif-host.com',
      language: 'en',
      rating: 'G',
      apiKey: 'this-is-an-api-key'
    }

    axios.get.mockResolvedValue({
      data: {
        data: [{
          images: {
            original: {
              url: 'https://a-gif-url.com'
            }
          }
        }]
      }
    })
  })

  test('builds endpoint correctly', () => {
    const prTitle = 'This is a title'

    gifRepository(config).findGifUrlForTitle(prTitle)

    const query = `approved ${prTitle}`

    const {
      host,
      apiKey,
      language,
      rating
    } = config

    const endpoint = `${host}/gifs/search?api_key=${apiKey}&limit=10&lang=${language}&q=${query}&rating=${rating}`

    expect(axios.get).toBeCalledWith(endpoint)
  })

  test('returns a GIF url', async () => {
    const prTitle = 'This is another title'

    const gifUrl = await gifRepository(config).findGifUrlForTitle(prTitle)

    expect(gifUrl).toBe('https://a-gif-url.com')
  })
})
