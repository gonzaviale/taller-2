import { 
    createPurchaseController,
    getPurchaseController,
    getAllPurchasesController,
    updatePurchaseController,
    deletePurchaseController,
    getPurchasesByUserController,
} from "../controllers/purchaseController";



import { Router } from "express";
import { validatePurchase } from "../middleware/validatePurchase";
const cartRouter = Router();

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Crear un nuevo carrito
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PurchaseCreateDTO'
 *     responses:
 *       201:
 *         description: Carrito creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PurchaseResponseDTO'
 */
cartRouter.post("", validatePurchase ,createPurchaseController);

/**
 * @swagger
 * /api/cart/{id}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     tags: [Purchases]
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
 *               $ref: '#/components/schemas/PurchaseResponseDTO'
 */
cartRouter.get("/:id", getPurchaseController);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtener todos los carritos
 *     tags: [Purchases]
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
 *                 purchases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PurchaseResponseDTO'
 */
cartRouter.get("", getAllPurchasesController);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Actualizar el estado de un carrito
 *     tags: [Purchases]
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
 *              $ref: '#/components/schemas/PurchaseResponseDTO'
 *       404:
 *         description: Carrito no encontrado
 */
cartRouter.put("/:id", updatePurchaseController);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Eliminar un carrito por ID
 *     tags: [Purchases]
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

/**
 * @swagger
 * /api/cart/mis-compras:
 *   get:
 *     summary: Obtener las compras del usuario autenticado
 *     tags: [Purchases]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de compras del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PurchaseResponseDTO'
 *       401:
 *         description: No autorizado
 */

cartRouter.get('/mis-compras', getPurchasesByUserController);

export default cartRouter;