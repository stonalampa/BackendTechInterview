import {
  IsEmail,
  IsString,
  Length,
  Matches,
  IsUrl,
  IsArray,
  ArrayMinSize,
} from 'class-validator';

export class RegisterClientDto {
  @IsString()
  @Length(2, 25)
  firstName: string;

  @IsString()
  @Length(2, 25)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(6, 50)
  @Matches(/^(?=.*[0-9]).*$/, {
    message: 'Password must contain at least one number',
  })
  password: string;

  @IsString()
  role: string;

  @IsUrl()
  avatar?: string;

  @IsArray()
  @ArrayMinSize(4, { message: 'At least 4 photos are required' })
  @IsUrl({}, { each: true })
  photos: string[];
}
