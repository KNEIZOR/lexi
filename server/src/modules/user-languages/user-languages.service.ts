import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { CreateUserLanguageDto } from './dto/create-user-language.dto.js';
import type { UpdateUserLanguageDto } from './dto/update-user-language.dto.js';

@Injectable()
export class UserLanguagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserLanguages(userId: string) {
    return this.prisma.userLearningLanguage.findMany({
      where: {
        userId,
      },
      include: {
        language: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createUserLanguage(userId: string, dto: CreateUserLanguageDto) {
    const language = await this.prisma.language.findUnique({
      where: {
        id: dto.languageId,
      },
    });

    if (!language) {
      throw new NotFoundException({
        code: 'LANGUAGE_NOT_FOUND',
        message: 'Language not found',
      });
    }

    const existing = await this.prisma.userLearningLanguage.findUnique({
      where: {
        userId_languageId: {
          userId,
          languageId: dto.languageId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException({
        code: 'USER_LANGUAGE_ALREADY_EXISTS',
        message: 'This language is already added to your learning languages',
      });
    }

    const userLanguage = await this.prisma.userLearningLanguage.create({
      data: {
        userId,
        languageId: dto.languageId,
        level: dto.level,
      },
      include: {
        language: true,
      },
    });

    const activeLanguage = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        activeLearningLanguageId: true,
      },
    });

    if (!activeLanguage) {
      throw new NotFoundException({
        code: 'AUTH_USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    if (!activeLanguage.activeLearningLanguageId) {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          activeLearningLanguageId: userLanguage.id,
        },
      });
    }

    return userLanguage;
  }

  async updateUserLanguage(
    userId: string,
    id: string,
    dto: UpdateUserLanguageDto,
  ) {
    const userLanguage = await this.prisma.userLearningLanguage.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!userLanguage) {
      throw new NotFoundException({
        code: 'USER_LANGUAGE_NOT_FOUND',
        message: 'Learning language not found',
      });
    }

    return this.prisma.userLearningLanguage.update({
      where: {
        id,
      },
      data: {
        level: dto.level,
      },
      include: {
        language: true,
      },
    });
  }

  async activateUserLanguage(userId: string, id: string) {
    const userLanguage = await this.prisma.userLearningLanguage.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        language: true,
      },
    });

    if (!userLanguage) {
      throw new NotFoundException({
        code: 'USER_LANGUAGE_NOT_FOUND',
        message: 'Learning language not found',
      });
    }

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        activeLearningLanguageId: userLanguage.id,
      },
    });

    return userLanguage;
  }

  async deleteUserLanguage(userId: string, id: string) {
    const userLanguage = await this.prisma.userLearningLanguage.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!userLanguage) {
      throw new NotFoundException({
        code: 'USER_LANGUAGE_NOT_FOUND',
        message: 'Learning language not found',
      });
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        activeLearningLanguageId: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'AUTH_USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    if (user.activeLearningLanguageId === id) {
      const replacement = await this.prisma.userLearningLanguage.findFirst({
        where: {
          userId,
          id: {
            not: id,
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      });

      await this.prisma.$transaction([
        this.prisma.userLearningLanguage.delete({
          where: {
            id,
          },
        }),
        this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            activeLearningLanguageId: replacement?.id ?? null,
          },
        }),
      ]);

      return {
        success: true,
      };
    }

    await this.prisma.userLearningLanguage.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
    };
  }
}
