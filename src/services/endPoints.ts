export const API_BASE_URL = 'https://back-app-equisoft-production.up.railway.app/api/sign/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login-email`
  },
  SERVICES: {
    LIST: `${API_BASE_URL}/servicing`
  },
  USERS: {
    LIST: `${API_BASE_URL}/user`
  },
  QUERIES: {
    LIST: `${API_BASE_URL}/query-history`
  }
} as const;
