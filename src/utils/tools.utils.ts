import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const objectIdTransformer = (bar, key) => {
  if (!Types.ObjectId.isValid(bar)) {
    throw new BadRequestException('Invalid ObjectId' + (key ? ': ' + key : ''));
  }

  return Types.ObjectId.createFromHexString(bar);
};
