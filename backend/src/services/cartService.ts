import { sequelize } from "../config/db";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";
import { StatusCart } from "../types/types";

export const createCartService = async (
    userId: number,
    productIds: number[],
) => {
    try {

        // Calcular el total sumando los precios de los productos
        const products = await Product.findAll({ where: { id: productIds } });
        const total = products.reduce((sum, product) => sum + product.price, 0);

        // Crear el carrito
        const newCart = await Cart.create({
            userId,
            status: "buying",
            total,
        });

        // Asociar los productos al carrito
        const cartProducts = productIds.map((productId) => ({
            cartId: newCart.id,
            productId,
        }));
        await sequelize.models.CartProducts.bulkCreate(cartProducts);

        return newCart;
    } catch (error: any) {
        throw new Error("Error creating cart: " + error.message || error);
    }
};

export const getCartService = async (id: number) => {
    try {
        // Obtener el carrito por ID
        const cart = await Cart.findByPk(id, {
            include: [
                {
                    model: Product,
                    // excluir atributos de la tabla intermedia
                    through: { attributes: [] },
                },
            ],
        });

        if (!cart) {
            throw new Error("Cart not found");
        }

        return cart;
    } catch (error: any) {
        throw new Error("Error getting cart: " + error.message || error);
    }
};

export const getAllCartsService = async (
    page: number,
    limit: number,
    status: string | null
) => {
    try {
        const offset = (page - 1) * limit;

        // Obtener todos los carritos con paginación y filtro por estado
        const { count, rows } = await Cart.findAndCountAll({
            offset,
            limit,
            where: {
                ...(status && { status }),
            },
            include: [
                {
                    model: Product,
                    through: { attributes: [] },
                },
            ],
            order: [["createdAt", "DESC"]],
        });

        return {
            carts: rows,
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        };
    } catch (error: any) {
        throw new Error("Error getting carts: " + error.message || error);
    }
};

export const updateCartService = async (id: number, status: StatusCart) => {
    try {
        // Obtener el carrito por ID
        const cart = await Cart.findByPk(id);

        if (!cart) {
            throw new Error(`Cart with id ${id} not found`);
        }

        // Actualizar el estado del carrito
        cart.status = status;
        await cart.save();

        return cart;
    } catch (error: any) {
        throw new Error("Error updating cart: " + error.message || error);
    }
};

export const deleteCartService = async (id: number) => {
    try {
        // Obtener el carrito por ID
        const cart = await Cart.findByPk(id);

        if (!cart) {
            throw new Error(`Cart with id ${id} not found`);
        }

        // Eliminar el carrito
        await cart.destroy();
        return cart;
    } catch (error: any) {
        throw new Error("Error deleting cart: " + error.message || error);
    }
};