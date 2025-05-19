import { sequelize } from "../config/db";
import { UserRequestDTO, UserResponseDTO } from "../types";

export const createUserService = async (userDTO: UserRequestDTO) => {
  try {
    const newUser = {
      ...userDTO,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await sequelize.models.User.create(newUser);
    const userData = createdUser.get({ plain: true });

    // Convertir el usuario a un DTO
    const userResponse: UserResponseDTO = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return userResponse;
  } catch (error: any) {
    throw new Error("Error creating user: " + error.message || error);
  }
};

export const getUserService = async (id: number) => {
  try {
    // Obtener el usuario por id
    const user = await sequelize.models.User.findByPk(id);

    if (!user) {
      throw new Error("User not found");
    }

    const userData = user.get({ plain: true });
    // Convertir el usuario a un DTO
    const userResponse: UserResponseDTO = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      isActive: userData.isActive,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };

    return userResponse;
  } catch (error: any) {
    throw new Error("Error getting user: " + error.message || error);
  }
};
