import { sequelize } from "../config/db";
import { UserRequestDTO, UserResponseDTO } from "../types/DTO";
import { convertToUserResponseDTO } from "../utils/convertToDTO";
import { verifyPassword } from "../utils/cryptoUtils";
import jwt from 'jsonwebtoken';

export const loginService = async (email: string, password: string) => {
  const user = await sequelize.models.User.findOne({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  const userData = user.get({ plain: true });
  const isPasswordValid = verifyPassword(password, userData.password);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ username: userData.username }, process.env.JWT_SECRET || 'default', {
    expiresIn: '24h',
  });

  return {
    userId: userData.id,
    token,
  };
};


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
    throw new Error('El email ya está en uso. Por favor, usa otro.' );
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


export const getProfileService = async (id: number) => {
  try {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) throw new Error("User not found");

    const userData = user.get({ plain: true });
    return convertToUserResponseDTO(userData);
  } catch (error: any) {
    throw new Error("Error getting profile: " + (error.message || error));
  }
};

export const updateProfileService = async (id: number, userDTO: UserRequestDTO) => {
  try {
    const user = await sequelize.models.User.findByPk(id);
    if (!user) throw new Error("User not found");

    Object.assign(user, userDTO);
    await user.save();

    return convertToUserResponseDTO(user.get({ plain: true }));
  } catch (error: any) {
    throw new Error("Error updating profile: " + (error.message || error));
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
