import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import {
  CheckHandleExistsResponse,
  DeactivateReqeust,
  DeactivateResponse,
  RestoreRequest,
  RestoreResponse,
  UserProfileResponse,
} from './dto';
import { UsersService } from './users.service';
// import { DeactivateGuard } from '../guards/deactivate.guard'

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(DeactivateGuard)
  deactivate(@Body() deactivate: DeactivateReqeust): DeactivateResponse {
    console.log(deactivate);
    return {
      message: '계정 삭제가 완료 되었습니다.',
    };
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  restore(@Body() restore: RestoreRequest): RestoreResponse {
    console.log(restore);
    return {
      message: '계정이 복구되었습니다.',
    };
  }

  @Get(':handle')
  getProfile(@Param('handle') handle: string): UserProfileResponse {
    return this.usersService.getProfile(handle);
  }

  @Get('exists/handle')
  checkHandleExists(@Query('handle') handle: string): CheckHandleExistsResponse {
    return this.usersService.checkHandleExists(handle);
  }
}
