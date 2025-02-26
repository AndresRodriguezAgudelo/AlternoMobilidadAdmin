import { useState, useEffect } from 'react';

interface PaymentData {
  idClic: string;
  usuario: string;
  fechaClic: string;
}

const usuarios = [
  'Juan García', 'María Rodriguez', 'Carlos Martinez', 'Ana Lopez', 
  'Pedro Gonzalez', 'Laura Perez', 'Diego Sanchez', 'Sofia Ramirez',
  'Miguel Torres', 'Isabel Flores', 'Jorge Diaz', 'Patricia Reyes'
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

const generarIdClic = () => {
  const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CLIC-${num}`;
};

const generarDatosPago = (): PaymentData => {
  return {
    idClic: generarIdClic(),
    usuario: usuarios[Math.floor(Math.random() * usuarios.length)],
    fechaClic: generarFechaAleatoria()
  };
};

export const usePaymentData = () => {
  const [payments, setPayments] = useState<PaymentData[]>([]);

  useEffect(() => {
    const generatedPayments = Array.from({ length: 50 }, () => generarDatosPago());
    setPayments(generatedPayments);
  }, []);

  return { payments };
};

export const paymentTableHeaders = [
  { key: 'idClic', label: 'ID Clic' },
  { key: 'usuario', label: 'Usuario' },
  { key: 'fechaClic', label: 'Fecha Clic' }
];
