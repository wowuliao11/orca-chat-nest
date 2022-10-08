import { Module } from '@nestjs/common';
import { CosController } from './cos.controller';
import { CosService } from './cos.service';

@Module({
  providers: [CosService],
  exports: [CosService],
  controllers: [CosController],
})
export class CosModule {}
