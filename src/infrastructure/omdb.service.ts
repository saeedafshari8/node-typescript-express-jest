import * as http from 'axios';

export class OMDBService {
  constructor(private apiKey: string = '68fd98ab') {}

  async findByImdbId(imdbId: string): Promise<any> {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${this.apiKey}&plot=full`;
    return await http.default.get(url);
  }
}
