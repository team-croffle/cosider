import {
  CheckHandleExistsResponseDto,
  DeactivateReqeustDto,
  DeactivateResponseDto,
  RestoreRequestDto,
  RestoreResponseDto,
  UserProfileResponseDto,
} from '@cosider/shared';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query } from '@nestjs/common';

import { UsersService } from './users.service';
// import { DeactivateGuard } from '../guards/deactivate.guard'

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(DeactivateGuard)
  deactivate(@Body() deactivate: DeactivateReqeustDto): DeactivateResponseDto {
    console.log(deactivate);
    return {
      message: '계정 삭제가 완료 되었습니다.',
    };
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  restore(@Body() restoreDto: RestoreRequestDto): RestoreResponseDto {
    console.log(restoreDto);
    return {
      message: '계정이 복구되었습니다.',
    };
  }

  @Get(':handle')
  getProfile(@Param('handle') handle: string): UserProfileResponseDto {
    return this.usersService.getProfile(handle);
  }

  @Get('exists/handle')
  checkHandleExists(@Query('handle') handle: string): CheckHandleExistsResponseDto {
    return this.usersService.checkHandleExists(handle);
  }
}
