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

export interface ProductsResponse {
  products: ProductDTO[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}


export interface ProductoCarrito extends ProductDTO{
   quantity: number;
}

export interface PriceRange { 
  priceMin: string;
  priceMax: string;

}