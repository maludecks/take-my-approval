const webhookHandler = require('../src/webhookHandler')
const payload = require('./fixtures/pull_request_review.submitted')

describe('webhookHandler', () => {
  const gifRepository = { findGifUrlForTitle: () => 'https://a-gif-url.com' }

  test('returns false when review state is "commented"', () => {
    const params = webhookHandler(gifRepository).createReviewParams({
      review: {
        state: 'commented'
      }
    })

    expect(params).resolves.toBe(false)
  })

  test('returns params when review state is "approved"', async () => {
    const params = await webhookHandler(gifRepository).createReviewParams(payload)

    expect(params).toEqual({
      body: '![](https://a-gif-url.com)',
      event: 'COMMENT',
      number: 1,
      owner: 'username',
      repo: 'repository-name'
    })
  })
})
