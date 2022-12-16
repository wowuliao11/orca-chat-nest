import { HttpException, Injectable, Logger } from '@nestjs/common';
import jimp, { AUTO } from 'jimp';
import * as Minio from 'minio';
import mimeType from 'mime-types';

@Injectable()
export class CosService {
  minioClient: Minio.Client;
  logger: Logger = new Logger('MINIO');
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_SECRET_KEY,
    });
  }
  async upload(file: Express.Multer.File) {
    const metadata = {
      'Content-Type': file.mimetype,
    };
    const fileName =
      Number(new Date()).toString() + '.' + mimeType.extension(file.mimetype);

    this.logger.log(file.mimetype);

    await this.minioClient
      .putObject(process.env.MINIO_BUCKET_1, fileName, file.buffer, metadata)
      .catch((err) => {
        this.logger.error(err.message);
        throw new HttpException(err, 400);
      });
    if (['image/gif'].includes(file.mimetype)) {
      await this.minioClient.putObject(
        process.env.MINIO_BUCKET_1,
        process.env.MINIO_BUCKET_THUMB_FOLDER_1 + '/' + fileName,
        file.buffer,
        metadata,
      );
    } else if (file.mimetype.includes('image'))
      // 当是图片的情况下进行一个缩略图的保存
      await this.minioClient.putObject(
        process.env.MINIO_BUCKET_1,
        process.env.MINIO_BUCKET_THUMB_FOLDER_1 + '/' + fileName,
        await (
          await jimp.read(file.buffer)
        )
          .resize(200, AUTO)
          .getBufferAsync(file.mimetype)
          .catch((err) => {
            throw new HttpException(err, 400);
          }),
        metadata,
      );
    return `${process.env.SSL ? 'https' : 'http'}://${
      process.env.MINIO_ENDPOINT
    }${process.env.SSL ? '' : ':' + process.env.MINIO_PORT}/${
      process.env.MINIO_BUCKET_1
    }/${fileName}`;
  }
}
