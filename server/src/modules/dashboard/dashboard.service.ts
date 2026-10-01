import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        nativeLanguageId: true,
        createdAt: true,

        activeLearningLanguage: {
          select: {
            id: true,
            level: true,

            language: {
              select: {
                id: true,
                code: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH_USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    const activeLearningLanguageId = user.activeLearningLanguage?.id ?? null;

    if (!activeLearningLanguageId) {
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          nativeLanguageId: user.nativeLanguageId,
          createdAt: user.createdAt,
          activeLearningLanguage: null,
        },

        stats: {
          totalWords: 0,
          newWords: 0,
          learningWords: 0,
          masteredWords: 0,
          totalSessions: 0,
          totalAttempts: 0,
          correctAnswers: 0,
          accuracy: 0,
          currentStreak: 0,
        },
      };
    }

    const [
      totalWords,
      newWords,
      learningWords,
      masteredWords,
      totalSessions,
      totalAttempts,
      correctAnswers,
      currentStreak,
    ] = await Promise.all([
      this.prisma.userWord.count({
        where: {
          userId,
          userLearningLanguageId: activeLearningLanguageId,
        },
      }),

      this.prisma.userWord.count({
        where: {
          userId,
          userLearningLanguageId: activeLearningLanguageId,
          status: 'NEW',
        },
      }),

      this.prisma.userWord.count({
        where: {
          userId,
          userLearningLanguageId: activeLearningLanguageId,
          status: 'LEARNING',
        },
      }),

      this.prisma.userWord.count({
        where: {
          userId,
          userLearningLanguageId: activeLearningLanguageId,
          status: 'MASTERED',
        },
      }),

      this.prisma.learningSession.count({
        where: {
          userId,
          userLearningLanguageId: activeLearningLanguageId,
        },
      }),

      this.prisma.learningAttempt.count({
        where: {
          session: {
            userId,
            userLearningLanguageId: activeLearningLanguageId,
          },
        },
      }),

      this.prisma.learningAttempt.count({
        where: {
          session: {
            userId,
            userLearningLanguageId: activeLearningLanguageId,
          },
          result: 'CORRECT',
        },
      }),

      this.calculateCurrentStreak(userId, activeLearningLanguageId),
    ]);

    const accuracy =
      totalAttempts > 0
        ? Math.round((correctAnswers / totalAttempts) * 100)
        : 0;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        nativeLanguageId: user.nativeLanguageId,
        createdAt: user.createdAt,
        activeLearningLanguage: user.activeLearningLanguage,
      },

      stats: {
        totalWords,
        newWords,
        learningWords,
        masteredWords,
        totalSessions,
        totalAttempts,
        correctAnswers,
        accuracy,
        currentStreak,
      },
    };
  }

  private async calculateCurrentStreak(
    userId: string,
    userLearningLanguageId: string,
  ): Promise<number> {
    const sessions = await this.prisma.learningSession.findMany({
      where: {
        userId,
        userLearningLanguageId,
        completedAt: {
          not: null,
        },
      },
      select: {
        completedAt: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    if (sessions.length === 0) {
      return 0;
    }

    const uniqueDates = new Set<string>();

    for (const session of sessions) {
      if (!session.completedAt) {
        continue;
      }

      uniqueDates.add(this.toDateKey(session.completedAt));
    }

    const dates = Array.from(uniqueDates).sort((a, b) => b.localeCompare(a));

    if (dates.length === 0) {
      return 0;
    }

    const today = this.toDateKey(new Date());

    let streak = 0;
    let expectedDate = today;

    for (const date of dates) {
      if (date === expectedDate) {
        streak += 1;
        expectedDate = this.getPreviousDate(expectedDate);

        continue;
      }

      if (streak === 0 && date === this.getPreviousDate(expectedDate)) {
        streak += 1;
        expectedDate = this.getPreviousDate(date);

        continue;
      }

      break;
    }

    return streak;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private getPreviousDate(dateKey: string): string {
    const date = new Date(`${dateKey}T00:00:00`);

    date.setDate(date.getDate() - 1);

    return this.toDateKey(date);
  }
}
