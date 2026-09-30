import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateWordDto } from './dto/create-word.dto.js';
import { WordsQueryDto } from './dto/words-query.dto.js';

@Injectable()
export class WordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: WordsQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = {
      isActive: true,
      ...(query.languageId && {
        languageId: query.languageId,
      }),
      ...(query.categoryId && {
        categoryId: query.categoryId,
      }),
      ...(query.level && {
        level: query.level,
      }),
      ...(query.difficulty && {
        difficulty: query.difficulty,
      }),
    };

    const [words, total] = await Promise.all([
      this.prisma.word.findMany({
        where,
        include: {
          language: true,
          category: true,
          examples: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),

      this.prisma.word.count({
        where,
      }),
    ]);

    return {
      data: words,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string) {
    const word = await this.prisma.word.findUnique({
      where: {
        id,
      },
      include: {
        language: true,
        category: true,
        examples: true,
      },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    return word;
  }

  async create(dto: CreateWordDto) {
    const language = await this.prisma.language.findUnique({
      where: {
        id: dto.languageId,
      },
    });

    if (!language) {
      throw new NotFoundException('Language not found');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: {
          id: dto.categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.word.create({
      data: {
        text: dto.text,
        translation: dto.translation,
        languageId: dto.languageId,
        categoryId: dto.categoryId,
        level: dto.level,
        difficulty: dto.difficulty,
        transcription: dto.transcription,
        audioUrl: dto.audioUrl,
      },
      include: {
        language: true,
        category: true,
        examples: true,
      },
    });
  }
}