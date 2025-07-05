import { ProductDTO } from "./ProductDTO";

export interface PurchaseDTO {
    id?: number;
    userId: number;
    status: StatusPurchase;
    total?: number;
    createdAt?: Date;
    updatedAt?: Date;
    Products?: ProductCartDTO[];
}

export interface PurchaseRequest {
    userId: number;
    products: ProductCartDTO[];
    status?: StatusPurchase;
}

export interface PurchaseResponse {
    purchases: PurchaseDTO[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
}

export type StatusPurchase = 'buying' | 'purchased' | 'cancelled';

export interface CartDTO {
    products: ProductCartDTO[];
    totalPrice: number;
}

export interface ProductCartDTO {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
    category: string;
}