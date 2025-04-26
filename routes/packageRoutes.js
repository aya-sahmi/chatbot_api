import { Router } from 'express';
import {createPackage,getAllPackages,getPackageById,updatePackage,deletePackage} from '../controllers/packageController.js';
import { checkRole } from '../middlewares/checkRole.js';
import { authenticateUser } from '../middlewares/verifyToken.js';

const router = Router();

router.use(authenticateUser);

/**
 * @swagger
 * tags:
 *   - name: Packages
 *     description: API for managing packages
 */

/**
 * @swagger
 * /api/v1/packages/:
 *   post:
 *     tags:
 *       - Packages
 *     summary: Créer un nouveau package.
 *     description: Cette route permet de créer un nouveau package.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               package_name:
 *                 type: string
 *                 example: "Package Test"
 *               package_description:
 *                 type: string
 *                 example: "Description package."
 *               number_workspace:
 *                 type: integer
 *                 example: 5
 *               number_chatbot:
 *                 type: integer
 *                 example: 3
 *               number_domaine:
 *                 type: integer
 *                 example: 2
 *               solde_total:
 *                 type: number
 *                 example: 400
 *     responses:
 *       201:
 *         description: package créé avec succès.
 *       400:
 *         description: Demande invalide.
 */
router.post('/',checkRole(['super_admin', 'admin']), createPackage);

/**
 * @swagger
 * /api/v1/packages/:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Récupérer tous les packages.
 *     description: Cette route permet de récupérer la liste de tous les packages.
 *     responses:
 *       200:
 *         description: Liste des packages récupérée avec succès.
 */
router.get('/',checkRole(['super_admin', 'admin','user']), getAllPackages);

/**
 * @swagger
 * /api/v1/packages/{id}:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Récupérer un package par son ID.
 *     description: Cette route permet de récupérer les informations d'un package spécifique.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du package à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: package récupéré avec succès.
 *       404:
 *         description: package non trouvé.
 */
router.get('/:id', checkRole(['super_admin', 'admin']), getPackageById);

/**
 * @swagger
 * /api/v1/packages/{id}:
 *   put:
 *     tags:
 *       - Packages
 *     summary: Mettre à jour un package existant.
 *     description: Cette route permet de mettre à jour les informations d'un package.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du package à mettre à jour.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               package_name:
 *                 type: string
 *                 example: "Package Name"
 *               package_description:
 *                 type: string
 *                 example: "Description du package"
 *               number_workspace:
 *                 type: integer
 *                 example: 5
 *               number_chatbot:
 *                 type: integer
 *                 example: 3
 *               number_domaine:
 *                 type: integer
 *                 example: 2
 *               solde_total:
 *                 type: number
 *                 example: 5000
 *     responses:
 *       200:
 *         description: package mis à jour avec succès.
 *       404:
 *         description: package non trouvé.
 */
router.put('/:id',checkRole(['super_admin', 'admin']), updatePackage);

/**
 * @swagger
 * /api/v1/packages/{id}:
 *   delete:
 *     tags:
 *       - Packages
 *     summary: Supprimer un package.
 *     description: Cette route permet de supprimer un package existant.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du package à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: package supprimé avec succès.
 *       404:
 *         description: package non trouvé.
 */
router.delete('/:id',checkRole(['super_admin', 'admin']), deletePackage);

export default router;
