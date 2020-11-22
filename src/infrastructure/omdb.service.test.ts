import { OMDBService } from './omdb.service';

describe('omdb-service tests', () => {
  let omdbService: OMDBService;

  beforeEach(() => {
    omdbService = new OMDBService();
  });

  it('omdbService is instantiated correctly', async () => {
    expect(omdbService).toBeTruthy();
  });
});
