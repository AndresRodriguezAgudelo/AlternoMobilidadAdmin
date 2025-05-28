export const API_BASE_URL = 'https://back-app-equisoft-production.up.railway.app/api/sign/v1';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login-email`
  },
  SERVICES: {
    LIST: `${API_BASE_URL}/servicing`,
    ORDER_LIST: `${API_BASE_URL}/list`
  },
  GUIDES: {
    LIST: `${API_BASE_URL}/guides`,
    DETAIL: (id: number | string) => `${API_BASE_URL}/guides/${id}`
  },
  IMAGES: {
    FILE: (key: string) => `${API_BASE_URL}/files/file/${key}`
  },
  USERS: {
    LIST: `${API_BASE_URL}/user`,
    UPDATE: (id: number) => `${API_BASE_URL}/user/${id}`
  },
  QUERIES: {
    LIST: `${API_BASE_URL}/query-history`
  },
  REPORTS: {
    DOWNLOAD: (module: string) => `${API_BASE_URL}/reports/${module}/excel`
  }
} as const;
