import { PaginationParams } from './../../utils/paginationParams';
import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { Roles } from 'src/decorators/roles.decorator';
import Role from 'src/config/roles';

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
}
