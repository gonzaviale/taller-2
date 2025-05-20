import { sequelize } from "../config/db";
import { ProductDTO } from "../types";
import { convertToProductDTO } from "../utils/convertToDTO";

export const createProductService = async (productDTO: ProductDTO) => {
  try {
    const newProduct = {
      ...productDTO,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdProductInstance = await sequelize.models.Product.create(newProduct);
    const createdProduct: ProductDTO = convertToProductDTO(createdProductInstance.get({ plain: true }));
    
    return createdProduct;
  } catch (error: any) {
    throw new Error("Error creating product: " + error.message || error);
  }
};

export const getProductService = async (id: number) => {
  try {
    // Obtener el producto por id
    const product = await sequelize.models.Product.findByPk(id);

    if (!product) {
      throw new Error("Product not found");
    }

    const productData = product.get({ plain: true });
    // Convertir el producto a un DTO
    const productResponse: ProductDTO = convertToProductDTO(productData);

    return productResponse;
  } catch (error: any) {
    throw new Error("Error getting product: " + error.message || error);
  }
};

export const getAllProductsService = async (page: number, limit: number) => {
  try {
    // constante offset para la paginación
    const offset = (page - 1) * limit;

    // Obtener todos los productos con paginación
    // y ordenados por fecha de creación
    const { count, rows } = await sequelize.models.Product.findAndCountAll({
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    return {
      // Convertir los productos a DTO
      products: rows.map((product: any) => convertToProductDTO(product)),
      totalItems: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error: any) {
    throw new Error(
      "Error getting products: " + (error.message || error.toString())
    );
  }
};

export const updateProductService = async (
  id: number,
  productDTO: ProductDTO
) => {
  try {
    // Obtener el producto por id
    const product = await sequelize.models.Product.findByPk(id);
    // Si no existe el producto, lanzar un error
    if (!product) throw new Error(`Product with id ${id} not found`);

    Object.assign(product, productDTO);
    await product.save();

    // Convertir el producto a un DTO
    return convertToProductDTO(product);
  } catch (error: any) {
    throw new Error("Error updating product: " + error.message || error);
  }
};

export const deleteProductService = async (id: number) => {
  try {
    // Obtener el producto por id
    const product = await sequelize.models.Product.findByPk(id);
    // Si no existe el producto, lanzar un error
    if (!product) throw new Error(`Product with id ${id} not found`);

    await product.destroy();
    return convertToProductDTO(product);
  } catch (error: any) {
    throw new Error("Error deleting product: " + error.message || error);
  }
};
