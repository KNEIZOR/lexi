import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { CategoriesService } from './categories.service.js';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }
}
