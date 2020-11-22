import { MovieService } from './movie.service';
import { defaultMovieRepository } from './movie.repository';
import fs from 'fs';
import path from 'path';
import * as appRoot from 'app-root-path';

describe('', () => {
  let movieService: MovieService;

  beforeEach(() => {
    movieService = new MovieService(defaultMovieRepository);
  });

  it('movieService is instantiated correctly', async () => {
    expect(movieService).toBeTruthy();
  });

  it('throws Error when the expected movie with the specified id not found', async () => {
    const id = 1234;

    try {
      movieService.findMovieById(id);
    } catch (err) {
      expect(err.message).toEqual(`movie with id=${id} not found`);
    }
  });

  it('finds a movie by id correctly', async () => {
    const id = 3532674;

    expect(movieService.findMovieById(id)).toEqual(
      JSON.parse(fs.readFileSync(path.join(appRoot.path, 'movies', `${id}.json`), 'utf-8'))
    );
  });
});
