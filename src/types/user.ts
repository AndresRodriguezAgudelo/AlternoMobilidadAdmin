export interface Vehicle {
  licensePlate: string;
  numberDocument: string;
  dateRegister: string | null;
  typeDocument: {
    typeName: string;
  };
}

export interface UserVehicle {
  id: number;
  vehicle: Vehicle;
}

export interface User {
  id: number;
  email: string;
  name: string;
  accepted: boolean;
  phone: string | null;
  verify: boolean;
  userVehicles: UserVehicle[];
}

export interface UserResponse {
  data: User[];
  meta: {
    page: string;
    take: string;
    total: number;
    pageCount: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export interface UserParams {
  page?: number;
  take?: number;
  search?: string;
  order?: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
  totalVehicles?: number;
}
