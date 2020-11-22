import { MovieRepository } from './movie.repository';
import NodeCache from 'node-cache';
import log, { Logger } from 'loglevel';
export class MovieService {
  constructor(
    private movieRepository: MovieRepository,
    private cacheManager = new NodeCache({ stdTTL: 100, checkperiod: 120 }),
    private logger: Logger = log.getLogger('movie-service')
  ) {}

  findMovieById(id: number): any {
    const movies = this.tryCacheMovies();
    const movie = movies.find((movie) => movie.id === id);
    if (!movie) {
      throw new Error(`movie with id=${id} not found`);
    }
    return movie;
  }

  private tryCacheMovies(): any[] {
    const cacheName = 'movies';
    let movies = this.cacheManager.get<any[]>(cacheName);
    if (!movies) {
      movies = this.movieRepository.getAll();
      this.cacheManager.set(cacheName, movies);
      this.logger.info('movies cache reloaded');
    }
    return movies;
  }
}
