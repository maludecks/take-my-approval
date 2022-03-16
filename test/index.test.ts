import nock from 'nock';
import fs from 'fs';
import path from 'path';
import { Probot, ProbotOctokit } from 'probot';
import app from '../src/index';
import payload from './fixtures/pull_request_review.submitted.json';

const pullRequestComment = { body: `![](https://gif-image-url.com)` };

const mockedPrivateKey = fs.readFileSync(
  path.join(__dirname, 'fixtures/mock-cert.pem'),
  'utf-8'
);

jest.mock('../etc/config', () => ({
  giphy: {
    rating: 'G',
    searchTermsAllowlist: [
      'approved'
    ]
  }
}));

describe('take-my-approval', () => {
  let probot: Probot;

  beforeEach(() => {
    nock.disableNetConnect();
    probot = new Probot({
      appId: 123,
      privateKey: mockedPrivateKey,
      // disable request throttling and retries for testing
      Octokit: ProbotOctokit.defaults({
        retry: { enabled: false },
        throttle: { enabled: false },
      }),
    });
    probot.load(app);
  });

  test('creates a comment after a pull request approval', async (done) => {
    const githubMock = nock('https://api.github.com')
      // Test that we correctly return a test token
      .post('/app/installations/2/access_tokens')
      .reply(200, {
        token: 'test',
        permissions: {
          issues: 'write',
          pull_requests: 'write',
          pull_request_review: 'write'
        },
      })
      // Test that a comment is posted
      .post('/repos/hiimbex/testing-things/issues/1/comments', (body: any) => {
        done(expect(body).toMatchObject(pullRequestComment));
        return true;
      })
      .reply(200);

    const giphyMock = nock('https://giphy.com')
      .get('/gifs/random?api_key=v01234567890&tag=approved&rating=G')
      .reply(200, {
        data: {
          images: {
            original: {
              url: 'https://gif-image-url.com'
            }
          }
        }
      });

    // Receive a webhook event
    await probot.receive({ id: 'id-here', name: 'pull_request_review.submitted', payload });

    expect(githubMock.pendingMocks()).toStrictEqual([]);
    expect(giphyMock.pendingMocks()).toStrictEqual([]);
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });
});

