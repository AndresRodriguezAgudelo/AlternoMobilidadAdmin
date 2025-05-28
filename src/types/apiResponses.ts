// Archivo de tipos y mensajes estáticos para respuestas de endpoints

export interface ApiStaticResponse {
  endpoint: string; // ejemplo: 'USERS.LIST'
  successMessage: string;
  errorMessage?: string;
}

export const apiStaticResponses: ApiStaticResponse[] = [
  // ---- GENERIC HTTP METHOD RESPONSES ----
  // AUTH.LOGIN
  {
    endpoint: 'AUTH.LOGIN.POST',
    successMessage: 'Bienvenido!',
    errorMessage: 'Error al iniciar sesión',
  },
  // SERVICES.LIST
  {
    endpoint: 'SERVICES.LIST.GET',
    successMessage: 'Datos de servicio(s) cargados exitosamente',
    errorMessage: 'Hubo un error al cargar los servicios',
  },
  {
    endpoint: 'SERVICES.LIST.POST',
    successMessage: 'Servicio creado!',
    errorMessage: 'No se pudo crear el servicio',
  },
  {
    endpoint: 'SERVICES.LIST.PATCH',
    successMessage: 'Servicio actualizado!',
    errorMessage: 'No se pudo actualizar el servicio',
  },
  // SERVICES.ORDER_LIST
  {
    endpoint: 'SERVICES.ORDER_LIST.PUT',
    successMessage: 'Nuevo orden actualizado',
    errorMessage: 'No se pudo actualizar el orden de los servicios',
  },
  // SERVICES.LIST.DELETE
  {
    endpoint: 'SERVICES.LIST.DELETE',
    successMessage: 'Servicio eliminado!',
    errorMessage: 'No se pudo eliminar el servicio',
  },

  
  // GUIDES.LIST
  {
    endpoint: 'GUIDES.LIST.GET',
    successMessage: 'Datos de guía(s) cargados exitosamente',
    errorMessage: 'No se pudieron cargar las guías',
  },
  {
    endpoint: 'GUIDES.LIST.POST',
    successMessage: 'Guía creada correctamente',
    errorMessage: 'No se pudo crear la guía',
  },
  // GUIDES.DETAIL
  {
    endpoint: 'GUIDES.DETAIL.GET',
    successMessage: 'Detalle de guía cargado correctamente',
    errorMessage: 'No se pudo cargar el detalle de la guía',
  },
  {
    endpoint: 'GUIDES.DETAIL.PUT',
    successMessage: 'Guía actualizada correctamente',
    errorMessage: 'No se pudo actualizar la guía',
  },
  {
    endpoint: 'GUIDES.DETAIL.PATCH',
    successMessage: 'Guía actualizada',
    errorMessage: 'No se pudo actualizar la guía',
  },
  // Agregar entrada adicional para asegurar que coincida con cualquier patrón de eliminación de guías
  {
    endpoint: 'GUIDES.LIST.DELETE',
    successMessage: 'Guía eliminada!',
    errorMessage: 'No se pudo eliminar la guía',
  },
  // CATEGORIES.LIST
  {
    endpoint: 'CATEGORIES.LIST.GET',
    successMessage: 'Datos de categoría(s) cargados exitosamente',
    errorMessage: 'No se pudieron cargar las categorías',
  },
  {
    endpoint: 'CATEGORIES.LIST.POST',
    successMessage: 'Categoría creada correctamente',
    errorMessage: 'No se pudo crear la categoría',
  },
  {
    endpoint: 'CATEGORIES.LIST.PATCH',
    successMessage: 'Categoría actualizada!',
    errorMessage: 'No se pudo actualizar la categoría',
  },
  {
    endpoint: 'CATEGORIES.LIST.DELETE',
    successMessage: 'Categoría eliminada!',
    errorMessage: 'No se pudo eliminar la categoría',
  },
   //CATEGORIES.ORDER_LIST
   {
     endpoint: 'CATEGORIES.ORDER_LIST.PUT',
     successMessage: 'Nuevo orden de categorías actualizado',
     errorMessage: 'No se pudo actualizar el orden de las categorías',
   },
   //IMAGES.FILE
  {
    endpoint: 'IMAGES.FILE.POST',
    successMessage: 'Imagen cargada correctamente',
    errorMessage: 'No se pudo cargar la imagen',
  },
  // USERS.LIST
  {
    endpoint: 'USERS.LIST.GET',
    successMessage: 'Usuarios cargados con éxito',
    errorMessage: 'No se pudieron cargar los usuarios',
  },
  {
    endpoint: 'USERS.LIST.POST',
    successMessage: 'Usuario creado correctamente',
    errorMessage: 'No se pudo crear el usuario',
  },
  {
    endpoint: 'USERS.LIST.PATCH',
    successMessage: 'Usuario actualizado!',
    errorMessage: 'No se pudo actualizar  el usuario',
  },
  // USERS.UPDATE
  {
    endpoint: 'USERS.UPDATE.PUT',
    successMessage: 'Usuario actualizado correctamente',
    errorMessage: 'No se pudo actualizar el usuario',
  },
  {
    endpoint: 'USERS.UPDATE.PATCH',
    successMessage: 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
    errorMessage: 'No se pudo actualizar parcialmente el usuario',
  },
  {
    endpoint: 'USERS.UPDATE.PASSWORD',
    successMessage: 'Contraseña actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.',
    errorMessage: 'Error al cambiar la contraseña. Por favor, inténtalo de nuevo.',
  },
  // QUERIES.LIST
  {
    endpoint: 'QUERIES.LIST.GET',
    successMessage: 'Historial de consultas cargado correctamente',
    errorMessage: 'No se pudo cargar el historial de consultas',
  },
  // QUERIES.MODULES
  {
    endpoint: 'QUERIES.MODULES.GET',
    successMessage: 'Módulos de consultas cargados correctamente',
    errorMessage: 'No se pudieron cargar los módulos de consultas',
  },
  // REPORTS.DOWNLOAD
  {
    endpoint: 'REPORTS.DOWNLOAD.GET',
    successMessage: 'Reporte descargado correctamente',
    errorMessage: 'No se pudo descargar el reporte',
  },
  // ---- END GENERIC HTTP METHOD RESPONSES ----

  // AUTH
  {
    endpoint: 'AUTH.LOGIN',
    successMessage: 'Inicio de sesión exitoso',
    errorMessage: 'Error al iniciar sesión',
  },
  {
    endpoint: 'AUTH.FORGOT_PASSWORD',
    successMessage: 'Correo enviado. Revisa tu bandeja o spam para cambiar tu contraseña.',
    errorMessage: 'Error al enviar el correo de recuperación',
  },
  {
    endpoint: 'AUTH.FORGOT_PASSWORD.POST',
    successMessage: 'Correo enviado. Revisa tu bandeja o spam para cambiar tu contraseña.',
    errorMessage: 'Error al enviar el correo de recuperación',
  },

  // SERVICES
  {
    endpoint: 'SERVICES.LIST',
    successMessage: 'Servicios cargados correctamente',
    errorMessage: 'No se pudieron cargar los servicios',
  },
  {
    endpoint: 'SERVICES.ORDER_LIST',
    successMessage: 'Orden de servicios actualizado',
    errorMessage: 'No se pudo actualizar el orden de los servicios',
  },

  // GUIDES
  {
    endpoint: 'GUIDES.LIST',
    successMessage: 'Guías cargadas correctamente',
    errorMessage: 'No se pudieron cargar las guías',
  },
  {
    endpoint: 'GUIDES.DETAIL',
    successMessage: 'Detalle de guía cargado correctamente',
    errorMessage: 'No se pudo cargar el detalle de la guía',
  },

  // CATEGORIES
  {
    endpoint: 'CATEGORIES.LIST',
    successMessage: 'Categorías cargadas correctamente',
    errorMessage: 'No se pudieron cargar las categorías',
  },

  // IMAGES
  {
    endpoint: 'IMAGES.FILE',
    successMessage: 'Imagen cargada correctamente',
    errorMessage: 'No se pudo cargar la imagen',
  },

  // USERS
  {
    endpoint: 'USERS.LIST',
    successMessage: 'Usuarios cargados con éxito',
    errorMessage: 'No se pudieron cargar los usuarios',
  },
  {
    endpoint: 'USERS.UPDATE',
    successMessage: 'Usuario actualizado correctamente',
    errorMessage: 'No se pudo actualizar el usuario',
  },

  // QUERIES
  {
    endpoint: 'QUERIES.LIST',
    successMessage: 'Historial de consultas cargado correctamente',
    errorMessage: 'No se pudo cargar el historial de consultas',
  },
  {
    endpoint: 'QUERIES.MODULES',
    successMessage: 'Módulos de consultas cargados correctamente',
    errorMessage: 'No se pudieron cargar los módulos de consultas',
  },

  // REPORTS
  {
    endpoint: 'REPORTS.DOWNLOAD',
    successMessage: 'Reporte descargado correctamente',
    errorMessage: 'No se pudo descargar el reporte',
  },
];

// Helper para buscar el mensaje por endpoint (puedes mejorar la lógica)
export function getApiStaticResponse(endpoint: string): ApiStaticResponse | undefined {
  return apiStaticResponses.find(r => r.endpoint === endpoint);
}
