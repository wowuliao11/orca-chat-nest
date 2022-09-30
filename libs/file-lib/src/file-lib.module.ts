import { Module } from '@nestjs/common';
import { FileLibService } from './file-lib.service';

@Module({
  providers: [FileLibService],
  exports: [FileLibService],
})
export class FileLibModule {}
