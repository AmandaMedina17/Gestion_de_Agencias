import { Test, TestingModule } from '@nestjs/testing';
import { BillboardListController } from './billboard-list.controller';

describe('BillboardListController', () => {
  let controller: BillboardListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillboardListController],
    }).compile();

    controller = module.get<BillboardListController>(BillboardListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
