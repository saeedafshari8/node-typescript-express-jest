import fs from 'fs';
import log, { Logger } from 'loglevel';
import * as path from 'path';
import * as appRoot from 'app-root-path';

export class MovieRepository {
  constructor(private repoPath: string, private logger: Logger = log.getLogger('movie-repository')) {}

  getAll(): any[] {
    let fileNames: string[];
    try {
      fileNames = fs.readdirSync(this.repoPath);
    } catch (err) {
      this.logger.error(err.message);
      throw new Error('unable to read movies');
    }
    return fileNames.map((fileName) => {
      let content: string;
      try {
        content = fs.readFileSync(path.join(this.repoPath, fileName), 'utf-8');
      } catch (err) {
        this.logger.error(err.message);
        throw new Error(`unable to read file ${path.join(this.repoPath, fileName)}`);
      }
      try {
        return JSON.parse(content);
      } catch (err) {
        this.logger.error(err.message);
        throw new Error(`unable to parse file ${path.join(this.repoPath, fileName)}`);
      }
    });
  }
}

export const defaultMovieRepository = new MovieRepository(path.join(appRoot.path, 'movies'));
