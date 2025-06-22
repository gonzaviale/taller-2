import { sequelize } from "../config/db";
import { UserRequestDTO, UserResponseDTO } from "../types/DTO";
import { convertToUserResponseDTO } from "../utils/convertToDTO";
import { verifyPassword } from "../utils/cryptoUtils";

export const loginService = async (email: string, password: string) => {
  try {
    // Buscar el usuario por email
    const user = await sequelize.models.User.findOne({
      where: { email, isActive: true },
    });

    // Si no existe el usuario, lanzar un error
    if (!user) {
      throw new Error("User not found or inactive");
    }

    // Convertir el usuario a un DTO
    const userData = user.get({ plain: true });
    const isPasswordValid = verifyPassword(password, userData.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }
    return convertToUserResponseDTO(userData);
  } catch (error: any) {
    throw new Error("Error logging in: " + error.message || error);
  }
}

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
      order: [["createdAt", "DESC"]],
    });

    return {
      // Convertir los usuarios a DTO
      users: rows.map((user: any) => convertToUserResponseDTO(user)),
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error: any) {
    throw new Error(
      "Error getting users: " + (error.message || error.toString())
    );
  }
};

export const updateUserService = async (
  id: number,
  userDTO: UserRequestDTO
) => {
  try {
    // Obtener el usuario por id
    const user = await sequelize.models.User.findByPk(id);
    // Si no existe el usuario, lanzar un error
    if (!user) throw new Error(`User with id ${id} not found`);

    Object.assign(user, userDTO);
    await user.save();

    // Convertir el usuario a un DTO
    return convertToUserResponseDTO(user);
  } catch (error: any) {
    throw new Error("Error updating user: " + error.message || error);
  }
};

export const deleteUserService = async (id: number) => {
  try {
    // Obtener el usuario por id
    const user = await sequelize.models.User.findByPk(id);
    // Si no existe el usuario, lanzar un error
    if (!user) throw new Error(`User with id ${id} not found`);

    await user.destroy();
    return convertToUserResponseDTO(user);
  } catch (error: any) {
    throw new Error("Error deleting user: " + error.message || error);
  }
};
