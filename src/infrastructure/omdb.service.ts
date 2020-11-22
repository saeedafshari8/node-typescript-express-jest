import * as http from 'axios';

export class OMDBService {
  constructor(private apiKey: string = '68fd98ab') {}

  async findByImdbId(imdbId: string): Promise<any> {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${this.apiKey}&plot=full`;
    let res;
    try {
      res = await http.default.get(url);
    } catch (err) {
      throw new Error(`unable to fetch data from imdb api with imdbId=${imdbId}`);
    }
    return res.data;
  }
}
