import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
} from 'class-validator';
import {
  LanguageLevel,
  WordDifficulty,
} from '../../../generated/prisma/client.js';

export class CreateWordDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  text!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  translation!: string;

  @IsString()
  @IsNotEmpty()
  languageId!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsEnum(LanguageLevel)
  level!: LanguageLevel;

  @IsOptional()
  @IsEnum(WordDifficulty)
  difficulty?: WordDifficulty;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  transcription?: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(2048)
  audioUrl?: string;
}