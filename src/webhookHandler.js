const webhookHandler = (gifRepository) => {
  return {
    createReviewParams: async (payload) => {
      const {
        pull_request: pullRequest,
        repository,
        review
      } = payload

      if (review.state !== 'approved') {
        return false
      }

      try {
        const gifUrl = await gifRepository.findGifUrlForTitle(
          pullRequest.title
        )

        return {
          body: `![](${gifUrl})`,
          event: 'COMMENT',
          number: pullRequest.number,
          owner: repository.owner.login,
          repo: repository.name
        }
      } catch (error) {
        return false
      }
    }
  }
}

module.exports = webhookHandler
