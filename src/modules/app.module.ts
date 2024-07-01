import { Module } from '@nestjs/common';
import { AppService } from '../services/app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AppController } from 'src/controllers/app.controller';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'test123',
      database: 'testdb',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
