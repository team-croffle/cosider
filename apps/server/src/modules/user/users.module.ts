import { Module } from '@nestjs/common';

import { ParseUserHandlePipe } from './pipes/parse-user-handle.pipe';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ParseUserHandlePipe],
  exports: [ParseUserHandlePipe],
})
export class UserModule {}
