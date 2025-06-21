import { ProductDTO } from "./ProductDTO";

export interface CartDTO {
    id?: number;
    userId: number;
    status: StatusCart;
    totalPrice?: number;
    createdAt?: Date;
    updatedAt?: Date;
    Products?: ProductDTO[];
}

export interface CartResponse {
    carts: CartDTO[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export type StatusCart = 'buying' | 'purchased' | 'cancelled';