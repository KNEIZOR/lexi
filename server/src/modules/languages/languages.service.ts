import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateLanguageDto } from './dto/create-language.dto.js';

@Injectable()
export class LanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.language.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const language = await this.prisma.language.findUnique({
      where: {
        id,
      },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    return language;
  }

  async create(dto: CreateLanguageDto) {
    return this.prisma.language.create({
      data: {
        code: dto.code,
        name: dto.name,
      },
    });
  }
}
