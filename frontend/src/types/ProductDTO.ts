export interface ProductDTO {
    id?: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    ratingRate?: number;
    ratingCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}