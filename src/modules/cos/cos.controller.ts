import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CosService } from './cos.service';

@Controller('cos')
export class CosController {
  constructor(private cosService: CosService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image', maxCount: 5 },
      { name: 'file', maxCount: 1 },
    ]),
  )
  async upload(
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
      file?: Express.Multer.File[];
    },
  ) {
    const result: {
      file?: string[];
      image?: string[];
    } = {};

    result.file = await Promise.all(
      files.file?.map((f: Express.Multer.File) => this.cosService.upload(f)) ||
        [],
    );

    result.image = await Promise.all(
      files.image?.map((f: Express.Multer.File) => this.cosService.upload(f)) ||
        [],
    );

    return result;
  }
}
