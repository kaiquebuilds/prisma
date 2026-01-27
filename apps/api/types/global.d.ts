/// <reference types="@clerk/express/env" />

export {};

declare global {
  interface CustomJwtSessionClaims {
    prismaUserId?: string;
  }
}
