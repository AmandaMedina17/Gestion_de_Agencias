import { Test, TestingModule } from '@nestjs/testing';
import { SongBillboardController } from './song_billboard.controller';

describe('SongBillboardController', () => {
  let controller: SongBillboardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SongBillboardController],
    }).compile();

    controller = module.get<SongBillboardController>(SongBillboardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
