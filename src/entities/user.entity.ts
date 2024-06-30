import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  TableInheritance,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import {
  IsEmail,
  IsString,
  Length,
  Matches,
  IsUrl,
  IsArray,
} from 'class-validator';
import { Photo } from './photo.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 25)
  firstName: string;

  @Column()
  @Length(2, 25)
  lastName: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Length(6, 50)
  @Matches(/^(?=.*[0-9]).*$/, {
    message: 'Password must contain at least one number',
  })
  password: string;

  @Column()
  @IsString()
  role: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity()
export class Client extends User {
  @Column({ nullable: true })
  @IsUrl()
  avatar: string;

  @Column('simple-array', { nullable: true })
  @IsArray()
  @IsUrl({}, { each: true })
  photos: string[];

  @Column()
  @IsString()
  fullName: string;

  @OneToMany(() => Photo, (photo) => photo.client)
  photoList: Photo[];

  @BeforeInsert()
  @BeforeUpdate()
  setFullName() {
    this.fullName = `${this.firstName} ${this.lastName}`;
  }

  @BeforeInsert()
  setDefaultAvatar() {
    if (!this.avatar) {
      this.avatar =
        'https://gravatar.com/avatar/08f9267228ffc3bf9104f1ced5473a3c?s=400&d=robohash&r=x';
    }
  }
}
