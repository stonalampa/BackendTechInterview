import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/user.entity';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { LoginClientDto } from '../dtos/login-client.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerClientDto: RegisterClientDto): Promise<Client> {
    const { firstName, lastName, email, password, role, avatar, photos } =
      registerClientDto;

    const client = new Client();
    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;
    client.password = await bcrypt.hash(password, 10);
    client.role = role;
    client.avatar = avatar;
    client.photos = photos;

    return this.clientRepository.save(client);
  }

  async login(loginClientDto: LoginClientDto): Promise<{ token: string }> {
    const { email, password } = loginClientDto;

    const client = await this.clientRepository.findOne({ where: { email } });
    if (!client || !(await bcrypt.compare(password, client.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: client.email, sub: client.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
