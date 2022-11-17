import { PaginationParams } from './../../utils/paginationParams';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room, RoomDocument } from './schemas/room.schema';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
    private readonly userService: UsersService,
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
        .limit(pageSize)
        .populate('members.user'),
      this.roomModel.countDocuments(),
    ]);
  }

  updateOne(updateRoomDto: UpdateRoomDto) {
    return this.roomModel
      .findOneAndUpdate({ _id: updateRoomDto._id }, updateRoomDto)
      .populate('members.user');
  }

  findOne(filter) {
    return this.roomModel
      .findOne(filter)
      .populate<{ 'member.user': User }>('members.user');
  }

  async leaveRoom(roomId, userId) {
    const room = await this.roomModel.findOne({ _id: roomId });

    room.members = room.members.filter(
      (m) => m.user.toString() !== userId?.toString(),
    );

    return room.save();
  }

  async joinRoom(roomId, userId) {
    const [room, user] = await Promise.all([
      this.roomModel.findOne({ _id: roomId }),
      this.userService.findOneByKey(userId),
    ]);

    room.members.push({ user: userId, alias: user.nick });

    return room.save();
  }
}
