export type StatusPurchase = 'buying' | 'purchased' | 'cancelled';

export interface SortOptions {
    field: 'createdAt' | 'ratingRate' | 'price' | 'title';
    direction: 'ASC' | 'DESC';
}