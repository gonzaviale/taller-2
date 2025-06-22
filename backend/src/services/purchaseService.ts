import { sequelize } from "../config/db";
import { Purchase } from "../models/Purchase";
import { Product } from "../models/Product";
import { StatusPurchase } from "../types/types";

export const createPurchaseService = async (
    userId: number,
    productIds: number[],
) => {
    try {

        // Calcular el total sumando los precios de los productos
        const products = await Product.findAll({ where: { id: productIds } });
        const total = products.reduce((sum, product) => sum + product.price, 0);

        // Crear la compra
        const newPurchase = await Purchase.create({
            userId,
            status: "buying",
            total,
        });

        // Asociar los productos a la compra
        const purchaseProducts = productIds.map((productId) => ({
            purchaseId: newPurchase.id,
            productId,
        }));
        await sequelize.models.PurchaseProducts.bulkCreate(purchaseProducts);

        return newPurchase;
    } catch (error: any) {
        throw new Error("Error creating purchase: " + error.message || error);
    }
};

export const getPurchaseService = async (id: number) => {
    try {
        // Obtener la compra por ID
        const purchase = await Purchase.findByPk(id, {
            include: [
                {
                    model: Product,
                    // excluir atributos de la tabla intermedia
                    through: { attributes: [] },
                },
            ],
        });

        if (!purchase) {
            throw new Error("Purchase not found");
        }

        return purchase;
    } catch (error: any) {
        throw new Error("Error getting purchase: " + error.message || error);
    }
};

export const getAllPurchasesService = async (
    page: number,
    limit: number,
    status: string | null
) => {
    try {
        const offset = (page - 1) * limit;

        // Obtener todo el historial de compras con paginación y filtro por estado
        const { count, rows } = await Purchase.findAndCountAll({
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
            purchases: rows,
            totalItems: count,
            currentPage: page,
            totalPages: Math.ceil(count / limit),
        };
    } catch (error: any) {
        throw new Error("Error getting purchases: " + error.message || error);
    }
};

export const updatePurchaseService = async (id: number, status: StatusPurchase) => {
    try {
        // Obtener la compra por ID
        const purchase = await Purchase.findByPk(id);

        if (!purchase) {
            throw new Error(`Purchase with id ${id} not found`);
        }

        // Actualizar el estado de la compra
        purchase.status = status;
        await purchase.save();

        return purchase;
    } catch (error: any) {
        throw new Error("Error updating purchase: " + error.message || error);
    }
};

export const deletePurchaseService = async (id: number) => {
    try {
        // Obtener la compra por ID
        const purchase = await Purchase.findByPk(id);

        if (!purchase) {
            throw new Error(`Purchase with id ${id} not found`);
        }

        // Eliminar la compra
        await purchase.destroy();
        return purchase;
    } catch (error: any) {
        throw new Error("Error deleting purchase: " + error.message || error);
    }
};