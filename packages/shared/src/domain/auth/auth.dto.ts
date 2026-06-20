export interface IAuthorizeDto {
  email: string;
  password: string;
}

export interface IEmailVerifyRequest {
  token: string;
}

export interface ISignupRequest extends IAuthorizeDto {
  passwordConfirm: string;
}
