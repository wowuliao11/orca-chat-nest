import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CreateUserDto } from './dto/create.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Public()
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.createOne(body);
  }
}
