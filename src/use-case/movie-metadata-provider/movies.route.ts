import { Router } from 'express';
import { MovieMetadataService } from './movie-metadata.service';
import { MovieService } from '../../domain/movie/movie.service';
import { OMDBService } from '../../infrastructure/omdb.service';
import { defaultMovieRepository } from '../../domain/movie/movie.repository';
import log from 'loglevel';

const logger = log.getLogger('movie-repository');
const moviesRouter = Router();
const movieMetadataService = new MovieMetadataService(new MovieService(defaultMovieRepository), new OMDBService());

moviesRouter.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    logger.error('Unable to parse id');
    return res.status(400).send('id must be a valid integer number');
  }
  try {
    const movie = await movieMetadataService.findEnrichedMovieById(id);
    return res.status(200).send(movie);
  } catch (err) {
    return res
      .status(500)
      .send(`at the moment the specified service is not available. Please try again later. ${err.message}`);
  }
});

moviesRouter.get('/search/query', async (req, res) => {
  try {
    if (Object.keys(req.query).length === 0) {
      const movies = await movieMetadataService.findAllEnrichedMovies();
      return res.status(200).send(movies);
    }
    const movies = await movieMetadataService.searchEnrichedMovies(req.query);
    return res.status(200).send(movies);
  } catch (err) {
    return res
      .status(500)
      .send(`at the moment the specified service is not available. Please try again later. ${err.message}`);
  }
});

export { moviesRouter };
