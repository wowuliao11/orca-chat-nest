import { PaginationParams } from './../../utils/paginationParams';
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Roles } from 'src/decorators/roles.decorator';
import Role from 'src/config/roles';
import { UpdateRoomDto } from './dto/update-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomService.create(createRoomDto);
  }

  @Get()
  async findAll(@Query() paginaion: PaginationParams) {
    const [data, count] = await this.roomService.findAll(paginaion);
    return { data, count };
  }

  @Roles(Role.ADMIN)
  @Patch()
  async updateOne(@Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.updateOne(updateRoomDto);
  }

  @Get('findOne')
  findOne(@Query('key') key: string) {
    return this.roomService.findOne({ title: key });
  }

  /***
   * Check is user have permission into the room
   */
  @Get('checkIsUserInRoom')
  async checkIsUserInRoom(@Query('roomTitle') title, @Req() req) {
    const room = await this.roomService.findOne({ title });

    if (!room)
      throw new HttpException(
        'I did not found this room: ' + title,
        HttpStatus.NOT_FOUND,
      );

    return room.members.some(
      (member) => member.user?._id?.toString() === req.user?.id?.toString(),
    );
  }

  /***
   * User leave room
   */
  @Patch('leaveRoom')
  async leaveRoom(@Body('roomTitle') roomTitle, @Req() req) {
    const room = await this.roomService.findOne({ title: roomTitle });
    if (!room)
      throw new HttpException(
        'Not found this room:' + roomTitle,
        HttpStatus.NOT_FOUND,
      );

    return this.roomService.leaveRoom(room._id, req.user?.id);
  }

  /***
   * User join room
   */
  @Patch('joinRoom')
  async joinRoom(@Body('roomTitle') roomTitle, @Req() req) {
    const room = await this.roomService.findOne({ title: roomTitle });

    if (!room)
      throw new HttpException(
        'Not found this room:' + roomTitle,
        HttpStatus.NOT_FOUND,
      );

    return this.roomService.joinRoom(room._id, req.user?.id);
  }
}
