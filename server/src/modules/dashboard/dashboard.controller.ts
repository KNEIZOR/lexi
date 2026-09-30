import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { AuthUser } from '../../common/types/auth-user.type.js';
import { AuthGuard } from '../auth/guards/auth.guard.js';
import { DashboardService } from './dashboard.service.js';

@Controller('api/dashboard')
@UseGuards(AuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@CurrentUser() user: AuthUser) {
    return this.dashboardService.getDashboard(user.id);
  }
}
