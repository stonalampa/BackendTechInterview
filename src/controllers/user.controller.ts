import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  NotFoundException,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { LoginClientDto } from '../dtos/login-client.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UseInterceptors(FilesInterceptor('photos'))
  async register(
    @UploadedFiles() photos,
    @Body() registerClientDto: RegisterClientDto,
  ) {
    if (!photos || photos.length < 4) {
      throw new BadRequestException('At least 4 photos are required');
    }

    const client = await this.userService.register(registerClientDto, photos);
    return client;
  }

  @Post('login')
  async login(@Body() loginClientDto: LoginClientDto) {
    return this.userService.login(loginClientDto);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUser(@Query('email') email: string) {
    const user = await this.userService.getUser(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
