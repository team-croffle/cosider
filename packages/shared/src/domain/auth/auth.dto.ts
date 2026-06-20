export interface IAuthorizeDto {
  email: string;
  password: string;
}

export interface IEmailVerifyRequest {
  token: string;
}
