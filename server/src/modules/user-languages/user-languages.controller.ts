import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/types/auth-user.type.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { CreateUserLanguageDto } from './dto/create-user-language.dto.js';
import { UpdateUserLanguageDto } from './dto/update-user-language.dto.js';
import { UserLanguagesService } from './user-languages.service.js';

@Controller('api/user-languages')
@UseGuards(AuthGuard)
export class UserLanguagesController {
  constructor(private readonly userLanguagesService: UserLanguagesService) {}

  @Get()
  getUserLanguages(@CurrentUser() user: AuthUser) {
    return this.userLanguagesService.getUserLanguages(user.id);
  }

  @Post()
  createUserLanguage(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateUserLanguageDto,
  ) {
    return this.userLanguagesService.createUserLanguage(user.id, dto);
  }

  @Patch(':id')
  updateUserLanguage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserLanguageDto,
  ) {
    return this.userLanguagesService.updateUserLanguage(user.id, id, dto);
  }

  @Post(':id/activate')
  activateUserLanguage(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.userLanguagesService.activateUserLanguage(user.id, id);
  }

  @Delete(':id')
  deleteUserLanguage(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.userLanguagesService.deleteUserLanguage(user.id, id);
  }
}
