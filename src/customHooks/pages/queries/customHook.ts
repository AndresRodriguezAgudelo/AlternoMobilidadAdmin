import { useState, useEffect } from 'react';

interface QueryData {
  id: string;
  consulta: string;
  usuario: string;
  consultante: string;
  moduloConsulta: string;
  fConsulta: string;
}

const usuarios = [
  'Juan García', 'María Rodriguez', 'Carlos Martinez', 'Ana Lopez', 
  'Pedro Gonzalez', 'Laura Perez', 'Diego Sanchez', 'Sofia Ramirez'
];

const consultantes = [
  'Admin Sistema', 'Soporte Técnico', 'Servicio Cliente', 'Gerente Operaciones',
  'Analista Datos', 'Coordinador Flota', 'Supervisor Regional', 'Asesor Ventas'
];

const modulosConsulta = [
  'Usuarios', 'Vehículos', 'Reservas', 'Pagos', 
  'Mantenimiento', 'Reportes', 'Incidencias', 'Configuración'
];

const tiposConsulta = [
  'Actualización de datos', 'Consulta de estado', 'Reporte de problema',
  'Solicitud de información', 'Modificación de reserva', 'Verificación de pago',
  'Cambio de configuración', 'Reporte de incidente'
];

const generarFechaAleatoria = () => {
  const inicio = new Date(2023, 0, 1).getTime();
  const fin = new Date().getTime();
  const fechaAleatoria = new Date(inicio + Math.random() * (fin - inicio));
  const dia = fechaAleatoria.getDate().toString().padStart(2, '0');
  const mes = (fechaAleatoria.getMonth() + 1).toString().padStart(2, '0');
  const anio = fechaAleatoria.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

const generarId = () => {
  return `QRY-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
};

const generarConsulta = (modulo: string) => {
  const tipo = tiposConsulta[Math.floor(Math.random() * tiposConsulta.length)];
  return `${tipo} - ${modulo}`;
};

const generarDatosConsulta = (): QueryData => {
  const modulo = modulosConsulta[Math.floor(Math.random() * modulosConsulta.length)];
  
  return {
    id: generarId(),
    consulta: generarConsulta(modulo),
    usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
    consultante: consultantes[Math.floor(Math.random() * consultantes.length)],
    moduloConsulta: modulo,
    fConsulta: generarFechaAleatoria()
  };
};

export const useQueryData = () => {
  const [queries, setQueries] = useState<QueryData[]>([]);

  useEffect(() => {
    const generatedQueries = Array.from({ length: 50 }, () => generarDatosConsulta());
    setQueries(generatedQueries);
  }, []);

  return { queries };
};

export const queryTableHeaders = [
  { key: 'id', label: 'ID' },
  { key: 'consulta', label: 'Consulta' },
  { key: 'usuario', label: 'Usuario' },
  { key: 'consultante', label: 'Consultante' },
  { key: 'moduloConsulta', label: 'Módulo de Consulta' },
  { key: 'fConsulta', label: 'F.Consulta' }
];
