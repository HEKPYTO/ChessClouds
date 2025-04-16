export interface CognitoIdentity {
  userId: string;
  providerName: string;
  providerType: string;
  issuer: string | null;
  primary: boolean;
  dateCreated: number;
}

export interface GoogleCognitoJwtPayload {
  at_hash: string;
  sub: string;
  'cognito:groups': string[];
  email_verified: boolean;
  iss: string;
  'cognito:username': string;
  aud: string;
  identities: CognitoIdentity[];
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  jti: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthCallbackResult {
  token: string | null;
  error: string | null;
  redirectPath: string | null;
}

export interface UserInfo {
  username?: string;
  'cognito:username'?: string;
  email?: string;
  sub?: string;
  email_verified?: boolean;
  'cognito:groups'?: string[];
  [key: string]: unknown;
}

export type JwtParseResult = GoogleCognitoJwtPayload | null;
