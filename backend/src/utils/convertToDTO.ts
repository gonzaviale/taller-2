import { UserResponseDTO } from "../types";

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