import { 
    createPurchaseController,
    getPurchaseController,
    getAllPurchasesController,
    updatePurchaseController,
    deletePurchaseController,
} from "../controllers/purchaseController";

import { Router } from "express";
import { validateCart } from "../middleware/validateCart";
const cartRouter = Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Carts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartCreateDTO'
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponseDTO'
 */
cartRouter.post("", validateCart ,createPurchaseController);

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del carrito
 *     responses:
 *       200:
 *         description: Carrito obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponseDTO'
 */
cartRouter.get("/:id", getPurchaseController);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener todos los carritos
 *     tags: [Carts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número de página para paginación (opcional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número máximo de carritos por página (opcional)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filtrar por estado del carrito (opcional)
 *     responses:
 *       200:
 *         description: Lista de carritos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 carts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CartResponseDTO'
 */
cartRouter.get("", getAllPurchasesController);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Actualizar el estado de un carrito
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del carrito a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nuevo estado del carrito (e.g., "completed", "cancelled")
 *     responses:
 *       200:
 *         description: Carrito actualizado exitosamente
 *         content:
 *           application/json:
 *            schema:
 *              $ref: '#/components/schemas/CartResponseDTO'
 *       404:
 *         description: Carrito no encontrado
 */
cartRouter.put("/:id", updatePurchaseController);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Eliminar un carrito por ID
 *     tags: [Carts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del carrito a eliminar
 *     responses:
 *       204:
 *         description: Carrito eliminado exitosamente
 *       404:
 *        description: Carrito no encontrado
 */
cartRouter.delete("/:id", deletePurchaseController);

export default cartRouter;