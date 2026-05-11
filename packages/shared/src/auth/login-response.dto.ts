export class LoginResponseDto {
  /**
   * 서버에서 발급한 JWT Access Token
   * @example 'eyJhb...' (string)
   */
  readonly accessToken: string;

  /**
   * 서버에서 발급한 JWT Refresh Token
   * @example 'eyJhb...' (string)
   */
  readonly refreshToken: string;

  /**
   * Access Token 만료 시간 (초)
   * @example 60 * 60 * 24 (24 hours)
   */
  readonly expiresIn: number;
}
