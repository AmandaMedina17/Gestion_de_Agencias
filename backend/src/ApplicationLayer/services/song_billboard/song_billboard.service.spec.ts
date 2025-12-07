import { Test, TestingModule } from '@nestjs/testing';
import { SongBillboardService } from './song_billboard.service';

describe('SongBillboard', () => {
  let provider: SongBillboardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SongBillboardService],
    }).compile();

    provider = module.get<SongBillboardService>(SongBillboardService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
