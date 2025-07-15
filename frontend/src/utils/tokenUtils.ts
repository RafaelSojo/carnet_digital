// src/utils/tokenUtils.ts

export const isTokenExpired = (expires_in: string): boolean => {
  if (!expires_in) return true;
  const expirationDate = new Date(expires_in);
  const now = new Date();
  return now >= expirationDate;
};