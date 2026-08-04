import { ArgumentsHost, Catch, ExceptionFilter, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';

import { OAuthException } from '../exception/oauth.exception';

interface OAuthErrorResponse {
  errorCode?: string;
  meta?: {
    providers?: string[];
    userId?: string;
  };
}

@Catch(OAuthException)
@Injectable()
export class OAuthExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: OAuthException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');

    let errorCode = 'AUTH_FAILED';
    let providers = '';

    const responseBody = exception.getResponse();

    if (typeof responseBody === 'object' && responseBody !== null) {
      const body = responseBody as OAuthErrorResponse;
      errorCode = body.errorCode || errorCode;

      const metaProviders = body.meta?.providers;
      if (Array.isArray(metaProviders)) {
        providers = metaProviders.join(',');
      }
    } else if (typeof responseBody === 'string') {
      errorCode = responseBody;
    }

    const redirectUrl = new URL(`${clientUrl}/login`);
    redirectUrl.searchParams.set('error', errorCode);
    if (providers) {
      redirectUrl.searchParams.set('providers', providers);
    }

    response.redirect(redirectUrl.toString());
  }
}
