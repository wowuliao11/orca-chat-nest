import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

import { Public } from 'src/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create.dto';
import { EditProfileDto } from './dto/edit-profile.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.registe(body);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('editProfile')
  async editProfile(@Body() body: EditProfileDto, @Request() req) {
    console.log(req.user.id);
    const result = await this.usersService.updateOne({
      id: req.user?.id,
      user: body,
    });
    return result;
  }
}
