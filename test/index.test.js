const nock = require('nock')
const myApp = require('..')
const { Probot } = require('probot')
const payload = require('./fixtures/pull_request_review.submitted')

nock.disableNetConnect()

describe('app test', () => {
  let probot

  beforeEach(() => {
    probot = new Probot({})
    // Load our app into probot
    const app = probot.load(myApp)

    // just return a test token
    app.app = () => 'test'
  })

  test('creates a review comment when a PR review is submitted', async () => {
    const reviewCreatedBody = {
      body: `![](https://a-gif-url.com)`,
      event: 'COMMENT',
      number: 1,
      owner: 'username',
      repo: 'repository-name'
    }

    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    // Test that a comment is posted
    nock('https://api.github.com')
      .post('/repos/username/repository-name/pull_requests/1/comments', (body) => {
        expect(body).toMatchObject(reviewCreatedBody)
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'pull_requests', payload })
  })

  test('creates a comment when an issue is opened', async () => {
    const issueCreatedBody = { body: 'Thanks for opening this issue!' }

    // Test that we correctly return a test token
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'test' })

    // Test that a comment is posted
    nock('https://api.github.com')
      .post('/repos/hiimbex/testing-things/issues/1/comments', (body) => {
        expect(body).toMatchObject(issueCreatedBody)
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'issues', payload })
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about testing with Nock see:
// https://github.com/nock/nock
