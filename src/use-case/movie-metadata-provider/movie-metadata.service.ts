import { OMDBService } from '../../infrastructure/omdb.service';
import { MovieService } from '../../domain/movie/movie.service';
import NodeCache from 'node-cache';

export class MovieMetadataService {
  constructor(
    private movieService: MovieService,
    private omdbService: OMDBService,
    private cacheManager = new NodeCache({ stdTTL: 10, checkperiod: 10 })
  ) {}

  async findEnrichedMovieById(id: number): Promise<any> {
    const movie = this.getFromCache(id);
    if (movie) {
      return movie;
    }
    const localMovie = this.movieService.findMovieById(id);
    const imdbMovie = await this.omdbService.findByImdbId(localMovie.imdbId);
    const enrichMovie = this.enrichMovie(localMovie, imdbMovie);
    this.putIntoCache(id, enrichMovie);
    return enrichMovie;
  }

  async findAllEnrichedMovies(): Promise<any[]> {
    const localMovies = this.movieService.getAll();
    return await this.fetchMovies(localMovies);
  }

  async searchEnrichedMovies(params: any): Promise<any[]> {
    const movies = await this.findAllEnrichedMovies();
    const localMovies = await this.filter(movies, params);
    return await this.fetchMovies(localMovies);
  }

  private async fetchMovies(localMovies: any[]) {
    const enrichedMovies: any[] = [];
    for (const localMovie of localMovies) {
      enrichedMovies.push(await this.findEnrichedMovieById(localMovie.id));
    }
    return enrichedMovies;
  }

  private enrichMovie(localMovie: any, imdbMovie: any): any {
    const enrichedMovie = { ...localMovie, ...imdbMovie };
    for (const key in enrichedMovie) {
      switch (key) {
        case 'Title':
          delete enrichedMovie['title'];
          break;
        case 'Plot':
          delete enrichedMovie['description'];
          break;
        case 'duration':
          delete enrichedMovie['Runtime'];
          break;
        case 'userrating':
          this.enrichRatings(enrichedMovie, key);
          delete enrichedMovie[key];
          break;
        case 'Director':
        case 'Writer':
        case 'Actors':
          enrichedMovie[key] = enrichedMovie[key].split(',');
          break;
      }
    }
    return enrichedMovie;
  }

  private enrichRatings(enrichedMovie: any, key: string): void {
    enrichedMovie['Ratings'] = enrichedMovie['Ratings'].concat(
      Object.keys(enrichedMovie[key]).map((property: any) => {
        return { Source: property, Value: `${enrichedMovie[key][property]}/10` };
      })
    );
  }

  private getFromCache(id: number): any {
    return this.cacheManager.get<any>(`enriched-movies-${id}`);
  }

  private putIntoCache(id: number, movie: any): any {
    return this.cacheManager.set(`enriched-movies-${id}`, movie);
  }

  private async filter(movies: any[], params: any): Promise<any[]> {
    const enrichedMovies: any[] = [];
    for (const localMovie of movies) {
      let flag = true;
      for (const key of Object.keys(params)) {
        if (localMovie[key] != params[key]) {
          flag = false;
        }
      }
      if (flag) {
        enrichedMovies.push(await this.findEnrichedMovieById(localMovie.id));
      }
    }
    return enrichedMovies;
  }
}
