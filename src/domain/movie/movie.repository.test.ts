import path from 'path';
import fs from 'fs';
import * as appRoot from 'app-root-path';
import { defaultMovieRepository } from './movie.repository';

describe('movie-repository tests', () => {
  it('movieRepository is instantiated correctly', () => {
    expect(defaultMovieRepository).toBeTruthy();
  });

  it('loads all movies from files correctly', async () => {
    const movies = await defaultMovieRepository.getAll();

    expect(movies.length).toBe(4);
    ['3532674', '5979300', '11043689', '11528860'].forEach((id) => {
      expect(movies.find((movie) => movie.id == id)).toEqual(
        JSON.parse(fs.readFileSync(path.join(appRoot.path, 'movies', `${id}.json`), 'utf-8'))
      );
    });
  });
});
