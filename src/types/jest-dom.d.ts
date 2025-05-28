// Extensión de tipos para Jest DOM
import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      toBeInTheDocument(): R;
      toHaveTextContent(content: string | RegExp): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveClass(className: string): R;
      toBeDisabled(): R;
      // Añadir cualquier otro matcher que necesites
    }
  }
}
