import {
  DeactivateReqeustDto,
  DeactivateResponseDto,
  RestoreRequestDto,
  RestoreResponseDto,
  UserProfileResponseDto,
  CheckHandleExistsResponseDto,
} from '@cosider/shared';
import { Body, Controller, HttpCode, HttpStatus, Post, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
// import { DeactivateGuard } from '../guards/deactivate.guard'

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Post('deactivate')
  @HttpCode(HttpStatus.OK)
  // @UseGuards(DeactivateGuard)
  @ApiOperation({
    summary: 'Deactivate account',
    description: '계정 soft delete 수행 및 모든 세션 만료',
  })
  @ApiResponse({
    status: 200,
    type: DeactivateResponseDto,
    description: '계정이 삭제됨.',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자',
  })
  @ApiResponse({
    status: 409,
    description: '사용자의 명으로 남은 프로젝트가 존재함.',
  })
  deactivate(@Body() deactivate: DeactivateReqeustDto): DeactivateResponseDto {
    console.log(deactivate);
    return {
      message: '계정 삭제가 완료 되었습니다.',
    };
  }

  @Post('restore')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '계정 복구',
    description: '이메일 인증을 통해 탈퇴된 계정을 복구합니다.',
  })
  @ApiResponse({
    status: 200,
    type: RestoreResponseDto,
    description: '계정 복구 성공',
  })
  @ApiResponse({
    status: 400,
    description: '인증 코드 불일치',
  })
  @ApiResponse({
    status: 403,
    description: '복구 가능 기간 (탈퇴 후 1개월) 초과 ',
  })
  @ApiResponse({
    status: 404,
    description: '탈퇴된 계정을 찾을 수 없음',
  })
  @ApiResponse({
    status: 410,
    description: '인증 코드 만료',
  })
  restore(@Body() restoreDto: RestoreRequestDto): RestoreResponseDto {
    console.log(restoreDto);
    return {
      message: '계정이 복구되었습니다.',
    };
  }

  @Get(':handle')
  @ApiOperation({
    summary: "Get Other User's Profile",
    description: '다른 유저의 공개 프로필 조회',
  })
  @ApiResponse({
    status: 200,
    type: UserProfileResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'handle 조회 실패',
  })
  getProfile(
    @Param('handle') handle: string,
  ): UserProfileResponseDto {
    return this.usersService.getProfile(handle);
  }

  @ApiOperation({
  summary: 'Check Handle Exists',
  description: '핸들 사용 가능 여부 조회',
  })
  @ApiResponse({
    status: 200,
    type: CheckHandleExistsResponseDto,
    description: '조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '조회 실패',
  })
  @Get('exists/handle')
  checkHandleExists(
    @Query('handle') handle: string,
  ): CheckHandleExistsResponseDto {
    return this.usersService.checkHandleExists(handle);
  }
}
