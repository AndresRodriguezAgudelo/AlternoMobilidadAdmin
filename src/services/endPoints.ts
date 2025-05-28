

//export const API_BASE_URL = 'https://0b9619997bbcbdbff41bed4641785ae4.serveo.net/api/sign/v1';
export const API_BASE_URL = 'https://equirentappbackend-dev-f9e9d0geh6dgdkeu.eastus2-01.azurewebsites.net/api/sign/v1';



export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login-email`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`
  },
  SERVICES: {
    LIST: `${API_BASE_URL}/servicing`,
    ORDER_LIST: `${API_BASE_URL}/list`
  },
  GUIDES: {
    LIST: `${API_BASE_URL}/guides`,
    DETAIL: (id: number | string) => `${API_BASE_URL}/guides/${id}`
  },
  CATEGORIES: {
    LIST: `${API_BASE_URL}/category`,
    ORDER_LIST: `${API_BASE_URL}/category`
  },
  IMAGES: {
    FILE: (key: string) => `${API_BASE_URL}/files/file/${key}`
  },
  USERS: {
    LIST: `${API_BASE_URL}/user`,
    UPDATE: (id: number) => `${API_BASE_URL}/user/${id}`
  },
  QUERIES: {
    LIST: `${API_BASE_URL}/query-history`,
    MODULES: `${API_BASE_URL}/query-history/modules`,
    PAYMENTLIST: `${API_BASE_URL}/query-history/paymentLink`,
  },
  REPORTS: {
    DOWNLOAD: (module: string) => `${API_BASE_URL}/reports/${module}/excel`
  }
} as const;
