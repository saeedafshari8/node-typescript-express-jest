import path from 'path';
import fs from 'fs';
import * as appRoot from 'app-root-path';
import { MovieRepository } from './movie.repository';

describe('', () => {
  let movieRepository: MovieRepository;

  beforeEach(() => {
    movieRepository = new MovieRepository(path.join(appRoot.path, 'movies'));
  });

  it('movieRepository is instantiated correctly', () => {
    expect(movieRepository).toBeTruthy();
  });

  it('loads all movies from files correctly', async () => {
    const movies = await movieRepository.getAll();

    expect(movies.length).toBe(4);
    ['3532674', '5979300', '11043689', '11528860'].forEach((id) => {
      expect(movies.find((movie) => movie.id == id)).toEqual(
        JSON.parse(fs.readFileSync(path.join(appRoot.path, 'movies', `${id}.json`), 'utf-8'))
      );
    });
  });
});
