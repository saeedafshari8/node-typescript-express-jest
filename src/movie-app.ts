import express from 'express';
import cors from 'cors';
import { moviesRouter } from './use-case/movie-metadata-provider/movies.route';

const app = express();

app.use(cors());
app.use('/api/movies', moviesRouter);
app.use(express.json());

app.listen(8000, () => {
  console.log('Server Started at Port, 8000');
});
