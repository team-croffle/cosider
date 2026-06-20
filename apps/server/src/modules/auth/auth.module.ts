import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshGuard } from './guard/refresh.guard';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserCredentialService } from './user-credential.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '15m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    UserCredentialService,
    // Passports
    JwtStrategy,

    //Guards
    LocalAuthGuard,
    JwtAuthGuard,
    RefreshGuard,
  ],
})
export class AuthModule {}
