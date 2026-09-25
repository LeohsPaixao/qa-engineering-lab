export interface JwtPayload {
  sub: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  id: number;
  email: string;
  full_name: string;
  social_name: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}
