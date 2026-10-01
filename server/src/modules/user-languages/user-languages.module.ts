import { Module } from '@nestjs/common';
import { UserLanguagesController } from './user-languages.controller.js';
import { UserLanguagesService } from './user-languages.service.js';

@Module({
  controllers: [UserLanguagesController],
  providers: [UserLanguagesService],
  exports: [UserLanguagesService],
})
export class UserLanguagesModule {}
