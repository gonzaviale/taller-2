// Utilidades compartidas para los componentes de productos

export class ProductUtils {

    static getCategoryDisplayName(category: string): string {
        const categoryMap: { [key: string]: string } = {
            'electronics': 'Electrónicos',
            'jewelery': 'Joyería',
            "men's clothing": 'Ropa Hombre',
            "women's clothing": 'Ropa Mujer'
        };
        return categoryMap[category] || category;
    }

    static getCategories(): string[] {
        return [
            'electronics',
            'jewelery',
            'men\'s clothing',
            'women\'s clothing'
        ];
    }

    static getCategoryIcon(category: string): string {
        const iconMap: { [key: string]: string } = {
            'electronics': '📱',
            'jewelery': '💎',
            "men's clothing": '👔',
            "women's clothing": '👗'
        };
        return iconMap[category] || '🏷️';
    }

    static getStars(rating: number): string {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        return '⭐'.repeat(fullStars) + (hasHalfStar ? '⭐' : '');
    }

    static getDefaultImageUrl(): string {
        return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
    }

    static handleImageError(event: Event): void {
        const target = event.target as HTMLImageElement;
        target.src = ProductUtils.getDefaultImageUrl();
    }
}