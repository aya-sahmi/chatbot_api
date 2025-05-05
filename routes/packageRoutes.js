import { Router } from 'express';
import {createPackage,getAllPackages,getPackageById,updatePackage,deletePackage, assignPackageToDomaine, unassignDomaineFromPackage, activeDesactivePackage, getDomainsByPackageId} from '../controllers/packageController.js';
import { authenticateUser } from '../middlewares/verifyToken.js';
import { checkPermission } from '../middlewares/checkPermission.js';

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
 * /packages/:
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
router.post('/',checkPermission('createPackage'), createPackage);

/**
 * @swagger
 * /packages/:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Récupérer tous les packages.
 *     description: Cette route permet de récupérer la liste de tous les packages.
 *     responses:
 *       200:
 *         description: Liste des packages récupérée avec succès.
 */
router.get('/',checkPermission('getAllPackages'), getAllPackages);

/**
 * @swagger
 * /packages/{id}:
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
router.get('/:id', checkPermission('getPackageById'), getPackageById);

/**
 * @swagger
 * /packages/{id}:
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
router.put('/:id',checkPermission('updatePackage'), updatePackage);

/**
 * @swagger
 * /packages/{id}:
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
router.delete('/:id',checkPermission('deletePackage'), deletePackage);

/**
 * @swagger
 * /packages/active-desactive/{id}:
 *   patch:
 *     tags:
 *       - Packages
 *     summary: Activer ou désactiver un package.
 *     description: Cette route permet de basculer le statut `is_active` d'un package entre `true` et `false`. Nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du package à activer ou désactiver.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Statut du package mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Package was activated successfully."
 *                 updateActivation:
 *                   type: object
 *                   description: Les détails du package mis à jour.
 *       400:
 *         description: Requête invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request."
 *       404:
 *         description: Package non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Package not found."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.patch('/active-desactive/:id', checkPermission('activeDesactivePackage'), activeDesactivePackage);

/**
 * @swagger
 * /packages/assign-domaine-to-package:
 *   post:
 *     tags:
 *       - Packages
 *     summary: Assigner un domaine à un package.
 *     description: Cette route permet d'assigner un domaine spécifique à un package. Nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaineId:
 *                 type: string
 *                 example: "domaine_id"
 *                 description: L'ID du domaine à assigner.
 *               packageId:
 *                 type: string
 *                 example: "package_id"
 *                 description: L'ID du package auquel le domaine sera assigné.
 *     responses:
 *       200:
 *         description: Domaine assigné au package avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Domaine assigned to package successfully."
 *                 updatedDomaine:
 *                   type: object
 *                   description: Les détails du domaine mis à jour.
 *       400:
 *         description: Requête invalide (données manquantes ou incorrectes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "domaineId and packageId are required."
 *       404:
 *         description: Domaine ou package non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Domaine not found."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post('/assign-package-to-domaine', checkPermission('assignPackageToDomaine'), assignPackageToDomaine);

/**
 * @swagger
 * /packages/assign-domaine-to-package:
 *   post:
 *     tags:
 *       - Packages
 *     summary: Assigner un domaine à un package.
 *     description: Cette route permet d'assigner un domaine spécifique à un package. Nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaineId:
 *                 type: string
 *                 example: "domaine_id"
 *                 description: L'ID du domaine à assigner.
 *               packageId:
 *                 type: string
 *                 example: "package_id"
 *                 description: L'ID du package auquel le domaine sera assigné.
 *     responses:
 *       200:
 *         description: Domaine assigné au package avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Domaine assigned to package successfully."
 *                 updatedDomaine:
 *                   type: object
 *                   description: Les détails du domaine mis à jour.
 *       400:
 *         description: Requête invalide (données manquantes ou incorrectes).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "domaineId and packageId are required."
 *       404:
 *         description: Domaine ou package non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Domaine not found."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post('/assign-domaine-to-package', checkPermission('assignPackageToDomaine'), assignPackageToDomaine);

/**
 * @swagger
 * /packages/unassign-domaine-from-package:
 *   post:
 *     tags:
 *       - Packages
 *     summary: Désassigner un domaine d'un package.
 *     description: Cette route permet de désassigner un domaine d'un package. Nécessite un rôle approprié.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domaineId:
 *                 type: string
 *                 example: "domaine_id"
 *                 description: L'ID du domaine à désassigner.
 *     responses:
 *       200:
 *         description: Domaine désassigné du package avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Domaine unassigned from package successfully."
 *                 updatedDomaine:
 *                   type: object
 *                   description: Les détails du domaine mis à jour.
 *       400:
 *         description: Requête invalide (données manquantes ou domaine déjà désassigné).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Domaine is not assigned to any package."
 *       404:
 *         description: Domaine non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Domaine not found."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.post('/unassign-domaine-from-package', checkPermission('unassignDomaineFromPackage'), unassignDomaineFromPackage);

/**
 * @swagger
 * /packages/{id}/domains:
 *   get:
 *     tags:
 *       - Packages
 *     summary: Récupérer les domaines associés à un package.
 *     description: Cette route permet de récupérer les détails d'un package spécifique et les domaines qui lui sont assignés. Nécessite un rôle approprié.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: L'ID du package pour lequel récupérer les domaines.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails du package et domaines associés récupérés avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Package details and their domains."
 *                 package:
 *                   type: object
 *                   description: Les détails du package.
 *                   properties:
 *                     package_id:
 *                       type: string
 *                       example: "123"
 *                     package_name:
 *                       type: string
 *                       example: "Example Package"
 *                     package_description:
 *                       type: string
 *                       example: "Description of the package"
 *                     solde_total:
 *                       type: number
 *                       example: 500
 *                 domaines:
 *                   type: array
 *                   description: Liste des domaines associés au package.
 *                   items:
 *                     type: object
 *                     properties:
 *                       domaine_id:
 *                         type: string
 *                         example: "101"
 *                       domaine_name:
 *                         type: string
 *                         example: "Domaine 1"
 *                       domaine_description:
 *                         type: string
 *                         example: "Description of Domaine 1"
 *                       solde_total:
 *                         type: number
 *                         example: 100
 *       404:
 *         description: Package non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Package not found."
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error."
 */
router.get('/:id/domains', checkPermission('getDomainsByPackageId'), getDomainsByPackageId);

export default router;
