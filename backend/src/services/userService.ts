import { sequelize } from "../config/db";
import { UserRequestDTO, UserResponseDTO } from "../types";
import { convertToUserResponseDTO } from "../utils/convertToDTO";

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
    const userResponse: UserResponseDTO = convertToUserResponseDTO(userData);

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
    const userResponse: UserResponseDTO = convertToUserResponseDTO(userData);

    return userResponse;
  } catch (error: any) {
    throw new Error("Error getting user: " + error.message || error);
  }
};

export const getAllUsersService = async (page: number, limit: number) => {
  try {
    // constante offset para la paginación
    const offset = (page - 1) * limit;

    // Obtener todos los usuarios con paginación
    // y ordenados por fecha de creación
    const { count, rows } = await sequelize.models.User.findAndCountAll({
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return {
      // Convertir los usuarios a DTO
      users: rows.map((user: any) => convertToUserResponseDTO(user)),
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    };
  } catch (error: any) {
    console.error("Error in getAllUsersService:", error);
    throw new Error("Error getting users: " + (error.message || error.toString()));
  }
};

