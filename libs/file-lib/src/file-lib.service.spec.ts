import { Test, TestingModule } from '@nestjs/testing';
import { FileLibService } from './file-lib.service';

describe('FileLibService', () => {
  let service: FileLibService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileLibService],
    }).compile();

    service = module.get<FileLibService>(FileLibService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
