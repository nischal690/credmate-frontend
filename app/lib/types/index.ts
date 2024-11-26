// Global type definitions
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
