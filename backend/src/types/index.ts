export interface UserRequestDTO {
  id?: number;
  username: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  address: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserResponseDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDTO {
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  ratingRate: number;
  ratingCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}