export type StatusCart = 'buying' | 'purchased' | 'cancelled';

export interface SortOptions {
    field: 'createdAt' | 'ratingRate' | 'price' | 'title';
    direction: 'ASC' | 'DESC';
}