import { Test, TestingModule } from '@nestjs/testing';
import { BillboardListService } from './billboard-list.service';

describe('BillboardListService', () => {
  let service: BillboardListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillboardListService],
    }).compile();

    service = module.get<BillboardListService>(BillboardListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
