const config = require('./etc/config')
const gifRepository = require('./src/gifRepository')
const webhookHandler = require('./src/webhookHandler')

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on('pull_request_review.submitted', async context => {
    const { payload, github } = context

    const params = await webhookHandler(gifRepository(config.giphy)).createReviewParams(payload)

    if (params === false) {
      return
    }

    github.pullRequests.createReview(params)
  })
}
