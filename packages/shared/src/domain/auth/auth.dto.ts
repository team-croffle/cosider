export interface IAuthorizeDto {
  email: string;
  password: string;
}

export interface IEmailVerifyRequest {
  email: string;
  code: string;
}
