import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { LanguagesModule } from './modules/languages/languages.module.js';
import { CategoriesModule } from './modules/categories/categories.module.js';
import { WordsModule } from './modules/words/words.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { UserLanguagesModule } from './modules/user-languages/user-languages.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    LanguagesModule,
    CategoriesModule,
    WordsModule,
    AuthModule,
    DashboardModule,
    UserLanguagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
