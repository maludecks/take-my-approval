import axios from 'axios';
import config from '../etc/config';

export default class GiphyRepository {
  private static readonly GIPHY_HOST = process.env.GIPHY_HOST;
  private static readonly GIPHY_API_KEY = process.env.GIPHY_API_KEY;

  public async fetchGif(): Promise<string> {
    const { searchTermsAllowlist, rating } = config.giphy;

    const index = Math.floor(Math.random() * searchTermsAllowlist.length);
    const searchTerm = searchTermsAllowlist[index];

    console.log(`Search term selected for tag: ${searchTerm}`);

    const endpoint = `/gifs/random?api_key=${GiphyRepository.GIPHY_API_KEY}&tag=${searchTerm}&rating=${rating}`;

    try {
      const { data: response } = await axios.get(`${GiphyRepository.GIPHY_HOST}${endpoint}`);

      if (!response || !response.data) {
        throw new Error(`No GIF found for search term '${searchTerm}'`);
      }

      return String(response.data.images.original.url);
    } catch (error) {
      throw Error(`Unable to fetch GIF for search term '${searchTerm}': ${error}`);
    }
  }
}
