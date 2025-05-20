import { ProductDTO, UserResponseDTO } from "../types/DTO";

export const convertToUserResponseDTO = (user: any): UserResponseDTO => {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const convertToProductDTO = (product: any): ProductDTO => {
    return {
        id: product.id,
        title: product.title,
        price: product.price,
        description: product.description,
        category: product.category,
        image: product.image,
        ratingRate: product.ratingRate,
        ratingCount: product.ratingCount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}; 