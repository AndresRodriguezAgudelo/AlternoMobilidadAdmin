/**
 * @jest-environment jsdom
 */
import { API_BASE_URL, ENDPOINTS } from '../src/services/endPoints';

describe('endPoints', () => {
  // Test para API_BASE_URL
  test('API_BASE_URL should be a valid URL', () => {
    // En lugar de verificar una URL específica, verificamos que sea una URL válida
    // ya que la URL puede cambiar entre entornos de desarrollo y producción
    expect(API_BASE_URL).toMatch(/^https?:\/\/[\w.-]+(\/[\w.-]+)*\/api\/sign\/v1$/);
  });

  // Tests para URLs estáticas
  describe('Static URLs', () => {
    test('AUTH endpoints should be correctly defined', () => {
      expect(ENDPOINTS.AUTH.LOGIN).toBe(`${API_BASE_URL}/auth/login-email`);
      expect(ENDPOINTS.AUTH.FORGOT_PASSWORD).toBe(`${API_BASE_URL}/auth/forgot-password`);
    });

    test('SERVICES endpoints should be correctly defined', () => {
      expect(ENDPOINTS.SERVICES.LIST).toBe(`${API_BASE_URL}/servicing`);
      expect(ENDPOINTS.SERVICES.ORDER_LIST).toBe(`${API_BASE_URL}/list`);
    });

    test('GUIDES.LIST endpoint should be correctly defined', () => {
      expect(ENDPOINTS.GUIDES.LIST).toBe(`${API_BASE_URL}/guides`);
    });

    test('CATEGORIES endpoints should be correctly defined', () => {
      expect(ENDPOINTS.CATEGORIES.LIST).toBe(`${API_BASE_URL}/category`);
      expect(ENDPOINTS.CATEGORIES.ORDER_LIST).toBe(`${API_BASE_URL}/category`);
    });

    test('QUERIES endpoints should be correctly defined', () => {
      expect(ENDPOINTS.QUERIES.LIST).toBe(`${API_BASE_URL}/query-history`);
      expect(ENDPOINTS.QUERIES.MODULES).toBe(`${API_BASE_URL}/query-history/modules`);
    });
  });

  // Tests para funciones generadoras de URLs
  describe('URL generator functions', () => {
    test('GUIDES.DETAIL should generate correct URL with numeric ID', () => {
      const numericId = 123;
      expect(ENDPOINTS.GUIDES.DETAIL(numericId)).toBe(`${API_BASE_URL}/guides/${numericId}`);
    });

    test('GUIDES.DETAIL should generate correct URL with string ID', () => {
      const stringId = 'abc123';
      expect(ENDPOINTS.GUIDES.DETAIL(stringId)).toBe(`${API_BASE_URL}/guides/${stringId}`);
    });

    test('IMAGES.FILE should generate correct URL with key', () => {
      const key = 'image-key-123';
      expect(ENDPOINTS.IMAGES.FILE(key)).toBe(`${API_BASE_URL}/files/file/${key}`);
    });

    test('USERS.UPDATE should generate correct URL with ID', () => {
      const userId = 456;
      expect(ENDPOINTS.USERS.UPDATE(userId)).toBe(`${API_BASE_URL}/user/${userId}`);
    });

    test('REPORTS.DOWNLOAD should generate correct URL with module', () => {
      const module = 'services';
      expect(ENDPOINTS.REPORTS.DOWNLOAD(module)).toBe(`${API_BASE_URL}/reports/${module}/excel`);
    });
  });

  // Test para verificar que todas las propiedades del objeto ENDPOINTS están definidas
  test('All ENDPOINTS properties should be defined', () => {
    // Verificar que todas las secciones principales existen
    expect(ENDPOINTS.AUTH).toBeDefined();
    expect(ENDPOINTS.SERVICES).toBeDefined();
    expect(ENDPOINTS.GUIDES).toBeDefined();
    expect(ENDPOINTS.CATEGORIES).toBeDefined();
    expect(ENDPOINTS.IMAGES).toBeDefined();
    expect(ENDPOINTS.USERS).toBeDefined();
    expect(ENDPOINTS.QUERIES).toBeDefined();
    expect(ENDPOINTS.REPORTS).toBeDefined();

    // Verificar que todas las propiedades dentro de cada sección existen
    // AUTH
    expect(ENDPOINTS.AUTH.LOGIN).toBeDefined();
    expect(ENDPOINTS.AUTH.FORGOT_PASSWORD).toBeDefined();

    // SERVICES
    expect(ENDPOINTS.SERVICES.LIST).toBeDefined();
    expect(ENDPOINTS.SERVICES.ORDER_LIST).toBeDefined();

    // GUIDES
    expect(ENDPOINTS.GUIDES.LIST).toBeDefined();
    expect(ENDPOINTS.GUIDES.DETAIL).toBeDefined();
    expect(typeof ENDPOINTS.GUIDES.DETAIL).toBe('function');

    // CATEGORIES
    expect(ENDPOINTS.CATEGORIES.LIST).toBeDefined();
    expect(ENDPOINTS.CATEGORIES.ORDER_LIST).toBeDefined();

    // IMAGES
    expect(ENDPOINTS.IMAGES.FILE).toBeDefined();
    expect(typeof ENDPOINTS.IMAGES.FILE).toBe('function');

    // USERS
    expect(ENDPOINTS.USERS.LIST).toBeDefined();
    expect(ENDPOINTS.USERS.UPDATE).toBeDefined();
    expect(typeof ENDPOINTS.USERS.UPDATE).toBe('function');

    // QUERIES
    expect(ENDPOINTS.QUERIES.LIST).toBeDefined();
    expect(ENDPOINTS.QUERIES.MODULES).toBeDefined();

    // REPORTS
    expect(ENDPOINTS.REPORTS.DOWNLOAD).toBeDefined();
    expect(typeof ENDPOINTS.REPORTS.DOWNLOAD).toBe('function');
  });
});
