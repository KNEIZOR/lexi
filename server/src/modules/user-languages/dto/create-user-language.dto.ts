import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { LanguageLevel } from '../../../generated/prisma/client.js';

export class CreateUserLanguageDto {
  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @IsEnum(LanguageLevel)
  level!: LanguageLevel;
}
