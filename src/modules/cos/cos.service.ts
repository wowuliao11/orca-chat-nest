import { HttpException, Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as mimeType from 'mime-types';

@Injectable()
export class CosService {
  minioClient: Minio.Client;
  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT,
      port: 9000,
      useSSL: false, // 暂未开通https哦
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
    await this.minioClient
      .putObject(process.env.MINIO_BUCKET_1, fileName, file.buffer, metadata)
      .catch((err) => {
        console.log(err);
        throw new HttpException(err, 500);
      });
    return `http://${process.env.MINIO_ENDPOINT}:9000/${process.env.MINIO_BUCKET_1}/${fileName}`;
  }
}
