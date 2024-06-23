import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { LoginClientDto } from '../dtos/login-client.dto';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerClientDto: RegisterClientDto) {
    if (registerClientDto.photos.length < 4) {
      throw new BadRequestException('At least 4 photos are required');
    }
    const client = await this.userService.register(registerClientDto);
    return client;
  }

  @Post('login')
  async login(@Body() loginClientDto: LoginClientDto) {
    return this.userService.login(loginClientDto);
  }
}
