import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateLanguageDto } from './dto/create-language.dto.js';
import { LanguagesService } from './languages.service.js';

@Controller('api/languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateLanguageDto) {
    return this.languagesService.create(dto);
  }
}
