import { MovieService } from '../../domain/movie/movie.service';
import { OMDBService } from '../../infrastructure/omdb.service';
import { defaultMovieRepository } from '../../domain/movie/movie.repository';
import { MovieMetadataService } from './movie-metadata.service';

describe('movie-metadata-service tests', () => {
  let movieMetadataService: MovieMetadataService;
  let movieService: MovieService;
  let omdbService: OMDBService;

  beforeEach(() => {
    movieService = new MovieService(defaultMovieRepository);
    omdbService = new OMDBService();
    movieMetadataService = new MovieMetadataService(movieService, omdbService);
  });

  it('movieMetadataService is instantiated correctly', async () => {
    expect(movieMetadataService).toBeTruthy();
  });

  it('finds a reached movie metadata by id and Title overwrites title', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie',
      originalLanguage: 'en'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Title: 'imdb-movie'
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      Title: 'imdb-movie',
      originalLanguage: 'en'
    });
  });

  it('finds a reached movie metadata by id and Plot overwrites description', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie',
      description: 'description'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Plot: 'Plot'
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      title: 'local-movie',
      Plot: 'Plot'
    });
  });

  it('finds a reached movie metadata by id and duration overwrites Runtime', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie',
      duration: 'duration'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Runtime: 'Runtime'
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      title: 'local-movie',
      duration: 'duration'
    });
  });

  it('finds a reached movie metadata by id and userrating should be a part of Ratings', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie',
      userrating: {
        countStar1: 5
      }
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Runtime: 'Runtime',
      Ratings: [{ Source: 'Internet Movie Database', Value: '8.6/10' }]
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      title: 'local-movie',
      Ratings: [
        { Source: 'Internet Movie Database', Value: '8.6/10' },
        { Source: 'countStar1', Value: '5/10' }
      ],
      Runtime: 'Runtime'
    });
  });

  it('finds a reached movie metadata by id and Director should change to string[]', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Runtime: 'Runtime',
      Director: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      title: 'local-movie',
      Runtime: 'Runtime',
      Director: ['George Lucas', 'Quentin Tarantino']
    });
  });

  it('finds a reached movie metadata by id and Writer should change to string[]', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Runtime: 'Runtime',
      Writer: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      title: 'local-movie',
      Runtime: 'Runtime',
      Writer: ['George Lucas', 'Quentin Tarantino']
    });
  });

  it('finds a reached movie metadata by id and Actors should change to string[]', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Runtime: 'Runtime',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = () => mockMovie;
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findEnrichedMovieById(1234);

    expect(enrichedMetadata).toEqual({
      imdbId: '1234',
      title: 'local-movie',
      Runtime: 'Runtime',
      Actors: ['George Lucas', 'Quentin Tarantino']
    });
  });

  it('findAllEnrichedMovies should return all enriched movies', async () => {
    const mockMovie = {
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockImdbMovie = {
      imdbId: '1234',
      Runtime: 'Runtime',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = () => mockMovie;
    movieService.getAll = () => [mockMovie];
    omdbService.findByImdbId = () => new Promise<any>((resolve) => resolve(mockImdbMovie));

    const enrichedMetadata = await movieMetadataService.findAllEnrichedMovies();

    expect(enrichedMetadata).toEqual([
      {
        imdbId: '1234',
        title: 'local-movie',
        Runtime: 'Runtime',
        Actors: ['George Lucas', 'Quentin Tarantino']
      }
    ]);
  });

  it('searchEnrichedMovies should return only filtered enriched movies', async () => {
    const mockMovie1 = {
      id: 1,
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockMovie2 = {
      id: 2,
      imdbId: '1235',
      title: 'local-movie'
    };
    const mockImdbMovie1 = {
      id: 1,
      imdbId: '1234',
      Runtime: 'Runtime1',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    const mockImdbMovie2 = {
      id: 2,
      imdbId: '1235',
      Runtime: 'Runtime2',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = (id) => (id === 1 ? mockMovie1 : mockMovie2);
    movieService.getAll = () => [mockMovie1, mockMovie2];
    omdbService.findByImdbId = (imdbId) =>
      new Promise<any>((resolve) => resolve(imdbId === '1234' ? mockImdbMovie1 : mockImdbMovie2));

    const enrichedMetadata = await movieMetadataService.searchEnrichedMovies({
      id: '1',
      Runtime: 'Runtime1',
      Actors: 'George Lucas'
    });

    expect(enrichedMetadata).toEqual([
      {
        id: 1,
        imdbId: '1234',
        title: 'local-movie',
        Runtime: 'Runtime1',
        Actors: ['George Lucas', 'Quentin Tarantino']
      }
    ]);
  });

  it('searchEnrichedMovies should return only filtered enriched movies insensitive case', async () => {
    const mockMovie1 = {
      id: 1,
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockMovie2 = {
      id: 2,
      imdbId: '1235',
      title: 'local-movie'
    };
    const mockImdbMovie1 = {
      id: 1,
      imdbId: '1234',
      Runtime: 'Runtime1',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    const mockImdbMovie2 = {
      id: 2,
      imdbId: '1235',
      Runtime: 'Runtime2',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = (id) => (id === 1 ? mockMovie1 : mockMovie2);
    movieService.getAll = () => [mockMovie1, mockMovie2];
    omdbService.findByImdbId = (imdbId) =>
      new Promise<any>((resolve) => resolve(imdbId === '1234' ? mockImdbMovie1 : mockImdbMovie2));

    const enrichedMetadata = await movieMetadataService.searchEnrichedMovies({
      iD: '1',
      RUNTIME: 'Runtime1',
      ActorS: 'George Lucas'
    });

    expect(enrichedMetadata).toEqual([
      {
        id: 1,
        imdbId: '1234',
        title: 'local-movie',
        Runtime: 'Runtime1',
        Actors: ['George Lucas', 'Quentin Tarantino']
      }
    ]);
  });

  it('searchEnrichedMovies should not return any value as search key not found', async () => {
    const mockMovie1 = {
      id: 1,
      imdbId: '1234',
      title: 'local-movie'
    };
    const mockMovie2 = {
      id: 2,
      imdbId: '1235',
      title: 'local-movie'
    };
    const mockImdbMovie1 = {
      id: 1,
      imdbId: '1234',
      Runtime: 'Runtime1',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    const mockImdbMovie2 = {
      id: 2,
      imdbId: '1235',
      Runtime: 'Runtime2',
      Actors: 'George Lucas,Quentin Tarantino'
    };
    movieService.findMovieById = (id) => (id === 1 ? mockMovie1 : mockMovie2);
    movieService.getAll = () => [mockMovie1, mockMovie2];
    omdbService.findByImdbId = (imdbId) =>
      new Promise<any>((resolve) => resolve(imdbId === '1234' ? mockImdbMovie1 : mockImdbMovie2));

    const enrichedMetadata = await movieMetadataService.searchEnrichedMovies({
      unknown: '1'
    });

    expect(enrichedMetadata).toEqual([]);
  });
});
