import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../entities/user.entity';
import { RegisterClientDto } from '../dtos/register-client.dto';
import { LoginClientDto } from '../dtos/login-client.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
import { Multer } from 'multer'; // Import the Multer namespace

@Injectable()
export class UserService {
  private s3: AWS.S3;
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    });
  }

  async register(
    registerClientDto: RegisterClientDto,
    photos: Multer.File[], // Add the Multer namespace to the 'photos' parameter
  ): Promise<Client> {
    const { firstName, lastName, email, password, role, avatar } =
      registerClientDto;
    const photoUrls = await Promise.all(
      photos.map((photo) => this.uploadPhotoToS3(photo)),
    );

    const client = new Client();
    client.firstName = firstName;
    client.lastName = lastName;
    client.email = email;
    client.password = await bcrypt.hash(password, 10);
    client.role = role;
    client.avatar = avatar;
    client.photos = photoUrls;

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

  async getUser(email: string): Promise<Client> {
    const user = await this.clientRepository.findOne({ where: { email } });
    return user;
  }

  async uploadPhotoToS3(file: Multer.File): Promise<string> {
    const type = file.mimetype.split('/')[1];
    const key = `${uuidv4()}.${type}`;

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const data = await this.s3.upload(params).promise();
    return data.Location;
  }
}
