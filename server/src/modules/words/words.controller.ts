import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto.js';
import { WordsQueryDto } from './dto/words-query.dto.js';
import { WordsService } from './words.service.js';

@Controller('api/words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Get()
  findAll(@Query() query: WordsQueryDto) {
    return this.wordsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wordsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWordDto) {
    return this.wordsService.create(dto);
  }
}