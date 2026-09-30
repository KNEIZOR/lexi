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
        learningLevel: true,
        nativeLanguageId: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException({
        code: 'AUTH_USER_NOT_FOUND',
      });
    }

    const [
      totalWords,
      newWords,
      learningWords,
      masteredWords,
      totalSessions,
      totalAttempts,
      correctAttempts,
      attemptDates,
    ] = await Promise.all([
      this.prisma.userWord.count({
        where: {
          userId,
        },
      }),

      this.prisma.userWord.count({
        where: {
          userId,
          status: 'NEW',
        },
      }),

      this.prisma.userWord.count({
        where: {
          userId,
          status: 'LEARNING',
        },
      }),

      this.prisma.userWord.count({
        where: {
          userId,
          status: 'MASTERED',
        },
      }),

      this.prisma.learningSession.count({
        where: {
          userId,
        },
      }),

      this.prisma.learningAttempt.count({
        where: {
          session: {
            userId,
          },
        },
      }),

      this.prisma.learningAttempt.count({
        where: {
          session: {
            userId,
          },
          result: 'CORRECT',
        },
      }),

      this.prisma.learningAttempt.findMany({
        where: {
          session: {
            userId,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    const accuracy =
      totalAttempts > 0
        ? Math.round((correctAttempts / totalAttempts) * 100)
        : 0;

    const currentStreak = this.calculateCurrentStreak(
      attemptDates.map((attempt) => attempt.createdAt),
    );

    return {
      user,
      stats: {
        totalWords,
        newWords,
        learningWords,
        masteredWords,
        totalSessions,
        totalAttempts,
        correctAnswers: correctAttempts,
        accuracy,
        currentStreak,
      },
    };
  }

  private calculateCurrentStreak(dates: Date[]): number {
    if (dates.length === 0) {
      return 0;
    }

    const uniqueDays = new Set(dates.map((date) => this.toDateKey(date)));

    const sortedDays = Array.from(uniqueDays).sort((a, b) =>
      b.localeCompare(a),
    );

    if (sortedDays.length === 0) {
      return 0;
    }

    const today = this.toDateKey(new Date());
    const yesterday = this.toDateKey(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
    );

    const latestDay = sortedDays[0];

    if (latestDay !== today && latestDay !== yesterday) {
      return 0;
    }

    let streak = 0;
    let expectedDate = new Date(`${latestDay}T00:00:00`);

    for (const day of sortedDays) {
      const expectedKey = this.toDateKey(expectedDate);

      if (day !== expectedKey) {
        break;
      }

      streak += 1;

      expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000);
    }

    return streak;
  }

  private toDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
