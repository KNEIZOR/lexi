import { IsEnum } from 'class-validator';
import { LanguageLevel } from '../../../generated/prisma/client.js';

export class UpdateUserLanguageDto {
  @IsEnum(LanguageLevel)
  level!: LanguageLevel;
}
