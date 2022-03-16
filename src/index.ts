import { Probot } from 'probot';
import GiphyRepository from './giphyRepository';

export = (app: Probot) => {
  app.on("pull_request_review.submitted", async (context) => {
    console.log(`Pull request review received`);

    const { review } = context.payload;

    if (review.state !== 'approved') {
      console.log(`Skipping pull request, review state '${review.state}'`);
      return;
    }

    const gifUrl = await (new GiphyRepository()).fetchGif();

    const comment = context.issue({
      body: `![](${gifUrl})`
    });

    await context.octokit.issues.createComment(comment);
  });
}
