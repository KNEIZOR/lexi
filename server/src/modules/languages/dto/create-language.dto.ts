import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { LanguageCode } from '../../../generated/prisma/client.js';

export class CreateLanguageDto {
  @IsEnum(LanguageCode)
  code!: LanguageCode;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;
}