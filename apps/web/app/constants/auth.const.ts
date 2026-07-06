export const OAuthProvider = {
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

export type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];
