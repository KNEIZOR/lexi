import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  LanguageLevel,
  WordDifficulty,
} from '../../../generated/prisma/client.js';

export class WordsQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsString()
  languageId?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsEnum(LanguageLevel)
  level?: LanguageLevel;

  @IsOptional()
  @IsEnum(WordDifficulty)
  difficulty?: WordDifficulty;
}