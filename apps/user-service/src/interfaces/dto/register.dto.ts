import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
    minLength: 4,
    maxLength: 20,
  })
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'strong_password_123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
