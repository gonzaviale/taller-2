import { sequelize } from "../config/db";
import { UserDTO } from "../types";

export const createUserService = async (userDTO: UserDTO) => {
  try {
    const newUser = {
      ...userDTO,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // Guardar el nuevo usuario en la base de datos
    const createdUser = await sequelize.models.User.create(newUser);
    // Retornar el usuario creado excepto password
    const { password, ...userWithoutPassword } = createdUser.toJSON();
    return userWithoutPassword;
  } catch (error) {
    throw new Error("Error creating user");
  }
};
