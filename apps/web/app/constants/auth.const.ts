const OAuthProvider = {
  GOOGLE: 'google',
  GITHUB: 'github',
} as const;

type OAuthProvider = (typeof OAuthProvider)[keyof typeof OAuthProvider];

export { OAuthProvider };
