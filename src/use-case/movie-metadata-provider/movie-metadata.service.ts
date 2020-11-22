import { OMDBService } from '../../infrastructure/omdb.service';
import { MovieService } from '../../domain/movie/movie.service';

export class MovieMetadataService {
  constructor(private movieService: MovieService, private omdbService: OMDBService) {}

  async findEnrichedMovieById(id: number): Promise<any> {
    const localMovie = this.movieService.findMovieById(id);
    const imdbMovie = await this.omdbService.findByImdbId(localMovie.imdbId);
    return this.enrichMovie(localMovie, imdbMovie);
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
}
