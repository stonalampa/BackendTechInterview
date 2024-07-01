import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserController } from 'src/controllers/user.controller';
import { Client } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
