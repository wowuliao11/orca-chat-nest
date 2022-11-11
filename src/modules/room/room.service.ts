import { PaginationParams } from './../../utils/paginationParams';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomDocument } from './schemas/room.schema';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {}

  create(createRoomDto: CreateRoomDto) {
    return this.roomModel.create(createRoomDto);
  }

  findAll(pagination: PaginationParams) {
    const { pageSize, pageIndex } = pagination;
    return Promise.all([
      this.roomModel
        .find()
        .skip(pageSize * (pageIndex - 1))
        .limit(pageSize),
      this.roomModel.countDocuments(),
    ]);
  }
}
